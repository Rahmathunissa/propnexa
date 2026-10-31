import os

from flask import Flask, jsonify, request
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

@app.route("/api/properties/<int:property_id>")
def get_property(property_id):
    property_item = db.session.get(Property, property_id)

    if property_item is None:
        return jsonify({"error": "Property not found"}), 404

    return jsonify(property_item.to_dict())


# ADMIN: Add a new property
@app.route("/api/admin/properties", methods=["POST"])
def create_property():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Property data is required"}), 400

    required_fields = ["title", "location", "price"]

    for field in required_fields:
        if data.get(field) is None or str(data[field]).strip() == "":
            return jsonify({"error": f"{field} is required"}), 400

    try:
        property_item = Property(
            title=data["title"],
            description=data.get("description", ""),
            location=data["location"],
            community=data.get("community", ""),
            price=float(data["price"]),
            bedrooms=int(data.get("bedrooms", 1)),
            bathrooms=int(data.get("bathrooms", 1)),
            property_type=data.get("property_type", "Apartment"),
            area_sqft=float(data.get("area_sqft", 0)),
            listing_type=data.get("listing_type", "Sale"),
            image_url=data.get("image_url", "")
        )

        db.session.add(property_item)
        db.session.commit()

        return jsonify({
            "message": "Property created successfully",
            "property": property_item.to_dict()
        }), 201

    except (ValueError, TypeError):
        db.session.rollback()
        return jsonify({"error": "Please enter valid numeric values"}), 400

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Could not create property"}), 500


# ADMIN: Update an existing property
@app.route("/api/admin/properties/<int:property_id>", methods=["PUT"])
def update_property(property_id):
    property_item = db.session.get(Property, property_id)

    if property_item is None:
        return jsonify({"error": "Property not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "Updated property data is required"}), 400

    try:
        allowed_fields = [
            "title", "description", "location", "community",
            "price", "bedrooms", "bathrooms", "property_type",
            "area_sqft", "listing_type", "image_url"
        ]

        for field in allowed_fields:
            if field in data:
                setattr(property_item, field, data[field])

        if "price" in data:
            property_item.price = float(data["price"])

        if "bedrooms" in data:
            property_item.bedrooms = int(data["bedrooms"])

        if "bathrooms" in data:
            property_item.bathrooms = int(data["bathrooms"])

        if "area_sqft" in data:
            property_item.area_sqft = float(data["area_sqft"])

        db.session.commit()

        return jsonify({
            "message": "Property updated successfully",
            "property": property_item.to_dict()
        })

    except (ValueError, TypeError):
        db.session.rollback()
        return jsonify({"error": "Please enter valid numeric values"}), 400

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Could not update property"}), 500


# ADMIN: Delete a property
@app.route("/api/admin/properties/<int:property_id>", methods=["DELETE"])
def delete_property(property_id):
    property_item = db.session.get(Property, property_id)

    if property_item is None:
        return jsonify({"error": "Property not found"}), 404

    try:
        db.session.delete(property_item)
        db.session.commit()

        return jsonify({
            "message": "Property deleted successfully"
        })

    except Exception:
        db.session.rollback()
        return jsonify({"error": "Could not delete property"}), 500