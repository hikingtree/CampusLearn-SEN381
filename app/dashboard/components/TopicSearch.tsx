import React from "react";

const TopicSearch = () => {
  return (
    <div className="bg-surface p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">What do you want to learn?</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Find courses, skills, etc."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-1"
        />
        <select className="border border-gray-300 rounded px-4 py-2">
          <option>All Topics</option>
          <option>BCom</option>
          <option>BIT</option>
          <option>Diploma</option>
        </select>
        <button className="bg-button-primary text-white px-4 py-2 rounded hover:bg-accent-2 transition-colors">
          Search
        </button>
      </div>
    </div>
  );
};

export default TopicSearch;
