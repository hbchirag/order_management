import pika
import json

def produce_test_message():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    # Declare the queue
    channel.queue_declare(queue='email_tasks', durable=True)

    # Define a test message
    message = {
        "tm_id": 1,
        "email_address": "test@example.com",
        "imap_host": "imap.test.com",
        "imap_port": 993,
        "imap_encryption": "SSL",
        "password": "test_password",
        "sync_start_date": "2024-12-01T00:00:00"
    }

    # Publish the message
    channel.basic_publish(
        exchange='',
        routing_key='email_tasks',
        body=json.dumps(message),
        properties=pika.BasicProperties(delivery_mode=2)  # Make message persistent
    )

    print(" [x] Sent test message to 'email_tasks' queue")
    connection.close()

if __name__ == "__main__":
    produce_test_message()
