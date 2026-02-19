from fastapi import APIRouter, HTTPException
from starlette import status
from pydantic import BaseModel, EmailStr
from datetime import date
from utils.utils import db_dependency, hash_password
from models import UserAccount, UserRole, School, Student, Parent, Teacher, ParentStudent, GenderEnum, ParentRelationship


router = APIRouter(prefix="/superadmin", tags=["superadmin"])

class CreateAccountRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    first_name: str
    last_name: str
    mobile_number: str | None = None

class CreateAccountResponse(BaseModel):
    response_message: str
    user_id: int
    email: str
    role: UserRole


class CreateSchoolRequest(BaseModel):
    school_name: str
    address: str | None = None
    contact_email: EmailStr | None = None


class CreateStudentRequest(BaseModel):
    nric: str
    school_id: int
    first_name: str
    last_name: str | None = None
    date_of_birth: date | None = None
    gender: GenderEnum | None = GenderEnum.OTHER
    assigned_groups: str | None = None
    enrollment_year: int | None = None
    parent_contact_email: EmailStr | None = None
    parent_contact_number: str | None = None


class CreateParentRequest(BaseModel):
    nric: str
    first_name: str
    last_name: str | None = None
    email: EmailStr | None = None
    mobile_number: str | None = None
    gender: GenderEnum | None = GenderEnum.OTHER
    user_id: int | None = None


class CreateTeacherRequest(BaseModel):
    nric: str
    school_id: int
    first_name: str
    last_name: str | None = None
    email: EmailStr | None = None
    mobile_number: str | None = None
    gender: GenderEnum | None = GenderEnum.OTHER
    assigned_groups: str | None = None
    user_id: int | None = None


class CreateParentStudentRequest(BaseModel):
    parent_id: int
    student_id: int
    relationship: ParentRelationship


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
        last_name=request.last_name,
        mobile_number=request.mobile_number
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
            "mobile_number": user.mobile_number,
            "role": user.role,
            "status": user.status
        })
    
    return {"accounts": result}


# POST request - add schools
@router.post("/add_school", status_code=status.HTTP_201_CREATED)
def add_school(request: CreateSchoolRequest, db: db_dependency):
    existing_school = db.query(School).filter(School.school_name == request.school_name).first()
    if existing_school:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="School already exists")
    
    new_school = School(
        school_name=request.school_name,
        address=request.address,
        contact_email=request.contact_email
    )
    db.add(new_school)
    db.commit()
    db.refresh(new_school)
    
    return {
        "message": "School added successfully",
        "school_id": new_school.id,
        "school_name": new_school.school_name
    }
    

# POST request - add students
@router.post('/add_student', status_code=status.HTTP_201_CREATED)
def add_student(request: CreateStudentRequest, db: db_dependency):
    existing_student = db.query(Student).filter(Student.nric == request.nric).first()
    if existing_student:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Student already exists')
    
    new_student = Student(
        nric=request.nric,
        school_id=request.school_id,
        first_name=request.first_name,
        last_name=request.last_name,
        date_of_birth=request.date_of_birth,
        gender=request.gender,
        assigned_groups=request.assigned_groups,
        enrollment_year=request.enrollment_year,
        parent_contact_email=request.parent_contact_email,
        parent_contact_number=request.parent_contact_number
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {
        'message': 'Student added successfully',
        'student_id': new_student.id,
        'nric': new_student.nric
    }


# POST request - add parent
@router.post('/add_parent', status_code=status.HTTP_201_CREATED)
def add_parent(request: CreateParentRequest, db: db_dependency):
    existing_parent = db.query(Parent).filter(Parent.nric == request.nric).first()
    if existing_parent:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Parent already exists')
    
    new_parent = Parent(
        nric=request.nric,
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        mobile_number=request.mobile_number,
        gender=request.gender,
        user_id=request.user_id
    )
    db.add(new_parent)
    db.commit()
    db.refresh(new_parent)
    
    return {
        'message': 'Parent added successfully',
        'parent_id': new_parent.id,
        'nric': new_parent.nric
    }
    

# POST request - add teacher
@router.post('/add_teacher', status_code=status.HTTP_201_CREATED)
def add_teacher(request: CreateTeacherRequest, db: db_dependency):
    existing_teacher = db.query(Teacher).filter(Teacher.nric == request.nric).first()
    if existing_teacher:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Teacher already exists')
    
    new_teacher = Teacher(
        nric=request.nric,
        school_id=request.school_id,
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        mobile_number=request.mobile_number,
        gender=request.gender,
        assigned_groups=request.assigned_groups,
        user_id=request.user_id
    )
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    
    return {
        'message': 'Teacher added successfully',
        'teacher_id': new_teacher.id,
        'nric': new_teacher.nric
    }
    
    
# POST request - link parent and student
@router.post('/add_parent_student', status_code=status.HTTP_201_CREATED)
def add_parent_student(request: CreateParentStudentRequest, db: db_dependency):
    existing_link = db.query(ParentStudent).filter(
        ParentStudent.parent_id == request.parent_id,
        ParentStudent.student_id == request.student_id
    ).first()
    
    if existing_link:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Link already exists')
    
    new_link = ParentStudent(
        parent_id=request.parent_id,
        student_id=request.student_id,
        relationship=request.relationship
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    
    return {
        'message': 'Parent and student linked successfully',
        'link_id': new_link.id
    }
    

# GET request - view all schools
@router.get('/all_schools', status_code=status.HTTP_200_OK)
def get_all_schools(db: db_dependency):
    schools = db.query(School).all()
    return {'schools': schools}


# GET request - view all students
@router.get('/all_students', status_code=status.HTTP_200_OK)
def get_all_students(db: db_dependency):
    students = db.query(Student).all()
    return {'students': students}


# GET request - view all parents
@router.get('/all_parents', status_code=status.HTTP_200_OK)
def get_all_parents(db: db_dependency):
    parents = db.query(Parent).all()
    return {'parents': parents}


# GET request - view all teachers
@router.get('/all_teachers', status_code=status.HTTP_200_OK)
def get_all_teachers(db: db_dependency):
    teachers = db.query(Teacher).all()
    return {'teachers': teachers}


# GET request - view all parent-student links
@router.get('/all_parent_students', status_code=status.HTTP_200_OK)
def get_all_parent_students(db: db_dependency):
    links = db.query(ParentStudent).all()
    return {'parent_student_links': links}
