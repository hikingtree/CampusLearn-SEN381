"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] px-6">
      {/* Hero Image and Title */}
      <div className="text-center animate-fade-in">
        <div className="relative w-64 h-64 mx-auto mb-6">
          <Image
            src="/assets/dashboard-image.jpg" // replace with your image path
            alt="Campus Learn Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-2)] mb-4">
          Campus Learn
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-md mx-auto">
          Empowering students and tutors to connect, learn, and grow together.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center">
          <Link href="/pages/sign-in">
            <button className="px-8 py-3 rounded-full font-semibold text-[var(--color-text-primary)] bg-[var(--color-button-primary)] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
              Login
            </button>
          </Link>

          <Link href="/pages/sign-up">
            <button className="px-8 py-3 rounded-full font-semibold text-[var(--color-text-primary)] bg-[var(--color-button-secondary)] hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
        {/* Footer */}
      <Footer />
      
    </main>
  );
}
