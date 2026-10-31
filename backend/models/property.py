
from extensions import db


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)

    location = db.Column(db.String(100), nullable=False)
    community = db.Column(db.String(100))

    price = db.Column(db.Float, nullable=False)

    bedrooms = db.Column(db.Integer, default=1)
    bathrooms = db.Column(db.Integer, default=1)

    property_type = db.Column(db.String(50))
    area_sqft = db.Column(db.Float)

    listing_type = db.Column(db.String(20))
    image_url = db.Column(db.String(300))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "community": self.community,
            "price": self.price,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "property_type": self.property_type,
            "area_sqft": self.area_sqft,
            "listing_type": self.listing_type,
            "image_url": self.image_url
        }
