import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-surface border-b border-gray-200 p-4">
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-button-primary text-text-primary rounded hover:opacity-80"
        >
          Dashboard
        </Link>
        <Link
          href="/create-lesson"
          className="px-4 py-2 bg-button-secondary text-text-primary rounded hover:opacity-80"
        >
          Create Lesson
        </Link>
      </div>
    </nav>
  );
}
