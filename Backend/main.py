from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LEAD_FILE = "leads.json"

class Auth(BaseModel):
    email: str
    password: str

class Lead(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    source: str
    status: str

@app.post("/login")
def login(auth: Auth):
    if auth.email == "admin@example.com" and auth.password == "admin123":
        return {"token": "sample-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/leads")
def get_leads():
    if not os.path.exists(LEAD_FILE):
        with open(LEAD_FILE, "w") as f:
            json.dump([], f)
    with open(LEAD_FILE, "r") as f:
        return json.load(f)

@app.post("/leads")
def add_lead(lead: Lead):
    with open(LEAD_FILE, "r") as f:
        leads = json.load(f)
    leads.append(lead.dict())
    with open(LEAD_FILE, "w") as f:
        json.dump(leads, f, indent=2)
    return lead

@app.put("/leads/{lead_id}")
def update_lead(lead_id: int, updated: Lead):
    with open(LEAD_FILE, "r") as f:
        leads = json.load(f)
    for i, l in enumerate(leads):
        if l["id"] == lead_id:
            leads[i] = updated.dict()
            with open(LEAD_FILE, "w") as f:
                json.dump(leads, f, indent=2)
            return updated
    raise HTTPException(status_code=404, detail="Lead not found")
