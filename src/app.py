from flask import Flask, request, jsonify, send_from_directory
import os
from flask_migrate import Migrate
from flask_cors import CORS
from src.api.utils import APIException, generate_sitemap
from src.api.models import db, Restaurant, User, Reservation, Owner, Diner
from src.api.routes import api
from src.api.admin import setup_admin
from src.api.commands import setup_commands
from src.api.routesReservations import reservations
from src.api.routesRestaurants import restaurants_api
from src.api.routesOwner import owner_api
from src.api.routesDiner import diner_api
from flask_jwt_extended import JWTManager

# Inicialización de Flask
app = Flask(__name__)

# Configuración de CORS (Permitir todas las solicitudes en desarrollo)
CORS(app)

# Configuración del entorno (desarrollo o producción)
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Datos de prueba para desarrollo
if ENV == "development":
    from src.api.test_data import get_sample_restaurants

    if not hasattr(app, 'restaurants'):
        app.restaurants = []

    if len(app.restaurants) == 0:
        app.restaurants.extend(get_sample_restaurants())

app.url_map.strict_slashes = False

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
app.register_blueprint(reservations, url_prefix='/api/reservations', strict_slashes=False)
app.register_blueprint(owner_api, url_prefix='/api/owners', strict_slashes=False)
app.register_blueprint(diner_api, url_prefix='/api/diners', strict_slashes=False)
app.register_blueprint(restaurants_api, url_prefix='/api/restaurants', strict_slashes=False)
# Configuración de clave secreta para JWT
app.config["JWT_SECRET_KEY"] = "your-secure-secret-keyasdfghjklzxcvbnm"  # Cambiar en producción
jwt = JWTManager(app)

# Manejadores de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.errorhandler(404)
def handle_404(error):
    return jsonify({"error": "Recurso no encontrado"}), 404

@app.errorhandler(500)
def handle_500(error):
    return jsonify({"error": "Error interno del servidor"}), 500

# Generar sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Manejo de archivos estáticos (Frontend)
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if path.startswith('api/'):
        return jsonify({"error": "Ruta no encontrada"}), 404
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar caché
    return response

# Manejo de CORS
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"  # Permitir todos los orígenes
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    print("Encabezados añadidos:", response.headers)
    return response

# Ejecución principal
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
