CREATE OR REPLACE FUNCTION campuslearn.create_lesson(
    p_teacher_id INTEGER,
    p_student_id INTEGER,
    p_lesson_date TIMESTAMP,
    p_location VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    new_lesson_id INTEGER;
BEGIN
    INSERT INTO campuslearn.lessons (teacher_id, student_id, lesson_date, location)
    VALUES (p_teacher_id, p_student_id, p_lesson_date, p_location)
    RETURNING lesson_id INTO new_lesson_id;
    
    RETURN new_lesson_id;
END;
$$ LANGUAGE plpgsql;
