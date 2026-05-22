import yfinance as yf

def get_ticker_info(ticker):
    try:
        info = yf.Ticker(ticker).info
        return {
            "InvestmentName": info.get("shortName") or info.get("longName") or ticker,
            "CurrentPrice": info.get("regularMarketPrice") or info.get("previousClose"),
            "Beta": info.get("beta"),
        }
    except Exception:
        return {"InvestmentName": ticker, "CurrentPrice": None, "Beta": None}
