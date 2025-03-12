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
CORS(app, resources={r"/api/*": {"origins":  "https://glorious-space-capybara-575qvj6jgqqh767x-3000.app.github.dev"}})

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
app.register_blueprint(api, url_prefix='/api', strict_slashes=False)
app.register_blueprint(reservations, url_prefix='/api/reservations', strict_slashes=False)
app.register_blueprint(owner_api, url_prefix='/api/owners', strict_slashes=False)
app.register_blueprint(diner_api, url_prefix='/api/diners', strict_slashes=False)

# Manejador de encabezados CORS (para cualquier solicitud sin configurar adecuadamente)
@app.after_request
def add_cors_headers(response):
    print("Encabezados añadidos:", response.headers)  # DEBUG: Mostrar en consola los encabezados
    response.headers["Access-Control-Allow-Origin"] = "https://glorious-space-capybara-575qvj6jgqqh767x-3000.app.github.dev"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

"""@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response"""

# Generar el sitemap con todos los endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

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
