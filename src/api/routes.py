

from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Diner, Origin, Restaurant, Owner, Categories, RestaurantCategories, Reservation
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from datetime import datetime

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

@api.route('/create_reservation', methods=['POST'])
@jwt_required()
def create_reservation():
    email = get_jwt_identity()
    diner = Diner.query.filter_by(email=email).first()
    
    if not diner:
        return jsonify({"message": "Diner not found"}), 404

    data = request.get_json()
    
    if not all(key in data for key in ['id_fk_restaurant', 'date', 'hour', 'people']):
        return jsonify({"message": "Missing required fields"}), 400
    
    try:
        reservation_date = datetime.strptime(data['date'], "%Y-%m-%d").date()
        reservation_hour = datetime.strptime(data['hour'], "%H:%M").time()
    except ValueError:
        return jsonify({"message": "Invalid date or hour format"}), 400
    
    new_reservation = Reservation(
        id_fk_restaurant=data['id_fk_restaurant'],
        id_fk_diner=diner.id,
        date=reservation_date,
        hour=reservation_hour,
        state="Pending",  
        people=data['people']
    )
    
    db.session.add(new_reservation)
    db.session.commit()
    
    return jsonify(new_reservation.serialize()), 201

@api.route('/reservation_by_diner', methods=['GET'])
@jwt_required()
def get_all_reservation_by_diner():
    email = get_jwt_identity()
    diner = Diner.query.filter_by(email=email).first()
    all_reservations =Reservation.query.filter_by(id_fk_diner=diner.id).all()
    
    print(all_reservations)
    print(email)
    if not all_reservations:
        return jsonify({"message": "No reservation found"}), 404
    results = list(map(lambda reservation: reservation.serialize(), all_reservations))
    return jsonify(results), 200

@api.route('/delete_reservation_by_diner/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def delete_reservation_by_diner(reservation_id):
    email = get_jwt_identity()
    
    diner = Diner.query.filter_by(email=email).first()
    
    if not diner:
        return jsonify({"message": "Diner not found"}), 404

    reservation = Reservation.query.filter_by(id=reservation_id, id_fk_diner=diner.id).first()
    
    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404
    
    try:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Reservation successfully deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting reservation", "error": str(e)}), 500


"""/////////////////////////////////// OWNERS ////////////////////////////////////////"""

@api.route('/owners', methods=['GET'])
def get_all_owners():

    all_owners= Owner.query.all()

    if not all_owners:                                           
        return jsonify({"message": "No owners found"}), 404

    results= list(map(lambda owner : owner.serialize(), all_owners)) 

    return jsonify(results), 200



@api.route('/owners/<int:owner_id>', methods=['GET'])
@jwt_required()
def get_single_owner(owner_id):
 
    email_from_token = get_jwt_identity()  # L'email è stata usata come identity

    # Usa l'email per trovare l'owner_id dal database
    owner = Owner.query.filter_by(email=email_from_token).first()

    if owner is None:
        return jsonify({"message": "Owner not found"}), 404

    if owner.id != owner_id:
        return jsonify({"message": "Unauthorized"}), 401

    print(f"Owner ID from token: {owner.id}")
    return jsonify(owner.serialize()), 200



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
    return jsonify({"access_token": access_token, "owner_name": owner.name, "owner_id": owner.id}), 200


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


@api.route('/owners/<int:owner_id>/restaurants', methods=['GET'])
def get_restaurants_by_owner(owner_id):
    # Filtra los restaurantes por owner_id
    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()

    if not restaurants:
        return jsonify({"message": "No se encontraron restaurantes para este propietario."}), 404

    # Devuelve los restaurantes serializados
    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200

from flask_jwt_extended import jwt_required, get_jwt_identity




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



# @api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
# @jwt_required()
# def update_restaurant(restaurant_id):
#     try:
#         data = request.get_json()

#         # Busca el restaurante por ID
#         restaurant = Restaurant.query.get(restaurant_id)
#         if not restaurant:
#             return jsonify({"error": "Restaurante no encontrado."}), 404

#         # Obtén el owner_id del usuario autenticado
#         current_user = get_jwt_identity()  # Extrae la identidad del token
#         owner_id = current_user.get('owner_id')  # Asegúrate de que el token tenga el owner_id

#         # Validar que el usuario logueado es el propietario
#         if restaurant.owner_id != owner_id:
#             return jsonify({"error": "No tienes permisos para modificar este restaurante."}), 403

#         # Validar datos de entrada
#         if 'capacity' in data and not isinstance(data['capacity'], int):
#             return jsonify({"error": "La capacidad debe ser un número entero."}), 400

#         if 'latitude' in data and not isinstance(data['latitude'], (float, int)):
#             return jsonify({"error": "La latitud debe ser un número."}), 400

#         # Actualizar los datos del restaurante
#         restaurant.name = data.get('name', restaurant.name)
#         restaurant.location = data.get('location', restaurant.location)
#         restaurant.telephone = data.get('telephone', restaurant.telephone)
#         restaurant.latitude = data.get('latitude', restaurant.latitude)
#         restaurant.longitude = data.get('longitude', restaurant.longitude)
#         restaurant.capacity = data.get('capacity', restaurant.capacity)

#         db.session.commit()

#         return jsonify({"message": "Restaurante modificado exitosamente.", "restaurant": restaurant.serialize()}), 200

    # except Exception as e:
    #     # Registra el error para propósitos de depuración
    #     import logging
    #     logging.error(f"Error actualizando restaurante {restaurant_id}: {str(e)}")
    #     return jsonify({"error": "Server error"}), 500



# @api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
# @jwt_required()
# def delete_restaurant(restaurant_id):
#     current_user = get_jwt_identity()  # Obtén el usuario logueado
#     restaurant = Restaurant.query.get(restaurant_id)
#     if not restaurant:
#         return jsonify({"error": "Restaurante no encontrado"}), 404

#     # Verifica que el usuario sea el propietario
#     if restaurant.owner_id != current_user.get('owner_id'):
#         return jsonify({"error": "No tienes permisos para eliminar este restaurante."}), 403

#     db.session.delete(restaurant)
#     db.session.commit()
#     return jsonify({"message": "Restaurante eliminado exitosamente."}), 200


@api.route('/create_restaurant', methods=['POST'])         #añade rest a owner logeado
@jwt_required()
def create_restaurant():
    owner_email = get_jwt_identity()  

    # Buscar el owner logueado
    owner = Owner.query.filter_by(email=owner_email).first()
    if not owner:
        return jsonify({"message": "Owner not found"}), 404  

    # datos de la req
    data = request.get_json()

    required_fields = ["name", "location", "telephone", "latitude", "longitude", "capacity"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"The field {field} is required"}), 400

    # Verifica si el restaurante ya existe para el owner
    existing_restaurant = Restaurant.query.filter_by(name=data["name"], owner_id=owner.id).first()
    if existing_restaurant:
        return jsonify({"error": "You already have a restaurant with this name"}), 400

    # Crea nuevo rest
    new_restaurant = Restaurant(
        name=data["name"],
        location=data["location"],
        telephone=data["telephone"],
        latitude=float(data["latitude"]),  # float por decimales
        longitude=float(data["longitude"]),  
        capacity=int(data["capacity"]),  # por numero
        owner_id=owner.id  
    )

    try:
        db.session.add(new_restaurant)
        db.session.commit()

        return jsonify(new_restaurant.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error saving restaurant: {str(e)}"}), 500  
    


@api.route('/restaurants/<int:restaurant_id>', methods=['GET'])        #filtra con id restaurante
def get_restaurant_by_restaurant_id(restaurant_id):
    # Cerca il ristorante per ID
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    # Restituisce il ristorante in formato JSON
    return jsonify(restaurant.serialize()), 200 


@api.route('/owners/restaurants', methods=['GET'])                      #filtra por rest del usaurio logeado
@jwt_required()
def get_restaurants_for_loggedin_owner():

    current_owner_email = get_jwt_identity()       # email del owner desde el token

    owner = Owner.query.filter_by(email=current_owner_email).first()
    if not owner:
        return jsonify({"message": "Owner not found"}), 404

    # Obtener los restaurantes asociados al owner
    restaurants = Restaurant.query.filter_by(owner_id=owner.id).all()

    if not restaurants:
        return jsonify({"message": "No se encontraron restaurantes para este propietario."}), 404

    return jsonify([restaurant.serialize() for restaurant in restaurants]), 200


@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
def delete_restaurant_owner_loggedin(restaurant_id):
    current_user_email = get_jwt_identity()  # correo del usuario logueado
    
    restaurant = Restaurant.query.get(restaurant_id)
    
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    # Obtiene dueño del rist con owner_id de la relación con table restaurant
    owner = Owner.query.get(restaurant.owner_id)
    
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404

    # Verifica que email del owner = a usuario logueato
    if owner.email != current_user_email:
        return jsonify({"error": "No tienes permisos para eliminar este restaurante."}), 403

    db.session.delete(restaurant)
    db.session.commit()

    return jsonify({"message": "Restaurante eliminado exitosamente."}), 200


@api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
@jwt_required()
def update_restaurant(restaurant_id):
    current_user_email = get_jwt_identity()  # correo del usuario logueado
    
    restaurant = Restaurant.query.get(restaurant_id)
    
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}),
    
    owner = Owner.query.get(restaurant.owner_id)   # Obtiene dueño del rist con owner_id de la relación con table restaurant
    
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404
    
    # Verifica que email del owner = a usuario logueato
    if owner.email != current_user_email:
        return jsonify({"error": "No tienes permisos para editar este restaurante."}), 403  # Si no tiene permiso
    
    # Obtén los datos del cuerpo de la solicitud (JSON)
    data = request.get_json()

    # Actualiza los campos proporcionados en la solicitud
    if 'name' in data:
        restaurant.name = data['name']
    if 'location' in data:
        restaurant.location = data['location']
    if 'telephone' in data:
        restaurant.telephone = data['telephone']
    if 'latitude' in data:
        restaurant.latitude = data['latitude']
    if 'longitude' in data:
        restaurant.longitude = data['longitude']
    if 'capacity' in data:
        restaurant.capacity = data['capacity']

    db.session.commit()

    return jsonify({"message": "Restaurante actualizado exitosamente."}), 200


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


"""/////////////////////////////////// RESERVATIONS ////////////////////////////////////////"""

# Crear el Blueprint para las rutas de reservas
reservations = Blueprint('reservations', __name__)

# Validación de datos de una reserva
def validate_reservation_data(data):
    errors = []
    required_fields = ['id_fk_restaurant', 'date', 'hour', 'people']

    # Validar campos obligatorios
    for field in required_fields:
        if field not in data or not data[field]:
            errors.append(f"El campo {field} es obligatorio")

    # Validar formato de fecha y hora
    try:
        datetime.strptime(data.get('date', ''), '%Y-%m-%d')
        datetime.strptime(data.get('hour', ''), '%H:%M')
    except ValueError:
        errors.append("Formato de fecha u hora inválido (YYYY-MM-DD, HH:MM)")

    # Validar número de personas
    if not isinstance(data.get('people', 0), int) or data.get('people', 0) <= 0:

        errors.append("El número de personas debe ser un entero positivo")

    return errors if errors else None

# **GET**: Obtener todas las reservas
@reservations.route('/reservations', methods=['GET'])
def get_all_reservations():
    try:
        # Obtener todas las reservas
        reservations = Reservation.query.all()

        # Serializar todas las reservas y devolverlas en la respuesta
        return jsonify([reservation.serialize() for reservation in reservations]), 200
    except Exception as e:
        print(f"Error al obtener todas las reservas: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500

# **GET**: Obtener todas las reservas de un restaurante
@reservations.route('/restaurants/<int:restaurant_id>/reservations', methods=['GET'])
def get_restaurant_reservations(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    try:
        reservations = Reservation.query.filter_by(id_fk_restaurant=restaurant_id).all()
        return jsonify([reservation.serialize() for reservation in reservations]), 200
    except Exception as e:
        print(f"Error al obtener reservas del restaurante: {e}")
        return jsonify({"error": "Error al obtener las reservas"}), 500
    
    
@reservations.route('/available', methods=['POST'])
def get_available_restaurants():
    # Obtener los datos enviados en el cuerpo de la solicitud
    data = request.get_json()
    location = data.get('location')
    people = data.get('people')

    # Validar los datos obligatorios
    if not location or not isinstance(people, int) or people <= 0:
        return jsonify({"error": "Debes proporcionar una ubicación válida y un número de personas positivo"}), 400

    try:
        # Buscar restaurantes en la ubicación especificada
        restaurants = Restaurant.query.filter_by(location=location).all()

        # Filtrar restaurantes que puedan acomodar el número de personas solicitado
        available_restaurants = []
        for restaurant in restaurants:
            # Calcular la capacidad restante
            total_reserved_people = sum(
                reservation.people
                for reservation in restaurant.reservations
            )
            capacity_remaining = restaurant.capacity - total_reserved_people

            # Si el restaurante tiene suficiente capacidad disponible, incluirlo en la lista
            if capacity_remaining >= people:
                available_restaurants.append(restaurant.serialize())

        # Retornar los restaurantes disponibles
        return jsonify({"available_restaurants": available_restaurants}), 200

    except Exception as e:
        print(f"Error al obtener restaurantes disponibles: {e}")
        return jsonify({"error": "Error al buscar restaurantes disponibles", "details": str(e)}), 500


# **POST**: Crear una nueva reserva
@reservations.route('/', methods=['POST'])
def create_reservation():
    data = request.get_json()

    # Validar los datos de la reserva
    errors = validate_reservation_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    restaurant = Restaurant.query.get(data['id_fk_restaurant'])
    if not restaurant:
        return jsonify({"error": "El restaurante no existe"}), 404

    # Verificar si el comensal existe, de lo contrario crear uno
    diner = Diner.query.filter_by(telephone=data.get('phone')).first()
    if not diner:
        if 'name' not in data or 'email' not in data:
            return jsonify({"error": "El nombre y el correo electrónico son obligatorios"}), 400
        diner = Diner(
            fullname=data['name'],
            email=data['email'],
            telephone=data['phone'],
            password="temporarypassword"  # Contraseña temporal
        )
        db.session.add(diner)
        db.session.commit()

    # Verificar capacidad del restaurante
    existing_reservations = Reservation.query.filter_by(
        id_fk_restaurant=data['id_fk_restaurant'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time()
    ).all()
    total_people = sum(res.people for res in existing_reservations)
    if total_people + data['people'] > restaurant.capacity:
        return jsonify({"error": "La capacidad del restaurante ya está llena para esta hora"}), 400

    # Crear nueva reserva
    new_reservation = Reservation(
        id_fk_restaurant=data['id_fk_restaurant'],
        id_fk_diner=diner.id,
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        hour=datetime.strptime(data['hour'], '%H:%M').time(),
        people=data['people']
    )
    try:
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"message": "Reserva creada exitosamente", "reservation": new_reservation.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear la reserva: {e}")
        return jsonify({"error": "Error interno al crear la reserva"}), 500

# Map state function
def map_state(state):
    state_mapping = {
        "Pendiente": "Pending",
        "Aceptada": "Accepted",
        "Rechazada": "Refused",
        "Cancelada": "Canceled"
    }
    return state_mapping.get(state, "Invalid")

# **PUT**: Actualizar una reserva existente
@reservations.route('/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    data = request.get_json()
    print("Datos recibidos:", data)  # Imprime los datos recibidos para depuración

    try:
        # Definir la función para mapear valores a los estados permitidos
        def map_state(state):
            state_map = {
                "pending": "Pending",
                "accepted": "Accepted",
                "refused": "Refused",
                "canceled": "Canceled"
            }
            return state_map.get(state.lower(), state)  # Mapea el valor o retorna el original

        # Procesar y validar el estado (state) solo si está presente en los datos
        if "state" in data:
            mapped_state = map_state(data["state"])
            if mapped_state not in ["Pending", "Accepted", "Refused", "Canceled"]:
                return jsonify({"error": f"Estado '{data['state']}' no válido"}), 400
            reservation.state = mapped_state

        # Procesar y validar otros campos
        if "people" in data:
            reservation.people = data["people"]

        if "date" in data:
            try:
                reservation.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido (YYYY-MM-DD)"}), 400

        if "hour" in data:
            try:
                reservation.hour = datetime.strptime(data['hour'], '%H:%M').time()
            except ValueError:
                return jsonify({"error": "Formato de hora inválido (HH:MM)"}), 400

        db.session.commit()
        return jsonify({"message": "Reserva actualizada exitosamente", "reservation": reservation.serialize()}), 200
    
    except Exception as e:
        db.session.rollback()
        print(f"Error al actualizar la reserva: {e}")
        return jsonify({"error": "Error al actualizar la reserva"}), 500

# **DELETE**: Eliminar una reserva
@reservations.route('/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    try:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Reserva eliminada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar la reserva: {e}")
        return jsonify({"error": "Error interno al eliminar la reserva"}), 500
    
    # aceptar una reserva existente

@reservations.route('/accept/<int:reservation_id>', methods=['PUT'])
def accept_reservation(reservation_id):
    data = request.get_json()
    optional_fields = ['date', 'hour', 'people']  # Campos opcionales que el diner podría modificar

    # Buscar la reserva en la base de datos
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"error": "Reserva no encontrada"}), 404

    try:
        # Actualizar el estado de la reserva a "Accepted"
        reservation.state = "Accepted"

        # Actualizar detalles opcionales si son enviados
        for field in optional_fields:
            if field in data:
                setattr(reservation, field, data[field])

        db.session.commit()

        return jsonify({
            "message": "Reserva aceptada y actualizada correctamente",
            "reservation": reservation.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al aceptar reserva: {e}")
        return jsonify({"error": "Error interno al aceptar la reserva"}), 500


    