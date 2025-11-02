# 🛠️ Stock Price Predictor - Detailed Setup Guide

This guide will walk you through setting up the Stock Price Predictor application from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 to v3.12) - [Download](https://www.python.org/)
  - ⚠️ **Important**: Python 3.14+ is not yet supported by TensorFlow. Use Python 3.12 or earlier.
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas) (Free tier available)

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/stock-price-predictor.git
cd stock-price-predictor
```

### Step 2: Setup MongoDB Database

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (Free M0 tier is sufficient)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/`

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Add a new database user with username and password
   - Remember these credentials!

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can add `0.0.0.0/0` (allow from anywhere)
   - For production, restrict to your server's IP

### Step 3: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```

5. **Edit .env file**
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/stockapp"
   MODEL_PATH="./ml_model/saved_models/lstm_model.h5"
   API_HOST="0.0.0.0"
   API_PORT=8000
   ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
   ```

6. **Test the backend**
   ```bash
   uvicorn main:app --reload
   ```
   
   Open browser to `http://localhost:8000` - you should see a welcome message.
   
   Check API docs at `http://localhost:8000/docs`

### Step 4: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file**
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/stockapp"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-random-secret-key-here"
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

   To generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Push database schema** (creates collections in MongoDB)
   ```bash
   npx prisma db push
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open browser to `http://localhost:3000`

### Step 5: Train the ML Model

1. **Navigate to ml_model directory**
   ```bash
   cd ml_model
   ```

2. **Create virtual environment with Python 3.12** (recommended)
   ```bash
   # If you have Python 3.14+, use Python 3.12 instead
   python3.12 -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install ML dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Note**: If you encounter TensorFlow installation errors with Python 3.14+, make sure you're using Python 3.9-3.12.

4. **Run training script**
   ```bash
   python train_model.py
   ```
   
   This will:
   - Fetch 5 years of Apple (AAPL) stock data
   - Train an LSTM model
   - Save the trained model to `saved_models/lstm_model.h5`
   - Generate performance plots
   - Save training metadata

   **Note**: Training may take 10-30 minutes depending on your hardware.

5. **Check training results**
   - Model: `saved_models/lstm_model.h5`
   - Plots: `saved_models/training_history.png`
   - Metrics: `saved_models/metadata.json`

## 🧪 Testing the Application

### Test Backend API

1. **Check health endpoint**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Fetch stock data**
   ```bash
   curl http://localhost:8000/api/stock/AAPL
   ```

3. **Generate prediction**
   ```bash
   curl -X POST http://localhost:8000/api/predict/ \
     -H "Content-Type: application/json" \
     -d '{"symbol": "AAPL", "days": 30}'
   ```

### Test Frontend

1. Open `http://localhost:3000` in your browser
2. Enter a stock symbol (e.g., AAPL)
3. Select forecast days (5-60)
4. Click "Predict Stock Price"
5. View the interactive chart and metrics

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`
- **Solution**: Make sure you activated the virtual environment and ran `pip install -r requirements.txt`

**Problem**: `Connection refused` error
- **Solution**: Check if the backend server is running on port 8000

**Problem**: MongoDB connection error
- **Solution**: 
  - Verify your DATABASE_URL is correct
  - Check MongoDB Atlas network access settings
  - Ensure your IP is whitelisted

### Frontend Issues

**Problem**: `Module not found` errors
- **Solution**: Run `npm install` again in the frontend directory

**Problem**: API calls failing with CORS errors
- **Solution**: 
  - Ensure backend is running
  - Check ALLOWED_ORIGINS in backend .env file
  - Verify NEXT_PUBLIC_API_URL in frontend .env file

**Problem**: Prisma errors
- **Solution**: 
  - Run `npx prisma generate`
  - Run `npx prisma db push`
  - Check DATABASE_URL format

### ML Model Issues

**Problem**: Training takes too long
- **Solution**: 
  - Reduce EPOCHS in train_model.py (try 20 instead of 50)
  - Use smaller dataset (change period from '5y' to '2y')

**Problem**: Out of memory during training
- **Solution**:
  - Reduce BATCH_SIZE in train_model.py
  - Close other applications
  - Use a machine with more RAM

**Problem**: Model not found when making predictions
- **Solution**:
  - Ensure you've run the training script
  - Check MODEL_PATH in backend .env
  - Verify the model file exists at the specified path

## 📊 Testing with Different Stocks

Try these popular stock symbols:

**US Stocks:**
- AAPL (Apple)
- TSLA (Tesla)
- GOOGL (Google)
- MSFT (Microsoft)
- AMZN (Amazon)

**Indian Stocks:**
- TCS.NS (Tata Consultancy Services)
- INFY.NS (Infosys)
- RELIANCE.NS (Reliance Industries)
- HDFCBANK.NS (HDFC Bank)

**Other Markets:**
- 0700.HK (Tencent - Hong Kong)
- TSM (TSMC)

## 🚀 Next Steps

1. **Customize the UI**: Modify the frontend components to match your preferences
2. **Add Authentication**: Implement NextAuth.js for user login
3. **Save Predictions**: Store user predictions in MongoDB
4. **Deploy**: Follow deployment guides for Vercel (frontend) and Render (backend)
5. **Improve Model**: Train on different stocks or adjust hyperparameters

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TensorFlow/Keras Guide](https://www.tensorflow.org/guide/keras)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 💡 Pro Tips

1. **Development Workflow**
   - Keep both frontend and backend running in separate terminals
   - Use `--reload` flag with uvicorn for hot-reloading
   - Next.js automatically hot-reloads on file changes

2. **Database Management**
   - Use Prisma Studio to view database: `npx prisma studio`
   - Regularly backup your MongoDB data
   - Use environment-specific database URLs

3. **Model Management**
   - Retrain models monthly for better accuracy
   - Save different model versions
   - Track model performance metrics

4. **Performance Optimization**
   - Cache frequently requested stock data
   - Implement rate limiting for API calls
   - Use production builds for deployment

## ❓ Need Help?

If you encounter issues:

1. Check the error messages carefully
2. Review the logs in terminal
3. Verify all environment variables are set correctly
4. Check the troubleshooting section above
5. Open an issue on GitHub with detailed error information

---

Happy Coding! 🎉
