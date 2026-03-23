import os

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o"

# Use /data on Render (persistent disk), fallback to local for dev
BASE_DIR = "/data" if os.path.exists("/data") else "."
UPLOAD_DIR = f"{BASE_DIR}/uploads"
VECTOR_STORE_DIR = f"{BASE_DIR}/vector_store"
ACTIVE_DOC_FILE = f"{BASE_DIR}/vector_store/active_doc.txt"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50