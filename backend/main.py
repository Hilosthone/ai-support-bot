from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from document_handler import index_document
from answer_engine import answer
from memory import clear_session

app = FastAPI(title="AI Support Bot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    session_id: str
    question: str


@app.post("/admin/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    result = index_document(file.filename, content)
    return result


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        reply = answer(req.session_id, req.question)
        return {"reply": reply}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.delete("/session/{session_id}")
async def end_session(session_id: str):
    clear_session(session_id)
    return {"message": "Session cleared"}