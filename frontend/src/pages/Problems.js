import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Problems = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: '',
    topics: [],
    search: '',
    company: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const topics = [
    "Arrays", "Strings", "Linked Lists", "Stacks", "Queues",
    "Trees", "Binary Search Trees", "Heaps", "Graphs", 
    "Dynamic Programming", "Greedy", "Backtracking",
    "Sorting", "Searching", "Hash Tables", "Two Pointers",
    "Sliding Window", "Recursion", "Bit Manipulation"
  ];

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.topics.length) params.append('topics', filters.topics.join(','));
      if (filters.search) params.append('search', filters.search);
      if (filters.company) params.append('company', filters.company);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges?${params}`);
      console.log('API Response:', response.data);
      
      // Handle both array and object responses
      if (response.data.challenges) {
        setProblems(response.data.challenges);
      } else if (Array.isArray(response.data)) {
        setProblems(response.data);
      } else {
        setProblems([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to fetch problems. Please try again.');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: 'text-green-600 bg-green-100',
      Medium: 'text-yellow-600 bg-yellow-100',
      Hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Problems</h1>
              <p className="text-primary-100 mt-2">Practice coding problems and improve your skills</p>
            </div>
            {user?.role === 'admin' && (
              <Link
                to="/admin/create-problem"
                className="bg-white text-primary-600 px-6 py-3 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                Create Problem
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar with filters */}
          <div className="w-80 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Difficulty</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="difficulty"
                    value=""
                    checked={filters.difficulty === ''}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                    className="mr-2"
                  />
                  <span>All</span>
                </label>
                {['Easy', 'Medium', 'Hard'].map(diff => (
                  <label key={diff} className="flex items-center">
                    <input
                      type="radio"
                      name="difficulty"
                      value={diff}
                      checked={filters.difficulty === diff}
                      onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                      className="mr-2"
                    />
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(diff)}`}>
                      {diff}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Topics</h3>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {topics.map(topic => (
                  <label key={topic} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.topics.includes(topic)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, topics: [...filters.topics, topic]});
                        } else {
                          setFilters({...filters, topics: filters.topics.filter(t => t !== topic)});
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{topic}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Problems list */}
          <div className="flex-1">
            <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-xl border border-primary-200 backdrop-blur-sm">
              <div className="p-6 border-b border-primary-200 bg-gradient-to-r from-primary-600 to-primary-700 rounded-t-xl">
                <h2 className="text-xl font-semibold text-white">All Problems</h2>
                <p className="text-primary-100">{problems.length} problems found</p>
              </div>
              
              {error ? (
                <div className="p-6 text-center">
                  <div className="text-red-600 mb-2">⚠️ {error}</div>
                  <button 
                    onClick={fetchProblems}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : problems.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No problems found</h3>
                  <p className="text-gray-600">
                    {user?.role === 'admin' ? (
                      <>Create your first problem to get started!</>
                    ) : (
                      <>Check back later for new problems!</>
                    )}
                  </p>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin/create-problem"
                      className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      Create Problem
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-secondary-600 to-secondary-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Difficulty</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Topics</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Acceptance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200">
                      {problems.map(problem => (
                        <tr key={problem._id} className="hover:bg-primary-50/30 transition-colors duration-200">
                          <td className="px-6 py-4">
                            {problem.solved ? (
                              <span className="text-emerald-600 text-xl font-bold">✓</span>
                            ) : (
                              <span className="text-secondary-400 text-xl">○</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/problem/${problem._id}`}
                              className="text-primary-600 hover:text-primary-800 font-semibold hover:underline"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(problem.topics || []).slice(0, 2).map(topic => (
                                <span key={topic} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">
                                  {topic}
                                </span>
                              ))}
                              {(problem.topics || []).length > 2 && (
                                <span className="text-xs text-secondary-500 font-medium">+{problem.topics.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-bold text-secondary-700">
                              {problem.acceptanceRate || 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
