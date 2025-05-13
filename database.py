import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# lê direto do plugin
host     = os.getenv("MYSQLHOST")
port     = int(os.getenv("MYSQLPORT", 3306))
user     = os.getenv("MYSQLUSER")
password = os.getenv("MYSQLPASSWORD")
name     = os.getenv("MYSQLDATABASE")

# Debug: veja nos logs exatamente o que está chegando
print("CONNECTING TO:", f"{user}@{host}:{port}/{name}")

# monta a URL para o PyMySQL
DATABASE_URL = (
    f"mysql+pymysql://{user}:{password}"
    f"@{host}:{port}/{name}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
