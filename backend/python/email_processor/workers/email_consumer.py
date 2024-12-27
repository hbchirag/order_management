import sys
import os
import base64
import json
import logging
import pika

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.db_config import get_db_connection
from config.rabbitmq_config import get_rabbitmq_connection
from workers.activity_logger import log_activity

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def process_email(ch, method, properties, body):
    """
    Processes a single email message from RabbitMQ.
    """
    try:
        email = json.loads(body)
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Check for duplicate email
        cursor.execute("SELECT id FROM emails WHERE message_id = %s", (email["message_id"],))
        existing_email = cursor.fetchone()

        if existing_email:
            logging.info(f"Duplicate email detected: {email['message_id']}. Skipping...")
            log_activity(existing_email["id"], "Filtered Out", "Duplicate email detected")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return

        # Insert email into the database
        email_query = """
        INSERT INTO emails (sender, `to`, cc, subject, received_at, content, status, message_id, thread_id, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(email_query, (
            email["from"],
            ",".join(email["to"]),
            ",".join(email["cc"]) if email["cc"] else None,
            email["subject"],
            email["date"],
            email["text"] or email["html"],
            email["status"],
            email["message_id"],
            email["message_id"],
            1  # Placeholder user ID
        ))
        email_id = cursor.lastrowid
        log_activity(email_id, email["status"], "Email processed")

        # Save attachments
        for attachment in email["attachments"]:
            file_path = os.path.join("attachments", attachment["filename"])
            os.makedirs("attachments", exist_ok=True)

            try:
                if attachment["payload"]:
                    with open(file_path, "wb") as f:
                        f.write(base64.b64decode(attachment["payload"]))
                else:
                    logging.warning(f"No payload for attachment {attachment['filename']}. Skipping.")
            except Exception as e:
                logging.error(f"Failed to save attachment {attachment['filename']}: {e}")

        connection.commit()
        logging.info(f"Processed email: {email['subject']}")

    except Exception as e:
        logging.error(f"Error processing email: {e}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)
        cursor.close()
        connection.close()


def main():
    """
    Main function to consume messages from RabbitMQ.
    """
    while True:
        try:
            rabbitmq = get_rabbitmq_connection()
            channel = rabbitmq.channel()
            channel.queue_declare(queue="emails", durable=True)

            logging.info("Waiting for messages from RabbitMQ...")
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue="emails", on_message_callback=process_email)
            channel.start_consuming()

        except pika.exceptions.AMQPError as amqp_error:
            logging.error(f"AMQP error: {amqp_error}")
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
        finally:
            try:
                rabbitmq.close()
            except Exception:
                pass


if __name__ == "__main__":
    main()
