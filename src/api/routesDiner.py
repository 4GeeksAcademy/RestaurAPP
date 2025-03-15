from flask import Blueprint, jsonify, request
from src.api.models import Diner, db
from sqlalchemy.exc import IntegrityError

# Crear el blueprint para los comensales
diner_api = Blueprint('diner_api', __name__)

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

# Obtener todos los comensales
@diner_api.route('/', methods=['GET'])
def get_diners():
    try:
        diners = Diner.query.all()
        return create_response(data=serialize_list(diners), status=200)
    except Exception as e:
        print(f"Error: {e}")
        return create_response(error="Error al obtener comensales", status=500)

# Crear un nuevo comensal
@diner_api.route('/', methods=['POST'])
def create_diner():
    data = request.get_json()
    required_fields = ['fullname', 'email', 'telephone', 'password']

    validation_error = validate_required_fields(data, required_fields)
    if validation_error:
        return jsonify(validation_error), 400

    try:
        new_diner = Diner(
            fullname=data['fullname'],
            email=data['email'],
            telephone=data['telephone'],
            password=data['password']
        )
        db.session.add(new_diner)
        db.session.commit()
        return create_response(message="Comensal creado exitosamente", data=new_diner.serialize(), status=201)
    except IntegrityError:
        db.session.rollback()
        return create_response(error="El email o el teléfono ya están registrados", status=400)
    except Exception as e:
        print(f"Error: {e}")
        return create_response(error="Error al crear el comensal", status=500)

# Modificar un comensal existente
@diner_api.route('/<int:diner_id>', methods=['PUT'])
def update_diner(diner_id):
    data = request.get_json()
    try:
        diner = Diner.query.get(diner_id)
        if not diner:
            return create_response(error="El comensal no existe", status=404)

        # Actualizar solo los campos proporcionados
        diner.fullname = data.get('fullname', diner.fullname)
        diner.email = data.get('email', diner.email)
        diner.telephone = data.get('telephone', diner.telephone)
        diner.password = data.get('password', diner.password)

        db.session.commit()
        return create_response(message="Comensal actualizado exitosamente", data=diner.serialize(), status=200)
    except IntegrityError:
        db.session.rollback()
        return create_response(error="El email o el teléfono ya están registrados", status=400)
    except Exception as e:
        print(f"Error: {e}")
        return create_response(error="Error al actualizar el comensal", status=500)

# Eliminar un comensal existente
@diner_api.route('/<int:diner_id>', methods=['DELETE'])
def delete_diner(diner_id):
    try:
        diner = Diner.query.get(diner_id)
        if not diner:
            return create_response(error="El comensal no existe", status=404)

        db.session.delete(diner)
        db.session.commit()
        return create_response(message="Comensal eliminado exitosamente", status=200)
    except Exception as e:
        print(f"Error: {e}")
        return create_response(error="Error al eliminar el comensal", status=500)
