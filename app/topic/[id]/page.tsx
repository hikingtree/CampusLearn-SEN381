"use client";

import React, { useState } from "react";

interface Resource {
  name: string;
  type: string;
  link: string;
}

interface Note {
  page: string;
}

interface TopicDetailProps {
  topic: {
    image: string;
    category: string;
    tutorName: string;
    tutorImg: string;
    topicName: string;
    description: string;
    notes: Note[];
    resources: Resource[];
  };
}

const TopicDetailPage: React.FC<TopicDetailProps> = ({ topic }) => {
  const [noteIndex, setNoteIndex] = useState(0);
  const [sortNewest, setSortNewest] = useState(true);

  const sortedResources = [...topic.resources].sort((a, b) =>
    sortNewest ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  );

  return (
    <div className="p-6">
      {/* Topic Image */}
      <div className="w-full h-64 sm:h-96 relative mb-6">
        <img
          src={topic.image}
          alt={topic.topicName}
          className="object-cover w-full h-full rounded-lg shadow-md"
        />
      </div>

      {/* Tutor Info + Topic Name/Description */}
      <div className="flex items-center mb-6">
        <img
          src={topic.tutorImg}
          alt={topic.tutorName}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 className="text-xl font-bold">{topic.topicName}</h2>
          <p className="text-gray-600">{topic.tutorName}</p>
        </div>
      </div>

      <p className="mb-6 text-gray-700">{topic.description}</p>

      {/* Notes Block */}
      <div className="mb-6 border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Notes</h3>
          <div>
            <button
              onClick={() => setNoteIndex((prev) => Math.max(prev - 1, 0))}
              className="px-3 py-1 bg-gray-200 rounded-l"
            >
              ◀
            </button>
            <button
              onClick={() =>
                setNoteIndex((prev) => Math.min(prev + 1, topic.notes.length - 1))
              }
              className="px-3 py-1 bg-gray-200 rounded-r"
            >
              ▶
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded">{topic.notes[noteIndex]?.page}</div>
      </div>

      {/* Resources Block */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Resources</h3>
          <select
            value={sortNewest ? "newest" : "oldest"}
            onChange={(e) => setSortNewest(e.target.value === "newest")}
            className="border rounded px-2 py-1"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedResources.map((res, index) => (
            <div
              key={index}
              className="border rounded p-3 flex flex-col justify-between h-32"
            >
              <div>
                <h4 className="font-semibold">{res.name}</h4>
                <p className="text-gray-500">{res.type}</p>
              </div>
              <a
                href={res.link}
                download
                className="mt-2 px-3 py-1 bg-accent-2 rounded text-white text-sm text-center"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
