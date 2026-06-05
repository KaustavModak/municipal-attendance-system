from app.database import Base, engine

# Import all models
from app.models import *

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")