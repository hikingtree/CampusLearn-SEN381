import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TopDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {/* Announcement Box */}
      <div className="bg-surface p-6 rounded-xl shadow-md flex-1">
        <h2 className="text-xl font-semibold mb-4">Announcements</h2>
        <p>Welcome to CampusLearn! Don't forget to check out the upcoming workshops.</p>
      </div>

      {/* Calendar Box */}
      <div className="bg-surface p-6 rounded-xl shadow-md flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Calendar</h2>
          <div className="flex items-center gap-2 text-text-secondary">
            <FaChevronLeft className="cursor-pointer" />
            <FaChevronRight className="cursor-pointer" />
          </div>
        </div>

        {/* Simple calendar placeholder */}
        <div className="border rounded-md h-64 mb-4 flex items-center justify-center text-text-secondary">
          {/* You can replace this with a proper calendar library later */}
          Calendar goes here
        </div>

        {/* Upcoming events */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Upcoming Events</h3>
          <ul className="list-disc list-inside text-text-secondary">
            <li>BIT Assignment Deadline - Sep 20</li>
            <li>BCom Workshop - Sep 22</li>
          </ul>
        </div>

        <button className="bg-button-primary text-white py-2 px-4 rounded hover:bg-accent-2 transition-colors">
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default TopDashboard;
