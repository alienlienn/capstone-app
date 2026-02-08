"""add affected_groups to event_items

Revision ID: c48f6bf4a781
Revises: 459c735695e5
Create Date: 2026-02-07 04:29:33.982483

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c48f6bf4a781'
down_revision: Union[str, Sequence[str], None] = '459c735695e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# List all affected group options
AFFECTED_GROUPS = [
    "secondary 1", "secondary 1-1", "secondary 1-2", "secondary 1-3", "secondary 1-4", "secondary 1-5",
    "secondary 2", "secondary 2-1", "secondary 2-2", "secondary 2-3", "secondary 2-4", "secondary 2-5",
    "secondary 3", "secondary 3-1", "secondary 3-2", "secondary 3-3", "secondary 3-4", "secondary 3-5",
    "secondary 4", "secondary 4-1", "secondary 4-2", "secondary 4-3", "secondary 4-4", "secondary 4-5",
    "secondary 5", "secondary 5-1", "secondary 5-2"
]


def upgrade() -> None:
    op.add_column(
        "event_items",
        sa.Column(
            "affected_groups",
            sa.String(50),
            nullable=True,
        )
    )
    
    op.create_check_constraint(
        "ck_event_items_affected_groups",
        "event_items",
        f"affected_groups IS NULL OR affected_groups IN ({', '.join([f'\"{v}\"' for v in AFFECTED_GROUPS])})"
    )

def downgrade() -> None:
    op.drop_constraint("ck_event_items_affected_groups", "event_items", type_="check")
    op.drop_column("event_items", "affected_groups")
