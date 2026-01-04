from fastapi import APIRouter, HTTPException
from starlette import status
from pydantic import BaseModel
from utils.utils import db_dependency, verify_password
from models import UserAccount


router = APIRouter(prefix="/account", tags=["account"])

class LoginRequest(BaseModel):
    email: str
    password: str


# POST request - account login
@router.post("/user_authentication", status_code=status.HTTP_201_CREATED)
async def login(request: LoginRequest, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return {
        "message": "Login Successful",
        "user_id": user.id,
        "user_email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
       
    

    