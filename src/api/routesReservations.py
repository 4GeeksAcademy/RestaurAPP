from flask import Blueprint, jsonify, request
from src.api.models import Reservation, Restaurant, Diner
from src import db
from datetime import datetime

# Crear el Blueprint para las rutas de reservas
reservations = Blueprint('reservations', __name__)

# Funciones auxiliares
def create_response(data=None, message=None, status=200, error=None):
    if error:
        return jsonify({"error": error}), status
    return jsonify({"message": message, "data": data}), status

def serialize_list(query_result):
    return [item.serialize() for item in query_result]

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

def map_state(state):
    state_mapping = {
        "Pendiente": "Pending",
        "Aceptada": "Accepted",
        "Rechazada": "Refused",
        "Cancelada": "Canceled"
    }
    return state_mapping.get(state, "Invalid")

# **GET**: Obtener todas las reservas
@reservations.route('/', methods=['GET'])
def get_all_reservations():
    try:
        reservations = Reservation.query.all()
        return create_response(data=serialize_list(reservations), status=200)
    except Exception as e:
        print(f"Error al obtener todas las reservas: {e}")
        return create_response(error="Error al obtener las reservas", status=500)

# **GET**: Obtener todas las reservas de un restaurante
@reservations.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant_reservations(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return create_response(error="Restaurante no encontrado", status=404)

    try:
        reservations = Reservation.query.filter_by(id_fk_restaurant=restaurant_id).all()
        return create_response(data=serialize_list(reservations), status=200)
    except Exception as e:
        print(f"Error al obtener reservas del restaurante: {e}")
        return create_response(error="Error al obtener las reservas", status=500)

# **POST**: Crear una nueva reserva
@reservations.route('/', methods=['POST'])
def create_reservation():
    data = request.get_json()

    # Validar los datos de la reserva
    errors = validate_reservation_data(data)
    if errors:
        return create_response(error=errors, status=400)

    restaurant = Restaurant.query.get(data['id_fk_restaurant'])
    if not restaurant:
        return create_response(error="El restaurante no existe", status=404)

    # Verificar si el comensal existe, de lo contrario crear uno
    diner = Diner.query.filter_by(telephone=data.get('phone')).first()
    if not diner:
        if 'name' not in data or 'email' not in data:
            return create_response(error="El nombre y el correo electrónico son obligatorios", status=400)
        diner = Diner(
            fullname=data['name'],
            email=data['email'],
            telephone=data['phone'],
            password="temporarypassword"
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
        return create_response(error="La capacidad del restaurante ya está llena para esta hora", status=400)

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
        return create_response(message="Reserva creada exitosamente", data=new_reservation.serialize(), status=201)
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear la reserva: {e}")
        return create_response(error="Error interno al crear la reserva", status=500)

# **PUT**: Actualizar una reserva existente
@reservations.route('/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return create_response(error="Reserva no encontrada", status=404)

    data = request.get_json()

    try:
        # Validar estado si es proporcionado
        if "state" in data:
            mapped_state = map_state(data["state"])
            if mapped_state not in ["Pending", "Accepted", "Refused", "Canceled"]:
                return create_response(error=f"Estado '{data['state']}' no válido", status=400)
            reservation.state = mapped_state

        # Validar y actualizar otros campos
        if "people" in data:
            reservation.people = data["people"]

        if "date" in data:
            reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()

        if "hour" in data:
            reservation.hour = datetime.strptime(data['hour'], '%H:%M').time()

        db.session.commit()
        return create_response(message="Reserva actualizada exitosamente", data=reservation.serialize(), status=200)
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar la reserva: {e}")
        return create_response(error="Error al actualizar la reserva", status=500)

# **DELETE**: Eliminar una reserva
@reservations.route('/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return create_response(error="Reserva no encontrada", status=404)

    try:
        db.session.delete(reservation)
        db.session.commit()
        return create_response(message="Reserva eliminada exitosamente", status=200)
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar la reserva: {e}")
        return create_response(error="Error interno al eliminar la reserva", status=500)
