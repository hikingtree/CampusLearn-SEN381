CREATE OR REPLACE VIEW campuslearn.lesson_details AS
SELECT 
    l.lesson_id,
    CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    l.lesson_date,
    l.location
FROM campuslearn.lessons l
INNER JOIN campuslearn.teachers t ON l.teacher_id = t.teacher_id
INNER JOIN campuslearn.students s ON l.student_id = s.student_id;
