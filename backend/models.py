from database import Base
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, DateTime, Float, Enum as SQLAlchemyEnum
from datetime import datetime
from zoneinfo import ZoneInfo 


DEFAULT_PROFILE_IMAGE = "http://localhost:8000/static/default-avatar.png"
SINGAPORE_TZ = ZoneInfo("Asia/Singapore")  


class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    USER = "user"   

class AccountStatus(str, Enum):
    ACTIVE = "active"
    DISABLED = "disabled"

class PermissionType(str, Enum):
    FULL_ACCESS = "full_access"
    MANAGE_ACCOUNTS = "manage_accounts"
    MANAGE_EVENTS = "manage_events"
    SEND_ANNOUNCEMENTS = "send_announcements"

class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class ConductEnum(str, Enum):
    VERY_BAD = "very bad"
    BAD = "bad"
    GOOD = "good"
    VERY_GOOD = "very good"
    EXCELLENT = "excellent"

class SubjectCategoryEnum(str, Enum):
    LANGUAGES = "languages"
    MATHEMATICS = "mathematics"
    SCIENCES = "sciences"
    HUMANITIES = "humanities"
    ELECTIVES = "electives"
    OTHERS = "others"

class TermEnum(str, Enum):
    AY2026_T1 = "AY2026 Term 1"
    AY2026_T2 = "AY2026 Term 2"
    AY2026_T3 = "AY2026 Term 3"
    AY2026_T4 = "AY2026 Term 4"

class ParentRelationship(str, Enum):
    MOTHER = "mother"
    FATHER = "father"
    GUARDIAN = "guardian"
    OTHER = "other" 

class EventType(str, Enum):
    SCHOOL_EVENT = "school event"
    HOLIDAY = "holiday"
    EXAM = "exam"
    ANNOUNCEMENT = "announcement"
    OTHER = "other"

class AffectedGroup(str, Enum):
    SECONDARY1 = "secondary 1"
    SECONDARY1_CLASS1 = "secondary 1-1"
    SECONDARY1_CLASS2 = "secondary 1-2"
    SECONDARY1_CLASS3 = "secondary 1-3"
    SECONDARY1_CLASS4 = "secondary 1-4"
    SECONDARY1_CLASS5 = "secondary 1-5"
    SECONDARY2 = "secondary 2"
    SECONDARY2_CLASS1 = "secondary 2-1"
    SECONDARY2_CLASS2 = "secondary 2-2"
    SECONDARY2_CLASS3 = "secondary 2-3"
    SECONDARY2_CLASS4 = "secondary 2-4"
    SECONDARY2_CLASS5 = "secondary 2-5"
    SECONDARY3 = "secondary 3"
    SECONDARY3_CLASS1 = "secondary 3-1"
    SECONDARY3_CLASS2 = "secondary 3-2"
    SECONDARY3_CLASS3 = "secondary 3-3"
    SECONDARY3_CLASS4 = "secondary 3-4"
    SECONDARY3_CLASS5 = "secondary 3-5"
    SECONDARY4 = "secondary 4"
    SECONDARY4_CLASS1 = "secondary 4-1"
    SECONDARY4_CLASS2 = "secondary 4-2"
    SECONDARY4_CLASS3 = "secondary 4-3"
    SECONDARY4_CLASS4 = "secondary 4-4"
    SECONDARY4_CLASS5 = "secondary 4-5"
    SECONDARY5 = "secondary 5"
    SECONDARY5_CLASS1 = "secondary 5-1"
    SECONDARY5_CLASS2 = "secondary 5-2"
    
class EventTime(str, Enum):
    T0800 = "08:00"
    T0830 = "08:30"
    T0900 = "09:00"
    T0930 = "09:30"
    T1000 = "10:00"
    T1030 = "10:30"
    T1100 = "11:00"
    T1130 = "11:30"
    T1200 = "12:00"
    T1230 = "12:30"
    T1300 = "13:00"
    T1330 = "13:30"
    T1400 = "14:00"
    T1430 = "14:30"
    T1500 = "15:00"
    T1530 = "15:30"
    T1600 = "16:00"
    T1630 = "16:30"
    T1700 = "17:00"
    T1730 = "17:30"
    T1800 = "18:00"
    

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    school_name = Column(String(150), unique=True, nullable=False)
    address = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))
    

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    nric = Column(String(12), unique=True, nullable=False, index=True)  
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER)
    assigned_groups = Column(Text, nullable=True)  
    enrollment_year = Column(Integer, nullable=True)
    parent_contact_email = Column(String(255), nullable=True)  
    parent_contact_number = Column(String(20), nullable=True) 
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    nric = Column(String(12), unique=True, nullable=False, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    mobile_number = Column(String(20), nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER)
    user_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class ParentStudent(Base):
    __tablename__ = "parent_students"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parents.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    relationship = Column(SQLAlchemyEnum(ParentRelationship), nullable=False, default=ParentRelationship.OTHER)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class TeacherStudent(Base):
    __tablename__ = "teacher_students"

    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    nric = Column(String(12), unique=True, nullable=False, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    mobile_number = Column(String(20), nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER)
    school_role = Column(String(100), nullable=True)
    assigned_groups = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    subject_name = Column(String(100), unique=True, nullable=False)
    subject_code = Column(String(20), unique=True, nullable=False)
    subject_category = Column(SQLAlchemyEnum(SubjectCategoryEnum), nullable=True, default=SubjectCategoryEnum.OTHERS)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class StudentResult(Base):
    __tablename__ = "student_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    grade = Column(String(10), nullable=True)
    score = Column(Float, nullable=True) 
    term = Column(SQLAlchemyEnum(TermEnum), nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class StudentPerformanceSummary(Base):
    __tablename__ = "student_performance_summaries"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    term = Column(SQLAlchemyEnum(TermEnum), nullable=False)
    overall_percentage = Column(Float, nullable=True)
    total_marks = Column(Integer, nullable=True)
    total_max_marks = Column(Integer, nullable=True)
    class_position = Column(Integer, nullable=True)
    class_total = Column(Integer, nullable=True)
    level_position = Column(Integer, nullable=True)
    level_total = Column(Integer, nullable=True)
    l1r4 = Column(Integer, nullable=True)
    l1r5 = Column(Integer, nullable=True)
    attendance_present = Column(Integer, nullable=True)
    attendance_total = Column(Integer, nullable=True)
    conduct = Column(SQLAlchemyEnum(ConductEnum), default=ConductEnum.GOOD)
    teacher_comments = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)
    profile_image_url = Column(String(500), nullable=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER) 
    mobile_number = Column(String(20), nullable=True)
    status = Column(SQLAlchemyEnum(AccountStatus), default=AccountStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


class EventItem(Base):
    __tablename__ = "event_items"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(SQLAlchemyEnum(EventType), default=EventType.OTHER)
    venue = Column(String(150), nullable=True) 
    affected_groups = Column(Text, nullable=True) 
    start_time = Column(SQLAlchemyEnum(EventTime), nullable=True)
    end_time = Column(SQLAlchemyEnum(EventTime), nullable=True)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=True)  
    created_by = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(SINGAPORE_TZ), onupdate=lambda: datetime.now(SINGAPORE_TZ))


