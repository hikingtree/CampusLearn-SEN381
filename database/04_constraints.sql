ALTER TABLE campuslearn.teachers
    ADD CONSTRAINT uq_teachers_email UNIQUE (email);

ALTER TABLE campuslearn.students
    ADD CONSTRAINT uq_students_email UNIQUE (email);

ALTER TABLE campuslearn.lessons
    ADD CONSTRAINT fk_lessons_teacher FOREIGN KEY (teacher_id) REFERENCES campuslearn.teachers(teacher_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_lessons_student FOREIGN KEY (student_id) REFERENCES campuslearn.students(student_id) ON DELETE CASCADE;
