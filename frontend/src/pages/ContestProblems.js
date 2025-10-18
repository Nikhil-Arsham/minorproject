import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ContestProblems = ({ user }) => {
  const { contestId } = useParams();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [contest, setContest] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [contestParticipation, setContestParticipation] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('problems'); // 'problems' or 'leaderboard'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}`);
        setContest(response.data);
      } catch (error) {
        console.error('Error fetching contest:', error);
      }
    };
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    const fetchUserParticipation = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/contest-participation/${contestId}`);
        setContestParticipation(response.data);
        setUserScore(response.data.totalScore || 0);
        
        // Update problem solved status
        if (contest) {
          const updatedChallenges = contest.challenges.map(challenge => ({
            ...challenge,
            solved: response.data.solvedProblems?.includes(challenge._id || challenge.id) || false,
            attempted: response.data.solvedProblems?.includes(challenge._id || challenge.id) || false
          }));
          setContest(prev => ({ ...prev, challenges: updatedChallenges }));
        }
      } catch (error) {
        console.error('Error fetching user participation:', error);
      }
    };
    
    if (user && contestId) {
      fetchUserParticipation();
    }
  }, [contestId, user, refreshTrigger]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}/leaderboard`);
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching contest leaderboard:', error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaderboard' && leaderboard.length === 0) {
      fetchLeaderboard();
    }
  }, [activeTab]);

  const getDifficultyColor = (difficulty) => {
    const colors = { Easy: 'text-secondary-600 bg-secondary-100', Medium: 'text-neutral-600 bg-neutral-100', Hard: 'text-accent-600 bg-accent-100' };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const getProblemStatus = (problem) => {
    if (problem.solved) return <span className="text-green-600">✓ Solved</span>;
    if (problem.attempted) return <span className="text-yellow-600">! Attempted</span>;
    return <span className="text-gray-400">○ Not Attempted</span>;
  };

  if (!contest) return <div className="min-h-screen bg-gray-50 text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contest.title}</h1>
              <p className="text-gray-600">{((new Date(contest.endTime) - new Date(contest.startTime)) / (1000 * 60 * 60)).toFixed(1)} hours • Start: {new Date(contest.startTime).toLocaleDateString()} • End: {new Date(contest.endTime).toLocaleDateString()}</p>
            </div>
            <div className="text-right space-y-4">
              <div>
                <div className="text-sm text-gray-600">Your Score</div>
                <div className="text-2xl font-bold text-blue-600">{userScore}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className="text-lg font-bold text-red-600">01:23:45</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
              activeTab === 'problems'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            📋 Problems ({contest.challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* Problems Tab */}
        {activeTab === 'problems' && (
        <div className="flex gap-6">
          <div className="w-80 bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Problems</h2>
              <p className="text-sm text-gray-600">{contest.challenges.length} problems</p>
            </div>
            <div className="p-4">
              {contest.challenges.map((problem) => (
                <div
                  key={problem.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${selectedProblem?.id === problem.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedProblem(problem)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{problem.title}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{problem.points} points</span>
                    {getProblemStatus(problem)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-md">
            {selectedProblem ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProblem.title}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedProblem.difficulty)}`}>{selectedProblem.difficulty}</span>
                      <span className="text-gray-600">{selectedProblem.points} points</span>
                      {getProblemStatus(selectedProblem)}
                    </div>
                  </div>
                  <Link to={`/problem/${contestId}/${selectedProblem.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Solve Problem</Link>
                </div>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Description</h3>
                  <p className="text-gray-700 mb-4">{selectedProblem.description}</p>
                  {/* Add examples and constraints from backend if available */}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-gray-400 text-lg">Select a problem from the sidebar to view details</div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-lg shadow-md">
          {loadingLeaderboard ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
            </div>
          ) : (
            <div>
              {/* User's Rank Section */}
              {leaderboard.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Your Rank</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {leaderboard.findIndex(e => e.username === user?.username) + 1 || '-'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Your Score</div>
                    <div className="text-3xl font-bold text-green-600">
                      {leaderboard.find(e => e.username === user?.username)?.totalScore || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Participants</div>
                    <div className="text-3xl font-bold text-purple-600">{leaderboard.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 text-sm mb-1">Your Progress</div>
                    <div className="text-3xl font-bold text-orange-600">
                      {leaderboard[0]?.totalScore ? Math.round(((leaderboard.find(e => e.username === user?.username)?.totalScore || 0) / leaderboard[0].totalScore) * 100) : 0}%
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Rank</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Problems Solved</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Last Submission</th>
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
                          className={`hover:bg-blue-50 transition-colors ${
                            entry.username === user?.username ? 'bg-blue-100' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {entry.rank <= 3 ? (
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold text-white ${
                                entry.rank === 1 ? 'bg-yellow-500' :
                                entry.rank === 2 ? 'bg-gray-400' :
                                'bg-orange-500'
                              }`}>
                                {['🥇', '🥈', '🥉'][entry.rank - 1]}
                              </span>
                            ) : (
                              <span className="text-lg font-bold text-gray-600">{entry.rank}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">
                              {entry.username}
                              {entry.username === user?.username && (
                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xl font-bold text-green-600">{entry.totalScore}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              ✓ {entry.solvedProblems}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString('en-US', {
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
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default ContestProblems;