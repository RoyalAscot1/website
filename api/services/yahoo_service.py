import yfinance as yf

# Yahoo Finance helper functions
def get_investment_name(ticker):
    try:
        stock = yf.Ticker(ticker) 
        info = stock.info
        return info.get("shortName") or info.get("longName") or ticker
    except Exception:
        return ticker

def get_current_price(ticker):
    try:
        stock = yf.Ticker(ticker) 
        info = stock.info
        return info.get("regularMarketPrice") or info.get("previousClose")
    except Exception:
        return None

def get_beta(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        return info.get("beta")  # may return None
    except:
        return None