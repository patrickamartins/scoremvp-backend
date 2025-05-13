# models.py
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base   # garanta que é o mesmo Base de database.py

# models.py
class User(Base):
    __tablename__ = "users"

    id             = Column(Integer, primary_key=True, index=True)
    name           = Column(String(100), nullable=False)
    email          = Column(String(100), unique=True, index=True, nullable=False)
    password_hash  = Column(String(128), nullable=False)

    # camelCase direto
    document       = Column(String(20), nullable=False)
    documentType   = Column("document_type", String(10), nullable=False)

    teamPlay       = Column("team_play", String(100), nullable=True)
    teamFan        = Column("team_fan",  String(100), nullable=True)
    plan           = Column(String(20), default="free")
    created_at     = Column(DateTime, default=datetime.utcnow)

