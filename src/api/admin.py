  
import os
from flask_admin import Admin

from .models import db, User, Diner, Origin, Owner, Categories, Restaurant

from flask_admin.contrib.sqla import ModelView
from src.api.models import User, Owner, Diner, Restaurant, Reservation
from src import db

def setup_admin(app):
    # Configuración de clave secreta y estilo de Flask-Admin
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'default_secure_key')  # Cambia esto en producción
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    
    # Instancia del admin
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Registro de modelos en el panel de administración
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Diner, db.session))
    admin.add_view(ModelView(Owner, db.session))
    admin.add_view(ModelView(Restaurant, db.session, endpoint='admin_restaurant'))  # Agregar modelo Restaurant
    admin.add_view(ModelView(Reservation, db.session))  # Agregar modelo Reservation


    # Nota: Puedes duplicar las líneas anteriores para añadir más modelos en el futuro

    admin.add_view(ModelView(Origin, db.session))


    admin.add_view(ModelView(Restaurant, db.session))

    admin.add_view(ModelView(Categories, db.session))



    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))

