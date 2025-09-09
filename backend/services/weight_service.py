from db.models.weight import Weight
from db.database import db
from datetime import date

class WeightService:
    def __init__(self):
        self.db = db
    
    def get_weights(self):
        """Return all weight entries ordered by date."""
        return Weight.query.order_by(Weight.date.desc()).all()
    
    def add_weight(self, target_date, weight_kg):
        """Create a new weight entry."""
        if target_date is None:
            target_date = date.today()
        
        weight_entry = Weight(
            date=target_date,
            weight_kg=weight_kg
        )
        
        self.db.session.add(weight_entry)
        self.db.session.commit()
        return weight_entry
    
    def update_weight(self, entry_id, data):
        """Update an existing weight entry."""
        weight_entry = Weight.query.get(entry_id)
        if not weight_entry:
            return None
        
        # Update fields if provided
        if 'weight_kg' in data:
            weight_entry.weight_kg = data['weight_kg']
        if 'date' in data:
            weight_entry.date = data['date']
        
        self.db.session.commit()
        return weight_entry
    
    def delete_weight(self, entry_id):
        """Delete a weight entry."""
        weight_entry = Weight.query.get(entry_id)
        if not weight_entry:
            return False
        
        self.db.session.delete(weight_entry)
        self.db.session.commit()
        return True
