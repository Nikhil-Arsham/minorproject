import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/leaderboard`);
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">🏆 Global Leaderboard</h1>
        <p className="text-gray-600 mb-8">Top coders ranked by their problem-solving abilities</p>
        <div className="bg-white rounded-lg shadow-lg border border-primary-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Problems Solved
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Difficulty Breakdown
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users on leaderboard yet
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 transform hover:scale-[1.01] ${
                        entry.id === user?.id ? 'bg-gradient-to-r from-primary-100 to-secondary-100 shadow-inner-glow' : ''
                      }`}
                    >
                      <td className="px-6 py-6 whitespace-nowrap">
                        {index + 1 <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xl font-bold text-white ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                            'bg-gradient-to-r from-orange-400 to-orange-600'
                          }`}>
                            {['🥇', '🥈', '🥉'][index]}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-primary-600">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-base font-semibold text-gray-900">
                          {entry.name || entry.username}
                        </div>
                        {entry.country && <div className="text-sm text-gray-500">{entry.country}</div>}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold text-secondary-600">
                          {entry.totalSolved}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex gap-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            🟢 {entry.easySolved}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            🟡 {entry.mediumSolved}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            🔴 {entry.hardSolved}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-base font-bold text-accent-600">
                          {entry.rating}
                        </div>
                        {entry.maxRating > entry.rating && (
                          <div className="text-sm text-gray-500">max: {entry.maxRating}</div>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-base font-semibold text-blue-600">
                          🔥 {entry.currentStreak}
                        </div>
                        <div className="text-sm text-gray-500">best: {entry.maxStreak}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary-700 mb-6">🎖️ Top Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaderboard.slice(0, 10).map((entry) => (
              <div key={entry.id} className="bg-white rounded-lg shadow p-4 border border-primary-200">
                <h3 className="font-bold text-gray-900 mb-3">{entry.name || entry.username}</h3>
                <div className="space-y-2 text-sm">
                  {entry.achievements?.streakMaster && <div className="text-amber-600">🔥 Streak Master</div>}
                  {entry.achievements?.problemSolver && <div className="text-blue-600">💡 Problem Solver (100+)</div>}
                  {entry.achievements?.ratingExpert && <div className="text-purple-600">⭐ Rating Expert (2000+)</div>}
                  {entry.achievements?.balancedCoder && <div className="text-green-600">⚖️ Balanced Coder</div>}
                  {entry.achievements?.consistentCoder && <div className="text-indigo-600">📈 Consistent Coder</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;