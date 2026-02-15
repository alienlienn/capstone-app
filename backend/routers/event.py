from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from starlette import status
from utils.utils import db_dependency
from models import EventType, AffectedGroup, EventItem, EventTime
from datetime import datetime


router = APIRouter(prefix="/event", tags=["event"])

class AddEvent(BaseModel):
    school_id: int
    title: str
    description: str | None = None
    event_type: EventType
    venue: str | None = None
    affected_groups: list[AffectedGroup] | None = None
    start_time: EventTime | None = None
    end_time: EventTime | None = None
    start_datetime: datetime
    end_datetime: datetime | None = None
    created_by: int
    
# GET request - get all event items
@router.get("/get_all_events", status_code=status.HTTP_200_OK)
def get_all_events(db: db_dependency):
    events = db.query(EventItem).all()
    event_list = [
        {
            "id": event.id,
            "school_id": event.school_id,
            "title": event.title,
            "description": event.description,
            "event_type": event.event_type.value if event.event_type else None,
            "venue": event.venue,
            "affected_groups": event.affected_groups, 
            "start_time": event.start_time.value if event.start_time else None,
            "end_time": event.end_time.value if event.end_time else None,
            "start_datetime": event.start_datetime.isoformat() if event.start_datetime else None,
            "end_datetime": event.end_datetime.isoformat() if event.end_datetime else None,
            "created_by": event.created_by,
            "created_at": event.created_at.isoformat() if event.created_at else None,
            "updated_at": event.updated_at.isoformat() if event.updated_at else None,
        }
        for event in events
    ]
    
    return {"events": event_list, "count": len(event_list)}


# GET request - get events by user id
@router.get("/get_user_events/{user_id}", status_code=status.HTTP_200_OK)
def get_user_events(user_id: int, db: db_dependency):
    events = db.query(EventItem).filter(EventItem.created_by == user_id).all()
    event_list = [
        {
            "id": event.id,
            "school_id": event.school_id,
            "title": event.title,
            "description": event.description,
            "event_type": event.event_type.value if event.event_type else None,
            "venue": event.venue,
            "affected_groups": event.affected_groups,
            "start_time": event.start_time.value if event.start_time else None,
            "end_time": event.end_time.value if event.end_time else None,
            "start_datetime": event.start_datetime.isoformat() if event.start_datetime else None,
            "end_datetime": event.end_datetime.isoformat() if event.end_datetime else None,
            "created_by": event.created_by,
            "created_at": event.created_at.isoformat() if event.created_at else None,
            "updated_at": event.updated_at.isoformat() if event.updated_at else None,
        }
        for event in events
    ]

    return {"events": event_list, "count": len(event_list)}


# POST request - add new event item 
@router.post("/add_event", status_code=status.HTTP_201_CREATED)
def add_new_event(event: AddEvent, db: db_dependency):
    new_event = EventItem(
        school_id=event.school_id,
        title=event.title,
        description=event.description,
        event_type=event.event_type,
        venue=event.venue,
        affected_groups=",".join([g.value for g in event.affected_groups]) if event.affected_groups else None,
        start_time=event.start_time,
        end_time=event.end_time,
        start_datetime=event.start_datetime,
        end_datetime=event.end_datetime,
        created_by=event.created_by
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {
        "message": "Event created successfully",
        "event_id": new_event.id
    }


# POST request - update and save event 
@router.post("/update_event/{event_id}", status_code=status.HTTP_200_OK)
def update_event(event_id: int, payload: AddEvent, db: db_dependency):
    event = db.query(EventItem).filter(EventItem.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.school_id = payload.school_id
    event.title = payload.title
    event.description = payload.description
    event.event_type = payload.event_type
    event.venue = payload.venue
    event.affected_groups = (
        ",".join([g.value for g in payload.affected_groups])
        if payload.affected_groups else None
    )
    event.start_time = payload.start_time
    event.end_time = payload.end_time
    event.start_datetime = payload.start_datetime
    event.end_datetime = payload.end_datetime

    db.commit()
    db.refresh(event)

    return {
        "message": "Event updated successfully",
        "event_id": event.id
    }


# POST request - delete event
@router.post("/delete_event/{event_id}", status_code=status.HTTP_200_OK)
def delete_event(event_id: int, db: db_dependency):
    event = db.query(EventItem).filter(EventItem.id == event_id).first()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()

    return {
        "message": "Event deleted successfully",
        "event_id": event_id
    }
