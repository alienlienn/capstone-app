from fastapi import APIRouter, HTTPException, UploadFile, File
from starlette import status
from pydantic import BaseModel
from typing import Optional
from utils.utils import db_dependency, verify_password, hash_password
from models import UserAccount, GenderEnum, Teacher, TeacherStudent, Parent, ParentStudent, Student, UserRole, StudentResult
import uuid, os, shutil


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
        raise HTTPException(status_code=404, detail="User not found")

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

    # Store relative path
    user.profile_image_url = f"/uploads/{filename}"
    db.commit()

    return {"profile_image_url": user.profile_image_url}

@router.get("/get_students/{user_id}", status_code=status.HTTP_200_OK)
async def get_students(user_id: int, db: db_dependency):
    parent = db.query(Parent).filter(Parent.user_id == user_id).first()
    if not parent:
        return []
    
    student_links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent.id).all()
    student_ids = [link.student_id for link in student_links]
    
    students = db.query(Student).filter(Student.id.in_(student_ids)).all()
    
    return [
        {
            "id": s.id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "assigned_groups": s.assigned_groups,
            "school_id": s.school_id,
        }
        for s in students
    ]

    return [
        {
            "id": s.id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "assigned_groups": s.assigned_groups,
            "school_id": s.school_id,
        }
        for s in students
    ]

# GET request - fetch student by ID
@router.get("/student_details/{student_id}", status_code=status.HTTP_200_OK)
async def get_student_by_id(student_id: int, db: db_dependency):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {
        "id": student.id,
        "nric": student.nric,
        "first_name": student.first_name,
        "last_name": student.last_name,
        "date_of_birth": student.date_of_birth,
        "gender": student.gender,
        "assigned_groups": student.assigned_groups,
        "enrollment_year": student.enrollment_year,
        "school_id": student.school_id,
    }


# POST request - add results (bulk)
@router.post("/add_results", status_code=status.HTTP_201_CREATED)
async def add_results(request: CreateResultRequest | list[CreateResultRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_results = []
    
    for req in requests:
        # Check if student exists
        student = db.query(Student).filter(Student.id == req.student_id).first()
        if not student:
            if not isinstance(request, list):
                # Skip in bulk mode if studentId is invalid? Usually we do
                continue
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student ID {req.student_id} not found")
            
        new_result = StudentResult(
            student_id=req.student_id,
            subject=req.subject,
            grade=req.grade,
            score=req.score,
            term=req.term,
            year=req.year,
            teacher_id=req.teacher_id
        )
        db.add(new_result)
        created_results.append(new_result)
        
    db.commit()
    for res in created_results:
        db.refresh(res)
        
    return created_results if isinstance(request, list) else (created_results[0] if created_results else None)


# GET request - fetch results for student
@router.get("/get_student_results/{student_id}", status_code=status.HTTP_200_OK)
async def get_student_results(student_id: int, db: db_dependency):
    results = db.query(StudentResult).filter(StudentResult.student_id == student_id).all()
    return results
