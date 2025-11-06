import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# Replace with the path to your service account key file
# You can download this from Firebase Console -> Project settings -> Service accounts
SERVICE_ACCOUNT_KEY_PATH = "serviceAccountKey.json" 

# Replace with the UID of the user you want to make a developer
USER_UID = "oxZ4f7oA9Ca3atxgaY35SwYGXJq2"

def set_developer_role(uid: str):
    if not os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
        print(f"Error: Service account key file not found at {SERVICE_ACCOUNT_KEY_PATH}")
        print("Please download your service account key from Firebase Console -> Project settings -> Service accounts -> Generate new private key, and update the SERVICE_ACCOUNT_KEY_PATH variable.")
        return

    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    user_ref = db.collection('users').document(uid)
    try:
        user_ref.set({'role': 'developer'}, merge=True)
        print(f"Successfully set role 'developer' for user: {uid}")
    except Exception as e:
        print(f"Error setting role for user {uid}: {e}")

if __name__ == "__main__":
    set_developer_role(USER_UID)
