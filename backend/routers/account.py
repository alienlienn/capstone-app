from fastapi import APIRouter, HTTPException, UploadFile, File
from starlette import status
from pydantic import BaseModel
from typing import Optional
from utils.utils import db_dependency, verify_password, hash_password
from models import UserAccount, GenderEnum, School, Teacher, Parent, ParentStudent, Student, UserRole, TeacherStudent
import uuid, os, shutil
import smtplib
from email.message import EmailMessage

router = APIRouter(prefix="/account", tags=["account"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class LoginRequest(BaseModel):
    email: str
    password: str
    
class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    gender: Optional[GenderEnum] = None
    mobile_number: Optional[str] = None
    profile_image_url: Optional[str] = None

class CreateResultRequest(BaseModel):
    student_id: int
    subject: str
    grade: Optional[str] = None
    score: Optional[int] = None
    term: str
    year: int
    teacher_id: int

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    token: str
    new_password: str


# POST request - account login
@router.post("/user_authentication", status_code=status.HTTP_201_CREATED)
async def login(request: LoginRequest, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # Fetch school_id based on role
    school_id = None
    if user.role == UserRole.USER:
        # For 'user' role, find school_id via Parent -> ParentStudent -> Student
        parent = db.query(Parent).filter(Parent.user_id == user.id).first()
        if parent:
            # Get school_id from the first linked student
            student_link = db.query(ParentStudent).filter(ParentStudent.parent_id == parent.id).first()
            if student_link:
                student = db.query(Student).filter(Student.id == student_link.student_id).first()
                if student:
                    school_id = student.school_id
    else:
        # Fetch school_id from Teacher table for other roles
        teacher_record = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher_record:
            school_id = teacher_record.school_id

    return {
        "message": "Login Successful",
        "user_id": user.id,
        "user_email": user.email,
        "role": user.role,
        "school_id": school_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }


# POST request - forgot password
@router.post("/forgot_password", status_code=status.HTTP_200_OK)
async def forgot_password(request: ForgotPasswordRequest, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not registered")

    reset_token = str(uuid.uuid4())
    
    frontend_base_url = "http://192.168.1.229:8081" 
    reset_link = f"{frontend_base_url}/reset-password?token={reset_token}&email={user.email}"

    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    SENDER_EMAIL = "lientoh.102@gmail.com"
    SENDER_PASSWORD = "ejfj mqzy wpxs ydkk" 

    msg = EmailMessage()
    msg.set_content(f"Hi {user.first_name},\n\nYou requested a password reset. Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, please ignore this email.")
    msg['Subject'] = "Password Reset Request"
    msg['From'] = SENDER_EMAIL
    msg['To'] = user.email

    try:
        print(f"\n--- PASSWORD RESET DEBUG ---")
        print(f"To: {user.email}")
        print(f"Link: {reset_link}")
        print(f"---------------------------\n")

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            print(f"SUCCESS: Email sent to {user.email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

    return {"message": "Reset password link sent to your email"}


# POST request - set new password via forgot password
@router.post("/reset_password", status_code=status.HTTP_200_OK)
async def reset_password(request: ResetPasswordRequest, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password_hash = hash_password(request.new_password)
    db.commit()
    db.refresh(user)

    return {"message": "Password updated successfully"}
       

# GET request - fetch user profile by ID
@router.get("/profile_details/{user_id}", status_code=status.HTTP_200_OK)
async def get_user(user_id: int, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Fetch school_id based on role
    school_id = None
    if user.role == UserRole.USER:
        parent = db.query(Parent).filter(Parent.user_id == user.id).first()
        if parent:
            student_link = db.query(ParentStudent).filter(ParentStudent.parent_id == parent.id).first()
            if student_link:
                student = db.query(Student).filter(Student.id == student_link.student_id).first()
                if student:
                    school_id = student.school_id
    else:
        teacher_record = db.query(Teacher).filter(Teacher.user_id == user.id).first()
        if teacher_record:
            school_id = teacher_record.school_id
    
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "password": user.password_hash,
        "profile_image_url": user.profile_image_url,
        "gender": user.gender,
        "mobile_number": user.mobile_number,
        "role": user.role,
        "school_id": school_id,
    }


# POST request - save and update user profile 
@router.post("/update_profile/{user_id}", status_code=status.HTTP_201_CREATED)
async def update_profile(user_id: int, payload: UpdateProfileRequest, db: db_dependency):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Invalid Email")

    if payload.first_name is not None:
        user.first_name = payload.first_name

    if payload.last_name is not None:
        user.last_name = payload.last_name

    if payload.email is not None:
        user.email = payload.email

    if payload.gender is not None:
        user.gender = payload.gender

    if payload.mobile_number is not None:
        user.mobile_number = payload.mobile_number

    if payload.profile_image_url is not None:
        user.profile_image_url = payload.profile_image_url

    if payload.password:
        user.password_hash = hash_password(payload.password)

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "gender": user.gender,
            "mobile_number": user.mobile_number,
            "profile_image_url": user.profile_image_url,
        },
    }


# POST request - upload image as user profile avatar
@router.post("/upload_avatar/{user_id}", status_code=status.HTTP_201_CREATED)
async def upload_avatar(db: db_dependency, user_id: int, file: UploadFile = File(...)):
    user = db.query(UserAccount).filter(UserAccount.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Save file
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Store path as "uploads/filename" without leading slash for easier resolution
    user.profile_image_url = f"uploads/{filename}"
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"profile_image_url": user.profile_image_url}


# GET request - fetch relevant contacts (Admins & Student's Teachers)
@router.get("/get_contacts/{user_id}", status_code=status.HTTP_200_OK)
async def get_contacts(user_id: int, db: db_dependency):
    # 1. Identify all students associated with the parent (user_id)
    parent = db.query(Parent).filter(Parent.user_id == user_id).first()
    
    student_ids = []
    school_ids = set()

    if parent:
        # Get all linked students
        student_links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent.id).all()
        for link in student_links:
            student_ids.append(link.student_id)
            student = db.query(Student).filter(Student.id == link.student_id).first()
            if student:
                school_ids.add(student.school_id)
    else:
        # If not a parent, fallback to getting school admins if they have a teacher record
        teacher_me = db.query(Teacher).filter(Teacher.user_id == user_id).first()
        if teacher_me:
            school_ids.add(teacher_me.school_id)

    if not school_ids:
        return []

    # Use a dictionary to avoid duplicates
    contact_map = {}

    def add_to_contacts(res_list):
        for user, teacher, school_name in res_list:
            # We want to keep the most relevant role if duplicate
            # Or just set a default record
            contact_map[user.id] = {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "profile_image_url": user.profile_image_url,
                "mobile_number": user.mobile_number,
                "school_name": school_name,
                "school_role": teacher.school_role or ("Admin" if user.role == UserRole.ADMIN else "Teacher"),
            }

    # 2. Get all Admins for all relevant schools
    for sid in school_ids:
        # Expire any existing objects to ensure we get fresh data from DB
        db.expire_all()
        admins = db.query(UserAccount, Teacher, School.school_name)\
            .join(Teacher, Teacher.user_id == UserAccount.id)\
            .join(School, School.id == Teacher.school_id)\
            .filter(Teacher.school_id == sid)\
            .filter(UserAccount.role == UserRole.ADMIN).all()
        add_to_contacts(admins)

    # 3. Get all Teachers assigned to all associated students
    for stid in student_ids:
        db.expire_all()
        student_teachers = db.query(UserAccount, Teacher, School.school_name)\
            .join(Teacher, Teacher.user_id == UserAccount.id)\
            .join(School, School.id == Teacher.school_id)\
            .join(TeacherStudent, TeacherStudent.teacher_id == Teacher.id)\
            .filter(TeacherStudent.student_id == stid).all()
        add_to_contacts(student_teachers)

    return list(contact_map.values())
