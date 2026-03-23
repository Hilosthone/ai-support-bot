from collections import defaultdict

# Holds conversation history per session
# { session_id: [ {role, content}, ... ] }
_store: dict[str, list] = defaultdict(list)


def get_history(session_id: str) -> list:
    return _store[session_id]


def add_message(session_id: str, role: str, content: str):
    _store[session_id].append({"role": role, "content": content})


def clear_session(session_id: str):
    _store.pop(session_id, None)