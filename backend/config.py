import os

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o"
UPLOAD_DIR = "uploads"
VECTOR_STORE_DIR = "vector_store"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
ACTIVE_DOC_FILE = "vector_store/active_doc.txt"