from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from .database import get_database
from bson import ObjectId

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Data model
class DataPoint(BaseModel):
    value: float
    category: str

# Routes
@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("app/static/index.html") as f:
        return f.read()

@app.post("/data")
async def create_data(data: DataPoint):
    db = get_database()
    result = db.data.insert_one(data.dict())
    return {"id": str(result.inserted_id)}

@app.get("/data")
async def get_data():
    db = get_database()
    data = list(db.data.find())
    for item in data:
        item["_id"] = str(item["_id"])
    return data