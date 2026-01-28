from fastapi import APIRouter
from starlette import status
from models import GenderEnum

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
