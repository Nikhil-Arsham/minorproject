import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Example images (replace with your own if you want)
const heroImg = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80";
const exploreImg = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80";
const communityImg = "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80";
const companyImg = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80";
const logo = "https://img.icons8.com/color/96/000000/source-code.png"; // Example logo

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="CSCode Logo" className="h-10 w-10" />
            <span className="text-2xl font-extrabold text-blue-700 tracking-tight">CSCode</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="#" className="text-gray-700 font-medium hover:text-blue-600 transition">Premium</Link>
            <Link to="#" className="text-gray-700 font-medium hover:text-blue-600 transition">Explore</Link>
            <Link to="#" className="text-gray-700 font-medium hover:text-blue-600 transition">Product</Link>
          </div>
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Premium</Link>
            <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Explore</Link>
            <Link to="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">Product</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto pt-28 pb-12 px-4 sm:px-8 gap-8">
        <div className="w-full md:w-1/2 flex flex-col items-start space-y-6 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            A New Way to <span className="text-blue-600">Learn</span>
          </h1>
          <p className="text-lg text-gray-600">
            CSCode is the best platform to help you enhance your skills, expand your knowledge and prepare for technical interviews.
          </p>
          <Link
            to="/signup"
            className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 animate-bounce"
          >
            Get Started
          </Link>
        </div>
        <div className="w-full md:w-1/2 flex justify-center animate-fadeInUp">
          <img src={heroImg} alt="Hero" className="rounded-2xl shadow-2xl w-full max-w-md object-cover" />
        </div>
      </section>

      {/* Explore Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2 animate-fadeInLeft">
          <img src={exploreImg} alt="Explore" className="rounded-xl shadow-lg w-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 space-y-4 animate-fadeInRight">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Start Exploring</h2>
          <p className="text-gray-600">
            Explore is a well-organized tool that helps you get the most out of CSCode by providing structure to guide your progress towards the next step in your programming career.
          </p>
        </div>
      </section>

      {/* Community & Contests Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
          <img src={communityImg} alt="Community" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
          <h2 className="text-2xl font-bold text-purple-700">Questions, Community & Contests</h2>
          <p className="text-gray-600">
            Over 3800 questions for you to practice. Join one of the largest tech communities and participate in our contests to challenge yourself and earn rewards.
          </p>
          <Link
            to="/questions"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            View Questions &rarr;
          </Link>
        </div>
        <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
          <img src={companyImg} alt="Companies" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
          <h2 className="text-2xl font-bold text-purple-700">Companies & Candidates</h2>
          <p className="text-gray-600">
            Not only does CSCode prepare candidates for technical hackathons, we also help companies identify top technical talent. From sponsoring contests to providing online assessments and training, we offer numerous services to businesses.
          </p>
          <Link
            to="/contests"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            Contests &rarr;
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <img src={logo} alt="CSCode Logo" className="h-8 w-8" />
            <span className="font-bold text-lg">CSCode</span>
          </div>
          <div className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} CSCode. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fadeIn { animation: fadeIn 1s ease; }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(60px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1); }
          @keyframes fadeInLeft {
            from { opacity: 0; transform: translateX(-40px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fadeInLeft { animation: fadeInLeft 1.2s cubic-bezier(.4,0,.2,1); }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(40px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fadeInRight { animation: fadeInRight 1.2s cubic-bezier(.4,0,.2,1); }
        `}
      </style>
    </div>
  );
};

export default Landing;