from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from db.models.food_association import FoodAssociation
from db.models.diary_entry_improved import DiaryEntry
from datetime import date, datetime
from typing import List, Dict, Tuple

class FoodAssociationService:
    def __init__(self, db: Session):
        self.db = db
    
    def update_associations_for_meal(self, meal_date: date, meal_type: str):
        """Update food associations for a specific meal"""
        # Get all food IDs for this meal on this date
        food_entries = self.db.query(DiaryEntry).filter(
            DiaryEntry.date == meal_date,
            DiaryEntry.meal_type == meal_type
        ).all()
        
        food_ids = [entry.food_id for entry in food_entries]
        
        if len(food_ids) < 2:
            return  # Need at least 2 foods to create associations
        
        # Update individual food counts
        for food_id in food_ids:
            self._update_food_count(food_id, meal_type)
        
        # Update pair associations
        for i in range(len(food_ids)):
            for j in range(i + 1, len(food_ids)):
                food1_id, food2_id = food_ids[i], food_ids[j]
                association = FoodAssociation.get_or_create(
                    self.db, meal_type, food1_id, food2_id
                )
                association.co_occurrence_count += 1
        
        # Recalculate all metrics for this meal type
        self._recalculate_metrics(meal_type)
        self.db.commit()
    
    def _update_food_count(self, food_id: int, meal_type: str):
        """Update total occurrence count for a food in a meal type"""
        # This is a simplified approach - in practice you might want to track this separately
        # For now, we'll count from diary entries
        count = self.db.query(DiaryEntry).filter(
            DiaryEntry.food_id == food_id,
            DiaryEntry.meal_type == meal_type
        ).count()
        
        # Update all associations involving this food
        associations = self.db.query(FoodAssociation).filter(
            (FoodAssociation.food1_id == food_id) | (FoodAssociation.food2_id == food_id),
            FoodAssociation.meal_type == meal_type
        ).all()
        
        for assoc in associations:
            if assoc.food1_id == food_id:
                assoc.total_occurrences_food1 = count
            if assoc.food2_id == food_id:
                assoc.total_occurrences_food2 = count
    
    def _recalculate_metrics(self, meal_type: str):
        """Recalculate confidence and support for all associations in a meal type"""
        # Get total number of meals of this type
        total_meals = self.db.query(func.count(func.distinct(DiaryEntry.date))).filter(
            DiaryEntry.meal_type == meal_type
        ).scalar() or 1
        
        # Update all associations for this meal type
        associations = self.db.query(FoodAssociation).filter(
            FoodAssociation.meal_type == meal_type
        ).all()
        
        for assoc in associations:
            assoc.update_metrics(total_meals)
    
    def get_recommendations(self, food_id: int, meal_type: str, limit: int = 5) -> List[Dict]:
        """Get food recommendations based on associations"""
        associations = self.db.query(FoodAssociation).filter(
            ((FoodAssociation.food1_id == food_id) | (FoodAssociation.food2_id == food_id)),
            FoodAssociation.meal_type == meal_type,
            FoodAssociation.confidence > 0.1  # Minimum confidence threshold
        ).order_by(desc(FoodAssociation.confidence)).limit(limit).all()
        
        recommendations = []
        for assoc in associations:
            # Get the other food (not the input food)
            other_food_id = assoc.food2_id if assoc.food1_id == food_id else assoc.food1_id
            
            recommendations.append({
                'food_id': other_food_id,
                'confidence': assoc.confidence,
                'support': assoc.support,
                'co_occurrence_count': assoc.co_occurrence_count
            })
        
        return recommendations
    
    def get_popular_combinations(self, meal_type: str, limit: int = 10) -> List[Dict]:
        """Get most popular food combinations for a meal type"""
        associations = self.db.query(FoodAssociation).filter(
            FoodAssociation.meal_type == meal_type,
            FoodAssociation.co_occurrence_count >= 2  # At least 2 occurrences
        ).order_by(desc(FoodAssociation.co_occurrence_count)).limit(limit).all()
        
        combinations = []
        for assoc in associations:
            combinations.append({
                'food1_id': assoc.food1_id,
                'food2_id': assoc.food2_id,
                'co_occurrence_count': assoc.co_occurrence_count,
                'confidence': assoc.confidence,
                'support': assoc.support
            })
        
        return combinations
    
    def get_meal_insights(self, meal_type: str) -> Dict:
        """Get insights about food patterns in a meal type"""
        total_associations = self.db.query(FoodAssociation).filter(
            FoodAssociation.meal_type == meal_type
        ).count()
        
        high_confidence = self.db.query(FoodAssociation).filter(
            FoodAssociation.meal_type == meal_type,
            FoodAssociation.confidence > 0.5
        ).count()
        
        most_popular = self.get_popular_combinations(meal_type, 1)
        
        return {
            'total_associations': total_associations,
            'high_confidence_pairs': high_confidence,
            'most_popular_combination': most_popular[0] if most_popular else None
        }
