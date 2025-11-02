# 🧭 Stock Price Prediction — Instructions & Overview

## 🪶 Overview

The **Stock Price Prediction Web App** is a modern full-stack project designed to forecast stock prices using **LSTM (Long Short-Term Memory)** deep learning models.  
It integrates **Next.js (frontend)**, **FastAPI (backend)**, and **MongoDB (via Prisma ORM)** into a seamless system that provides data visualization, forecasting, and user management.

This system allows:
- Real-time fetching of stock data from **Yahoo Finance**
- Predictive modeling for **5–60 days ahead**
- Visualization of historical and forecasted prices
- Saving predictions to a secure user dashboard

---

## 🧱 Architecture Overview

```mermaid
graph TD
A[User Interface (Next.js + Tailwind CSS)] --> B[Backend API (FastAPI)]
B --> C[Machine Learning Engine (LSTM Model)]
B --> D[Database (MongoDB + Prisma ORM)]
C --> E[Yahoo Finance API]
```

### Data Flow
1. The user enters a stock symbol and forecast range in the web UI.
2. The frontend sends this data to the FastAPI backend.
3. The backend fetches historical prices via Yahoo Finance.
4. The ML model (LSTM) predicts future prices.
5. Predictions are sent back to the frontend for visualization and saved in MongoDB.

---

## 🧠 Technology Summary

| Layer | Tools / Frameworks | Purpose |
|-------|-------------------|---------|
| **Frontend** | Next.js 15, React, Tailwind CSS, Framer Motion | Responsive UI and routing |
| **Charts** | Plotly.js / Recharts | Data visualization |
| **Backend** | FastAPI, Python 3.11 | API + ML model serving |
| **Machine Learning** | TensorFlow, Keras, Scikit-learn | LSTM prediction engine |
| **Database** | MongoDB Atlas + Prisma | Data persistence and ORM |
| **Authentication** | NextAuth.js | User login system |
| **Deployment** | Docker, Vercel, Render / AWS | Cloud-based hosting |
| **API Source** | Yahoo Finance / Alpha Vantage | Stock market data source |

---

## 🧩 Components Overview

### 1️⃣ Frontend (Next.js)
- Built using React components and Tailwind CSS.
- Communicates with backend using Axios or native fetch.
- Displays interactive charts using Recharts / Plotly.js.
- Handles authentication via NextAuth.js.

**Key Pages**
- `/` — Dashboard (search & visualize)
- `/history` — User forecast history
- `/login` — Authentication
- `/about` — App details

### 2️⃣ Backend (FastAPI)
- Acts as a bridge between frontend and ML model.
- Fetches stock data using yfinance.
- Processes and scales data (MinMaxScaler).
- Uses pre-trained LSTM model (lstm_model.pkl).
- Returns predictions as JSON.

**Core Routes**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock/{symbol}` | Fetch stock data |
| POST | `/api/predict` | Generate forecast |
| GET | `/api/predictions/{userId}` | Retrieve user forecasts |

### 3️⃣ Database (MongoDB + Prisma)
- Hosted on MongoDB Atlas.
- Prisma ORM provides schema management and data validation.
- Stores user info, stock records, and predictions.

**Collections**
- `users`
- `stocks`
- `predictions`
- `logs`

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stock-price-predictor.git
cd stock-price-predictor
```

### 🧮 2. Setup MongoDB + Prisma
1. Create a MongoDB Atlas cluster.
2. Copy your connection string.
3. Add to `.env` file:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/stockapp"
```

**Generate Prisma Client**
```bash
cd frontend
npx prisma generate
npx prisma db push
```

### 🧰 3. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

This will start your FastAPI server at `http://localhost:8000`

### 💻 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access your app at `http://localhost:3000`

---

## 🔍 Usage Guide

1. Open the app in your browser.
2. Login using Google or GitHub (via NextAuth).
3. Enter a stock ticker (e.g., AAPL, TSLA, TCS.NS).
4. Select forecast period (5–60 days).
5. Click **Predict**.
6. View:
   - Historical vs Predicted chart
   - Key performance metrics (MA50, MA100, etc.)
   - Download results (CSV/PDF)
7. Save prediction for future reference.

---

## 🧾 Example Workflow

**User Input:**
```
Symbol: AAPL  
Forecast: 30 days
```

**Backend Process:**
1. Fetches data → Yahoo Finance
2. Preprocesses → Scaling, MA calculations
3. Predicts → 30 future closing prices
4. Sends result to frontend

**Frontend Visualization:**
- Blue line → Historical prices
- Red line → Predicted prices
- Dotted lines → Moving averages

---

## 🧱 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT encryption |
| `NEXTAUTH_URL` | URL for Next.js app |
| `YFINANCE_API` | (Optional) Custom finance API key |
| `MODEL_PATH` | Path to saved LSTM model file |

---

## 🧪 Testing

**Unit Tests:**
- Test ML functions, API endpoints, and DB queries.
- Use `pytest` for backend and `jest` for frontend.

**Integration Tests:**
- Simulate API calls and check response times.
- Validate predictions and data consistency.

---

## 🧩 Deployment Overview

| Component | Platform | Notes |
|-----------|----------|-------|
| **Frontend** | Vercel | Auto-deploy from GitHub |
| **Backend** | Render / AWS EC2 | Docker container with FastAPI |
| **Database** | MongoDB Atlas | Cloud NoSQL DB |
| **CI/CD** | GitHub Actions | Continuous deployment |
| **Domain** | Custom / vercel.app | HTTPS enabled |

---

## 🚀 Developer Notes

- Run ML training locally using Jupyter Notebook (`ml_model/train_model.ipynb`).
- Keep your `.env` file secure and never commit it to GitHub.
- When deploying, ensure both backend and frontend URLs are configured in CORS settings.
- Update the model regularly to adapt to new stock patterns.

---

## 📚 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Official Docs](https://nextjs.org/docs)
- [Prisma MongoDB Guide](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [TensorFlow / Keras Docs](https://www.tensorflow.org/guide/keras)
- [Yahoo Finance API](https://pypi.org/project/yfinance/)

---

## 👨‍💻 Author

**Vishesh Kumar**  
🎓 B.Tech (IT), USICT, GGSIPU  
📧 visesone@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/vishesh-kumar)

---

⚡ **"Transforming stock data into actionable insights — powered by Machine Learning and Modern Web Tech."**
