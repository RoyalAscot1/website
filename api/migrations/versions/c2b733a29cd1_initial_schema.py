"""initial schema

Revision ID: c2b733a29cd1
Revises: 
Create Date: 2026-05-23 17:04:18.707190

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c2b733a29cd1'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "investment_snapshots",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("description", sa.String, nullable=True),
    )
    op.create_table(
        "investments",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("snapshot_id", sa.Integer, sa.ForeignKey("investment_snapshots.id")),
        sa.Column("TickerSymbol", sa.String),
        sa.Column("InvestmentName", sa.String, nullable=True),
        sa.Column("AssetType", sa.String),
        sa.Column("QuantityHeld", sa.Float),
        sa.Column("AveragePurchasePrice", sa.Float),
        sa.Column("CurrentPrice", sa.Float),
        sa.Column("TotalValue", sa.Float),
        sa.Column("UnrealizedGainLoss", sa.Float),
        sa.Column("Currency", sa.String),
        sa.Column("Beta", sa.Float),
    )
    op.create_table(
        "surveys",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.String, nullable=False),
        sa.Column("riskTolerance", sa.Integer),
        sa.Column("investmentHorizon", sa.Integer),
        sa.Column("lossCapacity", sa.Integer),
        sa.Column("investmentGoal", sa.Integer),
    )


def downgrade() -> None:
    op.drop_table("investments")
    op.drop_table("investment_snapshots")
    op.drop_table("surveys")
