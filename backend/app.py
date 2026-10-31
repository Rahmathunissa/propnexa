
import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db
from models.property import Property

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}}
)

# Initialize database
os.makedirs(app.instance_path, exist_ok=True)
db.init_app(app)


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


@app.route("/api/properties")
def get_properties():
    properties = Property.query.all()

    return jsonify([
        property.to_dict() for property in properties
    ])


# Create database tables
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
