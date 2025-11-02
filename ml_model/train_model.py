"""
LSTM Model Training Script for Stock Price Prediction
"""

import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import matplotlib.pyplot as plt
import os
from datetime import datetime

# Configuration
SYMBOL = 'AAPL'  # Training on Apple stock
PERIOD = '5y'    # 5 years of data
SEQUENCE_LENGTH = 60  # Use 60 days to predict next day
EPOCHS = 50
BATCH_SIZE = 32
TRAIN_TEST_SPLIT = 0.8

def fetch_data(symbol=SYMBOL, period=PERIOD):
    """Fetch stock data from Yahoo Finance"""
    print(f"Fetching data for {symbol}...")
    stock = yf.Ticker(symbol)
    df = stock.history(period=period)
    print(f"Fetched {len(df)} data points")
    return df

def prepare_data(df, sequence_length=SEQUENCE_LENGTH):
    """Prepare data for LSTM training"""
    print("Preparing data...")
    
    # Use only Close price
    data = df['Close'].values.reshape(-1, 1)
    
    # Scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)
    
    # Create sequences
    X, y = [], []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i, 0])
        y.append(scaled_data[i, 0])
    
    X, y = np.array(X), np.array(y)
    
    # Reshape X for LSTM [samples, time steps, features]
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    
    print(f"Data shape - X: {X.shape}, y: {y.shape}")
    
    return X, y, scaler

def build_model(input_shape):
    """Build LSTM model architecture"""
    print("Building model...")
    
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        
        LSTM(units=50, return_sequences=True),
        Dropout(0.2),
        
        LSTM(units=50, return_sequences=False),
        Dropout(0.2),
        
        Dense(units=25),
        Dense(units=1)
    ])
    
    model.compile(
        optimizer='adam',
        loss='mean_squared_error',
        metrics=['mae']
    )
    
    print(model.summary())
    
    return model

def train_model(model, X_train, y_train, X_test, y_test):
    """Train the LSTM model"""
    print("Training model...")
    
    # Callbacks
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True
    )
    
    checkpoint = ModelCheckpoint(
        'saved_models/best_model.h5',
        monitor='val_loss',
        save_best_only=True,
        verbose=1
    )
    
    # Train
    history = model.fit(
        X_train, y_train,
        batch_size=BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=(X_test, y_test),
        callbacks=[early_stopping, checkpoint],
        verbose=1
    )
    
    return history

def plot_training_history(history):
    """Plot training metrics"""
    print("Plotting training history...")
    
    plt.figure(figsize=(12, 4))
    
    # Loss
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    # MAE
    plt.subplot(1, 2, 2)
    plt.plot(history.history['mae'], label='Training MAE')
    plt.plot(history.history['val_mae'], label='Validation MAE')
    plt.title('Model MAE')
    plt.xlabel('Epoch')
    plt.ylabel('MAE')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('saved_models/training_history.png')
    print("Training history saved to saved_models/training_history.png")

def evaluate_model(model, X_test, y_test, scaler):
    """Evaluate model performance"""
    print("Evaluating model...")
    
    predictions = model.predict(X_test)
    
    # Inverse transform
    predictions = scaler.inverse_transform(predictions)
    y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))
    
    # Calculate metrics
    mse = np.mean((predictions - y_test_actual) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(predictions - y_test_actual))
    
    print(f"\nModel Performance:")
    print(f"RMSE: ${rmse:.2f}")
    print(f"MAE: ${mae:.2f}")
    
    # Plot predictions vs actual
    plt.figure(figsize=(12, 6))
    plt.plot(y_test_actual, label='Actual Price', color='blue')
    plt.plot(predictions, label='Predicted Price', color='red', alpha=0.7)
    plt.title('Stock Price Prediction - Test Set')
    plt.xlabel('Time')
    plt.ylabel('Price ($)')
    plt.legend()
    plt.savefig('saved_models/prediction_comparison.png')
    print("Prediction comparison saved to saved_models/prediction_comparison.png")
    
    return rmse, mae

def main():
    """Main training pipeline"""
    print("=" * 50)
    print("LSTM Stock Price Prediction - Training Script")
    print("=" * 50)
    
    # Create directories
    os.makedirs('saved_models', exist_ok=True)
    os.makedirs('data', exist_ok=True)
    
    # Fetch data
    df = fetch_data()
    
    # Save raw data
    df.to_csv('data/training_data.csv')
    print("Raw data saved to data/training_data.csv")
    
    # Prepare data
    X, y, scaler = prepare_data(df)
    
    # Split data
    split_idx = int(len(X) * TRAIN_TEST_SPLIT)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    
    # Build model
    model = build_model(input_shape=(X_train.shape[1], 1))
    
    # Train model
    history = train_model(model, X_train, y_train, X_test, y_test)
    
    # Plot training history
    plot_training_history(history)
    
    # Evaluate model
    rmse, mae = evaluate_model(model, X_test, y_test, scaler)
    
    # Save final model
    model.save('saved_models/lstm_model.h5')
    print("\nModel saved to saved_models/lstm_model.h5")
    
    # Save scaler
    import joblib
    joblib.dump(scaler, 'saved_models/scaler.pkl')
    print("Scaler saved to saved_models/scaler.pkl")
    
    # Save model metadata
    metadata = {
        'symbol': SYMBOL,
        'training_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'sequence_length': SEQUENCE_LENGTH,
        'epochs': EPOCHS,
        'rmse': float(rmse),
        'mae': float(mae),
        'train_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    import json
    with open('saved_models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("Metadata saved to saved_models/metadata.json")
    
    print("\n" + "=" * 50)
    print("Training completed successfully!")
    print("=" * 50)

if __name__ == "__main__":
    main()
