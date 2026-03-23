import os
import uuid
import faiss
import numpy as np
import pandas as pd
import pickle
from io import BytesIO
from docx import Document
from PyPDF2 import PdfReader
from openai import OpenAI
from config import OPENAI_API_KEY, EMBEDDING_MODEL, UPLOAD_DIR, VECTOR_STORE_DIR, CHUNK_SIZE, CHUNK_OVERLAP

client = OpenAI(api_key=OPENAI_API_KEY)


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

    # Save as the active doc the bot will always reference
    from config import ACTIVE_DOC_FILE
    with open(ACTIVE_DOC_FILE, "w") as f:
        f.write(doc_id)

    return {"doc_id": doc_id, "chunks_indexed": len(chunks)}


def retrieve(query: str, doc_id: str, top_k: int = 5) -> list[str]:
    index = faiss.read_index(f"{VECTOR_STORE_DIR}/{doc_id}.index")
    with open(f"{VECTOR_STORE_DIR}/{doc_id}.chunks", "rb") as f:
        chunks = pickle.load(f)

    query_vector = embed([query])
    _, indices = index.search(query_vector, top_k)
    return [chunks[i] for i in indices[0] if i < len(chunks)]