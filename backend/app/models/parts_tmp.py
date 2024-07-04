from app.extensions import db
from dataclasses import dataclass
from datetime import datetime

@dataclass
class PartsTmp(db.Model):
    part_number: str = db.Column(db.String(100), nullable=False, primary_key=True)
    price: int = db.Column(db.Integer, nullable=False)
    quantity: int = db.Column(db.Integer, nullable=False)
    vehicle: str = db.Column(db.String(100), nullable=False)
    vehicle_make: str = db.Column(db.String(100), nullable=True)
    vehicle_model: str = db.Column(db.String(100), nullable=True)
    vehicle_year: str = db.Column(db.String(100), nullable=True)
    color: str = db.Column(db.String(100), nullable=True)
    date_added: str = db.Column(db.DateTime, default=datetime.utcnow)