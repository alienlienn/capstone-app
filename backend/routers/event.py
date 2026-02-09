from fastapi import APIRouter
from pydantic import BaseModel
from starlette import status
from utils.utils import db_dependency
from models import EventType, AffectedGroup, EventItem
from datetime import datetime


router = APIRouter(prefix="/event", tags=["event"])

class AddEvent(BaseModel):
    school_id: int
    title: str
    description: str | None = None
    event_type: EventType
    venue: str | None = None
    affected_groups: AffectedGroup | None = None
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
            "affected_groups": event.affected_groups.value if event.affected_groups else None,
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
        affected_groups=event.affected_groups,
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

