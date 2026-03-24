import os
import uuid
import faiss
import numpy as np
import pandas as pd
import pickle
import sqlite3
from io import BytesIO
from docx import Document
from PyPDF2 import PdfReader
from openai import OpenAI
from config import OPENAI_API_KEY, EMBEDDING_MODEL, VECTOR_STORE_DIR, CHUNK_SIZE, CHUNK_OVERLAP, BASE_DIR

client = OpenAI(api_key=OPENAI_API_KEY)

DB_PATH = f"{BASE_DIR}/memory.db"


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doc_id TEXT,
            filename TEXT,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    return conn


def extract_text(filename: str, content: bytes) -> str:
    ext = filename.split(".")[-1].lower()

    if ext == "txt":
        return content.decode("utf-8", errors="ignore")

    if ext == "pdf":
        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if ext == "docx":
        doc = Document(BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)

    if ext == "csv":
        df = pd.read_csv(BytesIO(content))
        return df.to_string(index=False)

    raise ValueError(f"Unsupported file type: {ext}")


def chunk_text(text: str) -> list[str]:
    chunks, start = [], 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return [c.strip() for c in chunks if c.strip()]


def embed(texts: list[str]) -> np.ndarray:
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return np.array([r.embedding for r in response.data], dtype="float32")


def index_document(filename: str, content: bytes) -> dict:
    text = extract_text(filename, content)
    chunks = chunk_text(text)
    vectors = embed(chunks)

    dimension = vectors.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(vectors)

    doc_id = str(uuid.uuid4())
    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)

    faiss.write_index(index, f"{VECTOR_STORE_DIR}/{doc_id}.index")
    with open(f"{VECTOR_STORE_DIR}/{doc_id}.chunks", "wb") as f:
        pickle.dump(chunks, f)

    conn = get_conn()
    conn.execute(
        "INSERT INTO documents (doc_id, filename) VALUES (?, ?)",
        (doc_id, filename)
    )
    conn.commit()
    conn.close()

    return {"doc_id": doc_id, "filename": filename, "chunks_indexed": len(chunks)}


def get_all_doc_ids() -> list[str]:
    conn = get_conn()
    rows = conn.execute("SELECT doc_id FROM documents").fetchall()
    conn.close()
    return [r[0] for r in rows]


def retrieve(query: str, top_k: int = 5) -> list[str]:
    doc_ids = get_all_doc_ids()
    if not doc_ids:
        raise RuntimeError("No company docs uploaded yet. Please contact the admin.")

    query_vector = embed([query])
    all_results = []

    for doc_id in doc_ids:
        index_path = f"{VECTOR_STORE_DIR}/{doc_id}.index"
        chunks_path = f"{VECTOR_STORE_DIR}/{doc_id}.chunks"

        if not os.path.exists(index_path):
            continue

        index = faiss.read_index(index_path)
        with open(chunks_path, "rb") as f:
            chunks = pickle.load(f)

        distances, indices = index.search(query_vector, top_k)
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(chunks):
                all_results.append((dist, chunks[idx]))

    # Sort by distance, return top_k best across all docs
    all_results.sort(key=lambda x: x[0])
    return [chunk for _, chunk in all_results[:top_k]]