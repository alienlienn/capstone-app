from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import superadmin, account

app = FastAPI()

origins = [
    "http://localhost:8081",  # For local web testing
    "exp://192.168.1.103:8081", # For Expo Go
]

models.Base.metadata.create_all(bind=engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(account.router)
app.include_router(superadmin.router)