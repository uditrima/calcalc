from flask_sqlalchemy import SQLAlchemy
import os

# Global database instance
db = SQLAlchemy()

def init_db(app):
    """
    Initialize database with Flask app.
    
    Args:
        app: Flask application instance
    """
    # Configure database URI
    database_url = os.getenv('DATABASE_URL', 'sqlite:///calorie_tracker.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database with app
    db.init_app(app)
    
    # Create all tables
    with app.app_context():
        db.create_all()
