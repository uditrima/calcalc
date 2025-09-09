from flask import Blueprint, request, jsonify
from services.goals_service import GoalsService

goals_bp = Blueprint('goals', __name__, url_prefix='/api/goals')
goals_service = GoalsService()

@goals_bp.route('/', methods=['GET'])
def get_goals():
    # TODO: implement get user goals
    pass

@goals_bp.route('/', methods=['POST'])
def create_goals():
    # TODO: implement create user goals
    pass

@goals_bp.route('/<int:goals_id>', methods=['PUT'])
def update_goals(goals_id):
    # TODO: implement update user goals
    pass
