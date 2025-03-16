from flask import Blueprint, jsonify, request
from src.api.models import Restaurant, db

restaurants_api = Blueprint('restaurants_api', __name__)

# Funciones auxiliares
def create_response(data=None, message=None, status=200, error=None):
    if error:
        return jsonify({"error": error}), status
    return jsonify({"message": message, "data": data}), status

def serialize_list(query_result):
    return [item.serialize() for item in query_result]

# **GET**: Buscar restaurantes por localidad y capacidad
@restaurants_api.route('/search', methods=['GET'])
def search_restaurants():
    location = request.args.get('location','' , type=str)
    people = request.args.get('people',1, type=int)

    # Validar parámetros obligatorios
    if not location or not people:
        return create_response(error="Localidad y número de personas son obligatorios", status=400)

    try:
        # Filtrar restaurantes por localidad y capacidad
        restaurants = Restaurant.query.filter(
            Restaurant.location.ilike(f"%{location}%"),
            Restaurant.capacity >= people
        ).all()

        if not restaurants:
            return create_response(error="No se encontraron restaurantes con estos criterios", status=404)

        return create_response(data=serialize_list(restaurants), status=200)
    except Exception as e:
        print(f"Error al buscar restaurantes: {e}")
        return create_response(error="Error interno del servidor", status=500)
