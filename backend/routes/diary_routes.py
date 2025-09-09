from flask import Blueprint, request, jsonify
from services.diary_service import DiaryService

diary_bp = Blueprint('diary', __name__, url_prefix='/api/diary')
diary_service = DiaryService()

@diary_bp.route('/', methods=['GET'])
def get_diary_entries():
    # TODO: implement get diary entries for date
    pass

@diary_bp.route('/', methods=['POST'])
def add_diary_entry():
    # TODO: implement add diary entry
    pass

@diary_bp.route('/<int:entry_id>', methods=['PUT'])
def update_diary_entry(entry_id):
    # TODO: implement update diary entry
    pass

@diary_bp.route('/<int:entry_id>', methods=['DELETE'])
def delete_diary_entry(entry_id):
    # TODO: implement delete diary entry
    pass
