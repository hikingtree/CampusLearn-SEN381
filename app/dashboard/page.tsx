'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';

interface Lesson {
  lesson_id: number;
  teacher_name: string;
  student_name: string;
  lesson_date: string;
  location: string;
}

export default function Dashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setLessons(data.lessons || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="p-8">
        <h1 className="text-text-primary text-4xl mb-8">Today's Lessons</h1>

        {loading ? (
          <p className="text-text-secondary">Loading...</p>
        ) : lessons.length === 0 ? (
          <p className="text-text-secondary">No lessons scheduled for today</p>
        ) : (
          <div className="bg-surface rounded-lg shadow">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 text-text-primary">Teacher</th>
                  <th className="text-left p-4 text-text-primary">Student</th>
                  <th className="text-left p-4 text-text-primary">Time</th>
                  <th className="text-left p-4 text-text-primary">Location</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map(lesson => (
                  <tr key={lesson.lesson_id} className="border-b last:border-b-0">
                    <td className="p-4 text-text-primary">{lesson.teacher_name}</td>
                    <td className="p-4 text-text-primary">{lesson.student_name}</td>
                    <td className="p-4 text-text-secondary">
                      {new Date(lesson.lesson_date).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-text-secondary">{lesson.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
