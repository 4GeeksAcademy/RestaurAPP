"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Restaurant
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location')
    capacity = request.args.get('capacity', type=int)  # type=int asegura que 'capacity' sea un entero

    query = Restaurant.query

    if location:
        query = query.filter_by(location=location)
    if capacity:
        query = query.filter(Restaurant.capacity >= capacity)

    restaurants = query.all()
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200

@api.route('/restaurants', methods=['POST'])
def add_restaurant():
    data = request.json
    if not data.get('name') or not data.get('location') or not data.get('telephone') or not data.get('latitude') or not data.get('longitude') or not data.get('capacity'):
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    new_restaurant = Restaurant(
        name=data['name'],
        location=data['location'],
        telephone=data['telephone'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        capacity=data['capacity']
    )
    db.session.add(new_restaurant)
    db.session.commit()

    return jsonify({"message": "Restaurante añadido exitosamente"}), 201

@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurante eliminado exitosamente"}), 200
