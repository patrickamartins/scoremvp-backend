# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Configuração do banco de dados usando variáveis de ambiente
DB_USER = os.environ.get('DB_USER', 'scoremvp_user')
DB_PASS = os.environ.get('DB_PASS', 'StrongPass!123')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'scoremvp')

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}:3306/{DB_NAME}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ⬇️ IMPORTA OS MODELOS para que Base.metadata "os conheça"
import models

# ⬇️ CRIA AS TABELAS DEFINIDAS EM models.py no banco
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
