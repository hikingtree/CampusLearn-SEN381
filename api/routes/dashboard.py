from flask import Blueprint, jsonify
from services.database import db_manager
from datetime import date

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard', methods=['GET'])
def get_todays_lessons():
    try:
        today = date.today()
        query = """
            SELECT lesson_id, teacher_name, student_name, lesson_date, location
            FROM campuslearn.lesson_details
            WHERE DATE(lesson_date) = %s
            ORDER BY lesson_date
        """
        lessons = db_manager.fetch_all(query, (today,))

        result = []
        for lesson in lessons:
            result.append({
                'lesson_id': lesson[0],
                'teacher_name': lesson[1],
                'student_name': lesson[2],
                'lesson_date': lesson[3].isoformat(),
                'location': lesson[4]
            })

        return jsonify({'lessons': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
