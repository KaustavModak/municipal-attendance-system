from sqlalchemy import create_engine # to create a connection to the database
from sqlalchemy.orm import sessionmaker # to create a session for interacting with the database
from sqlalchemy.orm import declarative_base # to define the base class for our database models

from app.config import settings # to access the database configuration settings from the .env file


DATABASE_URL = (
    f"mysql+pymysql://"
    f"{settings.DB_USER}:"
    f"{settings.DB_PASSWORD}@"
    f"{settings.DB_HOST}:"
    f"{settings.DB_PORT}/"
    f"{settings.DB_NAME}"
)

engine = create_engine(DATABASE_URL) # create a connection to the database using the provided URL

SessionLocal = sessionmaker(
    autocommit=False, # to ensure that changes are not automatically committed to the database
    autoflush=False, # to prevent automatic flushing of changes to the database before they are committed
    bind=engine # to bind the session to the database engine, allowing us to execute queries and interact with the database
)

Base = declarative_base() # to define the base class for our database models, which will be used to create tables and define relationships between them