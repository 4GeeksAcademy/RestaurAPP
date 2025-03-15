from flask import Blueprint, jsonify, request
from src.api.models import Owner, Restaurant, db, Reservation
from sqlalchemy.exc import IntegrityError

owner_api = Blueprint('owner_api', __name__)

# Funciones auxiliares
def create_response(data=None, message=None, status=200, error=None):
    if error:
        return jsonify({"error": error}), status
    return jsonify({"message": message, "data": data}), status

def serialize_list(query_result):
    return [item.serialize() for item in query_result]

def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return {"error": f"Faltan los campos obligatorios: {', '.join(missing_fields)}"}
    return None

# Obtener todos los propietarios
@owner_api.route('/', methods=['GET'])
def get_owners():
    try:
        owners = Owner.query.all()
        if not owners:
            return create_response(message="No se encontraron propietarios.", data=[], status=200)
        return create_response(data=serialize_list(owners), status=200)
    except Exception as e:
        print(f"Error: {e}")
        return create_response(error="Error interno del servidor", status=500)

# Crear un nuevo propietario
@owner_api.route('/', methods=['POST'])
def create_owner():
    data = request.get_json()
    required_fields = ['name', 'email', 'telephone', 'password']

    validation_error = validate_required_fields(data, required_fields)
    if validation_error:
        return jsonify(validation_error), 400

    try:
        new_owner = Owner(
            name=data['name'],
            email=data['email'],
            telephone=data['telephone'],
            password=data['password']  # No ciframos aquí, pero dejamos preparado para futuro uso
        )
        db.session.add(new_owner)
        db.session.commit()
        return create_response(message="Propietario creado exitosamente", data=new_owner.serialize(), status=201)
    except IntegrityError:
        db.session.rollback()
        return create_response(error="El email o el teléfono ya están registrados", status=400)
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return create_response(error="Error interno del servidor", status=500)

# Modificar un propietario existente
@owner_api.route('/<int:owner_id>', methods=['PUT'])
def update_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Propietario no encontrado", status=404)

    data = request.get_json()
    try:
        # Actualizar los campos proporcionados
        owner.name = data.get("name", owner.name)
        owner.email = data.get("email", owner.email)
        owner.telephone = data.get("telephone", owner.telephone)

        # Validar si el correo o teléfono ya están en uso
        existing_owner = Owner.query.filter(
            ((Owner.email == owner.email) | (Owner.telephone == owner.telephone)) & (Owner.id != owner.id)
        ).first()
        if existing_owner:
            return create_response(error="El correo o el teléfono ya están en uso por otro propietario", status=400)

        db.session.commit()
        return create_response(message="Propietario actualizado exitosamente", data=owner.serialize(), status=200)
    except Exception as e:
        print(f"Error al actualizar propietario: {e}")
        db.session.rollback()
        return create_response(error="Error al actualizar el propietario", status=500)

# Eliminar un propietario
@owner_api.route('/<int:owner_id>', methods=['DELETE'])
def delete_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Propietario no encontrado", status=404)

    try:
        db.session.delete(owner)
        db.session.commit()
        return create_response(message="Propietario eliminado exitosamente", status=200)
    except IntegrityError as e:
        db.session.rollback()
        print(f"IntegrityError al eliminar propietario: {e}")
        return create_response(
            error="No se puede eliminar el propietario porque está relacionado con otros recursos.", status=400
        )
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return create_response(error="Error interno del servidor", status=500)

# Obtener restaurantes de un propietario
@owner_api.route('/<int:owner_id>/restaurants', methods=['GET'])
def get_owner_restaurants(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Propietario no encontrado", status=404)

    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()
    return create_response(data=serialize_list(restaurants), status=200)

# Obtener reservas asociadas a los restaurantes de un propietario
@owner_api.route('/<int:owner_id>/reservations', methods=['GET'])
def get_reservations_by_owner(owner_id):
    try:
        # Obtener los restaurantes del propietario
        restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()
        restaurant_ids = [restaurant.id for restaurant in restaurants]

        # Obtener reservas relacionadas
        reservations = Reservation.query.filter(Reservation.id_fk_restaurant.in_(restaurant_ids)).all()
        return create_response(data=serialize_list(reservations), status=200)
    except Exception as e:
        print(f"Error al obtener reservas: {e}")
        return create_response(error="Error al obtener reservas", status=500)
