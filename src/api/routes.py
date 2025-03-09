
from flask import request, jsonify, Blueprint
from src.api.models import Restaurant, db
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)

# Obtener todos los restaurantes
@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    location = request.args.get('location')
    capacity = request.args.get('capacity', type=int)
    owner_id = request.args.get('owner_id', type=int)

    query = Restaurant.query

    if location:
        query = query.filter(Restaurant.location.ilike(f"%{location}%"))
    if capacity:
        query = query.filter(Restaurant.capacity >= capacity)
    if owner_id:
        query = query.filter(Restaurant.owner_id == owner_id)

    restaurants = query.all()
    if not restaurants:
        return jsonify({"error": "No se encontraron restaurantes que coincidan con los criterios."}), 404

    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200

# Crear un restaurante
@api.route('/restaurants', methods=['POST'])
def add_restaurant():
    data = request.json
    required_fields = ['name', 'location', 'telephone', 'latitude', 'longitude', 'capacity', 'owner_id']

    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400

    try:
        new_restaurant = Restaurant(
            name=data['name'],
            location=data['location'],
            telephone=data['telephone'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            capacity=data['capacity'],
            owner_id=data['owner_id']
        )
        db.session.add(new_restaurant)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Ya existe un restaurante con esos datos."}), 400

    return jsonify({"message": "Restaurante añadido exitosamente", "restaurant": new_restaurant.serialize()}), 201

# Modificar un restaurante
@api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    data = request.get_json()
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    restaurant.name = data.get('name', restaurant.name)
    restaurant.location = data.get('location', restaurant.location)
    restaurant.telephone = data.get('telephone', restaurant.telephone)
    restaurant.latitude = data.get('latitude', restaurant.latitude)
    restaurant.longitude = data.get('longitude', restaurant.longitude)
    restaurant.capacity = data.get('capacity', restaurant.capacity)

    db.session.commit()
    return jsonify({"message": "Restaurante modificado exitosamente", "restaurant": restaurant.serialize()}), 200

# Eliminar un restaurante
@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurante eliminado exitosamente"}), 200
