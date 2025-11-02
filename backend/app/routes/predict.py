from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import os

router = APIRouter()

class PredictionRequest(BaseModel):
    symbol: str
    days: int = 30

class PredictionResponse(BaseModel):
    symbol: str
    predictions: list
    historical_data: list
    forecast_dates: list
    metrics: dict
    trend_comparison: dict
    moving_averages: dict

@router.post("/", response_model=PredictionResponse)
async def predict_stock_price(request: PredictionRequest):
    """
    Generate stock price predictions using LSTM model with trend comparison
    
    Args:
        symbol: Stock ticker symbol
        days: Number of days to predict (5-60)
    """
    try:
        if request.days < 5 or request.days > 60:
            raise HTTPException(
                status_code=400, 
                detail="Days must be between 5 and 60"
            )
        
        # Fetch historical data (2 years for better moving average calculation)
        stock = yf.Ticker(request.symbol)
        hist = stock.history(period="2y")
        
        if hist.empty:
            raise HTTPException(
                status_code=404, 
                detail=f"No data found for symbol: {request.symbol}"
            )
        
        # Calculate moving averages for historical data
        hist['MA50'] = hist['Close'].rolling(window=50).mean()
        hist['MA100'] = hist['Close'].rolling(window=100).mean()
        hist['MA200'] = hist['Close'].rolling(window=200).mean()
        hist['MA20'] = hist['Close'].rolling(window=20).mean()
        
        # Calculate volatility and daily returns
        hist['Daily_Return'] = hist['Close'].pct_change()
        hist['Volatility'] = hist['Daily_Return'].rolling(window=20).std()
        
        # Prepare data for prediction
        data = hist['Close'].values.reshape(-1, 1)
        
        # Scale the data
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(data)
        
        # TODO: Load and use trained LSTM model
        # For now, using simple moving average prediction as placeholder
        predictions = simple_prediction(scaled_data, request.days)
        
        # Inverse transform predictions
        predictions = scaler.inverse_transform(predictions.reshape(-1, 1))
        
        # Generate forecast dates
        last_date = hist.index[-1]
        forecast_dates = [
            (last_date + timedelta(days=i+1)).strftime('%Y-%m-%d')
            for i in range(request.days)
        ]
        
        # Prepare historical data with moving averages
        hist.reset_index(inplace=True)
        historical_data = [
            {
                "date": row['Date'].strftime('%Y-%m-%d'),
                "price": float(row['Close']),
                "volume": int(row['Volume']),
                "ma50": float(row['MA50']) if not pd.isna(row['MA50']) else None,
                "ma100": float(row['MA100']) if not pd.isna(row['MA100']) else None,
                "ma200": float(row['MA200']) if not pd.isna(row['MA200']) else None,
                "ma20": float(row['MA20']) if not pd.isna(row['MA20']) else None,
            }
            for _, row in hist.tail(200).iterrows()
        ]
        
        # Calculate current metrics
        current_price = float(data[-1][0])
        predicted_price = float(predictions[-1][0])
        change = predicted_price - current_price
        change_percent = (change / current_price) * 100
        
        # Calculate historical trend metrics (past 30 days vs past 60 days)
        past_30_days = hist.tail(30)['Close'].values
        past_60_days = hist.tail(60)['Close'].values
        past_90_days = hist.tail(90)['Close'].values
        
        past_30_trend = calculate_trend(past_30_days)
        past_60_trend = calculate_trend(past_60_days)
        past_90_trend = calculate_trend(past_90_days)
        
        # Calculate predicted trend
        pred_trend = calculate_trend(predictions.flatten())
        
        # Volatility comparison
        historical_volatility = float(np.std(past_30_days) / np.mean(past_30_days) * 100)
        predicted_volatility = float(np.std(predictions) / np.mean(predictions) * 100)
        
        # Trend comparison analysis
        trend_comparison = {
            "historical_trend_30d": {
                "direction": "upward" if past_30_trend > 0 else "downward",
                "slope": float(past_30_trend),
                "avg_price": float(np.mean(past_30_days)),
                "volatility": float(np.std(past_30_days)),
            },
            "historical_trend_60d": {
                "direction": "upward" if past_60_trend > 0 else "downward",
                "slope": float(past_60_trend),
                "avg_price": float(np.mean(past_60_days)),
                "volatility": float(np.std(past_60_days)),
            },
            "historical_trend_90d": {
                "direction": "upward" if past_90_trend > 0 else "downward",
                "slope": float(past_90_trend),
                "avg_price": float(np.mean(past_90_days)),
                "volatility": float(np.std(past_90_days)),
            },
            "predicted_trend": {
                "direction": "upward" if pred_trend > 0 else "downward",
                "slope": float(pred_trend),
                "avg_price": float(np.mean(predictions)),
                "volatility": float(np.std(predictions)),
            },
            "comparison": {
                "trend_consistency": "consistent" if (past_30_trend > 0) == (pred_trend > 0) else "divergent",
                "volatility_change": float(predicted_volatility - historical_volatility),
                "momentum_shift": float(pred_trend - past_30_trend),
            }
        }
        
        # Moving averages data
        moving_averages = {
            "ma50": float(hist['MA50'].iloc[-1]) if not pd.isna(hist['MA50'].iloc[-1]) else None,
            "ma100": float(hist['MA100'].iloc[-1]) if not pd.isna(hist['MA100'].iloc[-1]) else None,
            "ma200": float(hist['MA200'].iloc[-1]) if not pd.isna(hist['MA200'].iloc[-1]) else None,
            "current_vs_ma50": float((current_price / hist['MA50'].iloc[-1] - 1) * 100) if not pd.isna(hist['MA50'].iloc[-1]) else None,
            "current_vs_ma100": float((current_price / hist['MA100'].iloc[-1] - 1) * 100) if not pd.isna(hist['MA100'].iloc[-1]) else None,
            "current_vs_ma200": float((current_price / hist['MA200'].iloc[-1] - 1) * 100) if not pd.isna(hist['MA200'].iloc[-1]) else None,
        }
        
        metrics = {
            "current_price": current_price,
            "predicted_price": predicted_price,
            "change": change,
            "change_percent": change_percent,
            "avg_prediction": float(np.mean(predictions)),
            "max_prediction": float(np.max(predictions)),
            "min_prediction": float(np.min(predictions)),
            "confidence_interval_upper": float(np.mean(predictions) + 1.96 * np.std(predictions)),
            "confidence_interval_lower": float(np.mean(predictions) - 1.96 * np.std(predictions)),
        }
        
        return {
            "symbol": request.symbol,
            "predictions": [float(p[0]) for p in predictions],
            "historical_data": historical_data,
            "forecast_dates": forecast_dates,
            "metrics": metrics,
            "trend_comparison": trend_comparison,
            "moving_averages": moving_averages,
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_trend(data: np.ndarray) -> float:
    """
    Calculate trend slope using linear regression
    """
    n = len(data)
    x = np.arange(n)
    
    # Calculate slope using least squares
    x_mean = np.mean(x)
    y_mean = np.mean(data)
    
    numerator = np.sum((x - x_mean) * (data - y_mean))
    denominator = np.sum((x - x_mean) ** 2)
    
    slope = numerator / denominator if denominator != 0 else 0
    return slope

def simple_prediction(data: np.ndarray, days: int) -> np.ndarray:
    """
    Simple prediction using moving average with trend
    This is a placeholder until LSTM model is trained
    """
    # Use last 60 days for prediction
    window = 60
    last_data = data[-window:]
    
    # Calculate trend from recent data
    trend = calculate_trend(last_data.flatten())
    
    predictions = []
    current_data = last_data.copy()
    
    for i in range(days):
        # Moving average with trend adjustment
        ma_pred = np.mean(current_data[-30:])
        trend_adjustment = trend * (i + 1) * 0.01  # Small trend influence
        next_pred = ma_pred + trend_adjustment
        
        # Add some realistic noise
        noise = np.random.normal(0, 0.002) if i > 0 else 0
        next_pred = max(0.01, next_pred + noise)  # Ensure positive
        
        predictions.append(next_pred)
        
        # Update window
        current_data = np.append(current_data[1:], next_pred)
    
    return np.array(predictions)
