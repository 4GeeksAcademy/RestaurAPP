

from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Diner, Origin, Restaurant, Owner, Categories, RestaurantCategories
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
    return jsonify({
        "access_token": access_token,
        "diner_fullname": diner.fullname,
        "diner_id": diner.id  
    }), 200

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

    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()
    if restaurants:
        return jsonify({"message": "Cannot delete owner with associated restaurants."}), 400
    
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

@api.route('/restaurants', methods=['GET'])
def get_restaurants():
    # Obtén los parámetros de la solicitud
    location = request.args.get('location')
    capacity = request.args.get('capacity', type=int)  # Asegura que 'capacity' sea un entero
    owner_id = request.args.get('owner_id', type=int)  # Nuevo filtro por propietario

    # Inicializa la consulta base
    query = Restaurant.query

    # Filtrar por ubicación si se proporciona
    if location:
        query = query.filter_by(location=location)

    # Filtrar por capacidad si se proporciona
    if capacity:
        query = query.filter(Restaurant.capacity >= capacity)

    # Filtrar por owner_id si se proporciona
    if owner_id:
        query = query.filter_by(owner_id=owner_id)

    # Obtener los resultados filtrados
    restaurants = query.all()

    # Serializar y devolver los resultados
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200


"""
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
"""
@api.route('/restaurants', methods=['POST'])
def add_restaurant():
    data = request.json

    # Valida que todos los campos requeridos estén presentes, incluyendo owner_id
    if not data.get('name') or not data.get('location') or not data.get('telephone') or \
       not data.get('latitude') or not data.get('longitude') or not data.get('capacity') or \
       not data.get('owner_id'):  # Aquí validamos que owner_id no sea nulo
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    new_restaurant = Restaurant(
        name=data['name'],
        location=data['location'],
        telephone=data['telephone'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        capacity=data['capacity'],
        owner_id=data['owner_id']  # Asegúrate de que el valor se esté asignando aquí
    )
    
    db.session.add(new_restaurant)
    db.session.commit()

    return jsonify({"message": "Restaurante añadido exitosamente"}), 201


"""
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
"""
from flask_jwt_extended import jwt_required, get_jwt_identity

@api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
@jwt_required()  # Protege la ruta para usuarios autenticados
def update_restaurant(restaurant_id):
    try:
        data = request.get_json()

        # Busca el restaurante por ID
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurante no encontrado."}), 404

        # Obtén el owner_id del usuario autenticado
        current_user = get_jwt_identity()  # Extrae la identidad del token
        owner_id = current_user.get('owner_id')  # Asegúrate de que el token tenga el owner_id

        # Validar que el usuario logueado es el propietario
        if restaurant.owner_id != owner_id:
            return jsonify({"error": "No tienes permisos para modificar este restaurante."}), 403

        # Validar datos de entrada
        if 'capacity' in data and not isinstance(data['capacity'], int):
            return jsonify({"error": "La capacidad debe ser un número entero."}), 400

        if 'latitude' in data and not isinstance(data['latitude'], (float, int)):
            return jsonify({"error": "La latitud debe ser un número."}), 400

        # Actualizar los datos del restaurante
        restaurant.name = data.get('name', restaurant.name)
        restaurant.location = data.get('location', restaurant.location)
        restaurant.telephone = data.get('telephone', restaurant.telephone)
        restaurant.latitude = data.get('latitude', restaurant.latitude)
        restaurant.longitude = data.get('longitude', restaurant.longitude)
        restaurant.capacity = data.get('capacity', restaurant.capacity)

        db.session.commit()

        return jsonify({"message": "Restaurante modificado exitosamente.", "restaurant": restaurant.serialize()}), 200

    except Exception as e:
        # Registra el error para propósitos de depuración
        import logging
        logging.error(f"Error actualizando restaurante {restaurant_id}: {str(e)}")
        return jsonify({"error": "Server error"}), 500



@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()  # Protege la ruta para usuarios autenticados
def delete_restaurant(restaurant_id):
    current_user = get_jwt_identity()  # Obtén el usuario logueado
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    # Verifica que el usuario sea el propietario
    if restaurant.owner_id != current_user.get('owner_id'):
        return jsonify({"error": "No tienes permisos para eliminar este restaurante."}), 403

    db.session.delete(restaurant)
    db.session.commit()
    return jsonify({"message": "Restaurante eliminado exitosamente."}), 200


@api.route('/create_restaurant', methods=['POST'])
@jwt_required()
def create_restaurant():
    
    owner_email = get_jwt_identity()  

   
    owner = Owner.query.filter_by(email=owner_email).first()
    if not owner:
        return jsonify({"message": "Owner not found"}), 404  

    
    data = request.get_json()

    name = data.get('name')
    location = data.get('location')
    telephone = data.get('telephone')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    capacity = data.get('capacity')

    new_restaurant = Restaurant(
        name=name,
        location=location,
        telephone=telephone,
        latitude=latitude,
        longitude=longitude,
        capacity=capacity,
        owner_id=owner.id  
    )

    
    db.session.add(new_restaurant)
    db.session.commit()

    
    response_data = new_restaurant.serialize()
    response_data["access_token"] = create_access_token(identity=owner_email)  
    response_data["owner_id"] = owner.id  

    return jsonify(response_data), 201

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


"""/////////////////////////////////// RESTAURANT_CATEGORIES ////////////////////////////////////////"""


@api.route('/restaurant_categories', methods=['GET'])
def get_all_restaurant_categories():

    all_restaurant_categories = RestaurantCategories.query.all()

    if not all_restaurant_categories:                                           
        return jsonify({"message": "No restaurant categories found"}), 404

    results = list(map(lambda restaurant_category: restaurant_category.serialize(), all_restaurant_categories))

    return jsonify(results), 200


@api.route('/restaurant_categories/<int:restaurant_category_id>', methods=['GET'])
def get_single_restaurant_category(restaurant_category_id):

    single_restaurant_category = RestaurantCategories.query.get(restaurant_category_id)
    print(single_restaurant_category)
    print(single_restaurant_category.serialize())

    if not single_restaurant_category:
        return jsonify({"message": "Restaurant category not found"}), 404

    return jsonify(single_restaurant_category.serialize()), 200


@api.route('/restaurant_categories', methods=['POST'])
def add_restaurant_category():

    id_restaurant = request.json.get("id_restaurant", None)
    id_category = request.json.get("id_category", None)

    if not all([id_restaurant, id_category]):
        return jsonify({"error": "All fields are required"}), 400

    new_restaurant_category = RestaurantCategories(id_restaurant=id_restaurant, id_category=id_category)

    db.session.add(new_restaurant_category)
    db.session.commit()

    return jsonify({"message": "Restaurant category added successfully", "restaurant_category": new_restaurant_category.serialize()}), 201


@api.route('/restaurant_categories/<int:restaurant_category_id>', methods=['DELETE'])
def delete_restaurant_category(restaurant_category_id):

    single_restaurant_category = RestaurantCategories.query.get(restaurant_category_id)

    if not single_restaurant_category:
        return jsonify({"message": "Restaurant category not found"}), 404

    db.session.delete(single_restaurant_category)
    db.session.commit()

    return jsonify({"message": "Restaurant category successfully deleted"}), 200


@api.route('/restaurant_categories/<int:restaurant_category_id>', methods=['PUT'])
def modify_restaurant_category(restaurant_category_id):

    single_restaurant_category = RestaurantCategories.query.get(restaurant_category_id)

    if not single_restaurant_category:
        return jsonify({"message": "Restaurant category not found"}), 404

    id_restaurant = request.json.get("id_restaurant", single_restaurant_category.id_restaurant)
    id_category = request.json.get("id_category", single_restaurant_category.id_category)

    single_restaurant_category.id_restaurant = id_restaurant
    single_restaurant_category.id_category = id_category

    db.session.commit()

    return jsonify({"message": "Restaurant category successfully modified"}), 200

    