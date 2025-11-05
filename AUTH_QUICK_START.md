# 🚀 Authentication Quick Start

## 1️⃣ Install Backend Dependencies (5 minutes)

```bash
cd backend
pip install -r requirements.txt
```

New packages installed:
- `python-jose[cryptography]` - JWT tokens
- `passlib[bcrypt]` - Password hashing
- `pymongo` - MongoDB driver

## 2️⃣ Configure Environment Variables (2 minutes)

### Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/stockapp"
JWT_SECRET="$(openssl rand -base64 32)"
```

### Frontend
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 3️⃣ Start Services (1 minute)

### Terminal 1 - Backend
```bash
cd backend
uvicorn main:app --reload
```
✅ Backend running at http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

## 4️⃣ Test It Out! (2 minutes)

1. Open http://localhost:3000
2. Click "Sign Up" → Register new account
3. Login automatically after registration
4. See your name in the navbar
5. Click "Logout" to test logout
6. Click "Login" to log back in

## 🎯 Quick Test Commands

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Get Current User
```bash
# Replace YOUR_TOKEN with token from login response
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/verify` | Verify token validity |

## 🔗 Quick Links

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register

## 📁 Files Changed

### Backend (NEW)
- `app/routes/auth.py` - Auth endpoints
- `app/models/user.py` - User models
- `app/utils/auth.py` - JWT utilities
- `app/utils/database.py` - MongoDB operations

### Frontend (NEW)
- `app/contexts/AuthContext.tsx` - Auth state
- `app/login/page.tsx` - Login page
- `app/register/page.tsx` - Register page
- `app/components/Navbar.tsx` - Navigation
- `app/components/ProtectedRoute.tsx` - Route protection

### Updated
- `backend/main.py` - Added auth router
- `backend/requirements.txt` - Added dependencies
- `frontend/app/layout.tsx` - Added AuthProvider
- `frontend/app/page.tsx` - Added Navbar

## 🎨 Features

✅ User registration with email/password  
✅ User login with JWT tokens  
✅ Automatic token persistence  
✅ Protected routes  
✅ Secure password hashing  
✅ Beautiful UI components  
✅ Error handling  
✅ Loading states  
✅ Logout functionality  
✅ User info display  

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure all dependencies installed
- Verify Python version (3.9-3.12)

### Frontend won't start
- Run `npm install` in frontend directory
- Check NEXT_PUBLIC_API_URL in .env
- Clear `.next` cache: `rm -rf .next`

### Can't login
- Check backend is running
- Verify MongoDB is accessible
- Check browser console for errors
- Ensure JWT_SECRET is set

### CORS errors
- Add frontend URL to ALLOWED_ORIGINS in backend .env
- Restart backend server

## 📚 Documentation

- **AUTHENTICATION_GUIDE.md** - Complete auth documentation
- **AUTHENTICATION_IMPLEMENTATION.md** - Implementation summary
- **README.md** - Project overview

## 💡 Tips

1. Use different MongoDB for dev/prod
2. Generate strong JWT_SECRET for production
3. Enable HTTPS in production
4. Add rate limiting for login attempts
5. Consider adding refresh tokens

## ✨ What's Working

✅ Complete authentication system  
✅ JWT token-based auth  
✅ Secure password storage  
✅ Login/Register UI  
✅ User session management  
✅ Protected routes ready  
✅ API documentation  
✅ Error handling  

## 🚀 Next Steps (Optional)

- [ ] Make predictions require login
- [ ] Add user dashboard
- [ ] Store predictions with user ID
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add OAuth (Google, GitHub)

---

**Total Setup Time:** ~10 minutes  
**Status:** ✅ Ready to use!

