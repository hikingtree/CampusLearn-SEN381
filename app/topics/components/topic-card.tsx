import React, { useState } from "react";
import Link from "next/link";

interface TopicCardProps {
    id: string;
    image: string;
    category: string;
    tutorName: string;
    tutorImg: string;
    topicName: string;
    description: string;
    details?: string; // more course info for modal
}

const TopicCard = ({ id, image, category, tutorName, tutorImg, topicName, description, details }: TopicCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <>
      {/* Topic Card */}
      <div className="bg-surface rounded-xl shadow-md overflow-hidden">
        <div className="relative">
          <img src={image} alt={topicName} className="w-full h-48 object-cover" />
          <span className="absolute top-2 right-2 bg-accent-1 text-white px-2 py-1 rounded text-sm">
            {category}
          </span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <img src={tutorImg} alt={tutorName} className="w-8 h-8 rounded-full" />
            <span className="font-semibold">{tutorName}</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">{topicName}</h3>
          <p className="text-text-secondary mb-4">{description}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-button-primary text-white px-4 py-2 rounded hover:bg-accent-2 transition-colors"
          >
            ➔
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-surface rounded-xl shadow-xl w-11/12 max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-text-secondary font-bold text-lg"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <img src={image} alt={topicName} className="w-full md:w-1/3 h-48 object-cover rounded" />
              <div className="flex-1">
                <span className="bg-accent-1 text-white px-2 py-1 rounded text-sm">{category}</span>
                <h2 className="text-2xl font-semibold mt-2">{topicName}</h2>
                <div className="flex items-center gap-2 my-2">
                  <img src={tutorImg} alt={tutorName} className="w-10 h-10 rounded-full" />
                  <span className="font-semibold">{tutorName}</span>
                </div>
                <p className="text-text-secondary">{details || description}</p>
                <div className="flex gap-4 mt-6 justify-end">
                 <Link href={`/topic/${id}`}>
                    <a className="bg-button-primary text-white px-4 py-2 rounded hover:bg-accent-2 transition-colors">
                    View
                    </a>
                </Link>
                <button
                    className={`px-4 py-2 rounded ${subscribed ? "bg-red-400 text-white" : "bg-accent-1 text-white"} hover:opacity-90 transition`}
                    onClick={() => setSubscribed(!subscribed)}
                > 
                {subscribed ? "Unsubscribe" : "Subscribe"}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopicCard;
