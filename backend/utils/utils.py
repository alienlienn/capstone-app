from fastapi import Depends
from typing import Annotated
from database import SessionLocal
from sqlalchemy.orm import Session
from passlib.context import CryptContext


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])   # bcrypt max length = 72 bytes

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)