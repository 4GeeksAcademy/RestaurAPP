

from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Diner, Origin, Restaurant, Owner, Categories, RestaurantCategories, Reservation
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

# from flask_jwt_extended import jwt_required, get_jwt_identity




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


@api.route('/create_restaurant', methods=['POST'])         #añade rest a owner logeado
# @jwt_required()
# def create_restaurant():
#     owner_email = get_jwt_identity()  

#     owner = Owner.query.filter_by(email=owner_email).first()
#     if not owner:
#         return jsonify({"message": "Owner not found"}), 404  

#     data = request.get_json()

#     required_fields = ["name", "location", "telephone", "latitude", "longitude", "capacity"]
#     for field in required_fields:
#         if not data.get(field):
#             return jsonify({"error": f"The field {field} is required"}), 400

#     # Verifica si el restaurante ya existe para el owner
#     existing_restaurant = Restaurant.query.filter_by(name=data["name"], owner_id=owner.id).first()
#     if existing_restaurant:
#         return jsonify({"error": "You already have a restaurant with this name"}), 400

#     # Crea nuevo rest
#     new_restaurant = Restaurant(
#         name=data["name"],
#         location=data["location"],
#         telephone=data["telephone"],
#         latitude=float(data["latitude"]),  # float por decimales
#         longitude=float(data["longitude"]),  
#         capacity=int(data["capacity"]),  # por numero
#         owner_id=owner.id  
#     )

#     try:
#         db.session.add(new_restaurant)
#         db.session.commit()

#         return jsonify(new_restaurant.serialize()), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": f"Error saving restaurant: {str(e)}"}), 500  
# 
    

@api.route('/create_restaurant', methods=['POST'])  # añade rest a owner loguedo + Cloudinary
@jwt_required() 
def create_restaurant():
    owner_email = get_jwt_identity()

    owner = Owner.query.filter_by(email=owner_email).first()
    if not owner:
        return jsonify({"message": "Owner not found"}), 404

    data = request.get_json() 

    required_fields = ["name", "location", "telephone", "latitude", "longitude", "capacity", "image_url"]
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"The field {field} is required"}), 400

    existing_restaurant = Restaurant.query.filter_by(name=data["name"], owner_id=owner.id).first()
    if existing_restaurant:
        return jsonify({"error": "You already have a restaurant with this name"}), 400  # Si ya existe, error 400

    # Crear nuevo restaurante con los datos
    new_restaurant = Restaurant(
        name=data["name"],
        location=data["location"],
        telephone=data["telephone"],
        latitude=float(data["latitude"]),
        longitude=float(data["longitude"]),
        capacity=int(data["capacity"]),
        image_url=data["image_url"], 
        owner_id=owner.id
    )

    try:
        db.session.add(new_restaurant) 
        db.session.commit()

        return jsonify(new_restaurant.serialize()), 201
    except Exception as e:
        db.session.rollback()  # Si ocurre un error, hacer rollback de la sesión
        return jsonify({"error": f"Error saving restaurant: {str(e)}"}), 500



@api.route('/restaurants/<int:restaurant_id>', methods=['GET'])        #filtra con id restaurante
def get_restaurant_by_restaurant_id(restaurant_id):
    # Cerca il ristorante per ID
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    # Restituisce il ristorante in formato JSON
    return jsonify(restaurant.serialize()), 200 


@api.route('/owners/restaurants', methods=['GET'])                      #filtra por rest del usaurio logueado
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
        return jsonify({"error": "Restaurante no encontrado"}), 404
    
    owner = Owner.query.get(restaurant.owner_id)   # Obtiene dueño del restaurant con owner_id de la relación con table restaurant
    
    if not owner:
        return jsonify({"error": "Propietario no encontrado"}), 404
    
    # Verifica que el email del owner sea el mismo que el del usuario logueado
    if owner.email != current_user_email:
        return jsonify({"error": "No tienes permisos para editar este restaurante."}), 403  # Si no tiene permisos
    
    data = request.get_json()

    # Actualiza los campos de la solicitud
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
    if 'image_url' in data:  # Si hay una nueva imagen, actualízala
        restaurant.image_url = data['image_url']

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

@api.route('/reservation_by_owner', methods=['GET'])
@jwt_required()
def get_all_reservation_by_owner():
    email = get_jwt_identity()
    owner = Owner.query.filter_by(email=email).first()
    restaurants = Restaurant.query.filter_by(owner_id= owner.id)
    all_reservations= ()

    for restaurant in restaurants :
        all_reservations = all_reservations + tuple(Reservation.query.filter_by(id_fk_restaurant=restaurant.id).all())
        print(all_reservations)

    print(email)
    

    if not all_reservations:                                           
        return jsonify({"message": "No reservation found"}), 404

    results = list(map(lambda reservation: reservation.serialize(), all_reservations))

    return jsonify(results), 200


@api.route('/reservations/<int:reservation_id>', methods=['DELETE'])
@jwt_required()
def delete_reservation(reservation_id):
    email = get_jwt_identity()
    owner = Owner.query.filter_by(email=email).first()

    if not owner:
        return jsonify({"message": "Owner not found"}), 404

    reservation = Reservation.query.get(reservation_id)

    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    # Controlla che la prenotazione appartenga a un ristorante dell'owner
    restaurant = Restaurant.query.filter_by(id=reservation.id_fk_restaurant, owner_id=owner.id).first()

    if not restaurant:
        return jsonify({"message": "Unauthorized action"}), 403

    db.session.delete(reservation)
    db.session.commit()

    return jsonify({"message": "Reservation deleted successfully"}), 200


@api.route('/restaurant/reservations/<int:restaurant_id>', methods=['GET'])
@jwt_required()
def get_reservations_by_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"message": "Restaurante no encontrado"}), 404

    reservations = Reservation.query.filter_by(id_fk_restaurant=restaurant_id).all()

    results = [{
        "id": res.id,
        "restaurant_name": restaurant.name,
        "date": res.date.isoformat(),
        "hour": res.hour.strftime("%H:%M"),
        "diner_name": res.diner.fullname if res.diner else "No presente",
        "people": res.people,
        "state": res.state
    } for res in reservations]
    
    print(f"Resultados para el restaur from back {restaurant_id}: {results}")
    return jsonify(results), 200


# @api.route('/restaurant/<int:restaurant_id>/user/reservations', methods=['GET'])
# @jwt_required()
# def get_user_reservations_by_restaurant(restaurant_id):
#     current_user_id = get_jwt_identity()
#     restaurant = Restaurant.query.get(restaurant_id)
#     if not restaurant:
#         return jsonify({"message": "Restaurante no encontrado"}), 404
        
  
#     reservations = Reservation.query.filter_by(
#         id_fk_restaurant=restaurant_id,
#         id_fk_user=current_user_id
#     ).all()
    
#     results = [{
#         "id": res.id,
#         "restaurant_name": restaurant.name,
#         "date": res.date.isoformat(),
#         "hour": res.hour.strftime("%H:%M"),
#         "diner_name": res.diner.fullname if res.diner else "No presente",
#         "people": res.people
#     } for res in reservations]
    
#     return jsonify(results), 200


@api.route('/reservations/<int:reservation_id>/status', methods=['PUT'])
@jwt_required()
def update_reservation_status(reservation_id):
    email = get_jwt_identity()
    owner = Owner.query.filter_by(email=email).first()

    if not owner:
        return jsonify({'error': 'Owner not found'}), 404

    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404

    # check si el rest es del owner
    restaurant = Restaurant.query.filter_by(id=reservation.id_fk_restaurant, owner_id=owner.id).first()
    if not restaurant:
        return jsonify({"message": "Unauthorized action"}), 403

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['Pending', 'Accepted', 'Refused', 'Canceled']:
        return jsonify({'error': 'Invalid status'}), 400

    reservation.state = new_status
    db.session.commit()

    return jsonify({'message': 'Reservation status updated', 'status': reservation.state}), 200
