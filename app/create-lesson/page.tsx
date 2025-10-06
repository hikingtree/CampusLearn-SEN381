'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';

interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function CreateLesson() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    teacher_id: '',
    student_id: '',
    lesson_date: '',
    location: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/teachers')
      .then(res => res.json())
      .then(data => setTeachers(data.teachers || []));

    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.students || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (result.success) {
        alert('Lesson created successfully!');
        setFormData({ teacher_id: '', student_id: '', lesson_date: '', location: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Error creating lesson');
    }
  };

  return (
    <div className="min-h-screen bg--background">
      <Navbar />
      <main className="p-8">
        <h1 className="text--text-primary text-4xl mb-8">Create New Lesson</h1>

        <form onSubmit={handleSubmit} className="bg--surface rounded-lg shadow p-6 max-w-2xl">
          <div className="mb-4">
            <label className="block text--text-primary mb-2">Teacher</label>
            <select
              value={formData.teacher_id}
              onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text--text-primary mb-2">Student</label>
            <select
              value={formData.student_id}
              onChange={(e) => setFormData({...formData, student_id: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a student</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text--text-primary mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.lesson_date}
              onChange={(e) => setFormData({...formData, lesson_date: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text--text-primary mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg--button-primary text--text-primary rounded hover:opacity-80"
          >
            Create Lesson
          </button>
        </form>
      </main>
    </div>
  );
}
