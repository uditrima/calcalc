from flask import Blueprint, request, jsonify
from datetime import date, datetime
from sqlalchemy.orm import sessionmaker
from db.database import engine
from db.models.diary_entry_improved import DiaryEntry
from db.models.food import Food
from db.models.meal_types import MealType
from db.models.diary_helpers import DiaryHelpers

diary_bp = Blueprint('diary', __name__)

# Create session
Session = sessionmaker(bind=engine)

@diary_bp.route('/diary/entries', methods=['GET'])
def get_diary_entries():
    """Get diary entries for a specific date"""
    target_date = request.args.get('date')
    meal_type = request.args.get('meal_type')
    
    if not target_date:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    session = Session()
    try:
        if meal_type:
            if not MealType.is_valid(meal_type):
                return jsonify({'error': 'Invalid meal type'}), 400
            entries = DiaryHelpers.get_meal_entries(session, target_date, meal_type)
        else:
            entries = session.query(DiaryEntry).filter(DiaryEntry.date == target_date).all()
        
        result = []
        for entry in entries:
            result.append({
                'id': entry.id,
                'date': entry.date.isoformat(),
                'meal_type': entry.meal_type,
                'food_id': entry.food_id,
                'food_name': entry.food.name,
                'amount_grams': entry.amount_grams,
                'calories': entry.calories,
                'protein': entry.protein,
                'carbohydrates': entry.carbohydrates,
                'fat': entry.fat,
                'notes': entry.notes,
                'created_at': entry.created_at.isoformat()
            })
        
        return jsonify(result)
    
    finally:
        session.close()

@diary_bp.route('/diary/entries', methods=['POST'])
def add_diary_entry():
    """Add a new diary entry"""
    data = request.get_json()
    
    required_fields = ['food_id', 'date', 'meal_type', 'amount_grams']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    if not MealType.is_valid(data['meal_type']):
        return jsonify({'error': 'Invalid meal type'}), 400
    
    try:
        target_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    session = Session()
    try:
        # Get the food item
        food = session.query(Food).filter(Food.id == data['food_id']).first()
        if not food:
            return jsonify({'error': 'Food not found'}), 404
        
        # Create diary entry
        entry = DiaryEntry(
            date=target_date,
            meal_type=data['meal_type'],
            food_id=data['food_id'],
            amount_grams=data['amount_grams'],
            notes=data.get('notes')
        )
        
        # Calculate nutritional values
        entry.calculate_nutrition(food)
        
        # Update food's last_used timestamp
        food.last_used = int(datetime.now().timestamp())
        food.used = (food.used or 0) + 1
        
        session.add(entry)
        session.commit()
        
        return jsonify({
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'food_id': entry.food_id,
            'food_name': food.name,
            'amount_grams': entry.amount_grams,
            'calories': entry.calories,
            'protein': entry.protein,
            'carbohydrates': entry.carbohydrates,
            'fat': entry.fat,
            'notes': entry.notes,
            'created_at': entry.created_at.isoformat()
        }), 201
    
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        session.close()

@diary_bp.route('/diary/entries/<int:entry_id>', methods=['PUT'])
def update_diary_entry(entry_id):
    """Update a diary entry"""
    data = request.get_json()
    
    session = Session()
    try:
        entry = session.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        # Update fields
        if 'amount_grams' in data:
            entry.amount_grams = data['amount_grams']
            # Recalculate nutritional values
            entry.calculate_nutrition(entry.food)
        
        if 'meal_type' in data:
            if not MealType.is_valid(data['meal_type']):
                return jsonify({'error': 'Invalid meal type'}), 400
            entry.meal_type = data['meal_type']
        
        if 'notes' in data:
            entry.notes = data['notes']
        
        entry.updated_at = datetime.utcnow()
        session.commit()
        
        return jsonify({
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'food_id': entry.food_id,
            'food_name': entry.food.name,
            'amount_grams': entry.amount_grams,
            'calories': entry.calories,
            'protein': entry.protein,
            'carbohydrates': entry.carbohydrates,
            'fat': entry.fat,
            'notes': entry.notes,
            'updated_at': entry.updated_at.isoformat()
        })
    
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        session.close()

@diary_bp.route('/diary/entries/<int:entry_id>', methods=['DELETE'])
def delete_diary_entry(entry_id):
    """Delete a diary entry"""
    session = Session()
    try:
        entry = session.query(DiaryEntry).filter(DiaryEntry.id == entry_id).first()
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        session.delete(entry)
        session.commit()
        
        return jsonify({'message': 'Entry deleted successfully'})
    
    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        session.close()

@diary_bp.route('/diary/summary', methods=['GET'])
def get_daily_summary():
    """Get daily nutritional summary"""
    target_date = request.args.get('date')
    
    if not target_date:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    session = Session()
    try:
        summary = DiaryHelpers.get_daily_summary(session, target_date)
        return jsonify(summary)
    
    finally:
        session.close()

@diary_bp.route('/diary/recent-foods', methods=['GET'])
def get_recent_foods():
    """Get recently used foods"""
    days = int(request.args.get('days', 7))
    limit = int(request.args.get('limit', 20))
    
    session = Session()
    try:
        foods = DiaryHelpers.get_recent_foods(session, days, limit)
        
        result = []
        for food in foods:
            result.append({
                'id': food.id,
                'name': food.name,
                'brand': food.brand,
                'category': food.category,
                'calories': food.calories,
                'last_used': food.last_used,
                'used_count': food.used
            })
        
        return jsonify(result)
    
    finally:
        session.close()
