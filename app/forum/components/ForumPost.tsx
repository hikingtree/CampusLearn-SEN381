import React from "react";

interface ForumPostProps {
  author: string;
  topic: string;
  title: string;
  content: string;
  date: string;
  upvotes: number;
}

const ForumPost: React.FC<ForumPostProps> = ({ author, topic, title, content, date, upvotes }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg">{title}</h4>
        <span className="text-gray-500 text-sm">{date}</span>
      </div>
      <p className="text-gray-700 mb-2">{content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>By {author} in {topic}</span>
        <span>👍 {upvotes}</span>
      </div>
    </div>
  );
};

export default ForumPost;
