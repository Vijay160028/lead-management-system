# Lead Management System

A basic lead management web application using:

- Frontend: React + Tailwind CSS
- Backend: FastAPI (Python)
- Data: JSON file as mock database

## Features

- User login (email + password)
- Add new leads
- View leads in a table
- Change lead status (New Lead, Lead Sent, Deal Done)
- Logout functionality

## Project Setup
## Backend (FastAPI)

1. Go to the backend folder:

cd backend
Create a virtual environment (optional but recommended):

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
Install required packages:

pip install fastapi uvicorn
Run the server:

uvicorn main:app --reload
Visit: http://localhost:8000/docs to test the API.

## Frontend (React)
Go to the frontend folder:

cd frontend
Install dependencies: npm install

Start the React app: npm start

Visit: http://localhost:3000

🧪 Login Credentials
Use this to log in:


Email: admin@example.com
Password: admin123
