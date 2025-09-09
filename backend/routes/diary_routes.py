from flask import Blueprint, request, jsonify
from services.diary_service import DiaryService
from datetime import datetime

diary_bp = Blueprint('diary', __name__, url_prefix='/api/diary')
diary_service = DiaryService()

@diary_bp.route('/<date>', methods=['GET'])
@diary_bp.route('/<date>/', methods=['GET'])
def get_diary_entries(date):
    """Get diary entries for a specific date."""
    try:
        # Parse date string to date object
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
        
        entries = diary_service.get_entries_by_date(target_date)
        return jsonify([{
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'grams': entry.grams,
            'food_id': entry.food_id,
            'food_name': entry.food.name if entry.food else None,
            'nutrition': diary_service.calculate_entry_nutrition(entry)
        } for entry in entries])
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/', methods=['POST'])
def add_diary_entry():
    """Add a new diary entry."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['food_id', 'grams', 'meal_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse date if provided, otherwise use today
        target_date = None
        if 'date' in data:
            try:
                target_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        entry = diary_service.add_entry(
            food_id=data['food_id'],
            grams=data['grams'],
            meal_type=data['meal_type'],
            target_date=target_date
        )
        
        return jsonify({
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'grams': entry.grams,
            'food_id': entry.food_id,
            'food_name': entry.food.name if entry.food else None,
            'nutrition': diary_service.calculate_entry_nutrition(entry)
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/<int:entry_id>', methods=['PUT'])
@diary_bp.route('/<int:entry_id>/', methods=['PUT'])
def update_diary_entry(entry_id):
    """Update an existing diary entry."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Parse date if provided
        if 'date' in data:
            try:
                data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        entry = diary_service.update_entry(entry_id, data)
        if not entry:
            return jsonify({'error': 'Diary entry not found'}), 404
        
        return jsonify({
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'grams': entry.grams,
            'food_id': entry.food_id,
            'food_name': entry.food.name if entry.food else None,
            'nutrition': diary_service.calculate_entry_nutrition(entry)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/<int:entry_id>', methods=['DELETE'])
@diary_bp.route('/<int:entry_id>/', methods=['DELETE'])
def delete_diary_entry(entry_id):
    """Delete a diary entry."""
    try:
        success = diary_service.delete_entry(entry_id)
        if not success:
            return jsonify({'error': 'Diary entry not found'}), 404
        
        return jsonify({'message': 'Diary entry deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
