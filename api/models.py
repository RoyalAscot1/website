from sqlalchemy import Table, Column, Integer, String, Float
from database import metadata

investments = Table(
    "investments",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("risk_level", String(50)),
    Column("expected_return", Float),
)
