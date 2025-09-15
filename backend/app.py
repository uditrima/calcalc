from flask import Flask
from flask_cors import CORS
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
    CORS(app)
    
    # Initialize database
    init_db(app)
    
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
    app.run(debug=True, port=5000)
