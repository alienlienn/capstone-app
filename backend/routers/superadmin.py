from fastapi import APIRouter, HTTPException
from starlette import status
from pydantic import BaseModel, EmailStr
from utils.utils import db_dependency, hash_password
from models import UserAccount, UserRole


router = APIRouter(prefix="/superadmin", tags=["superadmin"])

class CreateAccountRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    first_name: str
    last_name: str

class CreateAccountResponse(BaseModel):
    response_message: str
    user_id: int
    email: str
    role: UserRole


# POST request - account creation
@router.post("/create_account", status_code=status.HTTP_201_CREATED)
def create_account(request: CreateAccountRequest, db: db_dependency):
    existing_user = db.query(UserAccount).filter(UserAccount.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
    
    # Create new user account
    new_user = UserAccount(
        email=request.email,
        password_hash=hash_password(request.password),
        role=request.role,
        first_name=request.first_name,
        last_name=request.last_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User account created successfully",
        "user_id": new_user.id,
        "email": new_user.email,
        "role": new_user.role
    }


# GET request - view all user accounts
@router.get("/all_accounts", status_code=status.HTTP_200_OK)
def get_all_accounts(db: db_dependency):
    users = db.query(UserAccount).all()
    
    result = []
    for user in users:
        result.append({
            "user_id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "status": user.status
        })
    
    return {"accounts": result}
