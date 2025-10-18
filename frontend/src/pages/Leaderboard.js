import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('`${process.env.REACT_APP_API_URL}`/leaderboard');
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-8">Leaderboard</h1>
        <div className="bg-white rounded-lg shadow-lg border border-primary-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 transform hover:scale-[1.01] ${entry.id === user?.id ? 'bg-gradient-to-r from-primary-100 to-secondary-100 shadow-inner-glow' : ''}`}
                  >
                    <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-primary-600">
                      {index + 1 <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                          index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white' :
                          'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                        }`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-primary-600 font-bold">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">
                        {entry.name}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-secondary-600">
                      {entry.totalSolved}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-accent-600">
                      {entry.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;