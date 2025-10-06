from flask import Flask, jsonify
from flask_cors import CORS
from routes.dashboard import dashboard_bp
from routes.create_lesson import create_lesson_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(dashboard_bp)
app.register_blueprint(create_lesson_bp)

@app.route('/')
def home():
    return jsonify({'message': 'CampusLearn API'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
