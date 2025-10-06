CREATE TABLE campuslearn.teachers (
    teacher_id INTEGER PRIMARY KEY DEFAULT nextval('campuslearn.teachers_id_seq'),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campuslearn.students (
    student_id INTEGER PRIMARY KEY DEFAULT nextval('campuslearn.students_id_seq'),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campuslearn.lessons (
    lesson_id INTEGER PRIMARY KEY DEFAULT nextval('campuslearn.lessons_id_seq'),
    teacher_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    lesson_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
