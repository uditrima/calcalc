from flask import Blueprint, request, jsonify
from services.weight_service import WeightService

weight_bp = Blueprint('weight', __name__, url_prefix='/api/weight')
weight_service = WeightService()

@weight_bp.route('/', methods=['GET'])
def get_weight_history():
    # TODO: implement get weight history
    pass

@weight_bp.route('/', methods=['POST'])
def add_weight_entry():
    # TODO: implement add weight entry
    pass

@weight_bp.route('/<int:weight_id>', methods=['PUT'])
def update_weight_entry(weight_id):
    # TODO: implement update weight entry
    pass

@weight_bp.route('/<int:weight_id>', methods=['DELETE'])
def delete_weight_entry(weight_id):
    # TODO: implement delete weight entry
    pass
