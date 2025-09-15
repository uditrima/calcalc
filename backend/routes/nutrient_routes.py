from flask import Blueprint, request, jsonify
from services.nutrient_service import NutrientService

nutrient_bp = Blueprint('nutrients', __name__)
nutrient_service = NutrientService()

@nutrient_bp.route('/', methods=['GET'])
def get_nutrients():
    """Get all nutrients."""
    try:
        nutrients = nutrient_service.get_all_nutrients()
        
        nutrients_data = [nutrient.to_dict() for nutrient in nutrients]
        
        return jsonify({
            'success': True,
            'data': nutrients_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/<int:nutrient_id>', methods=['GET'])
def get_nutrient(nutrient_id):
    """Get a specific nutrient by ID."""
    try:
        nutrient = nutrient_service.get_nutrient_by_id(nutrient_id)
        
        if not nutrient:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': nutrient.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/name/<string:name>', methods=['GET'])
def get_nutrient_by_name(name):
    """Get a specific nutrient by name."""
    try:
        nutrient = nutrient_service.get_nutrient_by_name(name)
        
        if not nutrient:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': nutrient.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/', methods=['POST'])
def create_nutrient():
    """Create a new nutrient."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'calories_per_gram']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate numeric values
        if not isinstance(data['calories_per_gram'], (int, float)) or data['calories_per_gram'] < 0:
            return jsonify({
                'success': False,
                'error': 'calories_per_gram must be a positive number'
            }), 400
        
        # Create nutrient
        nutrient = nutrient_service.create_nutrient(
            name=data['name'],
            calories_per_gram=data['calories_per_gram'],
            description=data.get('description')
        )
        
        return jsonify({
            'success': True,
            'data': nutrient.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/<int:nutrient_id>', methods=['PUT'])
def update_nutrient(nutrient_id):
    """Update an existing nutrient."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate numeric values if provided
        if 'calories_per_gram' in data:
            if not isinstance(data['calories_per_gram'], (int, float)) or data['calories_per_gram'] < 0:
                return jsonify({
                    'success': False,
                    'error': 'calories_per_gram must be a positive number'
                }), 400
        
        # Update nutrient
        nutrient = nutrient_service.update_nutrient(nutrient_id, **data)
        
        if not nutrient:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': nutrient.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/<int:nutrient_id>', methods=['DELETE'])
def delete_nutrient(nutrient_id):
    """Delete a nutrient."""
    try:
        success = nutrient_service.delete_nutrient(nutrient_id)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Nutrient not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Nutrient deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/initialize', methods=['POST'])
def initialize_nutrients():
    """Initialize database with default nutrient values."""
    try:
        nutrient_service.initialize_default_nutrients()
        
        return jsonify({
            'success': True,
            'message': 'Default nutrients initialized successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@nutrient_bp.route('/calculate-calories', methods=['POST'])
def calculate_calories():
    """Calculate calories for a specific amount of a nutrient."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        required_fields = ['nutrient_name', 'grams']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        if not isinstance(data['grams'], (int, float)) or data['grams'] < 0:
            return jsonify({
                'success': False,
                'error': 'grams must be a positive number'
            }), 400
        
        calories = nutrient_service.get_calories_for_nutrient(
            data['nutrient_name'], 
            data['grams']
        )
        
        return jsonify({
            'success': True,
            'data': {
                'nutrient_name': data['nutrient_name'],
                'grams': data['grams'],
                'calories': calories
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
