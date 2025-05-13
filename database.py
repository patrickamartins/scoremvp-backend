# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://scoremvp_user:StrongPass!123@localhost:3306/scoremvp"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ⬇️ IMPORTA OS MODELOS para que Base.metadata “os conheça”
import models

# ⬇️ CRIA AS TABELAS DEFINIDAS EM models.py no banco
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
