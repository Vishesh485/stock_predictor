from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from app.models.user import UserRegister, UserLogin, UserResponse, Token
from app.utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.utils.database import get_user_by_email, create_user, get_user_by_id

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Register a new user with email and password
    """
    # Check if user already exists
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user in database
    new_user = create_user(
        email=user_data.email,
        hashed_password=hashed_password,
        name=user_data.name
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user["_id"]), "email": user_data.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """
    Login with email and password
    """
    # Get user from database
    user = get_user_by_email(user_credentials.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get current authenticated user information
    """
    user_id = current_user.get("sub")
    user = get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "createdAt": user["createdAt"]
    }


@router.post("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """
    Verify if the token is valid
    """
    return {
        "valid": True,
        "user_id": current_user.get("sub"),
        "email": current_user.get("email")
    }
