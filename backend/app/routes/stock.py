from fastapi import APIRouter, HTTPException
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

router = APIRouter()

@router.get("/{symbol}")
async def get_stock_data(symbol: str, period: str = "1y"):
    """
    Fetch stock data from Yahoo Finance with moving averages and technical indicators
    
    Args:
        symbol: Stock ticker symbol (e.g., AAPL, TSLA)
        period: Time period (1mo, 3mo, 6mo, 1y, 2y, 5y)
    """
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for symbol: {symbol}")
        
        # Calculate moving averages
        hist['MA50'] = hist['Close'].rolling(window=50).mean()
        hist['MA100'] = hist['Close'].rolling(window=100).mean()
        hist['MA200'] = hist['Close'].rolling(window=200).mean()
        
        # Calculate additional technical indicators
        hist['MA20'] = hist['Close'].rolling(window=20).mean()
        hist['Daily_Return'] = hist['Close'].pct_change()
        hist['Volatility'] = hist['Daily_Return'].rolling(window=20).std()
        
        # Calculate Bollinger Bands
        hist['BB_upper'] = hist['MA20'] + (hist['Close'].rolling(window=20).std() * 2)
        hist['BB_lower'] = hist['MA20'] - (hist['Close'].rolling(window=20).std() * 2)
        
        # Calculate RSI (Relative Strength Index)
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        hist['RSI'] = 100 - (100 / (1 + rs))
        
        # Reset index to make Date a column
        hist.reset_index(inplace=True)
        
        # Convert to dict for JSON response
        data = hist.to_dict(orient='records')
        
        # Get stock info
        info = stock.info
        
        # Calculate summary statistics
        recent_data = hist.tail(30)
        summary = {
            "avg_volume": float(recent_data['Volume'].mean()),
            "avg_price": float(recent_data['Close'].mean()),
            "price_std": float(recent_data['Close'].std()),
            "min_price": float(recent_data['Close'].min()),
            "max_price": float(recent_data['Close'].max()),
            "current_ma50": float(hist['MA50'].iloc[-1]) if not pd.isna(hist['MA50'].iloc[-1]) else None,
            "current_ma100": float(hist['MA100'].iloc[-1]) if not pd.isna(hist['MA100'].iloc[-1]) else None,
            "current_ma200": float(hist['MA200'].iloc[-1]) if not pd.isna(hist['MA200'].iloc[-1]) else None,
        }
        
        return {
            "symbol": symbol,
            "data": data,
            "info": {
                "name": info.get("longName", symbol),
                "currency": info.get("currency", "USD"),
                "exchange": info.get("exchange", "Unknown"),
                "currentPrice": info.get("currentPrice", 0),
                "marketCap": info.get("marketCap", 0)
            },
            "summary": summary
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}/info")
async def get_stock_info(symbol: str):
    """Get basic stock information"""
    try:
        stock = yf.Ticker(symbol)
        info = stock.info
        
        return {
            "symbol": symbol,
            "name": info.get("longName", symbol),
            "sector": info.get("sector", "Unknown"),
            "industry": info.get("industry", "Unknown"),
            "currency": info.get("currency", "USD"),
            "exchange": info.get("exchange", "Unknown"),
            "currentPrice": info.get("currentPrice", 0),
            "marketCap": info.get("marketCap", 0),
            "description": info.get("longBusinessSummary", "")
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
