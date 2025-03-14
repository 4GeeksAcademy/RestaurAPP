
<<<<<<< HEAD
from flask import request, jsonify, Blueprint
from src.api.models import Restaurant, db
from sqlalchemy.exc import IntegrityError

api = Blueprint('api', __name__)

# Obtener todos los restaurantes
=======

from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Diner, Origin, Restaurant, Owner, Categories
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

"""/////////////////////////////////// DINERS ////////////////////////////////////////"""

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

@api.route("/diner/login", methods=["POST"])
def dinerLogin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    print(f"Email: {email}")

    diner = Diner.query.filter_by(email = email).first()
    print(diner)

    if diner is None :                                             
        return jsonify({"msg": "Could not find email"}), 401

    if password != diner.password :
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"access_token": access_token, "diner_fullname": diner.fullname}), 200

"""/////////////////////////////////// OWNERS ////////////////////////////////////////"""

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

@api.route('/owners/<int:owner_id>/restaurants', methods=['GET'])
def get_restaurants_by_owner(owner_id):
    # Filtra los restaurantes por owner_id
    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()

    if not restaurants:
        return jsonify({"message": "No se encontraron restaurantes para este propietario."}), 404

    # Devuelve los restaurantes serializados
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200


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

@api.route("/owners/login", methods=["POST"])
def ownerLogin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    print(f"Email: {email}")

    owner = Owner.query.filter_by(email = email).first()
    print(owner)

    if owner is None :                                             #si el correo no existe en la db
        return jsonify({"msg": "Could not find email"}), 401

    if password != owner.password :
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"access_token": access_token, "owner_name": owner.name}), 200


"""/////////////////////////////////// RESTAURANTS ////////////////////////////////////////"""

>>>>>>> develop
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

<<<<<<< HEAD
# Eliminar un restaurante
@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    try:
        # Verifica si el restaurante existe
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurante no encontrado"}), 404

        # Eliminar restaurante
        db.session.delete(restaurant)
        db.session.commit()

        # Respuesta exitosa
        return jsonify({"message": "Restaurante eliminado exitosamente"}), 200
    except Exception as e:
        # Capturar y registrar el error
        db.session.rollback()  # Revierte cambios en la base de datos
        print("Error interno en delete_restaurant:", str(e))  # Registro del error en consola
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@api.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the backend!"}), 200
=======
"""/////////////////////////////////// ORGINS ////////////////////////////////////////"""

@api.route('/origin', methods=['POST'])
def add_origin():
    data = request.get_json() 
    new_origin = Origin( 
        name=data ['name']
    )

    db.session.add(new_origin)
    db.session.commit()

    return jsonify({"message": "New Food Origin Created"}), 201

@api.route('/origins', methods=['GET'])
def get_origins():

    Origins = Origin.query.all()

    response_body = [Origin.serialize() for Origin in Origins]
        
    return jsonify(response_body), 200

@api.route('/origin/<int:id>', methods=['GET'])
def get_single_origin(id):
    
    origin = Origin.query.get(id)  

    if not origin:
        return jsonify({"error": "Origin not found"}), 404
        
    response_body = origin.serialize()  
    return jsonify(response_body), 200

@api.route('/origin/<int:id>', methods=['DELETE'])
def delete_origin(id):
    origin = Origin.query.get(id)
    if not origin:
        return jsonify({"error": "origin not found"}), 404

    db.session.delete(origin)
    db.session.commit()
    return jsonify({"message": "origin deleted"}), 200

@api.route('/origin/<int:id>', methods=['PUT'])
def modify_origin(id):

    single_origin = Origin.query.get(id)

    if not single_origin : 
        return jsonify({"message" : "origin not found"}), 404

    name= request.json.get("name", single_origin.name)
    
    single_origin.name = name
   
    db.session.commit()

    return jsonify({"message": "origin modified!"}), 200


"""/////////////////////////////////// CATEGORIES ////////////////////////////////////////"""


@api.route('/categories', methods=['GET'])
def get_all_categories():

    all_categories= Categories.query.all()

    if not all_categories:                                           
        return jsonify({"message": "No categories found"}), 404

    results= list(map(lambda category : category.serialize(), all_categories)) 

    return jsonify(results), 200


@api.route('/categories/<int:category_id>', methods=['GET'])
def get_single_category(category_id):

    single_category = Categories.query.get(category_id)
    print(single_category)
    print(single_category.serialize())

    return jsonify(single_category.serialize()), 200


@api.route('/categories', methods=['POST'])
def add_category():

    name= request.json.get("name", None)
    
    if not all([name]):
        return jsonify({"error": "All fields are required"}), 400

    new_category = Categories(name = name)

    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "category added successfully", "category": new_category.serialize()}), 201


@api.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):

    single_category = Categories.query.get(category_id)

    if not single_category : 
        return jsonify({"message" : "category not found"}), 404

    db.session.delete(single_category)
    db.session.commit()

    return jsonify({"message": "category successfully deleted"}), 200


@api.route('/categories/<int:category_id>', methods=['PUT'])
def modify_category(category_id):

    single_category = Categories.query.get(category_id)

    if not single_category : 
        return jsonify({"message" : "category not found"}), 404

    name= request.json.get("name", single_category.name)

    single_category.name = name
    
    db.session.commit()

    return jsonify({"message": "Category successfully modified"}), 200
>>>>>>> develop
