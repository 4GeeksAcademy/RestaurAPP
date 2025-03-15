from flask import Blueprint, jsonify, request
from src.api.models import Restaurant, db

restaurants_api = Blueprint('restaurants_api', __name__)

@restaurants_api.route('/search', methods=['GET'])
def search_restaurants():
    locality = request.args.get('locality', type=str)
    people = request.args.get('people', type=int)

    if not locality or not people:
        return jsonify({"error": "Localidad y número de personas son obligatorios"}), 400

    # Filtrar restaurantes por localidad y capacidad
    restaurants = Restaurant.query.filter(
        Restaurant.location.ilike(f"%{locality}%"),
        Restaurant.capacity >= people
    ).all()

    if not restaurants:
        return jsonify({"error": "No se encontraron restaurantes con estos criterios"}), 404

    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200
