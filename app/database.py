from pymongo import MongoClient
import os

def get_database():
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongo:27017/")
    client = MongoClient(MONGODB_URL)
    return client["data_viz_db"]