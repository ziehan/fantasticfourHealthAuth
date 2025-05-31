# backend/api.py (gunakan FastAPI)
from fastapi import FastAPI, Request
from pydantic import BaseModel
from rag.query import ask_rag

app = FastAPI()

class Question(BaseModel):
    prompt: str

@app.post("/api/ask")
def ask(question: Question):
    answer = ask_rag(question.prompt)
    return {"result": answer}
