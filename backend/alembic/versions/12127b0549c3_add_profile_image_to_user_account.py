"""add profile image to user account

Revision ID: 12127b0549c3
Revises: 9e6e261357c7
Create Date: 2026-01-14 23:38:37.650798

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '12127b0549c3'
down_revision: Union[str, Sequence[str], None] = '9e6e261357c7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_accounts",
        sa.Column("profile_image_url", sa.String(length=500), nullable=True)
    )


def downgrade() -> None:
    op.drop_column("user_accounts", "profile_image_url")
