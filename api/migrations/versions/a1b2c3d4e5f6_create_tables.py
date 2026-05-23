"""create tables

Revision ID: a1b2c3d4e5f6
Revises: c2b733a29cd1
Create Date: 2026-05-23 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = 'c2b733a29cd1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE IF NOT EXISTS investment_snapshots (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            uploaded_at TIMESTAMPTZ DEFAULT NOW(),
            description VARCHAR
        )
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS investments (
            id SERIAL PRIMARY KEY,
            snapshot_id INTEGER REFERENCES investment_snapshots(id),
            "TickerSymbol" VARCHAR,
            "InvestmentName" VARCHAR,
            "AssetType" VARCHAR,
            "QuantityHeld" FLOAT,
            "AveragePurchasePrice" FLOAT,
            "CurrentPrice" FLOAT,
            "TotalValue" FLOAT,
            "UnrealizedGainLoss" FLOAT,
            "Currency" VARCHAR,
            "Beta" FLOAT
        )
    """)
    op.execute("""
        CREATE TABLE IF NOT EXISTS surveys (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR NOT NULL,
            "riskTolerance" INTEGER,
            "investmentHorizon" INTEGER,
            "lossCapacity" INTEGER,
            "investmentGoal" INTEGER
        )
    """)


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS investments")
    op.execute("DROP TABLE IF EXISTS investment_snapshots")
    op.execute("DROP TABLE IF EXISTS surveys")
