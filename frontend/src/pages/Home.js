import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = ({ isLoggedIn }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('`${process.env.REACT_APP_API_URL}`/announcements');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 mb-12 shadow-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">Welcome to CodeArena</h1>
            <p className="text-xl sm:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              The ultimate platform for competitive programming. Compete in contests, solve challenges, and climb the leaderboards.
            </p>
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/login"
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-secondary-600 text-white px-8 py-4 rounded-xl hover:bg-secondary-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12">Why Choose CodeArena?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-semibold text-primary-800 mb-4">Competitive Contests</h3>
              <p className="text-secondary-700">Participate in timed coding contests with real-time leaderboards and prizes.</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-2xl font-semibold text-secondary-800 mb-4">Practice Problems</h3>
              <p className="text-secondary-700">Solve thousands of algorithmic problems across various difficulty levels.</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-semibold text-accent-800 mb-4">Global Leaderboards</h3>
              <p className="text-secondary-700">Track your progress and compete with programmers worldwide.</p>
            </div>
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold text-neutral-800 mb-4">Real-time Judging</h3>
              <p className="text-secondary-700">Get instant feedback on your code submissions with detailed test results.</p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-primary-800 mb-4">Skill Assessment</h3>
              <p className="text-secondary-700">Improve your coding skills with personalized recommendations and badges.</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-2xl font-semibold text-secondary-800 mb-4">Community Support</h3>
              <p className="text-secondary-700">Connect with fellow programmers, share solutions, and learn together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">5,000+</div>
              <div className="text-primary-100">Problems Solved</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Contests Hosted</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Programming Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-2xl font-semibold text-primary-800 mb-4">Sign Up</h3>
              <p className="text-secondary-700">Create your account and set up your profile to get started.</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-2xl font-semibold text-secondary-800 mb-4">Choose a Challenge</h3>
              <p className="text-secondary-700">Browse contests, practice problems, or join ongoing competitions.</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-2xl font-semibold text-accent-800 mb-4">Code & Compete</h3>
              <p className="text-secondary-700">Write efficient code, submit solutions, and climb the rankings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-xl p-8 border border-primary-200 backdrop-blur-sm">
            <h2 className="text-3xl font-semibold text-primary-700 mb-6">Latest Announcements</h2>
            {announcements.length > 0 ? (
              <ul className="space-y-6">
                {announcements.map((announcement) => (
                  <li key={announcement.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-primary-100 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-semibold text-primary-800 mb-2">{announcement.title}</h3>
                    <p className="text-secondary-700 mb-3">{announcement.content}</p>
                    <p className="text-sm text-secondary-500 font-medium">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📢</div>
                <p className="text-secondary-500 text-lg">No announcements available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-700 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Coding?</h2>
          <p className="text-xl text-primary-100 mb-8">Join thousands of programmers and take your skills to the next level.</p>
          <Link
            to={isLoggedIn ? '/contests' : '/login'}
            className="bg-white text-primary-600 px-12 py-5 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 font-semibold text-xl shadow-xl hover:shadow-2xl"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CodeArena</h3>
              <p className="text-primary-200">Empowering programmers worldwide through competitive coding.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/contests" className="text-primary-200 hover:text-white transition-colors">Contests</Link></li>
                <li><Link to="/problems" className="text-primary-200 hover:text-white transition-colors">Problems</Link></li>
                <li><Link to="/leaderboard" className="text-primary-200 hover:text-white transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-primary-200 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-primary-200 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-primary-200 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Forum</a></li>
                <li><a href="#" className="text-primary-200 hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-8 text-center">
            <p className="text-primary-200">&copy; 2024 CodeArena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;