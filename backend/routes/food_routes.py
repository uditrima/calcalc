from flask import Blueprint, request, jsonify
from services.food_service import FoodService

food_bp = Blueprint('food', __name__)
food_service = FoodService()

@food_bp.route('/', methods=['GET'])
def get_foods():
    """Get all foods."""
    try:
        foods = food_service.get_all_foods()
        return jsonify([{
            'id': food.id,
            'name': food.name,
            'category': food.category,
            'brand': food.brand,
            'used': food.used,
            'last_used': food.last_used,
            'calories': food.calories,
            'protein': food.protein,
            'carbohydrates': food.carbohydrates,
            'fat': food.fat,
            'fiber': food.fiber,
            'sugar': food.sugar,
            'saturated_fat': food.saturated_fat,
            'unsaturated_fat': food.unsaturated_fat,
            'cholesterol': food.cholesterol,
            'sodium': food.sodium,
            'potassium': food.potassium,
            'calcium': food.calcium,
            'iron': food.iron,
            'vitamin_a': food.vitamin_a,
            'vitamin_c': food.vitamin_c,
            'vitamin_d': food.vitamin_d,
            'vitamin_b12': food.vitamin_b12,
            'magnesium': food.magnesium,
            'created_at': food.created_at.isoformat() if food.created_at else None,
            'updated_at': food.updated_at.isoformat() if food.updated_at else None
        } for food in foods])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_bp.route('/<int:food_id>', methods=['GET'])
@food_bp.route('/<int:food_id>/', methods=['GET'])
def get_food(food_id):
    """Get a single food by ID."""
    try:
        food = food_service.get_food_by_id(food_id)
        if not food:
            return jsonify({'error': 'Food not found'}), 404
        
        return jsonify({
            'id': food.id,
            'name': food.name,
            'category': food.category,
            'brand': food.brand,
            'used': food.used,
            'last_used': food.last_used,
            'calories': food.calories,
            'protein': food.protein,
            'carbohydrates': food.carbohydrates,
            'fat': food.fat,
            'fiber': food.fiber,
            'sugar': food.sugar,
            'saturated_fat': food.saturated_fat,
            'unsaturated_fat': food.unsaturated_fat,
            'cholesterol': food.cholesterol,
            'sodium': food.sodium,
            'potassium': food.potassium,
            'calcium': food.calcium,
            'iron': food.iron,
            'vitamin_a': food.vitamin_a,
            'vitamin_c': food.vitamin_c,
            'vitamin_d': food.vitamin_d,
            'vitamin_b12': food.vitamin_b12,
            'magnesium': food.magnesium,
            'created_at': food.created_at.isoformat() if food.created_at else None,
            'updated_at': food.updated_at.isoformat() if food.updated_at else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_bp.route('/', methods=['POST'])
def create_food():
    """Create a new food."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        if 'name' not in data:
            return jsonify({'error': 'Name is required'}), 400
        
        food = food_service.create_food(data)
        return jsonify({
            'id': food.id,
            'name': food.name,
            'category': food.category,
            'brand': food.brand,
            'used': food.used,
            'last_used': food.last_used,
            'calories': food.calories,
            'protein': food.protein,
            'carbohydrates': food.carbohydrates,
            'fat': food.fat,
            'fiber': food.fiber,
            'sugar': food.sugar,
            'saturated_fat': food.saturated_fat,
            'unsaturated_fat': food.unsaturated_fat,
            'cholesterol': food.cholesterol,
            'sodium': food.sodium,
            'potassium': food.potassium,
            'calcium': food.calcium,
            'iron': food.iron,
            'vitamin_a': food.vitamin_a,
            'vitamin_c': food.vitamin_c,
            'vitamin_d': food.vitamin_d,
            'vitamin_b12': food.vitamin_b12,
            'magnesium': food.magnesium,
            'created_at': food.created_at.isoformat() if food.created_at else None,
            'updated_at': food.updated_at.isoformat() if food.updated_at else None
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_bp.route('/<int:food_id>', methods=['PUT'])
@food_bp.route('/<int:food_id>/', methods=['PUT'])
def update_food(food_id):
    """Update an existing food."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        food = food_service.update_food(food_id, data)
        if not food:
            return jsonify({'error': 'Food not found'}), 404
        
        return jsonify({
            'id': food.id,
            'name': food.name,
            'category': food.category,
            'brand': food.brand,
            'used': food.used,
            'last_used': food.last_used,
            'calories': food.calories,
            'protein': food.protein,
            'carbohydrates': food.carbohydrates,
            'fat': food.fat,
            'fiber': food.fiber,
            'sugar': food.sugar,
            'saturated_fat': food.saturated_fat,
            'unsaturated_fat': food.unsaturated_fat,
            'cholesterol': food.cholesterol,
            'sodium': food.sodium,
            'potassium': food.potassium,
            'calcium': food.calcium,
            'iron': food.iron,
            'vitamin_a': food.vitamin_a,
            'vitamin_c': food.vitamin_c,
            'vitamin_d': food.vitamin_d,
            'vitamin_b12': food.vitamin_b12,
            'magnesium': food.magnesium,
            'created_at': food.created_at.isoformat() if food.created_at else None,
            'updated_at': food.updated_at.isoformat() if food.updated_at else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_bp.route('/<int:food_id>', methods=['DELETE'])
@food_bp.route('/<int:food_id>/', methods=['DELETE'])
def delete_food(food_id):
    """Delete a food."""
    try:
        success = food_service.delete_food(food_id)
        if not success:
            return jsonify({'error': 'Food not found'}), 404
        
        return jsonify({'message': 'Food deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
