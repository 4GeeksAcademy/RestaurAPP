from flask import Blueprint, jsonify, request
from src.api.models import Reservation, Restaurant, Diner
from src import db
from datetime import datetime

# Crear el Blueprint para las rutas de reservas
reservations = Blueprint('reservations', __name__)

# Obtener todas las reservas con paginación
@reservations.route('/', methods=['GET'])
def get_all_reservations():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        reservations = Reservation.query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            "total": reservations.total,
            "pages": reservations.pages,
            "current_page": reservations.page,
            "reservations": [reservation.serialize() for reservation in reservations.items]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500

# Obtener todas las reservas de un comensal (Diner) con paginación
@reservations.route('/diner', methods=['GET'])
def get_diner_reservations():
    diner_id = request.args.get('diner_id', type=int)
    if not diner_id:
        return jsonify({"error": "El ID del comensal es obligatorio"}), 400

    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        reservations = Reservation.query.filter_by(id_fk_diner=diner_id).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            "total": reservations.total,
            "pages": reservations.pages,
            "current_page": reservations.page,
            "reservations": [reservation.serialize() for reservation in reservations.items]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500

# Obtener todas las reservas de un restaurante con paginación
@reservations.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant_reservations(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)

        reservations = Reservation.query.filter_by(id_fk_restaurant=restaurant_id).paginate(
            page=page, per_page=per_page, error_out=False
        )

        return jsonify({
            "total": reservations.total,
            "pages": reservations.pages,
            "current_page": reservations.page,
            "reservations": [reservation.serialize() for reservation in reservations.items]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener las reservas del restaurante"}), 500

# Buscar restaurantes disponibles en una localidad específica
@reservations.route('/available', methods=['POST'])
def get_available_restaurants():
    data = request.get_json()
    city = data.get('city')
    people = data.get('people')

    if not city or not people:
        return jsonify({"error": "Se requiere localidad y número de personas"}), 400

    try:
        restaurants = Restaurant.query.filter_by(location=city).all()
        available_restaurants = [
            restaurant.serialize()
            for restaurant in restaurants
            if sum(res.people for res in restaurant.reservations) + int(people) <= restaurant.capacity
        ]

        return jsonify({"available_restaurants": available_restaurants}), 200
    except Exception as e:
        print(f"Error al obtener restaurantes disponibles: {e}")
        return jsonify({"error": "Error al buscar restaurantes disponibles", "details": str(e)}), 500

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
        datetime.strptime(data.get('date', ''), '%Y-%m-%d')  # Cambiado a formato ISO
        datetime.strptime(data.get('hour', ''), '%H:%M')
    except ValueError:
        errors.append("Formato de fecha u hora inválido (YYYY-MM-DD, HH:MM)")

    # Validar número de personas
    if not isinstance(data.get('people', int)) or data['people'] <= 0:
        errors.append("El número de personas debe ser un entero positivo")
    
    return errors if errors else None

# Crear una nueva reserva
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

    # Verificar si el diner está registrado usando el teléfono
    diner = Diner.query.filter_by(telephone=data['phone']).first()
    
    if diner:
        # Diner registrado
        diner_id = diner.id
    else:
        # Registrar un nuevo diner
        if 'name' not in data or 'email' not in data:
            return jsonify({"error": "El nombre y el correo electrónico son obligatorios para nuevos usuarios"}), 400
        
        new_diner = Diner(
            fullname=data['name'],
            email=data['email'],
            telephone=data['phone'],
            password="temporarypassword"  # Generar una contraseña temporal o pedir al usuario que la cree
        )
        db.session.add(new_diner)
        db.session.commit()
        diner_id = new_diner.id

    # Verificar si hay espacio suficiente en el restaurante
    existing_reservations = Reservation.query.filter_by(
        id_fk_restaurant=data['id_fk_restaurant'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time()
    ).all()

    total_people = sum(res.people for res in existing_reservations)
    if total_people + data['people'] > restaurant.capacity:
        return jsonify({"error": "La capacidad del restaurante ya está llena para esta hora"}), 400

    new_reservation = Reservation(
        id_fk_restaurant=data['id_fk_restaurant'],
        id_fk_diner=diner_id,
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
        print(f"Error: {e}")
        return jsonify({"error": "Error interno al crear la reserva"}), 500

# Gestionar reservas (Owner: aceptar, rechazar, modificar y eliminar)
@reservations.route('/manage/<int:reservation_id>', methods=['PUT'])
def manage_reservation(reservation_id):
    data = request.get_json()
    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    if "state" in data:
        if data["state"] not in ["Accepted", "Rehused"]:
            return jsonify({"error": "Estado inválido"}), 400
        reservation.state = data["state"]
    
    if "people" in data:
        reservation.people = data["people"]
    if "date" in data:
        reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    if "hour" in data:
        reservation.hour = datetime.strptime(data['hour'], '%H:%M').time()

    try:
        db.session.commit()
        return jsonify({"message": "Reserva gestionada exitosamente", "reservation": reservation.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al gestionar la reserva: {e}")
        return jsonify({"error": "Error al gestionar la reserva"}), 500

@reservations.route('/manage/<int:reservation_id>', methods=['DELETE'])
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
        return jsonify({"error": "Error al eliminar la reserva"}), 500

# Añadir comentarios a