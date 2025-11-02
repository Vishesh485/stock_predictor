# ⚡ Quick Reference Guide

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your settings
npx prisma generate
npm run dev
```

### Train ML Model
```bash
cd ml_model
pip install -r requirements.txt
python train_model.py
```

---

## 🌐 Default URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Prisma Studio**: `npx prisma studio`

---

## 📝 Environment Variables Quick Setup

### Backend .env
```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/stockapp"
MODEL_PATH="./ml_model/saved_models/lstm_model.h5"
API_HOST="0.0.0.0"
API_PORT=8000
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend .env
```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/stockapp"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

---

## 🔧 Common Commands

### Backend
```bash
# Start dev server
uvicorn main:app --reload

# Start with custom port
uvicorn main:app --port 8080

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Prisma
npx prisma generate    # Generate client
npx prisma db push     # Push schema
npx prisma studio      # Open GUI
```

### Docker
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

---

## 🎯 Test API Endpoints

### Get Stock Data
```bash
curl http://localhost:8000/api/stock/AAPL
```

### Generate Prediction
```bash
curl -X POST http://localhost:8000/api/predict/ \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "days": 30}'
```

### Health Check
```bash
curl http://localhost:8000/health
```

---

## 📊 Popular Stock Symbols

### US Stocks
- AAPL - Apple
- TSLA - Tesla
- GOOGL - Google
- MSFT - Microsoft
- AMZN - Amazon
- META - Meta/Facebook
- NVDA - Nvidia
- NFLX - Netflix

### Indian Stocks
- TCS.NS - Tata Consultancy
- INFY.NS - Infosys
- RELIANCE.NS - Reliance
- HDFCBANK.NS - HDFC Bank
- WIPRO.NS - Wipro

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Python
pip install -r requirements.txt

# Node
npm install
```

### Database Connection Error
- Check MongoDB Atlas is accessible
- Verify IP whitelist in MongoDB
- Confirm DATABASE_URL format

### CORS Error
- Ensure backend is running
- Check ALLOWED_ORIGINS in backend .env
- Verify NEXT_PUBLIC_API_URL in frontend .env

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app entry |
| `backend/app/routes/predict.py` | Prediction logic |
| `frontend/app/page.tsx` | Home page |
| `frontend/app/components/PredictionForm.tsx` | Main UI |
| `ml_model/train_model.py` | Train LSTM model |
| `prisma/schema.prisma` | Database schema |

---

## 🔐 Generate Secrets

### NextAuth Secret
```bash
openssl rand -base64 32
```

### Random String
```bash
openssl rand -hex 16
```

---

## 📦 Package Management

### Add New Python Package
```bash
cd backend
pip install package-name
pip freeze > requirements.txt
```

### Add New Node Package
```bash
cd frontend
npm install package-name
```

---

## 🎨 Useful VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Python
- Prisma
- Docker
- GitLens

---

## 📚 Documentation Links

- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [TensorFlow](https://www.tensorflow.org/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/en-US/)

---

## 🔍 Debugging Tips

### Backend Logs
```bash
# Verbose mode
uvicorn main:app --reload --log-level debug
```

### Frontend Logs
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Database
```bash
# Open Prisma Studio
npx prisma studio
```

---

## 🚀 Production Deployment

### Backend (Render/Railway)
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

---

## 💾 Backup Important Files

Always backup:
- `.env` files
- `ml_model/saved_models/`
- Database exports
- Custom configurations

---

## 🎯 Performance Tips

1. Use production builds
2. Enable caching
3. Optimize images
4. Use CDN for static assets
5. Implement rate limiting
6. Monitor API response times

---

## 📞 Get Help

1. Check error message
2. Review logs
3. Check SETUP_GUIDE.md
4. Verify .env files
5. Test API endpoints
6. Check GitHub issues

---

**Pro Tip**: Keep this file open while developing for quick reference!
