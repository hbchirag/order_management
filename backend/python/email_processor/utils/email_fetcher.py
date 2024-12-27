from imap_tools import MailBox, AND
from datetime import datetime
import base64

def fetch_emails_from_imap(mailbox_config):
    try:
        with MailBox(mailbox_config['imap_host']).login(
            mailbox_config['email_address'], mailbox_config['password'], initial_folder='INBOX'
        ) as mailbox:
            emails = []
            
            # Use last_synced_at if available; fallback to sync_start_date
            sync_start_date = mailbox_config.get('last_synced_at') or mailbox_config['sync_start_date']
            if isinstance(sync_start_date, datetime):
                sync_start_date = sync_start_date.date()

            for msg in mailbox.fetch(AND(date_gte=sync_start_date)):
                # Serialize attachments for JSON compatibility
                serialized_attachments = []
                for att in msg.attachments:
                    try:
                        encoded_payload = base64.b64encode(att.payload).decode("utf-8") if att.payload else None
                    except Exception as e:
                        print(f"Error encoding attachment {att.filename}: {e}")
                        encoded_payload = None

                    serialized_attachments.append({
                        "filename": att.filename,
                        "content_type": att.content_type,
                        "size": att.size,
                        "payload": encoded_payload
                    })

                email_data = {
                    "message_id": msg.uid,
                    "from": msg.from_,
                    "to": list(msg.to) if msg.to else [],
                    "cc": list(msg.cc) if msg.cc else [],
                    "subject": msg.subject,
                    "date": msg.date.isoformat(),
                    "text": msg.text,
                    "html": msg.html,
                    "attachments": serialized_attachments
                }

                emails.append(email_data)

            return emails
    except Exception as e:
        print(f"Error fetching emails: {e}")
        return []
