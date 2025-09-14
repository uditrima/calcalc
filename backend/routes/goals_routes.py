from flask import Blueprint, request, jsonify
from services.goals_service import GoalsService

goals_bp = Blueprint('goals', __name__)
goals_service = GoalsService()

@goals_bp.route('/', methods=['GET'])
def get_goals():
    """Get current user goals."""
    try:
        goals = goals_service.get_goals()
        
        if not goals:
            return jsonify({
                'success': True,
                'data': None,
                'message': 'No goals set yet'
            }), 200
        
        goals_data = {
            'id': goals.id,
            'daily_calories': goals.daily_calories,
            'protein_target': goals.protein_target,
            'carbs_target': goals.carbs_target,
            'fat_target': goals.fat_target
        }
        
        return jsonify({
            'success': True,
            'data': goals_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@goals_bp.route('/', methods=['POST'])
def create_goals():
    """Create or overwrite user goals."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['daily_calories', 'protein_target', 'carbs_target', 'fat_target']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate numeric values
        for field in required_fields:
            if not isinstance(data[field], (int, float)) or data[field] < 0:
                return jsonify({
                    'success': False,
                    'error': f'Invalid value for {field}. Must be a positive number'
                }), 400
        
        # Create/overwrite goals
        goals = goals_service.set_goals(data)
        
        return jsonify({
            'success': True,
            'data': {
                'id': goals.id,
                'daily_calories': goals.daily_calories,
                'protein_target': goals.protein_target,
                'carbs_target': goals.carbs_target,
                'fat_target': goals.fat_target
            }
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@goals_bp.route('/<int:goals_id>', methods=['PUT'])
@goals_bp.route('/<int:goals_id>/', methods=['PUT'])
def update_goals(goals_id):
    """Update existing user goals."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate numeric values if provided
        numeric_fields = ['daily_calories', 'protein_target', 'carbs_target', 'fat_target']
        for field in numeric_fields:
            if field in data:
                if not isinstance(data[field], (int, float)) or data[field] < 0:
                    return jsonify({
                        'success': False,
                        'error': f'Invalid value for {field}. Must be a positive number'
                    }), 400
        
        # Update goals
        goals = goals_service.update_goals(goals_id, data)
        
        if not goals:
            return jsonify({
                'success': False,
                'error': 'Goals not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': goals.id,
                'daily_calories': goals.daily_calories,
                'protein_target': goals.protein_target,
                'carbs_target': goals.carbs_target,
                'fat_target': goals.fat_target
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
