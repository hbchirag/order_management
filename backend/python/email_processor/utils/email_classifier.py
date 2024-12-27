import re
from config.db_config import get_db_connection


def classify_email(email):
    """
    Classifies an email based on whitelist/blocklist and classification rules.

    Args:
        email (dict): The email to classify.

    Returns:
        str: Classification status.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # Fetch whitelist and blocklist entries
        cursor.execute("SELECT * FROM emaillistentries WHERE status = 1")
        email_list_entries = cursor.fetchall()

        # Check blocklist
        for entry in email_list_entries:
            if entry["type"] == "blocklist":
                if entry["email_address"] and entry["email_address"].lower() == email["from"].lower():
                    return "Filtered Out"
                if entry["domain"] and email["from"].split("@")[-1].lower() == entry["domain"].lower():
                    return "Filtered Out"

        # Check whitelist
        for entry in email_list_entries:
            if entry["type"] == "whitelist":
                if entry["email_address"] and entry["email_address"].lower() == email["from"].lower():
                    return "Confirmed Order Email"
                if entry["domain"] and email["from"].split("@")[-1].lower() == entry["domain"].lower():
                    return "Confirmed Order Email"

        # Fetch classification rules
        cursor.execute("SELECT * FROM classificationrules WHERE is_active = 1")
        classification_rules = cursor.fetchall()

        # Apply classification rules
        for rule in classification_rules:
            # Subject-based rules
            if rule["type"] == "Subject" and re.search(rule["pattern"], email["subject"], re.IGNORECASE):
                return "Confirmed Order Email"

            # Body text-based rules
            if rule["type"] == "Body Text" and re.search(rule["pattern"], email["text"], re.IGNORECASE):
                return "Confirmed Order Email"

            # Attachment name-based rules
            if rule["type"] == "Attachment Name":
                for attachment in email.get("attachments", []):
                    if re.search(rule["pattern"], attachment["filename"], re.IGNORECASE):
                        return "Confirmed Order Email"

        # Default classification
        return "Pending Review"

    except Exception as e:
        print(f"Error in classification: {e}")
        return "Pending Review"
    finally:
        cursor.close()
        connection.close()
