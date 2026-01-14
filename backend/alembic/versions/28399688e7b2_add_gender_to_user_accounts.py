"""add gender to user_accounts

Revision ID: 28399688e7b2
Revises: 12127b0549c3
Create Date: 2026-01-15 00:16:47.857260

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from models import GenderEnum


# revision identifiers, used by Alembic.
revision: str = '28399688e7b2'
down_revision: Union[str, Sequence[str], None] = '12127b0549c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_accounts",
        sa.Column("gender", sa.Enum("male", "female", "other", name="genderenum"), nullable=True, server_default="other")
    )


def downgrade() -> None:
    op.drop_column("user_accounts", "gender")
