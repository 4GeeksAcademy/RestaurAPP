# Description: Archivo principal de la aplicación, inicializa la aplicación de Flask y configura las rutas, la base de datos y el manejo de errores.
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
from src.api.routesOwner import owner_api
from src.api.routesDiner import diner_api

# Inicialización de Flask
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
app.register_blueprint(owner_api, url_prefix='/api/owners', strict_slashes=False)
app.register_blueprint(diner_api, url_prefix='/api/diners', strict_slashes=False)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

for rule in app.url_map.iter_rules():
    print(rule)
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

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

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
