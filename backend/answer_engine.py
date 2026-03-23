from openai import OpenAI
from config import OPENAI_API_KEY, CHAT_MODEL, ACTIVE_DOC_FILE
from document_handler import retrieve
from memory import get_history, add_message

client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM_PROMPT = """You are a helpful customer support assistant.
Answer questions using only the context provided.
If the answer is not in the context, say you don't have that information.
Be concise and friendly."""


def get_active_doc_id() -> str:
    try:
        with open(ACTIVE_DOC_FILE, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        raise RuntimeError("No company docs uploaded yet. Please contact the admin.")


def answer(session_id: str, question: str) -> str:
    doc_id = get_active_doc_id()
    context_chunks = retrieve(question, doc_id)
    context = "\n\n".join(context_chunks)

    history = get_history(session_id)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Context from company docs:\n{context}"},
        *history,
        {"role": "user", "content": question},
    ]

    response = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=messages,
    )

    reply = response.choices[0].message.content

    add_message(session_id, "user", question)
    add_message(session_id, "assistant", reply)

    return reply