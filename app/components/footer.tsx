import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] text-[var(--color-text-primary)] border-t border-gray-200 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Left Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="hover:text-[var(--color-accent-1)] transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-[var(--color-accent-1)] transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-[var(--color-accent-1)] transition">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Middle Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company Info</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[var(--color-accent-2)] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[var(--color-accent-2)] transition">
                Become a Tutor
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-[var(--color-accent-3)] transition">
                AI Chat Bot
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-200 pt-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} CampusLearn™. All rights reserved.
      </div>
    </footer>
  );
}
