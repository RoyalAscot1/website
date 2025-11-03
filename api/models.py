from sqlalchemy import Table, Column, Integer, String, Float
from database import metadata

investments = Table(
    "investments",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("TickerSymbol", String),
    Column("InvestmentName", String, nullable=True),
    Column("AssetType", String),
    Column("QuantityHeld", Float),
    Column("AveragePurchasePrice", Float),
    Column("CurrentPrice", Float),
    Column("TotalValue", Float),
    Column("UnrealizedGainLoss", Float),
    Column("Currency", String)
)

surveys = Table(
    "surveys",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("riskTolerance", String),
    Column("investmentHorizon", String),
)
