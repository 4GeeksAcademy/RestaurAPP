"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Diner


from api.models import  Restaurant, Owner


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



@api.route('/diners', methods=['GET'])
def get_diners():
    diners = Diner.query.all()
      
    response_body = [diner.to_dict() for diner in diners]
        
    return jsonify(response_body), 200

@api.route('/diner/<int:id>', methods=['GET'])
def get_singlediner(id):
    diner = Diner.query.get(id)

    if not diner:
        return jsonify({"error": "Diner not found"}), 404

    
    response_body = diner.to_dict()
    return jsonify(response_body), 200


@api.route('/diner', methods=['POST'])
def create_diners():
    data = request.get_json()

    fullname = data.get('fullname')
    email = data.get('email')
    telephone = data.get('telephone')
    password = data.get('password')
    
    new_diner = Diner(fullname=fullname, email=email, telephone=telephone, password=password)


    db.session.add(new_diner)
    db.session.commit()

       
    response_body = new_diner.to_dict()
    return jsonify(response_body), 201 

@api.route('/diner/<int:id>', methods=['PUT'])
def edit_diner(id):
    diner = Diner.query.get(id)

    if not diner:
        return jsonify({"error": "Diner not found"}), 404

    data = request.get_json()

    fullname = data.get('fullname')
    email = data.get('email')
    telephone = data.get('telephone')
    password = data.get('password')

    if fullname:
        diner.fullname = fullname
    if email:
        diner.email = email
    if telephone:
        diner.telephone = telephone
    if password:
        diner.password = password  
        db.session.commit()

    response_body = diner.to_dict()
    return jsonify(response_body), 200

@api.route('/diner/<int:id>', methods=['DELETE'])
def delete_diner(id):
    diner = Diner.query.get(id)

    if not diner:
        
        return jsonify({"error": "Diner not found"}), 404

    db.session.delete(diner)
    db.session.commit()
    
    return jsonify({"message": "Diner deleted"}), 200
     

@api.route('/owners', methods=['GET'])
def get_all_owners():

    all_owners= Owner.query.all()

    if not all_owners:                                           
        return jsonify({"message": "No owners found"}), 404

    results= list(map(lambda owner : owner.serialize(), all_owners)) 

    return jsonify(results), 200


@api.route('/owners/<int:owner_id>', methods=['GET'])
def get_single_owner(owner_id):

    single_owner = Owner.query.get(owner_id)
    print(single_owner)
    print(single_owner.serialize())

    return jsonify(single_owner.serialize()), 200


@api.route('/owners', methods=['POST'])
def add_owner():

    name= request.json.get("name", None)
    location= request.json.get("location", None)
    telephone= request.json.get("telephone", None)
    email= request.json.get("email", None)
    password= request.json.get("password", None)
    
    if not all([name, telephone, email, password]):                                     #tutti i campi obbligatori meno location
        return jsonify({"error": "All fields are required"}), 400

    new_owner = Owner(name = name, location = location, telephone = telephone, email = email, password = password)

    db.session.add(new_owner)
    db.session.commit()

    return jsonify({"message": "Owner added successfully", "owner": new_owner.serialize()}), 201


@api.route('/owners/<int:owner_id>', methods=['DELETE'])
def delete_owner(owner_id):

    single_owner = Owner.query.get(owner_id)

    if not single_owner : 
        return jsonify({"message" : "Owner not found"}), 404

    db.session.delete(single_owner)
    db.session.commit()

    return jsonify({"message": "Owner successfully deleted"}), 200


@api.route('/owners/<int:owner_id>', methods=['PUT'])
def modify_owner(owner_id):

    single_owner = Owner.query.get(owner_id)

    if not single_owner : 
        return jsonify({"message" : "Owner not found"}), 404

    name= request.json.get("name", single_owner.name)
    location= request.json.get("location", single_owner.location)
    telephone= request.json.get("telephone", single_owner.telephone)
    email= request.json.get("email", single_owner.email)
    password= request.json.get("password", single_owner.password)

    single_owner.name = name
    single_owner.location = location
    single_owner.telephone = telephone
    single_owner.email = email
    single_owner.password = password
        
    
    db.session.commit()

    return jsonify({"message": "Owner successfully modified"}), 200

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

