import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ContestProblems = ({ user }) => {
  const { contestId } = useParams();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [contest, setContest] = useState(null);

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
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Remaining</div>
              <div className="text-lg font-bold text-red-600">01:23:45</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </div>
    </div>
  );
};

export default ContestProblems;