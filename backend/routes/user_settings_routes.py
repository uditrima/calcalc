from flask import Blueprint, request, jsonify
from services.user_settings_service import UserSettingsService
from datetime import date

user_settings_bp = Blueprint('user_settings', __name__)

@user_settings_bp.route('/api/user-settings', methods=['GET'])
def get_user_settings():
    """Get current user settings"""
    try:
        settings = UserSettingsService.get_or_create_settings()
        return jsonify({
            'success': True,
            'data': settings.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_settings_bp.route('/api/user-settings', methods=['PUT'])
def update_user_settings():
    """Update user settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        settings = UserSettingsService.update_settings(data)
        return jsonify({
            'success': True,
            'data': settings.to_dict(),
            'message': 'Settings updated successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_settings_bp.route('/api/user-settings', methods=['DELETE'])
def delete_user_settings():
    """Delete user settings"""
    try:
        success = UserSettingsService.delete_settings()
        if success:
            return jsonify({
                'success': True,
                'message': 'Settings deleted successfully'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to delete settings'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_settings_bp.route('/api/user-settings/personal-metrics', methods=['PUT'])
def update_personal_metrics():
    """Update only personal metrics"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Only allow personal metrics fields
        allowed_fields = [
            'height_cm', 'starting_weight_kg', 'starting_weight_date',
            'current_weight_kg', 'goal_weight_kg', 'weekly_goal_kg'
        ]
        
        filtered_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        settings = UserSettingsService.update_settings(filtered_data)
        return jsonify({
            'success': True,
            'data': settings.to_dict(),
            'message': 'Personal metrics updated successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_settings_bp.route('/api/user-settings/nutrition-goals', methods=['PUT'])
def update_nutrition_goals():
    """Update only nutrition goals settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Only allow nutrition goals fields
        allowed_fields = [
            'customize_daily_goals', 'calorie_goals_by_meal',
            'show_nutrients_by_meal', 'show_nutrients_as_percent',
            'additional_nutrient_goals'
        ]
        
        filtered_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        settings = UserSettingsService.update_settings(filtered_data)
        return jsonify({
            'success': True,
            'data': settings.to_dict(),
            'message': 'Nutrition goals updated successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@user_settings_bp.route('/api/user-settings/fitness-goals', methods=['PUT'])
def update_fitness_goals():
    """Update only fitness goals settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Only allow fitness goals fields
        allowed_fields = [
            'workouts_per_week', 'minutes_per_workout',
            'adjust_daily_goals_on_exercise'
        ]
        
        filtered_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        settings = UserSettingsService.update_settings(filtered_data)
        return jsonify({
            'success': True,
            'data': settings.to_dict(),
            'message': 'Fitness goals updated successfully'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
