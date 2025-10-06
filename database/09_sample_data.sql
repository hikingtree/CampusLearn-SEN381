INSERT INTO campuslearn.teachers (first_name, last_name, email) VALUES
('John', 'Smith', 'john.smith@campuslearn.com'),
('Sarah', 'Johnson', 'sarah.johnson@campuslearn.com');

INSERT INTO campuslearn.students (first_name, last_name, email) VALUES
('Alice', 'Brown', 'alice.brown@student.com'),
('Bob', 'Davis', 'bob.davis@student.com'),
('Charlie', 'Wilson', 'charlie.wilson@student.com');

INSERT INTO campuslearn.lessons (teacher_id, student_id, lesson_date, location) VALUES
(1, 1, NOW() + INTERVAL '2 hours', 'Room 101'),
(1, 2, NOW() + INTERVAL '4 hours', 'Room 101'),
(2, 3, NOW() + INTERVAL '6 hours', 'Room 203');
