from flask import Blueprint, request, jsonify
from services.food_association_service import FoodAssociationService
from db.database import db
from datetime import date

food_association_bp = Blueprint('food_associations', __name__)

@food_association_bp.route('/api/food-associations/recommendations', methods=['GET'])
def get_food_recommendations():
    """Get food recommendations based on associations"""
    try:
        food_id = request.args.get('food_id', type=int)
        meal_type = request.args.get('meal_type', 'morgenmad')
        limit = request.args.get('limit', 5, type=int)
        
        if not food_id:
            return jsonify({'error': 'food_id is required'}), 400
        
        association_service = FoodAssociationService(db.session)
        recommendations = association_service.get_recommendations(food_id, meal_type, limit)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_association_bp.route('/api/food-associations/popular-combinations', methods=['GET'])
def get_popular_combinations():
    """Get most popular food combinations for a meal type"""
    try:
        meal_type = request.args.get('meal_type', 'morgenmad')
        limit = request.args.get('limit', 10, type=int)
        
        association_service = FoodAssociationService(db.session)
        combinations = association_service.get_popular_combinations(meal_type, limit)
        
        return jsonify({
            'success': True,
            'combinations': combinations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_association_bp.route('/api/food-associations/insights', methods=['GET'])
def get_meal_insights():
    """Get insights about food patterns in a meal type"""
    try:
        meal_type = request.args.get('meal_type', 'morgenmad')
        
        association_service = FoodAssociationService(db.session)
        insights = association_service.get_meal_insights(meal_type)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@food_association_bp.route('/api/food-associations/update-meal', methods=['POST'])
def update_meal_associations():
    """Manually update associations for a specific meal"""
    try:
        data = request.get_json()
        meal_date = data.get('date')
        meal_type = data.get('meal_type')
        
        if not meal_date or not meal_type:
            return jsonify({'error': 'date and meal_type are required'}), 400
        
        # Parse date if it's a string
        if isinstance(meal_date, str):
            from datetime import datetime
            meal_date = datetime.strptime(meal_date, '%Y-%m-%d').date()
        
        association_service = FoodAssociationService(db.session)
        association_service.update_associations_for_meal(meal_date, meal_type)
        
        return jsonify({
            'success': True,
            'message': f'Associations updated for {meal_type} on {meal_date}'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
