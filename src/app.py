from flask import Flask, request, jsonify, send_from_directory
import os
from flask_migrate import Migrate
from flask_cors import CORS
from src.api.utils import APIException, generate_sitemap
from src.api.models import db
from src.api.routes import api
from src.api.admin import setup_admin
from src.api.commands import setup_commands
from src.api.routesReservations import reservations
from src.api.routesOwner import owner_api
from src.api.routesDiner import diner_api



# Inicialización de Flask
app = Flask(__name__)

# Configuración de CORS (Permitir todas las solicitudes en desarrollo)
#CORS(app, resources={r"/api/*": {"origins":  "https://potential-telegram-9gw96rvrqwjfpvx6-3001.app.github.dev"}})
CORS(app)
# Configuración del entorno (desarrollo o producción)
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
<<<<<<< HEAD
=======
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Initialize Swagger


# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
"""
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate

from flask_cors import CORS
from flask_jwt_extended import JWTManager  # Importamos JWTManager
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev"}})

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app.url_map.strict_slashes = False
>>>>>>> develop

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL", "sqlite:////tmp/test.db")
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialización de la base de datos y migraciones
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Inicializa administración y comandos
setup_admin(app)
setup_commands(app)

<<<<<<< HEAD
# Registro de Blueprints
app.register_blueprint(api, url_prefix='/api', strict_slashes=False)
app.register_blueprint(reservations, url_prefix='/api/reservations', strict_slashes=False)
app.register_blueprint(owner_api, url_prefix='/api/owners', strict_slashes=False)
app.register_blueprint(diner_api, url_prefix='/api/diners', strict_slashes=False)
=======
# Configuración de clave secreta para JWT
app.config["JWT_SECRET_KEY"] = "your-secure-secret-keyasdfghjklzxcvbnm"  # Cambia "your-secure-secret-key" por una clave segura
jwt = JWTManager(app)

# Registrar el blueprint de la API
app.register_blueprint(api, url_prefix='/api')
>>>>>>> develop

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed_origins = ["https://potential-telegram-9gw96rvrqwjfpvx6-3000.app.github.dev"]

    # Permitir todos los orígenes o restringir a los permitidos
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        response.headers["Access-Control-Allow-Origin"] = "*"  # Permitir todos los orígenes (puedes restringir esto si necesario)

    # Métodos permitidos
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"

    # Encabezados permitidos
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

    # (Opcional) Mostrar los encabezados para depuración
    print("Encabezados añadidos:", response.headers)  # DEBUG: Mostrar en consola los encabezados
    return response

# Ruta de inicio
# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


# Inicializar la lista de restaurantes si no existe
if not hasattr(app, 'restaurants'):
    app.restaurants = []

# Agregar datos iniciales una única vez
if len(app.restaurants) == 0:
    app.restaurants.extend([
        {"name": "Restaurante A", "location": "Madrid", "capacity": 50},
        {"name": "Restaurante B", "location": "Barcelona", "capacity": 20},
        {"name": "Restaurante C", "location": "Madrid", "capacity": 10},
    ])

print(f"Lista completa de restaurantes: {app.restaurants}")


from src.api.models import db, Restaurant

@app.route('/api/restaurants', methods=['POST'])
def add_restaurant():
    data = request.get_json()

    # Validar los datos requeridos
    required_fields = ["name", "location", "telephone", "latitude", "longitude", "capacity", "owner_id"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"El campo {field} es obligatorio"}), 400

    # Crear un nuevo restaurante
    new_restaurant = Restaurant(
        name=data["name"],
        location=data["location"],
        telephone=data["telephone"],
        latitude=float(data["latitude"]),
        longitude=float(data["longitude"]),
        capacity=int(data["capacity"]),
        owner_id=int(data["owner_id"])
    )

    try:
        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify({"message": "Restaurante añadido exitosamente", "restaurant": new_restaurant.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al guardar el restaurante: {str(e)}"}), 500

@app.route('/api/restaurants/available', methods=['POST'])
def get_available_restaurants():
    data = request.get_json()

    # Validar los parámetros enviados
    location = data.get('location', '').strip().lower()
    people = data.get('people', 0)

    if not location or people <= 0:
        return jsonify({"error": "La ubicación y el número de personas son obligatorios"}), 400

    try:
        # Consultar la base de datos
        available_restaurants = Restaurant.query.filter(
            db.func.lower(Restaurant.location) == location,
            Restaurant.capacity >= people
        ).all()

        return jsonify({"available_restaurants": [restaurant.serialize() for restaurant in available_restaurants]})
    except Exception as e:
        return jsonify({"error": f"Error al obtener restaurantes: {str(e)}"}), 500


# Manejador de errores personalizados
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Manejador global de 404
@app.errorhandler(404)
def handle_404(error):
    return jsonify({"error": "Recurso no encontrado"}), 404

# Manejador global de 500
@app.errorhandler(500)
def handle_500(error):
    return jsonify({"error": "Error interno del servidor"}), 500

# Manejo de archivos estáticos (Frontend)
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    # Asegurarse de que el frontend no maneja rutas de la API
    if path.startswith('api/'):
        return jsonify({"error": "Ruta no encontrada"}), 404
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar caché
    return response


# Ejecución principal
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
