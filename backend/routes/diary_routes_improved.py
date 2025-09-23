from flask import Blueprint, request, jsonify
from datetime import date, datetime
from db.database import db
from db.models.diary_entry_simple import DiaryEntry
from db.models.food import Food
from db.models.meal_types import MealType

diary_bp = Blueprint('diary', __name__)

@diary_bp.route('/entries', methods=['GET'])
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
    
    try:
        if meal_type:
            entries = DiaryEntry.query.filter(
                DiaryEntry.date == target_date,
                DiaryEntry.meal_type == meal_type
            ).all()
        else:
            entries = DiaryEntry.query.filter(DiaryEntry.date == target_date).all()
        
        result = []
        for entry in entries:
            # Calculate calories based on grams and food data
            multiplier = entry.grams / 100.0
            food = Food.query.get(entry.food_id)
            if food:
                calc_calories = food.calories * multiplier
                calc_protein = food.protein * multiplier
                calc_carbs = food.carbohydrates * multiplier
                calc_fat = food.fat * multiplier
            else:
                calc_calories = calc_protein = calc_carbs = calc_fat = 0
            
            result.append({
                'id': entry.id,
                'date': entry.date.isoformat(),
                'meal_type': entry.meal_type,
                'food_id': entry.food_id,
                'food_name': food.name if food else 'Unknown',
                'amount_grams': entry.grams,
                'calories': calc_calories,
                'protein': calc_protein,
                'carbohydrates': calc_carbs,
                'fat': calc_fat,
                'notes': getattr(entry, 'notes', None),
                'created_at': getattr(entry, 'created_at', datetime.now()).isoformat()
            })
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/entries', methods=['POST'])
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
    
    try:
        # Get the food item
        food = Food.query.filter(Food.id == data['food_id']).first()
        if not food:
            return jsonify({'error': 'Food not found'}), 404
        
        # Calculate nutritional values
        multiplier = data['amount_grams'] / 100.0
        calc_calories = food.calories * multiplier
        calc_protein = food.protein * multiplier
        calc_carbs = food.carbohydrates * multiplier
        calc_fat = food.fat * multiplier
        
        # Create diary entry (simple model only has grams field)
        entry = DiaryEntry(
            date=target_date,
            meal_type=data['meal_type'],
            food_id=data['food_id'],
            grams=data['amount_grams']  # Simple model uses 'grams' field
        )
        
        # Add to database
        db.session.add(entry)
        
        # Update food's last_used timestamp
        food.last_used = int(datetime.now().timestamp())
        food.used = (food.used or 0) + 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'food_id': entry.food_id,
            'food_name': food.name,
            'amount_grams': entry.grams,  # Simple model uses 'grams' field
            'calories': calc_calories,
            'protein': calc_protein,
            'carbohydrates': calc_carbs,
            'fat': calc_fat,
            'created_at': datetime.now().isoformat()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/entries/<int:entry_id>', methods=['PUT'])
def update_diary_entry(entry_id):
    """Update a diary entry"""
    data = request.get_json()
    
    print(f"Updating diary entry {entry_id} with data: {data}")
    
    try:
        entry = DiaryEntry.query.filter(DiaryEntry.id == entry_id).first()
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        # Update fields
        if 'amount_grams' in data:
            entry.grams = data['amount_grams']
        
        if 'meal_type' in data:
            if not MealType.is_valid(data['meal_type']):
                return jsonify({'error': 'Invalid meal type'}), 400
            entry.meal_type = data['meal_type']
        
        if 'food_id' in data:
            # Verify the food exists
            food = Food.query.get(data['food_id'])
            if not food:
                return jsonify({'error': 'Food not found'}), 404
            entry.food_id = data['food_id']
        
        if 'notes' in data:
            entry.notes = data['notes']
        
        db.session.commit()
        
        # Get food for response
        food = Food.query.get(entry.food_id)
        multiplier = entry.grams / 100.0
        calc_calories = food.calories * multiplier if food else 0
        calc_protein = food.protein * multiplier if food else 0
        calc_carbs = food.carbohydrates * multiplier if food else 0
        calc_fat = food.fat * multiplier if food else 0
        
        return jsonify({
            'success': True,
            'id': entry.id,
            'date': entry.date.isoformat(),
            'meal_type': entry.meal_type,
            'food_id': entry.food_id,
            'food_name': food.name if food else 'Unknown',
            'amount_grams': entry.grams,
            'calories': calc_calories,
            'protein': calc_protein,
            'carbohydrates': calc_carbs,
            'fat': calc_fat,
            'notes': entry.notes,
            'updated_at': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error updating diary entry {entry_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/entries/<int:entry_id>', methods=['DELETE'])
def delete_diary_entry(entry_id):
    """Delete a diary entry"""
    try:
        entry = DiaryEntry.query.filter(DiaryEntry.id == entry_id).first()
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Entry deleted successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/summary', methods=['GET'])
def get_daily_summary():
    """Get daily nutritional summary"""
    target_date = request.args.get('date')
    
    if not target_date:
        return jsonify({'error': 'Date parameter is required'}), 400
    
    try:
        target_date = datetime.strptime(target_date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    try:
        # Calculate daily summary manually since we don't have DiaryHelpers
        entries = DiaryEntry.query.filter(DiaryEntry.date == target_date).all()
        
        total_calories = 0
        total_protein = 0
        total_carbs = 0
        total_fat = 0
        
        for entry in entries:
            food = Food.query.get(entry.food_id)
            if food:
                multiplier = entry.grams / 100.0
                total_calories += food.calories * multiplier
                total_protein += food.protein * multiplier
                total_carbs += food.carbohydrates * multiplier
                total_fat += food.fat * multiplier
        
        summary = {
            'date': target_date.isoformat(),
            'total_calories': round(total_calories, 1),
            'total_protein': round(total_protein, 1),
            'total_carbohydrates': round(total_carbs, 1),
            'total_fat': round(total_fat, 1),
            'entry_count': len(entries)
        }
        
        return jsonify(summary)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@diary_bp.route('/recent-foods', methods=['GET'])
def get_recent_foods():
    """Get recently used foods"""
    days = int(request.args.get('days', 7))
    limit = int(request.args.get('limit', 20))
    
    try:
        # Get recent foods manually
        from datetime import timedelta
        cutoff_date = datetime.now().date() - timedelta(days=days)
        
        # Get foods that have been used recently
        foods = Food.query.filter(
            Food.last_used.isnot(None),
            Food.used > 0
        ).order_by(Food.last_used.desc()).limit(limit).all()
        
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
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
