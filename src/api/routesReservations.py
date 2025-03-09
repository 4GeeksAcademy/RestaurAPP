from flask import Blueprint, jsonify, request
from src.api.models import Reservation, Restaurant
from src import db
from datetime import datetime

# Crear el Blueprint para las rutas de reservas
reservations = Blueprint('reservations', __name__)

# Validar datos de una reserva
def validate_reservation_data(data):
    required_fields = ['id_fk_restaurant', 'id_fk_diner', 'date', 'hour', 'people']
    for field in required_fields:
        if field not in data or not data[field]:
            return f"El campo {field} es obligatorio"
    try:
        datetime.strptime(data['date'], '%d/%m/%Y')
        datetime.strptime(data['hour'], '%H:%M')
    except ValueError:
        return "Formato de fecha u hora inválido (dd/mm/aaaa, HH:MM)"
    if not isinstance(data['people'], int) or data['people'] <= 0:
        return "El número de personas debe ser un entero positivo"
    return None

# Obtener todas las reservas de un comensal (Diner)
@reservations.route('/diner', methods=['GET'])
def get_diner_reservations():
    diner_id = request.args.get('diner_id', type=int)
    if not diner_id:
        return jsonify({"error": "El ID del comensal es obligatorio"}), 400

    reservations = Reservation.query.filter_by(id_fk_diner=diner_id).all()

    if not reservations:
        return jsonify({"error": "No se encontraron reservas"}), 404

    return jsonify([reservation.serialize() for reservation in reservations]), 200

# Crear una nueva reserva
@reservations.route('/diner', methods=['POST'])
def create_diner_reservation():
    data = request.get_json()

    error = validate_reservation_data(data)
    if error:
        return jsonify({"error": error}), 400

    restaurant = Restaurant.query.get(data['id_fk_restaurant'])
    if not restaurant:
        return jsonify({"error": "El restaurante no existe"}), 404

    if data['people'] > restaurant.capacity:
        return jsonify({"error": "El número de personas supera la capacidad del restaurante"}), 400

    new_reservation = Reservation(
        id_fk_diner=data['id_fk_diner'],
        id_fk_restaurant=data['id_fk_restaurant'],
        date=datetime.strptime(data['date'], '%d/%m/%Y').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time(),
        people=data['people']
    )

    try:
        db.session.add(new_reservation)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo crear la reserva"}), 500

    return jsonify({"message": "Reserva creada exitosamente", "reservation": new_reservation.serialize()}), 201

# Modificar una reserva existente
@reservations.route('/diner/<int:reservation_id>', methods=['PUT'])
def update_diner_reservation(reservation_id):
    data = request.get_json()

    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    if 'date' in data:
        try:
            reservation.date = datetime.strptime(data['date'], '%d/%m/%Y').date()
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido (dd/mm/aaaa)"}), 400

    if 'hour' in data:
        try:
            reservation.hour = datetime.strptime(data['hour'], '%H:%M').time()
        except ValueError:
            return jsonify({"error": "Formato de hora inválido (HH:MM)"}), 400

    if 'people' in data and (not isinstance(data['people'], int) or data['people'] <= 0):
        return jsonify({"error": "El número de personas debe ser un entero positivo"}), 400

    reservation.people = data.get('people', reservation.people)
    reservation.date = data.get('date', reservation.date)
    reservation.hour = data.get('hour', reservation.hour)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo actualizar la reserva"}), 500

    return jsonify({"message": "Reserva actualizada exitosamente", "reservation": reservation.serialize()}), 200

# Eliminar una reserva
@reservations.route('/diner/<int:reservation_id>', methods=['DELETE'])
def delete_diner_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    try:
        db.session.delete(reservation)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo eliminar la reserva"}), 500

    return jsonify({"message": "Reserva eliminada exitosamente"}), 200
