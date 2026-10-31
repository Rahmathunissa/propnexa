from flask import Flask, jsonify, request
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
    query = Property.query

    # Search by title, location or community
    search = request.args.get("search", "").strip()

    if search:
        query = query.filter(
            db.or_(
                Property.title.ilike(f"%{search}%"),
                Property.location.ilike(f"%{search}%"),
                Property.community.ilike(f"%{search}%")
            )
        )

    # Filter by city
    location = request.args.get("location", "").strip()

    if location:
        query = query.filter(
            Property.location.ilike(location)
        )

    # Filter by property type
    property_type = request.args.get("property_type", "").strip()

    if property_type:
        query = query.filter(
            Property.property_type.ilike(property_type)
        )

    # Filter by listing type
    listing_type = request.args.get("listing_type", "").strip()

    if listing_type:
        query = query.filter(
            Property.listing_type.ilike(listing_type)
        )

    # Sort by price
    sort = request.args.get("sort", "default")

    if sort == "price_low":
        query = query.order_by(Property.price.asc())
    elif sort == "price_high":
        query = query.order_by(Property.price.desc())
    else:
        query = query.order_by(Property.id.asc())

    properties = query.all()

    return jsonify([
        property.to_dict() for property in properties
    ])

