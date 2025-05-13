# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# Pegando as variáveis de ambiente corretas
DB_USER = os.environ.get("MYSQLUSER", "mvpplayer")
DB_PASS = os.environ.get("MYSQLPASSWORD", "cPUBRDSUdOKvCoUYKdcMxfnpeGpPLNMQ")
DB_HOST = os.environ.get("MYSQLHOST", "mysql.railway.internal")
DB_NAME = os.environ.get("MYSQLDATABASE", "scoremvp")
DB_PORT = os.environ.get("MYSQLPORT", "3306")

SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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
