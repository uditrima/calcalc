from flask import Blueprint, request, jsonify
from services.food_service import FoodService

food_bp = Blueprint('food', __name__, url_prefix='/api/food')
food_service = FoodService()

@food_bp.route('/', methods=['GET'])
def get_foods():
    # TODO: implement get all foods
    pass

@food_bp.route('/<int:food_id>', methods=['GET'])
def get_food(food_id):
    # TODO: implement get single food
    pass

@food_bp.route('/', methods=['POST'])
def create_food():
    # TODO: implement create food
    pass

@food_bp.route('/search', methods=['GET'])
def search_foods():
    # TODO: implement search foods
    pass
