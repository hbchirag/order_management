import json
from config.db_config import get_db_connection

def process_email(ch, method, properties, body):
    email = json.loads(body)

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Save email to the database
        cursor.execute("""
            INSERT INTO emails (sender, to, cc, subject, received_at, content, status, message_id, thread_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            email["from"], ", ".join(email["to"]), ", ".join(email["cc"] or []),
            email["subject"], email["date"], email["text"],
            email["status"], email["message_id"], email["message_id"]
        ))
        connection.commit()
        print(f"Email processed: {email['subject']}")
    except Exception as e:
        print(f"Error processing email: {e}")
    finally:
        cursor.close()
        connection.close()
        ch.basic_ack(delivery_tag=method.delivery_tag)
