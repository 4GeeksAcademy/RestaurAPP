from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Owner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=False)
    location = db.Column(db.String(120), unique=False, nullable=True)
    telephone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    
     # Relación con restaurantes
    restaurants = relationship("Restaurant", back_populates="owner")

    def __repr__(self):
        return f'<Owner {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name" : self.name,
            "telephone" : self.telephone,
            "email": self.email,
            # do not serialize the password, its a security breach

        }  

class Diner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    
    def __repr__(self):
        return f'<Diner {self.fullname}>'

    def to_dict(self):
        return {
            'id': self.id,
            'fullname': self.fullname,
            'email': self.email,  
            'telephone': self.telephone,    
        }

        
           

class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    capacity = db.Column(db.Integer, nullable=False)
    
     # Foreign Key para relacionar con Owner
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'), nullable=False)

    # Relación con Owner
    owner = relationship("Owner", back_populates="restaurants")
    categories = relationship("RestaurantCategories", back_populates="restaurant", cascade="all, delete-orphan")
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "telephone": self.telephone,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "capacity": self.capacity,
            "owner_id": self.owner_id  # Incluye el ID del propietario en la serialización
        }
    
class Origin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,      
        }

class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    
    restaurants = relationship("RestaurantCategories", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Categories {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name" : self.name
            # do not serialize the password, its a security breach
        }  
    
class RestaurantCategories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_restaurant = Column(Integer, ForeignKey("restaurant.id"), nullable=False)
    id_category = Column(Integer, ForeignKey("categories.id"), nullable=False)

    restaurant = relationship("Restaurant", back_populates="categories")
    category = relationship("Categories", back_populates="restaurants")

    def __repr__(self):
        return f'<RestaurantCategories {self.id}, id_restaurant={self.id_restaurant}, id_category={self.id_category}>'

    def serialize(self):
        return {
            "id": self.id,
            "id_restaurant": self.id_restaurant,
            "id_category": self.id_category,
            "restaurant_name": self.restaurant.name if self.restaurant else None,
            "category_name": self.category.name if self.category else None,
        }