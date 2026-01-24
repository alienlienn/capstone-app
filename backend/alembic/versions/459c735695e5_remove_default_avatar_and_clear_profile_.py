"""remove default avatar and clear profile_image_url

Revision ID: 459c735695e5
Revises: 28399688e7b2
Create Date: 2026-01-24 14:46:35.388730

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '459c735695e5'
down_revision: Union[str, Sequence[str], None] = '28399688e7b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'user_accounts',
        'profile_image_url',
        server_default=None,
        existing_type=sa.String(length=500),
        existing_nullable=True,
    )

    # 2️⃣ Set all existing profile_image_url values to NULL
    op.execute("UPDATE user_accounts SET profile_image_url = NULL WHERE profile_image_url IS NOT NULL;")



def downgrade() -> None:
    op.alter_column(
        'user_accounts',
        'profile_image_url',
        server_default=sa.text("'http://localhost:8000/static/default-avatar.png'"),
        existing_type=sa.String(length=500),
        existing_nullable=True,
    )
