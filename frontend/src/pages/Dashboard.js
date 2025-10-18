import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [contestHistory, setContestHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${user.id}/contests`);
        setContestHistory(response.data);
      } catch (error) {
        console.error('Error fetching contest history:', error);
      }
    };
    if (user?.id) fetchHistory();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <h1 className="text-5xl font-bold text-white">Dashboard</h1>
          <p className="text-primary-100 mt-2">Track your progress and performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-8 rounded-xl shadow-xl border border-primary-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <h2 className="text-xl font-semibold text-white mb-4">Total Score</h2>
            <p className="text-5xl font-bold text-white">{user?.profile?.score || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-8 rounded-xl shadow-xl border border-secondary-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <h2 className="text-xl font-semibold text-white mb-4">Contests Joined</h2>
            <p className="text-5xl font-bold text-white">{contestHistory.length}</p>
          </div>
          <div className="bg-gradient-to-br from-accent-500 to-accent-600 p-8 rounded-xl shadow-xl border border-accent-400 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <h2 className="text-xl font-semibold text-white mb-4">Current Rank</h2>
            <p className="text-5xl font-bold text-white">{user?.profile?.rank || 'Beginner'}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-secondary-50 rounded-xl shadow-xl p-8 border border-primary-200 backdrop-blur-sm">
          <h2 className="text-3xl font-semibold text-primary-700 mb-6">Contest History</h2>
          {contestHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-primary-600 to-primary-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Contest
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {contestHistory.map((contest) => (
                    <tr key={contest.id} className="hover:bg-primary-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-primary-800">
                          {contest.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-secondary-700">
                          {new Date(contest.endTime).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-primary-600">
                          {contest.score || 0}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-secondary-500 text-lg">No contest history available yet.</p>
              <p className="text-secondary-400 mt-2">Join your first contest to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;