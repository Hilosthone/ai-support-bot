# AI Support Bot

> Built by [BuildON](https://builon.com) for [JustXend](https://justxend.com)

An AI-powered customer support bot that reads your company documents and answers customer questions instantly — 24/7, no human needed.

---

## Live Demo

| Service | URL |
|---|---|
| Backend API | https://ai-support-bot-blo4.onrender.com/docs |
| Frontend | _Coming soon_ |

---

## What It Does

- Upload your company docs (PDF, DOCX, TXT, CSV) once via the admin panel
- Customers ask questions in plain English
- The bot retrieves the most relevant information from your docs and responds instantly using GPT-4o
- Remembers conversation context within each session
- Searches across all uploaded documents at once

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| AI | OpenAI GPT-4o |
| Embeddings | OpenAI text-embedding-3-small |
| Vector Search | FAISS |
| Memory | SQLite |
| Frontend | Next.js, Tailwind CSS |
| Hosting | Render |

---

## Project Structure

```
ai-support-bot/
├── backend/
│   ├── main.py                # API routes
│   ├── document_handler.py    # Doc parsing, chunking, indexing
│   ├── answer_engine.py       # Retrieval + GPT-4o response
│   ├── memory.py              # Session memory (SQLite)
│   └── config.py              # Environment config
├── frontend/                  # Next.js app
├── render.yaml                # Render deployment config
├── requirements.txt
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/upload` | Upload one or more company docs |
| GET | `/admin/docs` | List all indexed documents |
| POST | `/chat` | Send a question, get an answer |
| DELETE | `/session/{id}` | Clear a session's memory |

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/your-username/ai-support-bot.git
cd ai-support-bot

# Set up backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend (OPENAI_API_KEY must be set in your shell)
cd backend
uvicorn main:app --reload

# Run frontend
cd frontend
npm install
npm run dev
```

---

## License

MIT © 2025 BuilON