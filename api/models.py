from sqlalchemy import Table, Column, Integer, String, Float, DateTime, func, ForeignKey
from database import metadata

investment_snapshots = Table(
    "investment_snapshots",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
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
    Column("riskTolerance", String),
    Column("investmentHorizon", String),
)
