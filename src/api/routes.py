"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Diner
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


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
     