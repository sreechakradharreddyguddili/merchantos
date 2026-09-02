from pymongo import MongoClient

from app.config import settings


client = MongoClient(settings.MONGODB_URI)

database = client["merchantos"]

merchants_collection = database["merchants"]
products_collection = database["products"]
orders_collection = database["orders"]
customers_collection = database["customers"]