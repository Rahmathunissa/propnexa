
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})


@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to PropNexa API",
        "tagline": "Find Smarter. Live Better."
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "PropNexa backend is running!",
        "application": "PropNexa"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)