# openAI.py
# from flask import Blueprint, request, jsonify
# import openai
# import os
# from dotenv import load_dotenv

# load_dotenv()  # Carica le variabili d'ambiente (come OPENAI_API_KEY)
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Imposta la chiave API di OpenAI

# openai_api = Blueprint('openai_api', __name__)  # Blueprint per l'API OpenAI

# @openai_api.route('/api/recommendation', methods=['POST'])
# def get_recommendation():
#     data = request.get_json()  # Ottieni i dati della richiesta (messaggio dell'utente)
#     user_message = data.get("message", "")

#     if not user_message:
#         return jsonify({"error": "No se proporcionó mensaje"}), 400

#     try:
#         # Chiamata all'API di OpenAI con il messaggio dell'utente
#         response = openai.Completion.create(
#             model="gpt-3.5-turbo",
#             prompt=f"Eres un experto en restaurantes. Responde de manera amigable y profesional. Mensaje de usuario: {user_message}",
#             max_tokens=150
#         )
        
#         # Estrarre la risposta dal risultato dell'API
#         reply = response.choices[0].text.strip()

#         return jsonify({"reply": reply}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
