"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Owner
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

@api.route('/owners', methods=['GET'])
def get_all_owners():

    all_owners= Owner.query.all()

    if not all_owners:                                           
        return jsonify({"message": "No owners found"}), 404

    results= list(map(lambda owner : owner.serialize(), all_owners)) 

    return jsonify(results), 200


@api.route('/owners/<int:owner_id>', methods=['GET'])
def get_single_owner(owner_id):

    single_owner = Owner.query.get(owner_id)
    print(single_owner)
    print(single_owner.serialize())

    return jsonify(single_owner.serialize()), 200


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