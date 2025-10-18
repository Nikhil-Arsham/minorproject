import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContestLeaderboard = ({ user }) => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestResp, leaderboardResp] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}/leaderboard`)
        ]);
        setContest(contestResp.data);
        const leaderboardData = leaderboardResp.data.leaderboard || [];
        setLeaderboard(leaderboardData);
        
        // Find current user's rank
        if (user) {
          const userEntry = leaderboardData.find(entry => entry.username === user.username);
          if (userEntry) {
            setUserRank(userEntry.rank);
          }
        }
      } catch (error) {
        console.error('Error fetching contest leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contestId, user]);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            🏆 {contest?.title} - Contest Leaderboard
          </h1>
          <p className="text-gray-600">
            {leaderboard.length} participants • Total problems: {contest?.challenges?.length || 0}
          </p>
        </div>

        {/* User's Stats Card */}
        {userRank && (
          <div className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-lg p-6 border-2 border-primary-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">#{userRank}</div>
                <div className="text-gray-600">Your Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  {leaderboard.find(e => e.username === user?.username)?.totalScore || 0}
                </div>
                <div className="text-gray-600">Your Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  {leaderboard.find(e => e.username === user?.username)?.solvedProblems || 0}
                </div>
                <div className="text-gray-600">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {leaderboard[0]?.totalScore ? Math.round(((leaderboard.find(e => e.username === user?.username)?.totalScore || 0) / leaderboard[0].totalScore) * 100) : 0}%
                </div>
                <div className="text-gray-600">of Top Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-lg border border-primary-200 overflow-hidden">
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
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Problems Solved
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-primary-700 uppercase tracking-wider">
                    Last Submission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry.rank}
                      className={`hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300 ${
                        entry.username === user?.username ? 'bg-gradient-to-r from-primary-100 to-secondary-100 shadow-inner-glow font-semibold' : ''
                      }`}
                    >
                      <td className="px-6 py-6 whitespace-nowrap">
                        {entry.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xl font-bold text-white ${
                            entry.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            entry.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                            'bg-gradient-to-r from-orange-400 to-orange-600'
                          }`}>
                            {['🥇', '🥈', '🥉'][entry.rank - 1]}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-primary-600">{entry.rank}</span>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-base font-semibold text-gray-900">
                          {entry.username}
                          {entry.username === user?.username && (
                            <span className="ml-2 text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-2xl font-bold text-secondary-600">
                          {entry.totalScore}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          ✓ {entry.solvedProblems}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">
                        {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-US', {
                          year: '2-digit',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🥇 Leader</h3>
            {leaderboard.length > 0 && (
              <>
                <p className="text-2xl font-bold text-yellow-600">{leaderboard[0].username}</p>
                <p className="text-gray-600">{leaderboard[0].totalScore} points</p>
              </>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">💯 Total Participants</h3>
            <p className="text-2xl font-bold text-blue-600">{leaderboard.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Avg Score</h3>
            {leaderboard.length > 0 && (
              <p className="text-2xl font-bold text-green-600">
                {Math.round(leaderboard.reduce((sum, e) => sum + e.totalScore, 0) / leaderboard.length)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestLeaderboard;
