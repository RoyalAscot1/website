from sqlalchemy import Table, Column, Integer, String, Float, DateTime, func, ForeignKey
from database import metadata

investment_snapshots = Table(
    "investment_snapshots",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user_id", String, nullable=False),
    Column("uploaded_at", DateTime(timezone=True), server_default=func.now()),
    Column("description", String, nullable=True)
)

investments = Table(
    "investments",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("snapshot_id", Integer, ForeignKey("investment_snapshots.id")),
    Column("TickerSymbol", String),
    Column("InvestmentName", String, nullable=True),
    Column("AssetType", String),
    Column("QuantityHeld", Float),
    Column("AveragePurchasePrice", Float),
    Column("CurrentPrice", Float),
    Column("TotalValue", Float),
    Column("UnrealizedGainLoss", Float),
    Column("Currency", String),
    Column("Beta", Float)
)

surveys = Table(
    "surveys",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", String, nullable=False),
    Column("riskTolerance", Integer),        # 1–3
    Column("investmentHorizon", Integer),    # 1–3
    Column("lossCapacity", Integer),         # 1–3
    Column("investmentGoal", Integer),       # 1–3
)
