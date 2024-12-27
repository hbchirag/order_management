import json
from datetime import datetime
from config.db_config import get_db_connection
from config.rabbitmq_config import get_rabbitmq_connection
from utils.email_fetcher import fetch_emails_from_imap
from utils.email_classifier import classify_email

def main():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch active mailboxes
        cursor.execute("SELECT * FROM usermailboxes WHERE sync_status='Active'")
        mailboxes = cursor.fetchall()

        if not mailboxes:
            print("No active mailboxes found.")
            return

        # Connect to RabbitMQ
        rabbitmq = get_rabbitmq_connection()
        channel = rabbitmq.channel()
        channel.queue_declare(queue="emails", durable=True)

        for mailbox in mailboxes:
            # Fetch emails
            emails = fetch_emails_from_imap(mailbox)
            print(f"Fetched emails for mailbox {mailbox['email_address']}: {len(emails)} emails.")

            if not emails:
                print(f"No emails found for mailbox: {mailbox['email_address']}")
                continue

            for email in emails:
                try:
                    # Validate email structure
                    required_fields = ["message_id", "from", "to", "subject", "date", "text"]
                    for field in required_fields:
                        if field not in email or not email[field]:
                            raise ValueError(f"Missing or invalid field: {field}")

                    # Classify email
                    email["status"] = classify_email(email)

                    # Queue the email in RabbitMQ
                    channel.basic_publish(exchange="", routing_key="emails", body=json.dumps(email))
                    print(f"Email queued: {email['subject']}")
                except Exception as ex:
                    print(f"Error processing email: {email}. Error: {ex}")

            # Update last_synced_at for the mailbox
            cursor.execute(
                "UPDATE usermailboxes SET last_synced_at = %s WHERE id = %s",
                (datetime.utcnow(), mailbox["id"])
            )
            connection.commit()

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Clean up
        cursor.close()
        connection.close()
        rabbitmq.close()

if __name__ == "__main__":
    main()
