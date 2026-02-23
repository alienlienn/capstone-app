from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from starlette import status
from utils.utils import db_dependency
from pydantic import BaseModel
from typing import List, Optional
import io
import pandas as pd
from sqlalchemy.orm import Session
from models import Parent, Student, ParentStudent, Teacher, TeacherStudent, StudentResult, StudentPerformanceSummary, Subject


router = APIRouter(prefix="/result", tags=["result"])

class ResultUpdate(BaseModel):
    subject: str
    score: Optional[float] = None
    grade: Optional[str] = None
    teacher_id: int

class SummaryUpdate(BaseModel):
    overall_percentage: Optional[float] = None
    total_marks: Optional[float] = None
    total_max_marks: Optional[float] = None
    class_position: Optional[int] = None
    class_total: Optional[int] = None
    level_position: Optional[int] = None
    level_total: Optional[int] = None
    l1r4: Optional[int] = None
    l1r5: Optional[int] = None
    attendance_present: Optional[int] = None
    attendance_total: Optional[int] = None
    conduct: Optional[str] = None
    teacher_comments: Optional[str] = None

class ResultsSaveRequest(BaseModel):
    student_id: int
    term: str
    results: List[ResultUpdate]
    summary: SummaryUpdate


# GET request - fetch all students by their id
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


# GET request - fetch all students linked to a teacher
@router.get("/get_teacher_students/{user_id}", status_code=status.HTTP_200_OK)
async def get_teacher_students(user_id: int, db: db_dependency):
    teacher = db.query(Teacher).filter(Teacher.user_id == user_id).first()
    if not teacher:
        return []
    
    student_links = db.query(TeacherStudent).filter(TeacherStudent.teacher_id == teacher.id).all()
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


# GET request - fetch results and summary for a student by term
@router.get("/student/{student_id}", status_code=status.HTTP_200_OK)
async def get_student_results(student_id: int, term: str, db: db_dependency):
    # Fetch summary
    summary = db.query(StudentPerformanceSummary).filter(
        StudentPerformanceSummary.student_id == student_id,
        StudentPerformanceSummary.term == term
    ).first()

    # Fetch results with Subject Name
    results = db.query(StudentResult, Subject.subject_name).join(
        Subject, StudentResult.subject_id == Subject.id
    ).filter(
        StudentResult.student_id == student_id,
        StudentResult.term == term
    ).all()

    # Format results list
    results_list = []
    for result, subject_name in results:
        # Extract year from term string "AY2026 Term 1" -> 2026
        try:
            year_str = result.term.split()[0][2:] # "2026"
            year_int = int(year_str)
        except:
            year_int = 0

        results_list.append({
            "id": result.id,
            "student_id": result.student_id,
            "subject": subject_name,
            "grade": result.grade,
            "score": result.score,
            "max_score": 100, # Default
            "remarks": "",    # Default
            "term": result.term,
            "year": year_int,
            "teacher_id": result.teacher_id
        })

    return {
        "summary": summary,
        "results": results_list
    }


# POST request - bulk upload student's results in excel 
@router.post("/bulk_upload_excel", status_code=status.HTTP_201_CREATED)
async def bulk_upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(getattr(__import__('utils.utils', fromlist=['get_db']), 'get_db'))
):
    try:
        contents = await file.read()
        excel_file = io.BytesIO(contents)
        xl = pd.ExcelFile(excel_file)
        responses = {"results": [], "summaries": []}

        # Process results
        if 'results' in xl.sheet_names:
            df_results = xl.parse('results')
            for row in df_results.to_dict(orient='records'):
                student = db.query(Student).filter_by(id=row['student_id']).first()
                subject = db.query(Subject).filter_by(subject_code=row['subject_code']).first()
                if not student or not subject:
                    responses["results"].append({"error": f"Invalid student_id or subject_code in row: {row}"})
                    continue
                
                # Check if result already exists
                existing_result = db.query(StudentResult).filter_by(
                    student_id=row['student_id'],
                    subject_id=subject.id,
                    term=row.get('term')
                ).first()

                if existing_result:
                    existing_result.grade = row.get('grade')
                    existing_result.score = row.get('score')
                    existing_result.teacher_id = row.get('teacher_id')
                    responses["results"].append({"student_id": row['student_id'], "subject_id": subject.id, "status": "updated"})
                else:
                    result = StudentResult(
                        student_id=row['student_id'],
                        subject_id=subject.id,
                        grade=row.get('grade'),
                        score=row.get('score'),
                        term=row.get('term'),
                        teacher_id=row.get('teacher_id')
                    )
                    db.add(result)
                    responses["results"].append({"student_id": row['student_id'], "subject_id": subject.id, "status": "added"})

        # Process summaries
        if 'summaries' in xl.sheet_names:
            df_summaries = xl.parse('summaries')
            for row in df_summaries.to_dict(orient='records'):
                # Check if summary already exists
                existing_summary = db.query(StudentPerformanceSummary).filter_by(
                    student_id=row['student_id'],
                    term=row.get('term')
                ).first()

                if existing_summary:
                    existing_summary.overall_percentage = row.get('overall_percentage')
                    existing_summary.total_marks = row.get('total_marks')
                    existing_summary.total_max_marks = row.get('total_max_marks')
                    existing_summary.class_position = row.get('class_position')
                    existing_summary.class_total = row.get('class_total')
                    existing_summary.level_position = row.get('level_position')
                    existing_summary.level_total = row.get('level_total')
                    existing_summary.l1r4 = row.get('l1r4')
                    existing_summary.l1r5 = row.get('l1r5')
                    existing_summary.attendance_present = row.get('attendance_present')
                    existing_summary.attendance_total = row.get('attendance_total')
                    existing_summary.conduct = row.get('conduct')
                    existing_summary.teacher_comments = row.get('teacher_comments')
                    responses["summaries"].append({"student_id": row['student_id'], "term": row.get('term'), "status": "updated"})
                else:
                    summary = StudentPerformanceSummary(
                        student_id=row['student_id'],
                        term=row.get('term'),
                        overall_percentage=row.get('overall_percentage'),
                        total_marks=row.get('total_marks'),
                        total_max_marks=row.get('total_max_marks'),
                        class_position=row.get('class_position'),
                        class_total=row.get('class_total'),
                        level_position=row.get('level_position'),
                        level_total=row.get('level_total'),
                        l1r4=row.get('l1r4'),
                        l1r5=row.get('l1r5'),
                        attendance_present=row.get('attendance_present'),
                        attendance_total=row.get('attendance_total'),
                        conduct=row.get('conduct'),
                        teacher_comments=row.get('teacher_comments')
                    )
                    db.add(summary)
                    responses["summaries"].append({"student_id": row['student_id'], "term": row.get('term'), "status": "added"})

        db.commit()
        return responses
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/update_student_results", status_code=status.HTTP_200_OK)
async def update_student_results(request: ResultsSaveRequest, db: db_dependency):
    try:
        summary = db.query(StudentPerformanceSummary).filter(
            StudentPerformanceSummary.student_id == request.student_id,
            StudentPerformanceSummary.term == request.term
        ).first()

        if not summary:
            summary = StudentPerformanceSummary(
                student_id=request.student_id,
                term=request.term
            )
            db.add(summary)
        
        summary.overall_percentage = request.summary.overall_percentage
        summary.total_marks = request.summary.total_marks
        summary.total_max_marks = request.summary.total_max_marks
        summary.class_position = request.summary.class_position
        summary.class_total = request.summary.class_total
        summary.level_position = request.summary.level_position
        summary.level_total = request.summary.level_total
        summary.l1r4 = request.summary.l1r4
        summary.l1r5 = request.summary.l1r5
        summary.attendance_present = request.summary.attendance_present
        summary.attendance_total = request.summary.attendance_total
        summary.conduct = request.summary.conduct
        summary.teacher_comments = request.summary.teacher_comments

        existing_results = db.query(StudentResult).filter(
            StudentResult.student_id == request.student_id,
            StudentResult.term == request.term
        ).all()
        
        existing_results_map = {res.subject_id: res for res in existing_results}
        processed_subject_ids = set()

        for res_data in request.results:
            if not res_data.subject.strip():
                continue

            subject = db.query(Subject).filter(Subject.subject_name == res_data.subject).first()
            if not subject:
                subject_code = res_data.subject.strip().upper().replace(" ", "_")
                subject = db.query(Subject).filter(Subject.subject_code == subject_code).first()
                if not subject:
                    subject = Subject(
                        subject_name=res_data.subject.strip(), 
                        subject_code=subject_code
                    )
                    db.add(subject)
                    db.flush()
            
            processed_subject_ids.add(subject.id)
            
            if subject.id in existing_results_map:
                res_obj = existing_results_map[subject.id]
                res_obj.score = res_data.score
                res_obj.grade = res_data.grade
                res_obj.teacher_id = res_data.teacher_id
            else:
                new_res = StudentResult(
                    student_id=request.student_id,
                    subject_id=subject.id,
                    score=res_data.score,
                    grade=res_data.grade,
                    term=request.term,
                    teacher_id=res_data.teacher_id
                )
                db.add(new_res)

        for subject_id, res_obj in existing_results_map.items():
            if subject_id not in processed_subject_ids:
                db.delete(res_obj)

        db.commit()
        return {"message": "Results updated successfully"}

    except Exception as e:
        db.rollback()
        print(f"Error updating results: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    
