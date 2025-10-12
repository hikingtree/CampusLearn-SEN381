import Link from 'next/link';

import React from "react";
import { FaEnvelope, FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
      {/* Left side: Logo + Links */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-primary">CampusLearn</div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-text-primary font-semibold">
          <a href="/dashboard" className="hover:text-accent-2 transition-colors">
            Dashboard
          </a>
          <a href="/topics" className="hover:text-accent-2 transition-colors">
            Topics
          </a>
          <a href="/forum" className="hover:text-accent-2 transition-colors">
            Forum
          </a>
          <a href="/ai-chatbot" className="hover:text-accent-2 transition-colors">
            AI Chat
          </a>
        </div>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center space-x-6 text-xl text-text-primary">
        <FaEnvelope className="cursor-pointer hover:text-accent-2 transition-colors" />
        <FaBell className="cursor-pointer hover:text-accent-2 transition-colors" />
        <FaUserCircle className="cursor-pointer hover:text-accent-2 transition-colors" />
      </div>
    </nav>
  );
};

export default Navbar;

