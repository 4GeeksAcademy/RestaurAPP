"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# from models import Person
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://zany-space-lamp-r5wg7q95j5xfw4j-3001.app.github.dev"}})

app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Cambia esto a una clave segura
jwt = JWTManager(app)

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
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
from flask import Flask, jsonify, send_from_directory
import os
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.api.utils import APIException, generate_sitemap
from src.api.models import db, User, Owner, Diner, Reservation
from src.api.routes import api
from src.api.admin import setup_admin
from src.api.commands import setup_commands
from src.api.routesReservations import reservations

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Permitir todas las solicitudes en desarrollo

# Configuración de clave secreta para JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "default-unsafe-key")  # Usa una clave segura en producción

# Configuración del entorno (desarrollo o producción)
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

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

# Registro de Blueprints
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(reservations, url_prefix='/api/reservations')

# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Manejo de archivos estáticos
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar caché
    return response

# Ejecución principal
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
