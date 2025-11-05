from pymongo import MongoClient
from typing import Optional
import os
import ssl
import certifi
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# MongoDB client
client = None
db = None


def get_database():
    """Get MongoDB database instance"""
    global client, db
    if db is None:
        # Configure TLS/SSL settings for MongoDB Atlas with Python 3.14
        # Using certifi for proper SSL certificate verification
        client = MongoClient(
            DATABASE_URL,
            tls=True,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=False,
            tlsAllowInvalidHostnames=False,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=20000,
            socketTimeoutMS=20000,
        )
        db = client.get_database()
    return db


def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from MongoDB"""
    database = get_database()
    users_collection = database["User"]
    user = users_collection.find_one({"email": email})
    return user


def create_user(email: str, hashed_password: str, name: Optional[str] = None) -> dict:
    """Create a new user in MongoDB"""
    from datetime import datetime
    from bson import ObjectId
    
    database = get_database()
    users_collection = database["User"]
    
    user_data = {
        "email": email,
        "password": hashed_password,
        "name": name,
        "provider": "email",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_data)
    user_data["_id"] = result.inserted_id
    
    return user_data


def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID from MongoDB"""
    from bson import ObjectId
    
    database = get_database()
    users_collection = database["User"]
    
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        return user
    except:
        return None
