from flask import Blueprint, request, jsonify
from services.exercise_service import ExerciseService

exercise_bp = Blueprint('exercise', __name__, url_prefix='/api/exercise')
exercise_service = ExerciseService()

@exercise_bp.route('/', methods=['GET'])
def get_exercises():
    # TODO: implement get exercises for date
    pass

@exercise_bp.route('/', methods=['POST'])
def add_exercise():
    # TODO: implement add exercise
    pass

@exercise_bp.route('/<int:exercise_id>', methods=['PUT'])
def update_exercise(exercise_id):
    # TODO: implement update exercise
    pass

@exercise_bp.route('/<int:exercise_id>', methods=['DELETE'])
def delete_exercise(exercise_id):
    # TODO: implement delete exercise
    pass
