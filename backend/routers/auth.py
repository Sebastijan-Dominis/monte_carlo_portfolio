from fastapi import APIRouter, Depends, Path, HTTPException
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated
from passlib.context import CryptContext
from starlette import status
from pydantic import BaseModel, Field
from jose import jwt, JWTError
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from models import Users
from utils.dependencies import db_dependency, argon2_context, oauth2_bearer, oauth2_bearer_dependency

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

class CreateUserRequest(BaseModel):
    email: str = Field(min_length=11, max_length=150)
    password: str = Field(min_length=8, max_length=20)

    model_config = {
        "json_schema_extra": {
            "example": {
                "email": "john_doe@gmail.com",
                "password": "johndoe123"
            }
        }
    }

class Token(BaseModel):
    access_token: str
    token_type: str

def authenticate_user(email: str, password: str, db: db_dependency):
    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if not argon2_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password.")
    return user

def create_token(email: str, user_id: int):
    encoding = {"sub": email, "id": user_id, "exp": datetime.now(timezone.utc) + timedelta(minutes=60)}
    token = jwt.encode(encoding, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/create-user", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    try:
        email = create_user_request.email
        hashed_password = argon2_context.hash(create_user_request.password)

        new_user = Users(email = email, hashed_password = hashed_password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User successfully created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User creation failed: {str(e)}")

@router.post("/authorize", status_code=status.HTTP_200_OK)
async def authorize_user(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    email = form_data.username
    password = form_data.password

    user = authenticate_user(email, password, db)

    token = create_token(user.email, user.id)
    return {"access_token": token, "token_type": "bearer"}


# only for development:
#------------------------------------------------------------
@router.get("/all-users")
async def read_users(db: db_dependency):
    return db.query(Users).all()

@router.delete("/delete-user/{user_id}")
async def delete_user(db: db_dependency, user_id: int = Path(ge=1)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    db.delete(user)
    db.commit()
#------------------------------------------------------------