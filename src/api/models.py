
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Time, Enum
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from src import db
import enum

# Enum para el estado de las reservas
class ReservationState(enum.Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REHUSED = "Refused"
    CANCELED = "Canceled"

    @classmethod
    def list_values(cls):
        return [state.value for state in cls]


# Modelo de Usuario
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
        }


# Modelo de Propietario
class Owner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120), nullable=True)
    telephone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    # Relación con restaurantes, usando cascada para eliminaciones
    restaurants = relationship("Restaurant", back_populates="owner", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "telephone": self.telephone,
            "email": self.email,
            "restaurants": [restaurant.serialize() for restaurant in self.restaurants]  # Serializar restaurantes
        }


# Modelo de Comensal
class Diner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    telephone = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    # Relación con reservas
    reservations = relationship("Reservation", back_populates="diner")

    def serialize(self):
        return {
            'id': self.id,
            'fullname': self.fullname,
            'email': self.email,
            'telephone': self.telephone,
            'reservations': [reservation.serialize() for reservation in self.reservations]
        }


# Modelo de Restaurante
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    # Relación con propietario
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'), nullable=False)
    owner = relationship("Owner", back_populates="restaurants")

    # Relación con reservas
    reservations = relationship(
        "Reservation", 
        back_populates="restaurant",
        cascade="all, delete-orphan"  # Habilitar cascada para eliminar reservas asociadas
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "telephone": self.telephone,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "capacity": self.capacity,
            "owner": {"id": self.owner.id, "name": self.owner.name},  # Información básica del propietario
        }


# Modelo de Reserva
class Reservation(db.Model):  # Cambia de Reservations a Reservation
    __tablename__ = 'reservations'  # Asegúrate de que el nombre de la tabla sea correcto
    id = db.Column(db.Integer, primary_key=True)
    id_fk_restaurant = db.Column(
    db.Integer,
    db.ForeignKey('restaurant.id', ondelete="CASCADE"),  # Añade ondelete="CASCADE"
    nullable=False
)

    id_fk_diner = db.Column(db.Integer, db.ForeignKey('diner.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Time, nullable=False)
    state = db.Column(db.Enum(ReservationState), default=ReservationState.PENDING, nullable=False)
    people = db.Column(db.Integer, nullable=False)

    # Relación con restaurante
    restaurant = relationship("Restaurant", back_populates="reservations")

    # Relación con comensal
    diner = relationship("Diner", back_populates="reservations")

    def serialize(self):
        return {
            "id": self.id,
            "restaurant_id": self.id_fk_restaurant,
            "diner_id": self.id_fk_diner,
            "date": self.date.strftime('%d/%m/%Y'),
            "hour": self.hour.strftime('%H:%M'),
            "state": self.state.value,
            "people": self.people,
            "restaurant": self.restaurant.name if self.restaurant else None,  # Nombre del restaurante
            "diner": self.diner.fullname if self.diner else None  # Nombre del comensal
        }
