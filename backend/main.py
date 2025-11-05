from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import stock, predict, auth

load_dotenv()

app = FastAPI(
    title="Stock Price Prediction API",
    description="FastAPI backend for stock price prediction using LSTM",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(stock.router, prefix="/api/stock", tags=["Stock Data"])
app.include_router(predict.router, prefix="/api/predict", tags=["Predictions"])

@app.get("/")
async def root():
    return {
        "message": "Stock Price Prediction API",
        "status": "active",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
