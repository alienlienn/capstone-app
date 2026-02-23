from fastapi import APIRouter
from starlette import status
from models import GenderEnum, EventType, AffectedGroup, EventTime, TermEnum, ConductEnum

router = APIRouter(prefix="/lookup", tags=["lookup"])


# GET request - get gender options
@router.get("/gender_options", status_code=status.HTTP_200_OK)
def get_gender_option():
  return [
    {
      "label": gender.value.capitalize(),
      "value": gender.value
    }
    for gender in GenderEnum
  ]
  

# GET request - get event type options
@router.get("/event_type_options", status_code=status.HTTP_200_OK)
def get_event_type_options():
    return [
      {
        "label": event_type.value.replace("_", " ").title(), 
        "value": event_type.value
      }
      for event_type in EventType
    ]
    

# GET request - get affected group options
@router.get("/affected_group_options", status_code=status.HTTP_200_OK)
def get_affected_group_options():
    return [
      {
        "label": group.value.replace("_", " ").title(), 
        "value": group.value
      }
      for group in AffectedGroup
  ]

# GET request - get event time options
@router.get("/event_time_options", status_code=status.HTTP_200_OK)
def get_event_time_options():
    return [
      {
        "label": time.value,
        "value": time.value
      }
      for time in EventTime
    ]


# GET request - get term options
@router.get("/term_options", status_code=status.HTTP_200_OK)
def get_term_options():
    return [
      {
        "label": term.value,
        "value": term.value
      }
      for term in TermEnum
    ]


# GET request - get conduct options
@router.get("/conduct_options", status_code=status.HTTP_200_OK)
def get_conduct_options():
    return [
      {
        "label": conduct.value.replace("_", " ").title(),
        "value": conduct.value
      }
      for conduct in ConductEnum
    ]
