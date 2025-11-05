# 🔐 Authentication Implementation Guide

## Overview
This document describes the authentication system implemented in the Stock Price Predictor application using JWT (JSON Web Tokens) with email and password.

## Architecture

### Backend (FastAPI)
- **JWT Token-based Authentication**
- **Password Hashing** using bcrypt
- **MongoDB** for user storage via Prisma schema
- **Protected Routes** using dependency injection

### Frontend (Next.js)
- **React Context API** for global auth state
- **LocalStorage** for token persistence
- **Protected Routes** component wrapper
- **Login/Register Pages** with form validation

## Features Implemented

### ✅ User Registration
- Email and password validation
- Password hashing with bcrypt
- Automatic JWT token generation
- Optional user name field

### ✅ User Login
- Email and password authentication
- JWT token generation (7-day expiry)
- Secure password verification

### ✅ Token Management
- JWT tokens with 7-day expiration
- Automatic token refresh on page load
- Secure token storage in localStorage

### ✅ Protected Routes
- Authentication middleware for backend API
- Frontend route protection
- Automatic redirect to login

### ✅ User Interface
- Beautiful login/register pages
- Navigation bar with auth status
- Loading states and error handling

## Backend Implementation

### Dependencies Added
```txt
python-jose[cryptography]>=3.3.0  # JWT token handling
passlib[bcrypt]>=1.7.4            # Password hashing
pymongo>=4.6.0                     # MongoDB driver
pydantic-settings>=2.0.0          # Settings management
```

### File Structure
```
backend/
├── app/
│   ├── routes/
│   │   └── auth.py              # Authentication endpoints
│   ├── models/
│   │   └── user.py              # User models (Pydantic)
│   └── utils/
│       ├── auth.py              # JWT & password utilities
│       └── database.py          # MongoDB operations
└── main.py                      # Include auth router
```

### API Endpoints

#### POST `/api/auth/register`
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "secure123",
  "name": "John Doe" // optional
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### POST `/api/auth/login`
Login with credentials
```json
Request:
{
  "email": "user@example.com",
  "password": "secure123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

#### GET `/api/auth/me`
Get current user info (requires authentication)
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response:
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-05T10:00:00Z"
}
```

#### POST `/api/auth/verify`
Verify token validity
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response:
{
  "valid": true,
  "user_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

### Password Security
- Passwords are hashed using **bcrypt** with automatic salt generation
- Minimum password length: 6 characters
- Passwords never stored in plain text
- Secure password verification on login

### JWT Configuration
```python
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
```

## Frontend Implementation

### Dependencies
All dependencies already included in Next.js project:
- `axios` - HTTP client
- `react` - React library
- `next` - Next.js framework

### File Structure
```
frontend/app/
├── contexts/
│   └── AuthContext.tsx          # Auth context & provider
├── components/
│   ├── Navbar.tsx               # Navigation with auth status
│   └── ProtectedRoute.tsx       # Protected route wrapper
├── login/
│   └── page.tsx                 # Login page
├── register/
│   └── page.tsx                 # Register page
├── layout.tsx                   # Wrap app with AuthProvider
└── page.tsx                     # Updated with Navbar
```

### Auth Context API

The `AuthContext` provides:
- `user` - Current user object or null
- `token` - JWT token or null
- `loading` - Loading state
- `isAuthenticated` - Boolean authentication status
- `login(email, password)` - Login function
- `register(email, password, name?)` - Register function
- `logout()` - Logout function

### Usage Example

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <p>Welcome {user?.name}!</p>;
  }
  
  return <button onClick={() => login(email, password)}>Login</button>;
}
```

### Protected Routes

Wrap any page that requires authentication:

```tsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  );
}
```

## Database Schema

The User model in Prisma:
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  password  String?
  provider  String?  // "email" or OAuth provider
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  predictions Prediction[]
}
```

## Environment Variables

### Backend `.env`
```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/stockapp"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
MODEL_PATH="./ml_model/saved_models/lstm_model.h5"
API_HOST="0.0.0.0"
API_PORT=8000
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend `.env`
```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/stockapp"
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
```

## Setup Instructions

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set JWT_SECRET
JWT_SECRET="$(openssl rand -base64 32)"
```

### 3. Start Backend
```bash
uvicorn main:app --reload
```

### 4. Frontend Setup (Already Done)
Frontend dependencies are already installed. Just start the dev server:
```bash
cd frontend
npm run dev
```

## Testing the Authentication

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Get User Info
```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test Protected Route
```bash
# This should return 401 without token
curl http://localhost:8000/api/predict/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"symbol": "AAPL", "days": 30}'
```

## User Flow

### Registration Flow
1. User visits `/register`
2. Fills in email, password, and optional name
3. Submits form
4. Backend creates user with hashed password
5. JWT token generated and returned
6. Frontend stores token in localStorage
7. User redirected to home page

### Login Flow
1. User visits `/login`
2. Enters email and password
3. Backend verifies credentials
4. JWT token generated and returned
5. Frontend stores token in localStorage
6. User redirected to home page

### Logout Flow
1. User clicks logout button
2. Token removed from localStorage
3. Auth context cleared
4. User redirected to home page

### Protected Access Flow
1. User tries to access protected page
2. `ProtectedRoute` checks authentication
3. If not authenticated, redirect to `/login`
4. If authenticated, render content

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT tokens with expiration
- HTTPS recommended in production
- CORS configuration
- Token-based authentication

✅ **Recommended for Production:**
- Use environment variables for secrets
- Enable HTTPS/SSL
- Implement rate limiting
- Add refresh token mechanism
- Use secure cookie storage instead of localStorage
- Implement password strength requirements
- Add account verification via email
- Enable 2FA (Two-Factor Authentication)

## Common Issues & Solutions

### Issue: "Could not validate credentials"
**Solution:** Token may be expired or invalid. Login again.

### Issue: "Email already registered"
**Solution:** User already exists. Try logging in instead.

### Issue: CORS errors
**Solution:** Ensure backend ALLOWED_ORIGINS includes frontend URL.

### Issue: Token not persisting
**Solution:** Check browser localStorage. May be cleared on logout.

## Future Enhancements

Potential improvements:
- [ ] OAuth integration (Google, GitHub)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Refresh token mechanism
- [ ] Session management
- [ ] User profile editing
- [ ] Two-factor authentication (2FA)
- [ ] Role-based access control (RBAC)
- [ ] Activity logging
- [ ] Account deletion

## API Documentation

Full API documentation available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Test with curl commands
4. Check browser console for errors
5. Review backend logs

---

**Last Updated:** November 5, 2025  
**Version:** 1.0.0  
**Author:** Vishesh Kumar

