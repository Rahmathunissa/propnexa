
from app import app
from extensions import db
from models.property import Property

sample_properties = [
    {
        "title": "Modern Apartment with Marina View",
        "description": "A bright apartment with balcony and modern interiors.",
        "location": "Dubai",
        "community": "Dubai Marina",
        "price": 1850000,
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": "Apartment",
        "area_sqft": 1250,
        "listing_type": "Sale",
        "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
    },
    {
        "title": "Luxury Downtown Residence",
        "description": "Elegant apartment close to Downtown Dubai attractions.",
        "location": "Dubai",
        "community": "Downtown Dubai",
        "price": 2400000,
        "bedrooms": 2,
        "bathrooms": 3,
        "property_type": "Apartment",
        "area_sqft": 1450,
        "listing_type": "Sale",
        "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
    },
    {
        "title": "Family Villa with Private Garden",
        "description": "Spacious family home with a private garden and parking.",
        "location": "Abu Dhabi",
        "community": "Khalifa City",
        "price": 3200000,
        "bedrooms": 4,
        "bathrooms": 5,
        "property_type": "Villa",
        "area_sqft": 3200,
        "listing_type": "Sale",
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },
    {
        "title": "Waterfront Apartment",
        "description": "Contemporary apartment with beautiful waterfront surroundings.",
        "location": "Abu Dhabi",
        "community": "Al Reem Island",
        "price": 95000,
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": "Apartment",
        "area_sqft": 1100,
        "listing_type": "Rent",
        "image_url": "https://images.unsplash.com/photo-1600607687644-c7171b42498f"
    },
    {
        "title": "Affordable Family Apartment",
        "description": "Comfortable apartment in a convenient residential community.",
        "location": "Sharjah",
        "community": "Al Majaz",
        "price": 750000,
        "bedrooms": 2,
        "bathrooms": 2,
        "property_type": "Apartment",
        "area_sqft": 1050,
        "listing_type": "Sale",
        "image_url": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea"
    },
    {
        "title": "Spacious Townhouse",
        "description": "Modern townhouse with generous living spaces.",
        "location": "Dubai",
        "community": "Town Square",
        "price": 140000,
        "bedrooms": 3,
        "bathrooms": 3,
        "property_type": "Townhouse",
        "area_sqft": 2100,
        "listing_type": "Rent",
        "image_url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
    }
]

with app.app_context():
    existing = Property.query.count()

    if existing == 0:
        for item in sample_properties:
            db.session.add(Property(**item))

        db.session.commit()
        print("Six sample properties added successfully!")
    else:
        print(f"Database already contains {existing} properties.")
        print("No duplicate records were added.")
