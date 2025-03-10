from flask import Blueprint, jsonify, request
from src.api.models import Owner, Restaurant, db
from sqlalchemy.exc import IntegrityError

owner_api = Blueprint('owner_api', __name__)  # Nombre único para el Blueprint

# Obtener todos los propietarios
@owner_api.route('/', methods=['GET'])
def get_owners():
    try:
        owners = Owner.query.all()  # Obtener todos los propietarios
        if not owners:
            return jsonify({"message": "No se encontraron propietarios."}), 200
        response_body = [owner.serialize() for owner in owners]  # Serializar datos a JSON
        return jsonify(response_body), 200  # Devuelve la lista de propietarios
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Crear un nuevo propietario
@owner_api.route('/', methods=['POST'])
def create_owner():
    data = request.get_json()
    required_fields = ['name', 'email', 'telephone', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400
    try:
        new_owner = Owner(
            name=data['name'],
            email=data['email'],
            telephone=data['telephone'],
            password=data['password']  # Usa hashing para contraseñas en producción
        )
        db.session.add(new_owner)
        db.session.commit()
        return jsonify({"message": "Propietario creado exitosamente", "owner": new_owner.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El email o el teléfono ya están registrados"}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Modificar un propietario existente
@owner_api.route('/<int:owner_id>', methods=['PUT'])
def update_owner(owner_id):
    data = request.get_json()
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404

    owner.name = data.get('name', owner.name)
    owner.email = data.get('email', owner.email)
    owner.telephone = data.get('telephone', owner.telephone)
    owner.password = data.get('password', owner.password)  # Usa hashing si es necesario

    try:
        db.session.commit()
        return jsonify({"message": "Propietario actualizado exitosamente", "owner": owner.serialize()}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El email o el teléfono ya están registrados"}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Eliminar un propietario
@owner_api.route('/<int:owner_id>', methods=['DELETE'])
def delete_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404

    try:
        db.session.delete(owner)
        db.session.commit()
        return jsonify({"message": "Propietario eliminado exitosamente"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "No se puede eliminar el propietario porque está relacionado con otros recursos."}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

# Obtener restaurantes de un propietario
@owner_api.route('/<int:owner_id>/restaurants', methods=['GET'])
def get_owner_restaurants(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404

    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200
