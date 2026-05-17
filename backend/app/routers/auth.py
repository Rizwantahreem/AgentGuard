"""Authentication router for Aegis."""

import hashlib
import base64
import time
import uuid

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import User
from ..schemas import UserRegister, UserLogin, UserOut, TokenOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_token(user_id: str) -> str:
    raw = f"{user_id}:{int(time.time())}"
    return base64.b64encode(raw.encode()).decode()


def get_current_user(authorization: str = Header(...), db: Session = Depends(get_db)) -> User:
    try:
        token = authorization.removeprefix("Bearer ").strip()
        decoded = base64.b64decode(token.encode()).decode()
        user_id = decoded.split(":")[0]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/register", response_model=TokenOut)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=str(uuid.uuid4()),
        email=data.email,
        password_hash=hash_password(data.password),
        company_name=data.company_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenOut(token=create_token(user.id), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or user.password_hash != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenOut(token=create_token(user.id), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


def seed_demo_user(db: Session):
    """Seed the demo user if it doesn't exist."""
    existing = db.query(User).filter(User.email == "demo@aegis.ai").first()
    if not existing:
        user = User(
            id=str(uuid.uuid4()),
            email="demo@aegis.ai",
            password_hash=hash_password("demo1234"),
            company_name="Aegis Demo",
            plan="pro",
        )
        db.add(user)
        db.commit()
