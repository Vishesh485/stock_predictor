# 📈 Stock Price Predictor

An AI-powered stock market forecasting web application using LSTM (Long Short-Term Memory) neural networks. Built with Next.js 15, FastAPI, and TensorFlow.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Predictions** - LSTM neural network for accurate stock price forecasting
- 📊 **Interactive Charts** - Beautiful visualizations using Recharts
- 🎯 **Flexible Forecasting** - Predict 5-60 days into the future
- 🔄 **Real-time Data** - Fetches live stock data from Yahoo Finance
- 💾 **Data Persistence** - MongoDB with Prisma ORM
- 🎨 **Modern UI** - Built with Next.js 15 and Tailwind CSS
- 🌙 **Dark Mode Support** - Seamless theme switching

### Advanced Analytics (New! 🎉)
- 📈 **Historical Price Analysis** - Up to 200 data points with volume information
- 📉 **Moving Averages** - 20, 50, 100, and 200-day moving averages
- 🔀 **Trend Comparison** - Compare historical trends (30/60/90-day) with predicted trends
- 📊 **Technical Indicators** - RSI, Bollinger Bands, volatility metrics
- 🎯 **Confidence Intervals** - 95% confidence range for predictions
- 📈 **Momentum Analysis** - Track trend acceleration and momentum shifts
- 🔍 **Volatility Tracking** - Historical vs predicted volatility comparison
- 💡 **Trend Consistency** - Identify if predictions align with historical patterns

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Next.js 15)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend API   │─────▶│  Yahoo       │
│   (FastAPI)     │      │  Finance API │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│   LSTM Model    │
│  (TensorFlow)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   (Prisma)      │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9-3.12 (⚠️ Python 3.14+ not yet supported by TensorFlow)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stock-price-predictor.git
cd stock-price-predictor
```

### 2. Setup Backend

```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start the FastAPI server
uvicorn main:app --reload
```

The backend will be available at `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Train the ML Model (Optional)

```bash
cd ml_model
pip install -r requirements.txt

# Train the LSTM model
python train_model.py
```

This will create a trained model in `ml_model/saved_models/lstm_model.h5`

## 📁 Project Structure

```
stock-price-predictor/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
│   ├── main.py            # FastAPI application
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend
│   ├── app/
│   │   ├── components/    # React components
│   │   ├── api/           # API routes
│   │   └── page.tsx       # Main page
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json       # Node dependencies
│
├── ml_model/              # Machine learning
│   ├── train_model.py    # Training script
│   ├── saved_models/     # Trained models
│   └── requirements.txt   # ML dependencies
│
└── README.md
```

## 🔧 Configuration

### Backend (.env)

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/stockapp"
MODEL_PATH="./ml_model/saved_models/lstm_model.h5"
API_HOST="0.0.0.0"
API_PORT=8000
```

### Frontend (.env)

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/stockapp"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 🎯 Usage

1. **Enter Stock Symbol**: Type a valid stock ticker (e.g., AAPL, TSLA, GOOGL)
2. **Select Forecast Period**: Choose between 5-60 days
3. **Click Predict**: Generate AI-powered predictions
4. **View Results**: Analyze comprehensive metrics including:
   - Price predictions with confidence intervals
   - Interactive chart with moving averages (toggle MA50, MA100, MA200)
   - Trend comparison (30/60/90-day historical vs predicted)
   - Volatility and momentum analysis
   - Moving averages positioning

### Supported Stock Formats

- US Stocks: `AAPL`, `TSLA`, `GOOGL`
- Indian Stocks: `TCS.NS`, `INFY.NS`, `RELIANCE.NS`
- Other Markets: Check Yahoo Finance for valid symbols

### Understanding the Results

#### Moving Averages:
- **MA50** (Purple): 50-day moving average - medium-term trend
- **MA100** (Orange): 100-day moving average - intermediate trend
- **MA200** (Pink): 200-day moving average - long-term trend
- Toggle each MA on/off using the buttons above the chart

#### Trend Analysis:
- **Consistent Trend**: Prediction matches historical pattern (higher confidence)
- **Divergent Trend**: Prediction differs from history (review carefully)
- **Volatility Change**: Positive = more fluctuation, Negative = more stable
- **Momentum Shift**: Positive = accelerating trend, Negative = decelerating

📖 **For detailed usage instructions, see [USAGE_GUIDE.md](USAGE_GUIDE.md)**
📚 **For feature documentation, see [FEATURES_DOCUMENTATION.md](FEATURES_DOCUMENTATION.md)**

## 📊 API Endpoints

### Stock Data

```http
GET /api/stock/{symbol}?period=1y
```

Returns historical stock data with moving averages.

### Generate Prediction

```http
POST /api/predict/
Content-Type: application/json

{
  "symbol": "AAPL",
  "days": 30
}
```

Returns predicted stock prices with comprehensive analysis including:
- Predicted prices for specified period
- Historical data with moving averages (MA20, MA50, MA100, MA200)
- Trend comparison (30/60/90-day historical vs predicted)
- Confidence intervals (95% range)
- Moving averages analysis
- Volatility and momentum metrics

### Health Check

```http
GET /health
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🎨 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **yfinance** - Stock data fetching
- **uvicorn** - ASGI server

### Machine Learning
- **TensorFlow** - Deep learning framework
- **Keras** - Neural network API
- **Scikit-learn** - Data preprocessing
- **NumPy & Pandas** - Data manipulation

### Database
- **MongoDB** - NoSQL database
- **Prisma** - Next-generation ORM

## 📈 Model Performance

The LSTM model is trained on 5 years of historical stock data with the following architecture:

- 3 LSTM layers (50 units each)
- Dropout layers (0.2) for regularization
- 2 Dense layers for output
- Adam optimizer
- MSE loss function

Typical performance metrics:
- RMSE: ~$2-5 (varies by stock)
- MAE: ~$1-3

## 🚀 Deployment

### Deploy Backend (Render/Railway)

1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

## 📝 Recent Updates (v2.0.0)

### ✅ Completed
- ✅ Historical price analysis with 200+ data points
- ✅ Moving averages (MA20, MA50, MA100, MA200) with toggle controls
- ✅ Trend comparison analysis (30/60/90-day historical vs predicted)
- ✅ Technical indicators (RSI, Bollinger Bands, Daily Returns)
- ✅ Confidence intervals for predictions
- ✅ Volatility tracking and comparison
- ✅ Momentum shift analysis
- ✅ Enhanced visualization with interactive charts
- ✅ Comprehensive trend cards and metrics display

## 📝 Future Enhancements

- [ ] Add user authentication with NextAuth.js
- [ ] Implement saved predictions dashboard
- [ ] MACD (Moving Average Convergence Divergence)
- [ ] Fibonacci Retracement levels
- [ ] Support for multiple ML models (LSTM, GRU, Transformer)
- [ ] Real-time price updates with WebSockets
- [ ] Export predictions as PDF/CSV
- [ ] Add sentiment analysis from news
- [ ] Pattern recognition (Head & Shoulders, Double Top, etc.)
- [ ] Portfolio tracking and comparison
- [ ] Mobile app version
- [ ] Alert notifications for price targets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vishesh Kumar**  
B.Tech (IT), USICT, GGSIPU  
📧 visesone@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/vishesh-kumar)

## ⚠️ Disclaimer

This application is for educational purposes only. Stock predictions are based on historical data and should not be considered as financial advice. Always do your own research before making investment decisions.

## 🙏 Acknowledgments

- Yahoo Finance for providing free stock data API
- TensorFlow team for the excellent ML framework
- Next.js and Vercel for the amazing developer experience
- The open-source community for inspiration and tools

---

⚡ **"Transforming stock data into actionable insights — powered by Machine Learning and Modern Web Tech."**
