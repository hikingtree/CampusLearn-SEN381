from flask import Blueprint, jsonify, request
from services.database import db_manager

create_lesson_bp = Blueprint('create_lesson', __name__)

@create_lesson_bp.route('/api/teachers', methods=['GET'])
def get_teachers():
    try:
        query = "SELECT teacher_id, first_name, last_name, email FROM campuslearn.teachers ORDER BY last_name, first_name"
        teachers = db_manager.fetch_all(query)

        result = []
        for teacher in teachers:
            result.append({
                'teacher_id': teacher[0],
                'first_name': teacher[1],
                'last_name': teacher[2],
                'email': teacher[3]
            })

        return jsonify({'teachers': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@create_lesson_bp.route('/api/students', methods=['GET'])
def get_students():
    try:
        query = "SELECT student_id, first_name, last_name, email FROM campuslearn.students ORDER BY last_name, first_name"
        students = db_manager.fetch_all(query)

        result = []
        for student in students:
            result.append({
                'student_id': student[0],
                'first_name': student[1],
                'last_name': student[2],
                'email': student[3]
            })

        return jsonify({'students': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@create_lesson_bp.route('/api/lessons', methods=['POST'])
def create_lesson():
    try:
        data = request.json
        query = "SELECT campuslearn.create_lesson(%s, %s, %s, %s)"
        result = db_manager.fetch_one(query, (
            data['teacher_id'],
            data['student_id'],
            data['lesson_date'],
            data['location']
        ))

        return jsonify({'lesson_id': result[0], 'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
