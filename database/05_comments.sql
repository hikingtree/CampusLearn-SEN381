COMMENT ON TABLE campuslearn.teachers IS 'Stores teacher information';
COMMENT ON COLUMN campuslearn.teachers.teacher_id IS 'Primary key for teachers';
COMMENT ON COLUMN campuslearn.teachers.email IS 'Unique email address for teacher';

COMMENT ON TABLE campuslearn.students IS 'Stores student information';
COMMENT ON COLUMN campuslearn.students.student_id IS 'Primary key for students';
COMMENT ON COLUMN campuslearn.students.email IS 'Unique email address for student';

COMMENT ON TABLE campuslearn.lessons IS 'Junction table linking teachers and students for scheduled lessons';
COMMENT ON COLUMN campuslearn.lessons.lesson_id IS 'Primary key for lessons';
COMMENT ON COLUMN campuslearn.lessons.teacher_id IS 'Foreign key to teachers table';
COMMENT ON COLUMN campuslearn.lessons.student_id IS 'Foreign key to students table';
COMMENT ON COLUMN campuslearn.lessons.lesson_date IS 'Date and time of the lesson';
COMMENT ON COLUMN campuslearn.lessons.location IS 'Physical or virtual location of the lesson';
