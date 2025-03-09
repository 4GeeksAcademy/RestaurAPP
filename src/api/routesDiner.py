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
@diner_api.route('/diners', methods=['POST'])
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
