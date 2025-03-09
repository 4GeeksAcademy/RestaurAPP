from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # Instanciamos SQLAlchemy

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///your_database_name.db"  # Cambia a tu base de datos
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)  # Vinculamos SQLAlchemy con la app

    return app
