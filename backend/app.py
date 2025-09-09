from flask import Flask
from flask_cors import CORS
from db.database import db, init_db
from db.models.food import Food
from db.models.diary_entry import DiaryEntry
from db.models.exercise import Exercise
from db.models.weight import Weight
from db.models.user_goals import UserGoals

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize database
    init_db(app)
    
    # TODO: register blueprints
    # TODO: configure error handlers
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
