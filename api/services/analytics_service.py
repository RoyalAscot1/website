import pandas as pd

# Compute and return analytics for an investment portfolio
def compute_portfolio_analytics(df: pd.DataFrame):
    # Numeric: Position value, Unrealized gain/loss
    df["ReturnPercent"] = ((df["CurrentPrice"] - df["AveragePurchasePrice"]) /
                       df["AveragePurchasePrice"]) * 100
    total_value = df["TotalValue"].sum()
    total_pl = df["UnrealizedGainLoss"].sum()

    df["Weight"] = df["TotalValue"] / total_value if total_value else 0.0
    concentration = df[df["Weight"] > 0.40][["TickerSymbol", "Weight"]].to_dict(orient="records")

    def beta_to_volatility(beta):
        if beta is None:
            return "Unknown"
        return "High" if beta >= 1.2 else "Normal"

    df["Volatility"] = df["Beta"].apply(beta_to_volatility)
    vol_exposure = df[df["Volatility"] == "High"]["Weight"].sum()

    # Build the analytics JSON
    analytics = {
        "total_value": round(float(total_value), 2),
        "total_pl": round(float(total_pl), 2),

        "per_stock": df[[
            "TickerSymbol", "InvestmentName", "QuantityHeld", "AveragePurchasePrice",
            "CurrentPrice", "TotalValue", "UnrealizedGainLoss", "ReturnPercent", "Weight",
            "Volatility"
        ]].to_dict(orient="records"),

        "risks": {
            "concentration_risk": concentration,
            "volatility_exposure": round(float(vol_exposure), 4),
        }
    }
    return analytics