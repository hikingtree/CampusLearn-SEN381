import React, { useState } from "react";
import ForumPost from "./components/ForumPost";

const samplePosts = [
  {
    author: "John Doe",
    topic: "Accounting",
    title: "Question about journal entries",
    content: "Can someone explain the difference between debit and credit in this example?",
    date: "2025-10-11",
    upvotes: 15,
  },
  {
    author: "Jane Smith",
    topic: "Marketing",
    title: "How to create a marketing plan",
    content: "I'm struggling with creating a marketing plan for my assignment.",
    date: "2025-10-10",
    upvotes: 8,
  },
];

const ForumPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [sortOrder, setSortOrder] = useState("newest");

  // Filter and sort posts
  const filteredPosts = samplePosts
    .filter((post) => selectedTopic === "All Topics" || post.topic === selectedTopic)
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === "trending") return b.upvotes - a.upvotes;
      return 0;
    });

  return (
    <div className="p-6">
      {/* Header Filters */}
      <div className="flex justify-between items-center mb-6">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option>All Topics</option>
          <option>Accounting</option>
          <option>Marketing</option>
          <option>BIT</option>
          <option>BCom</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="trending">Trending</option>
        </select>
      </div>

      {/* Forum Posts */}
      <div className="mb-6">
        {filteredPosts.map((post, index) => (
          <ForumPost key={index} {...post} />
        ))}
      </div>

      {/* Ask a Question Button */}
      <div className="text-center">
        <button className="bg-accent-2 text-white px-6 py-2 rounded hover:bg-accent-3 transition">
          Ask a Question
        </button>
      </div>
    </div>
  );
};

export default ForumPage;
