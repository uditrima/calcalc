from flask import Flask
from flask_cors import CORS
from db.database import db, init_db
from db.models.food import Food
from db.models.diary_entry import DiaryEntry
from db.models.exercise import Exercise
from db.models.weight import Weight
from db.models.user_goals import UserGoals

# Import Blueprints
from routes.food_routes import food_bp
from routes.diary_routes import diary_bp
from routes.exercise_routes import exercise_bp
from routes.weight_routes import weight_bp
from routes.goals_routes import goals_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize database
    init_db(app)
    
    # Register Blueprints
    app.register_blueprint(food_bp)
    app.register_blueprint(diary_bp)
    app.register_blueprint(exercise_bp)
    app.register_blueprint(weight_bp)
    app.register_blueprint(goals_bp)
    
    # TODO: configure error handlers
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
