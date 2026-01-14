from database import Base
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, DateTime, Enum as SQLAlchemyEnum
from sqlalchemy.sql import func


DEFAULT_PROFILE_IMAGE = "http://localhost:8000/static/default-avatar.png"

class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    TEACHER = "teacher"
    USER = "user"   # can be parent/student

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

class ParentRelationship(str, Enum):
    MOTHER = "mother"
    FATHER = "father"
    GUARDIAN = "guardian"
    OTHER = "other" 

class EventType(str, Enum):
    MEETING = "meeting"
    HOLIDAY = "holiday"
    EXAM = "exam"
    ANNOUNCEMENT = "announcement"
    OTHER = "other"


class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    school_name = Column(String(150), unique=True, nullable=False)
    address = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

class UserAccount(Base):
    __tablename__ = "user_accounts"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)
    profile_image_url = Column(String(500), nullable=True, server_default=DEFAULT_PROFILE_IMAGE)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER) 
    mobile_number = Column(String(20), nullable=True)
    status = Column(SQLAlchemyEnum(AccountStatus), default=AccountStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    

class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    permission = Column(SQLAlchemyEnum(PermissionType), nullable=False)
    granted_by = Column(Integer, ForeignKey("user_accounts.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    nric = Column(String(12), unique=True, nullable=False, index=True)  
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True, default=GenderEnum.OTHER)
    class_name = Column(String(50), nullable=True)  
    enrollment_year = Column(Integer, nullable=True)
    parent_contact_email = Column(String(255), nullable=True)  
    parent_contact_number = Column(String(20), nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ParentStudent(Base):
    __tablename__ = "parent_students"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    relationship = Column(SQLAlchemyEnum(ParentRelationship), nullable=False, default=ParentRelationship.OTHER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    created_by = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    

class EventItem(Base):
    __tablename__ = "event_items"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(SQLAlchemyEnum(EventType), default=EventType.OTHER)
    start_datetime = Column(DateTime, nullable=False)
    end_datetime = Column(DateTime, nullable=True)  
    created_by = Column(Integer, ForeignKey("user_accounts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


