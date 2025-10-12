"use client";

import React from "react";
import TopDashboard from "./components/TopDashboard";
import TopicSearch from "./components/TopicSearch";
import TopicCardList from "./components/TopicCardList";

interface User {
  name: string;
  role: "student" | "tutor";
}

const DashboardPage: React.FC<{ user: User }> = ({ user }) => {
  return (
    
    <div>

      {/* Announcement Box */}
      <div className="announcement-box">
        {user?.role === "tutor" && (
  <button className="bg-accent-2 px-4 py-2 rounded">New Announcement</button>
)}
      </div>

        <div className="p-8">
            <TopDashboard />
            <TopicSearch />
            <TopicCardList />
        </div>
    </div>
  );
};

export default DashboardPage;
