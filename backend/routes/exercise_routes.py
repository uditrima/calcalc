from flask import Blueprint, request, jsonify
from services.exercise_service import ExerciseService
from datetime import datetime

exercise_bp = Blueprint('exercise', __name__, url_prefix='/api/exercises')
exercise_service = ExerciseService()

@exercise_bp.route('/<date>', methods=['GET'])
@exercise_bp.route('/<date>/', methods=['GET'])
def get_exercises_by_date(date):
    """Get all exercises for a specific date."""
    try:
        # Parse date string to date object
        target_date = datetime.strptime(date, '%Y-%m-%d').date()
        
        exercises = exercise_service.get_exercises_by_date(target_date)
        
        # Convert to dict format for JSON response
        exercises_data = []
        for exercise in exercises:
            exercise_dict = {
                'id': exercise.id,
                'name': exercise.name,
                'duration_minutes': exercise.duration_minutes,
                'calories_burned': exercise.calories_burned,
                'date': exercise.date.isoformat()
            }
            exercises_data.append(exercise_dict)
        
        return jsonify({
            'success': True,
            'data': exercises_data,
            'date': date
        }), 200
        
    except ValueError:
        return jsonify({
            'success': False,
            'error': 'Invalid date format. Use YYYY-MM-DD'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@exercise_bp.route('/', methods=['POST'])
def add_exercise():
    """Create a new exercise entry."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'duration_minutes', 'calories_burned']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Parse date if provided, otherwise use today
        target_date = None
        if 'date' in data:
            target_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        
        # Create exercise
        exercise = exercise_service.add_exercise(
            name=data['name'],
            duration_minutes=data['duration_minutes'],
            calories_burned=data['calories_burned'],
            target_date=target_date
        )
        
        return jsonify({
            'success': True,
            'data': {
                'id': exercise.id,
                'name': exercise.name,
                'duration_minutes': exercise.duration_minutes,
                'calories_burned': exercise.calories_burned,
                'date': exercise.date.isoformat()
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

@exercise_bp.route('/<int:exercise_id>', methods=['PUT'])
@exercise_bp.route('/<int:exercise_id>/', methods=['PUT'])
def update_exercise(exercise_id):
    """Update an existing exercise entry."""
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
        
        # Update exercise
        exercise = exercise_service.update_exercise(exercise_id, data)
        
        if not exercise:
            return jsonify({
                'success': False,
                'error': 'Exercise not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': {
                'id': exercise.id,
                'name': exercise.name,
                'duration_minutes': exercise.duration_minutes,
                'calories_burned': exercise.calories_burned,
                'date': exercise.date.isoformat()
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

@exercise_bp.route('/<int:exercise_id>', methods=['DELETE'])
@exercise_bp.route('/<int:exercise_id>/', methods=['DELETE'])
def delete_exercise(exercise_id):
    """Delete an exercise entry."""
    try:
        success = exercise_service.delete_exercise(exercise_id)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Exercise not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Exercise deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
