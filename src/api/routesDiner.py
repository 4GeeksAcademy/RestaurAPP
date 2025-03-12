from flask import Blueprint, jsonify, request
from src.api.models import Diner, db
from sqlalchemy.exc import IntegrityError

diner_api = Blueprint('diner_api', __name__)  # Cambiado a 'diner_api'

# Rutas CRUD para Diner

# Obtener todos los comensales
@diner_api.route('/', methods=['GET'])
def get_diners():
    try:
        diners = Diner.query.all()  # Obtener todos los comensales
        response_body = [diner.serialize() for diner in diners]
        return jsonify(response_body), 200  # Devolver JSON
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al obtener comensales"}), 500

# Crear un nuevo comensal
@diner_api.route('/', methods=['POST'])
def create_diner():
    data = request.get_json()
    required_fields = ['fullname', 'email', 'telephone', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400
    try:
        new_diner = Diner(
            fullname=data['fullname'],
            email=data['email'],
            telephone=data['telephone'],
            password=data['password']
        )
        db.session.add(new_diner)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El email o el teléfono ya están registrados"}), 400

    return jsonify({"message": "Comensal creado exitosamente", "diner": new_diner.serialize()}), 201

# Modificar un comensal existente
@diner_api.route('/<int:diner_id>', methods=['PUT'])
def update_diner(diner_id):
    data = request.get_json()
    try:
        diner = Diner.query.get(diner_id)
        if not diner:
            return jsonify({"error": "El comensal no existe"}), 404

        # Actualizar los campos proporcionados en la solicitud
        diner.fullname = data.get('fullname', diner.fullname)
        diner.email = data.get('email', diner.email)
        diner.telephone = data.get('telephone', diner.telephone)
        diner.password = data.get('password', diner.password)

        db.session.commit()
        return jsonify({"message": "Comensal actualizado exitosamente", "diner": diner.serialize()}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El email o el teléfono ya están registrados"}), 400
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al actualizar el comensal"}), 500

# Eliminar un comensal existente
@diner_api.route('/<int:diner_id>', methods=['DELETE'])
def delete_diner(diner_id):
    try:
        diner = Diner.query.get(diner_id)
        if not diner:
            return jsonify({"error": "El comensal no existe"}), 404

        db.session.delete(diner)
        db.session.commit()
        return jsonify({"message": "Comensal eliminado exitosamente"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error al eliminar el comensal"}), 500
