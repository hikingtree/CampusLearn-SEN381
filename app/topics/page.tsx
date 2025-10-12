"use client";


import React, { useEffect, useState } from "react";
import TopicCard from "./components/topic-card";

interface Topic {
  id: string;
  image: string;
  category: string;
  tutorName: string;
  tutorImg: string;
  topicName: string;
  description: string;
  details?: string;
}

interface User {
  id: string;
  role: "student" | "tutor";
  subscribedTopics?: string[]; // array of topic IDs (for students)
}

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserAndTopics = async () => {
      try {
        // 1. Get logged-in user info
        const userRes = await fetch("/api/auth/me"); // backend endpoint to get current user
        const userData: User = await userRes.json();
        setUser(userData);

        // 2. Fetch all topics
        const topicsRes = await fetch("/api/topics");
        let topicsData: Topic[] = await topicsRes.json();

        // 3. Filter based on role
        if (userData.role === "student") {
          topicsData = topicsData.filter((t) =>
            userData.subscribedTopics?.includes(t.id)
          );
        } else if (userData.role === "tutor") {
          topicsData = topicsData.filter((t) => t.tutorName === userData.id); // or use a tutorId field
        }

        setTopics(topicsData);
      } catch (err) {
        console.error("Failed to fetch topics or user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTopics();
  }, []);

  if (loading) return <p>Loading topics...</p>;

  // filter by search term
  const filteredTopics = topics.filter((topic) =>
    topic.topicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Topics</h1>
        <input
          type="text"
          placeholder="Search your topics"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-accent-1"
        />
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => (
          <TopicCard key={topic.id} {...topic} />
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
