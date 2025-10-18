import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    country: user?.profile?.country || '',
    company: user?.profile?.company || '',
    github: user?.profile?.github || '',
    linkedin: user?.profile?.linkedin || ''
  });
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchUserStats();
    fetchUserBadges();
  }, [user]);

  const refreshStats = () => {
    fetchUserStats();
    fetchUserBadges();
  };

  const fetchUserStats = async () => {
    try {
      // Removed debug logging
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}/stats`);
      // Debug logging removed - stats are now displaying correctly
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchUserBadges = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}/badges`);
      setBadges(response.data.badges || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      setBadges([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-xl p-8 mb-8 border border-primary-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold shadow-lg">
                {user?.profile?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white">{user?.profile?.name}</h1>
                <p className="text-primary-100">@{user?.username}</p>
                <div className="flex items-center space-x-6 mt-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-primary-100">Rating:</span>
                    <span className="text-lg font-bold text-white ml-2">{userStats?.profile?.rating || user?.profile?.rating || 1200}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-sm text-primary-100">Rank:</span>
                    <span className="text-lg font-bold text-white ml-2">{userStats?.profile?.rank || user?.profile?.rank || 'Beginner'}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={refreshStats}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-primary-200 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-primary-700 mb-6">Problem Solving Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 border border-primary-400">
                  <div className="text-4xl font-bold text-white mb-2">{userStats?.stats?.totalSolved || 0}</div>
                  <div className="text-sm text-primary-100 font-semibold">Total Solved</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 border border-primary-400">
                  <div className="text-4xl font-bold text-white mb-2">{userStats?.stats?.easySolved || 0}</div>
                  <div className="text-sm text-primary-100 font-semibold">Easy</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 border border-secondary-400">
                  <div className="text-4xl font-bold text-white mb-2">{userStats?.stats?.mediumSolved || 0}</div>
                  <div className="text-sm text-secondary-100 font-semibold">Medium</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105 border border-accent-400">
                  <div className="text-4xl font-bold text-white mb-2">{userStats?.stats?.hardSolved || 0}</div>
                  <div className="text-sm text-accent-100 font-semibold">Hard</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl shadow-xl p-8 border border-secondary-200 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-secondary-800 mb-6">Badges ({badges.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {badges.map(badge => (
                  <div key={badge._id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50 rounded-lg hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                    <div className="text-3xl">{badge.icon}</div>
                    <div>
                      <div className="font-semibold text-base text-gray-900">{badge.name}</div>
                      <div className="text-sm text-gray-700">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-xl p-8 border border-primary-200 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-primary-700 mb-6">Profile Information</h2>
            {/* Profile form fields */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
