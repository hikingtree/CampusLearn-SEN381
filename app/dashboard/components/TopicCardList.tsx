"use client";

import React, { useEffect, useState } from "react";
import TopicCard from "./TopicCard";

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

const TopicCardList = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("/api/topics"); // your backend route
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        console.error("Failed to fetch topics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <p>Loading topics...</p>;
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((t, i) => (
          <TopicCard key={i} {...t} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button className="px-3 py-1 border rounded hover:bg-accent-1 transition-colors">◀</button>
        <span>1 / 5</span>
        <button className="px-3 py-1 border rounded hover:bg-accent-1 transition-colors">▶</button>
      </div>
    </>
  );
};

export default TopicCardList;
