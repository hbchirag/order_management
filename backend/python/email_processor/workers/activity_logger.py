from config.db_config import get_db_connection

def log_activity(email_id, status, action, previous_status=None, user_id=None, comments=None):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO activitylogs (email_id, status, previous_status, action, action_date, user_id, comments)
            VALUES (%s, %s, %s, %s, NOW(), %s, %s)
        """, (email_id, status, previous_status, action, user_id, comments))
        connection.commit()
        print(f"Activity logged for email ID: {email_id}, Action: {action}")
    except Exception as e:
        print(f"Error logging activity: {e}")
    finally:
        cursor.close()
        connection.close()
