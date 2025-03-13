from flask import Blueprint, jsonify, request
from src.api.models import Reservation, Restaurant, Diner
from src import db
from datetime import datetime

# Crear el Blueprint para las rutas de reservas
reservations = Blueprint('reservations', __name__)

# Validación de datos de una reserva
def validate_reservation_data(data):
    errors = []
    required_fields = ['id_fk_restaurant', 'date', 'hour', 'people']

    # Validar campos obligatorios
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"El campo {field} es obligatorio")

    # Validar formato de fecha y hora
    try:
        datetime.strptime(data.get('date', ''), '%Y-%m-%d')
        datetime.strptime(data.get('hour', ''), '%H:%M')
    except ValueError:
        errors.append("Formato de fecha u hora inválido (YYYY-MM-DD, HH:MM)")

    # Validar número de personas
    if not isinstance(data.get('people', 0), int) or data.get('people', 0) <= 0:

        errors.append("El número de personas debe ser un entero positivo")

    return errors if errors else None

# **GET**: Obtener todas las reservas
@reservations.route('/', methods=['GET'])
def get_all_reservations():
    try:
        # Obtener todas las reservas
        reservations = Reservation.query.all()

        # Serializar todas las reservas y devolverlas en la respuesta
        return jsonify([reservation.serialize() for reservation in reservations]), 200
    except Exception as e:
        print(f"Error al obtener todas las reservas: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500

# **GET**: Obtener todas las reservas de un restaurante
@reservations.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant_reservations(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    try:
        reservations = Reservation.query.filter_by(id_fk_restaurant=restaurant_id).all()
        return jsonify([reservation.serialize() for reservation in reservations]), 200
    except Exception as e:
        print(f"Error al obtener reservas del restaurante: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500
    
    
@reservations.route('/available', methods=['POST'])
def get_available_restaurants():
    # Obtener los datos enviados en el cuerpo de la solicitud
    data = request.get_json()
    location = data.get('location')
    people = data.get('people')

    # Validar los datos obligatorios
    if not location or not isinstance(people, int) or people <= 0:
        return jsonify({"error": "Debes proporcionar una ubicación válida y un número de personas positivo"}), 400

    try:
        # Buscar restaurantes en la ubicación especificada
        restaurants = Restaurant.query.filter_by(location=location).all()

        # Filtrar restaurantes que puedan acomodar el número de personas solicitado
        available_restaurants = []
        for restaurant in restaurants:
            # Calcular la capacidad restante
            total_reserved_people = sum(
                reservation.people
                for reservation in restaurant.reservations
            )
            capacity_remaining = restaurant.capacity - total_reserved_people

            # Si el restaurante tiene suficiente capacidad disponible, incluirlo en la lista
            if capacity_remaining >= people:
                available_restaurants.append(restaurant.serialize())

        # Retornar los restaurantes disponibles
        return jsonify({"available_restaurants": available_restaurants}), 200

    except Exception as e:
        print(f"Error al obtener restaurantes disponibles: {e}")
        return jsonify({"error": "Error al buscar restaurantes disponibles", "details": str(e)}), 500


# **POST**: Crear una nueva reserva
@reservations.route('/', methods=['POST'])
def create_reservation():
    data = request.get_json()

    # Validar los datos de la reserva
    errors = validate_reservation_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    restaurant = Restaurant.query.get(data['id_fk_restaurant'])
    if not restaurant:
        return jsonify({"error": "El restaurante no existe"}), 404

    # Verificar si el comensal existe, de lo contrario crear uno
    diner = Diner.query.filter_by(telephone=data.get('phone')).first()
    if not diner:
        if 'name' not in data or 'email' not in data:
            return jsonify({"error": "El nombre y el correo electrónico son obligatorios"}), 400
        diner = Diner(
            fullname=data['name'],
            email=data['email'],
            telephone=data['phone'],
            password="temporarypassword"  # Contraseña temporal
        )
        db.session.add(diner)
        db.session.commit()

    # Verificar capacidad del restaurante
    existing_reservations = Reservation.query.filter_by(
        id_fk_restaurant=data['id_fk_restaurant'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time()
    ).all()
    total_people = sum(res.people for res in existing_reservations)
    if total_people + data['people'] > restaurant.capacity:
        return jsonify({"error": "La capacidad del restaurante ya está llena para esta hora"}), 400

    # Crear nueva reserva
    new_reservation = Reservation(
        id_fk_restaurant=data['id_fk_restaurant'],
        id_fk_diner=diner.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time(),
        people=data['people']
    )
    try:
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"message": "Reserva creada exitosamente", "reservation": new_reservation.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear la reserva: {e}")
        return jsonify({"error": "Error interno al crear la reserva"}), 500

# **PUT**: Actualizar una reserva existente
@reservations.route('/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    data = request.get_json()
    try:
        if "state" in data:
            reservation.state = data["state"]
        if "people" in data:
            reservation.people = data["people"]
        if "date" in data:
            reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if "hour" in data:
            reservation.hour = datetime.strptime(data['hour'], '%H:%M').time()

        db.session.commit()
        return jsonify({"message": "Reserva actualizada exitosamente", "reservation": reservation.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar la reserva: {e}")
        return jsonify({"error": "Error al actualizar la reserva"}), 500

# **DELETE**: Eliminar una reserva
@reservations.route('/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    try:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Reserva eliminada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar la reserva: {e}")
        return jsonify({"error": "Error interno al eliminar la reserva"}), 500

