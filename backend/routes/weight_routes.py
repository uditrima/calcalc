from flask import Blueprint, request, jsonify
from services.weight_service import WeightService
from datetime import datetime

weight_bp = Blueprint('weight', __name__)
weight_service = WeightService()

@weight_bp.route('/', methods=['GET'])
def get_weight_history():
    """Get all weight measurements ordered by date."""
    try:
        weights = weight_service.get_weights()
        
        # Convert to dict format for JSON response
        weights_data = []
        for weight in weights:
            weight_dict = {
                'id': weight.id,
                'date': weight.date.isoformat(),
                'weight_kg': weight.weight_kg
            }
            weights_data.append(weight_dict)
        
        return jsonify({
            'success': True,
            'data': weights_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@weight_bp.route('/', methods=['POST'])
def add_weight_entry():
    """Create a new weight measurement entry."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate required fields
        if 'weight_kg' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required field: weight_kg'
            }), 400
        
        # Parse date if provided, otherwise use today
        target_date = None
        if 'date' in data:
            target_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        # Create weight entry
        weight_entry = weight_service.add_weight(
            target_date=target_date,
            weight_kg=data['weight_kg']
        )
        
        return jsonify({
            'success': True,
            'data': {
                'id': weight_entry.id,
                'date': weight_entry.date.isoformat(),
                'weight_kg': weight_entry.weight_kg
            }
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid date format: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@weight_bp.route('/<int:weight_id>', methods=['PUT'])
@weight_bp.route('/<int:weight_id>/', methods=['PUT'])
def update_weight_entry(weight_id):
    """Update an existing weight measurement entry."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Parse date if provided
        if 'date' in data:
            data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        # Update weight entry
        weight_entry = weight_service.update_weight(weight_id, data)
        
        if not weight_entry:
            return jsonify({
                'success': False,
                'error': 'Weight entry not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': weight_entry.id,
                'date': weight_entry.date.isoformat(),
                'weight_kg': weight_entry.weight_kg
            }
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Invalid date format: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@weight_bp.route('/<int:weight_id>', methods=['DELETE'])
@weight_bp.route('/<int:weight_id>/', methods=['DELETE'])
def delete_weight_entry(weight_id):
    """Delete a weight measurement entry."""
    try:
        success = weight_service.delete_weight(weight_id)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Weight entry not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Weight entry deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
