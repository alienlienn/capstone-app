from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import superadmin, account, lookup
from database import Base, engine

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# User profile avatar
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
app.include_router(lookup.router)