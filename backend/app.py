from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from db.database import db, init_db
from db.models.food import Food
from db.models.diary_entry_simple import DiaryEntry
from db.models.exercise import Exercise
from db.models.weight import Weight
from db.models.user_goals import UserGoals
from db.models.user_settings import UserSettings
from db.models.nutrient import Nutrient

# Import Blueprints
from routes.food_routes import food_bp
from routes.diary_routes_improved import diary_bp
from routes.exercise_routes import exercise_bp
from routes.weight_routes import weight_bp
from routes.goals_routes import goals_bp
from routes.user_settings_routes import user_settings_bp
from routes.nutrient_routes import nutrient_bp
# from routes.food_association_routes import food_association_bp

def create_app():
    app = Flask(__name__)
    
    # Configure Flask app from environment variables
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Configure CORS
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    
    # Initialize database
    init_db(app)

    migrate = Migrate(app, db)
    
    
    @app.route("/reset-migrations")
    def reset_migrations():
        from sqlalchemy import text
        try:
            db.session.execute(text("DROP TABLE IF EXISTS alembic_version;"))
            db.session.commit()
            return "alembic_version dropped", 200
        except Exception as e:
            return str(e), 500
    
    # Register Blueprints with API prefix
    app.register_blueprint(food_bp, url_prefix='/api/foods')
    app.register_blueprint(diary_bp, url_prefix='/api/diary')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(weight_bp, url_prefix='/api/weights')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(user_settings_bp, url_prefix='/api')
    app.register_blueprint(nutrient_bp, url_prefix='/api/nutrients')
    # app.register_blueprint(food_association_bp, url_prefix='/api')
    
    # TODO: configure error handlers
    
    return app

if __name__ == "__main__":
    app = create_app()
    
    # Get host and port from environment variables
    host = os.getenv('HOST', '127.0.0.1')
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    app.run(debug=debug, host=host, port=port)
