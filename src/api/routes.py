from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy.exc import IntegrityError
from src.api.models import db, User, Diner, Origin, Restaurant, Owner, Categories
from src.api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

# Crear el blueprint principal
api = Blueprint('api', __name__)
CORS(api)

# Funciones auxiliares
def create_response(data=None, message=None, status=200, error=None):
    if error:
        return jsonify({"error": error}), status
    return jsonify({"message": message, "data": data}), status

def serialize_list(query_result):
    return [item.serialize() for item in query_result]

def validate_required_fields(data, required_fields):
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return {"error": f"Faltan los campos obligatorios: {', '.join(missing)}"}
    return None


"""/////////////////////////////////// DINERS ////////////////////////////////////////"""

@api.route('/diners', methods=['GET'])
def get_diners():
    diners = Diner.query.all()
    return create_response(data=serialize_list(diners), status=200)

@api.route('/diner/<int:id>', methods=['GET'])
def get_singlediner(id):
    diner = Diner.query.get(id)
    if not diner:
        return create_response(error="Diner not found", status=404)
    return create_response(data=diner.to_dict(), status=200)

@api.route('/diner', methods=['POST'])
def create_diners():
    data = request.get_json()
    fullname = data.get('fullname')
    email = data.get('email')
    telephone = data.get('telephone')
    password = data.get('password')

    if not all([fullname, email, telephone, password]):
        return create_response(error="All fields are required", status=400)

    new_diner = Diner(fullname=fullname, email=email, telephone=telephone, password=password)
    db.session.add(new_diner)
    db.session.commit()

    return create_response(data=new_diner.to_dict(), status=201)

@api.route('/diner/<int:id>', methods=['PUT'])
def edit_diner(id):
    diner = Diner.query.get(id)
    if not diner:
        return create_response(error="Diner not found", status=404)

    data = request.get_json()
    diner.fullname = data.get('fullname', diner.fullname)
    diner.email = data.get('email', diner.email)
    diner.telephone = data.get('telephone', diner.telephone)
    diner.password = data.get('password', diner.password)

    db.session.commit()
    return create_response(data=diner.to_dict(), status=200)

@api.route('/diner/<int:id>', methods=['DELETE'])
def delete_diner(id):
    diner = Diner.query.get(id)
    if not diner:
        return create_response(error="Diner not found", status=404)

    db.session.delete(diner)
    db.session.commit()
    return create_response(message="Diner deleted", status=200)

@api.route("/diner/login", methods=["POST"])
def dinerLogin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    diner = Diner.query.filter_by(email=email).first()

    if not diner or password != diner.password:
        return create_response(error="Invalid email or password", status=401)

    access_token = create_access_token(identity=email)
    return create_response(data={"access_token": access_token, "diner_fullname": diner.fullname}, status=200)


"""/////////////////////////////////// OWNERS ////////////////////////////////////////"""

@api.route("/owners/login", methods=["POST"])
def ownerLogin():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    owner = Owner.query.filter_by(email=email).first()

    if not owner or password != owner.password:
        return create_response(error="Invalid email or password", status=401)

    access_token = create_access_token(identity=email)
    return create_response(data={"access_token": access_token, "owner_name": owner.name}, status=200)

@api.route('/owners', methods=['GET'])
def get_all_owners():
    try:
        owners = Owner.query.all()
        if not owners:
            return jsonify({"error": "No se encontraron propietarios"}), 404
        return jsonify({"data": [owner.serialize() for owner in owners]})
    except Exception as e:
        print("Error al obtener propietarios:", e)
        return jsonify({"error": "Error interno del servidor"}), 500

@api.route('/owners/<int:owner_id>', methods=['GET'])
def get_single_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Owner not found", status=404)
    return create_response(data=owner.serialize(), status=200)

@api.route('/owners/<int:owner_id>/restaurants', methods=['GET'])
def get_restaurants_by_owner(owner_id):
    restaurants = Restaurant.query.filter_by(owner_id=owner_id).all()
    if not restaurants:
        return create_response(error="No se encontraron restaurantes para este propietario.", status=404)
    return create_response(data=serialize_list(restaurants), status=200)

@api.route('/owners', methods=['POST'])
def add_owner():
    data = request.json
    required_fields = ['name', 'telephone', 'email', 'password']
    validation_error = validate_required_fields(data, required_fields)
    if validation_error:
        return jsonify(validation_error), 400

    new_owner = Owner(name=data['name'], location=data.get('location'),
                      telephone=data['telephone'], email=data['email'], password=data['password'])
    db.session.add(new_owner)
    db.session.commit()

    return create_response(data=new_owner.serialize(), message="Owner added successfully", status=201)

@api.route('/owners/<int:owner_id>', methods=['DELETE'])
def delete_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Owner not found", status=404)

    db.session.delete(owner)
    db.session.commit()
    return create_response(message="Owner successfully deleted", status=200)

@api.route('/owners/<int:owner_id>', methods=['PUT'])
def modify_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return create_response(error="Owner not found", status=404)

    data = request.json
    owner.name = data.get('name', owner.name)
    owner.location = data.get('location', owner.location)
    owner.telephone = data.get('telephone', owner.telephone)
    owner.email = data.get('email', owner.email)
    owner.password = data.get('password', owner.password)

    db.session.commit()
    return create_response(message="Owner successfully modified", data=owner.serialize(), status=200)


"""/////////////////////////////////// RESTAURANTS ////////////////////////////////////////"""

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
        return create_response(error="No se encontraron restaurantes que coincidan con los criterios.", status=404)

    return create_response(data=serialize_list(restaurants), status=200)

@api.route('/restaurants', methods=['POST'])
def add_restaurant():
    try:
        data = request.json
        print("Datos recibidos en el backend:", data)  # Log de depuración inicial

        # Validar campos obligatorios
        if not data.get('name') or not data.get('location') or not data.get('capacity') or not data.get('telephone'):
            print("Faltan campos obligatorios en los datos recibidos")
            return jsonify({"error": "Faltan campos obligatorios: name, location, capacity, telephone"}), 400

        # Validar `owner_id`
        owner = Owner.query.get(data.get('owner_id'))
        if not owner:
            print("El propietario no existe para el owner_id proporcionado:", data.get('owner_id'))
            return jsonify({"error": "El propietario no existe para el ID proporcionado"}), 400

        # Validar latitude y longitude
        if data.get('latitude') is None or data.get('longitude') is None:
            print("Faltan los campos obligatorios: latitude o longitude")
            return jsonify({"error": "Faltan los campos obligatorios: latitude, longitude"}), 400

        # Validar y convertir latitude y longitude
        try:
            latitude = float(data['latitude'])
            longitude = float(data['longitude'])
        except (ValueError, TypeError) as e:
            print("Error en la conversión de latitude/longitude:", e)
            return jsonify({"error": "Latitude y longitude deben ser números válidos"}), 400

        # Crear el restaurante
        print("Creando restaurante con los datos:", data)
        restaurant = Restaurant(
            name=data['name'],
            location=data['location'],
            telephone=data['telephone'],
            capacity=data['capacity'],
            latitude=latitude,
            longitude=longitude,
            owner_id=data['owner_id']
        )
        db.session.add(restaurant)
        db.session.commit()

        print("Restaurante creado exitosamente:", restaurant.serialize())
        return jsonify({"message": "Restaurante añadido exitosamente"}), 201

    except Exception as e:
        # Capturar rastreo completo del error
        import traceback
        traceback.print_exc()
        print("Error interno del servidor:", e)
        return jsonify({"error": "Error interno del servidor"}), 500

@api.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return create_response(error="Restaurante no encontrado", status=404)

    db.session.delete(restaurant)
    db.session.commit()
    return create_response(message="Restaurante eliminado exitosamente", status=200)

@api.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    try:
        # Obtener restaurante por ID
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurante no encontrado"}), 404

        # Obtener datos del request
        data = request.json
        print("Datos recibidos para actualizar el restaurante:", data)

        # Actualizar los campos del restaurante
        restaurant.name = data.get('name', restaurant.name)
        restaurant.location = data.get('location', restaurant.location)
        restaurant.telephone = data.get('telephone', restaurant.telephone)
        restaurant.latitude = float(data.get('latitude', restaurant.latitude))
        restaurant.longitude = float(data.get('longitude', restaurant.longitude))
        restaurant.capacity = int(data.get('capacity', restaurant.capacity))
        restaurant.owner_id = data.get('owner_id', restaurant.owner_id)

        # Guardar cambios en la base de datos
        db.session.commit()
        print("Restaurante actualizado exitosamente:", restaurant.serialize())

        return jsonify({"message": "Restaurante actualizado exitosamente", "data": restaurant.serialize()}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Error al actualizar el restaurante:", e)
        return jsonify({"error": "Error interno del servidor"}), 500


"""/////////////////////////////////// ORIGINS ////////////////////////////////////////"""

@api.route('/origins', methods=['GET'])
def get_origins():
    origins = Origin.query.all()
    return create_response(data=serialize_list(origins), status=200)

@api.route('/origin', methods=['POST'])
def add_origin():
    data = request.get_json()
    if not data.get('name'):
        return create_response(error="El campo 'name' es obligatorio", status=400)

    new_origin = Origin(name=data['name'])
    db.session.add(new_origin)
    db.session.commit()

    return create_response(message="New Food Origin Created", data=new_origin.serialize(), status=201)

@api.route('/origin/<int:id>', methods=['GET'])
def get_single_origin(id):
    origin = Origin.query.get(id)
    if not origin:
        return create_response(error="Origin not found", status=404)

    return create_response(data=origin.serialize(), status=200)

@api.route('/origin/<int:id>', methods=['DELETE'])
def delete_origin(id):
    origin = Origin.query.get(id)
    if not origin:
        return create_response(error="Origin not found", status=404)

    db.session.delete(origin)
    db.session.commit()
    return create_response(message="Origin deleted", status=200)

@api.route('/origin/<int:id>', methods=['PUT'])
def modify_origin(id):
    origin = Origin.query.get(id)
    if not origin:
        return create_response(error="Origin not found", status=404)

    data = request.json
    origin.name = data.get('name', origin.name)

    db.session.commit()
    return create_response(message="Origin successfully modified!", data=origin.serialize(), status=200)


"""/////////////////////////////////// CATEGORIES ////////////////////////////////////////"""

@api.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Categories.query.all()
    return create_response(data=serialize_list(categories), status=200)

@api.route('/categories', methods=['POST'])
def add_category():
    data = request.json
    if not data.get('name'):
        return create_response(error="El campo 'name' es obligatorio", status=400)

    new_category = Categories(name=data['name'])
    db.session.add(new_category)
    db.session.commit()

    return create_response(message="Category added successfully", data=new_category.serialize(), status=201)

@api.route('/categories/<int:category_id>', methods=['GET'])
def get_single_category(category_id):
    category = Categories.query.get(category_id)
    if not category:
        return create_response(error="Category not found", status=404)

    return create_response(data=category.serialize(), status=200)

@api.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Categories.query.get(category_id)
    if not category:
        return create_response(error="Category not found", status=404)

    db.session.delete(category)
    db.session.commit()
    return create_response(message="Category successfully deleted", status=200)

@api.route('/categories/<int:category_id>', methods=['PUT'])
def modify_category(category_id):
    category = Categories.query.get(category_id)
    if not category:
        return create_response(error="Category not found", status=404)

    data = request.json
    category.name = data.get('name', category.name)

    db.session.commit()
    return create_response(message="Category successfully modified", data=category.serialize(), status=200)


"""/////////////////////////////////// HELLO ////////////////////////////////////////"""

@api.route('/hello', methods=['GET'])
def hello():
    return create_response(message="Hello from the backend!", status=200)
