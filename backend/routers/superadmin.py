from fastapi import APIRouter, HTTPException
from starlette import status
from pydantic import BaseModel, EmailStr
from datetime import date
from utils.utils import db_dependency, hash_password
from models import (
    UserAccount, UserRole, School, Student, Parent, Teacher, ParentStudent, 
    TeacherStudent, GenderEnum, ParentRelationship, Subject, TermEnum, ConductEnum, 
    SubjectCategoryEnum
)


router = APIRouter(prefix="/superadmin", tags=["superadmin"])

class CreateAccountRequest(BaseModel):
    email: EmailStr
    password: str
    role: UserRole
    first_name: str
    last_name: str
    school_id: int | None = None
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
    school_role: str | None = None
    assigned_groups: str | None = None
    user_id: int | None = None


class CreateParentStudentRequest(BaseModel):
    parent_id: int
    student_id: int
    relationship: ParentRelationship


class CreateTeacherStudentRequest(BaseModel):
    teacher_id: int
    student_id: int


class CreateSubjectRequest(BaseModel):
    subject_name: str
    subject_code: str
    subject_category: SubjectCategoryEnum | None = SubjectCategoryEnum.OTHERS
    description: str | None = None


class CreateStudentResultRequest(BaseModel):
    student_id: int
    subject_id: int
    grade: str | None = None
    score: float | None = None
    term: TermEnum
    teacher_id: int


class CreatePerformanceSummaryRequest(BaseModel):
    student_id: int
    term: TermEnum
    overall_percentage: float | None = None
    overall_grade: str | None = None
    total_marks: int | None = None
    total_max_marks: int | None = None
    class_position: int | None = None
    class_total: int | None = None
    level_position: int | None = None
    level_total: int | None = None
    l1r4: int | None = None
    l1r5: int | None = None
    attendance_present: int | None = None
    attendance_total: int | None = None
    conduct: ConductEnum = ConductEnum.GOOD
    teacher_comments: str | None = None


# POST request - account creation
@router.post("/create_account", status_code=status.HTTP_201_CREATED)
def create_account(request: CreateAccountRequest | list[CreateAccountRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_accounts = []
    
    for req in requests:
        existing_user = db.query(UserAccount).filter(UserAccount.email == req.email).first()
        if existing_user:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")
            continue
            
        # Create new user account
        new_user = UserAccount(
            email=req.email,
            password_hash=hash_password(req.password),
            role=req.role,
            first_name=req.first_name,
            last_name=req.last_name,
            mobile_number=req.mobile_number
        )
        db.add(new_user)
        created_accounts.append(new_user)
        
    db.commit()
    for user in created_accounts:
        db.refresh(user)
    
    result = [
        {
            "message": "User account created successfully",
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        }
        for user in created_accounts
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)


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
def add_school(request: CreateSchoolRequest | list[CreateSchoolRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_schools = []
    
    for req in requests:
        existing_school = db.query(School).filter(School.school_name == req.school_name).first()
        if existing_school:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="School already exists")
            continue
            
        new_school = School(
            school_name=req.school_name,
            address=req.address,
            contact_email=req.contact_email
        )
        db.add(new_school)
        created_schools.append(new_school)
        
    db.commit()
    for school in created_schools:
        db.refresh(school)
        
    result = [
        {
            "message": "School added successfully",
            "school_id": school.id,
            "school_name": school.school_name
        }
        for school in created_schools
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)
    

# POST request - add students
@router.post('/add_student', status_code=status.HTTP_201_CREATED)
def add_student(request: CreateStudentRequest | list[CreateStudentRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_students = []
    
    for req in requests:
        existing_student = db.query(Student).filter(Student.nric == req.nric).first()
        if existing_student:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Student already exists')
            continue
            
        new_student = Student(
            nric=req.nric,
            school_id=req.school_id,
            first_name=req.first_name,
            last_name=req.last_name,
            date_of_birth=req.date_of_birth,
            gender=req.gender,
            assigned_groups=req.assigned_groups,
            enrollment_year=req.enrollment_year,
            parent_contact_email=req.parent_contact_email,
            parent_contact_number=req.parent_contact_number
        )
        db.add(new_student)
        created_students.append(new_student)
        
    db.commit()
    for student in created_students:
        db.refresh(student)
        
    result = [
        {
            'message': 'Student added successfully',
            'student_id': student.id,
            'nric': student.nric
        }
        for student in created_students
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)


# POST request - add parent
@router.post('/add_parent', status_code=status.HTTP_201_CREATED)
def add_parent(request: CreateParentRequest | list[CreateParentRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_parents = []
    
    for req in requests:
        existing_parent = db.query(Parent).filter(Parent.nric == req.nric).first()
        if existing_parent:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Parent already exists')
            continue
            
        new_parent = Parent(
            nric=req.nric,
            first_name=req.first_name,
            last_name=req.last_name,
            email=req.email,
            mobile_number=req.mobile_number,
            gender=req.gender,
            user_id=req.user_id
        )
        db.add(new_parent)
        created_parents.append(new_parent)
        
    db.commit()
    for parent in created_parents:
        db.refresh(parent)
        
    result = [
        {
            'message': 'Parent added successfully',
            'parent_id': parent.id,
            'nric': parent.nric
        }
        for parent in created_parents
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)
    

# POST request - add teacher
@router.post('/add_teacher', status_code=status.HTTP_201_CREATED)
def add_teacher(request: CreateTeacherRequest | list[CreateTeacherRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_teachers = []
    
    for req in requests:
        existing_teacher = db.query(Teacher).filter(Teacher.nric == req.nric).first()
        if existing_teacher:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Teacher already exists')
            continue
            
        new_teacher = Teacher(
            nric=req.nric,
            school_id=req.school_id,
            first_name=req.first_name,
            last_name=req.last_name,
            email=req.email,
            mobile_number=req.mobile_number,
            gender=req.gender,
            school_role=req.school_role,
            assigned_groups=req.assigned_groups,
            user_id=req.user_id
        )
        db.add(new_teacher)
        created_teachers.append(new_teacher)
        
    db.commit()
    for teacher in created_teachers:
        db.refresh(teacher)
        
    result = [
        {
            'message': 'Teacher added successfully',
            'teacher_id': teacher.id,
            'nric': teacher.nric
        }
        for teacher in created_teachers
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)
    
    
# POST request - link parent and student
@router.post('/add_parent_student', status_code=status.HTTP_201_CREATED)
def add_parent_student(request: CreateParentStudentRequest | list[CreateParentStudentRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_links = []
    
    for req in requests:
        existing_link = db.query(ParentStudent).filter(
            ParentStudent.parent_id == req.parent_id,
            ParentStudent.student_id == req.student_id
        ).first()
        
        if existing_link:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Link already exists')
            continue
            
        new_link = ParentStudent(
            parent_id=req.parent_id,
            student_id=req.student_id,
            relationship=req.relationship
        )
        db.add(new_link)
        created_links.append(new_link)
        
    db.commit()
    for link in created_links:
        db.refresh(link)
        
    result = [
        {
            'message': 'Parent and student linked successfully',
            'link_id': link.id
        }
        for link in created_links
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)
    

# POST request - link teacher and student
@router.post('/add_teacher_student', status_code=status.HTTP_201_CREATED)
def add_teacher_student(request: CreateTeacherStudentRequest | list[CreateTeacherStudentRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_links = []
    
    for req in requests:
        existing_link = db.query(TeacherStudent).filter(
            TeacherStudent.teacher_id == req.teacher_id,
            TeacherStudent.student_id == req.student_id
        ).first()
        
        if existing_link:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Link already exists')
            continue
            
        new_link = TeacherStudent(
            teacher_id=req.teacher_id,
            student_id=req.student_id
        )
        db.add(new_link)
        created_links.append(new_link)
        
    db.commit()
    for link in created_links:
        db.refresh(link)
        
    result = [
        {
            'message': 'Teacher and student linked successfully',
            'link_id': link.id
        }
        for link in created_links
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)


# POST request - add subjects
@router.post("/add_subject", status_code=status.HTTP_201_CREATED)
def add_subject(request: CreateSubjectRequest | list[CreateSubjectRequest], db: db_dependency):
    requests = request if isinstance(request, list) else [request]
    created_subjects = []
    
    for req in requests:
        existing_subject = db.query(Subject).filter(Subject.subject_code == req.subject_code).first()
        if existing_subject:
            if not isinstance(request, list):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Subject with this code already exists")
            continue
            
        new_subject = Subject(
            subject_name=req.subject_name,
            subject_code=req.subject_code,
            subject_category=req.subject_category,
            description=req.description
        )
        db.add(new_subject)
        created_subjects.append(new_subject)
        
    db.commit()
    for subject in created_subjects:
        db.refresh(subject)
        
    result = [
        {
            "message": "Subject added successfully",
            "subject_id": subject.id,
            "subject_code": subject.subject_code
        }
        for subject in created_subjects
    ]
    
    return result if isinstance(request, list) else (result[0] if result else None)


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


# GET request - view all subjects
@router.get('/all_subjects', status_code=status.HTTP_200_OK)
def get_all_subjects(db: db_dependency):
    subjects = db.query(Subject).all()
    return {'subjects': subjects}


# GET request - view all teacher-student links
@router.get('/all_teacher_students', status_code=status.HTTP_200_OK)
def get_all_teacher_students(db: db_dependency):
    links = db.query(TeacherStudent).all()
    return {'teacher_student_links': links}

