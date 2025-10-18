import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateContest = ({ user }) => {
  const navigate = useNavigate();
  const [contestData, setContestData] = useState({ name: '', startTime: '', endTime: '', duration: '', description: '' });
  const [problems, setProblems] = useState([{ id: 1, title: '', description: '', difficulty: 'Easy', points: 10 }]);

  const handleContestChange = (e) => setContestData({ ...contestData, [e.target.name]: e.target.value });
  const handleProblemChange = (index, field, value) => {
    const updatedProblems = [...problems];
    updatedProblems[index] = { ...updatedProblems[index], [field]: value };
    setProblems(updatedProblems);
  };

  const addProblem = () => setProblems([...problems, { id: problems.length + 1, title: '', description: '', difficulty: 'Easy', points: 10 }]);
  const removeProblem = (index) => problems.length > 1 && setProblems(problems.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contestData.name || !contestData.startTime || !contestData.endTime) {
      alert('Please fill in all required contest fields');
      return;
    }
    if (problems.some(p => !p.title || !p.description)) {
      alert('Please fill in all problem details');
      return;
    }
    try {
      const response = await axios.post('`${process.env.REACT_APP_API_URL}`/contests', {
        title: contestData.name,
        startTime: contestData.startTime,
        endTime: contestData.endTime,
        description: contestData.description,
        challenges: problems
      });
      alert('Contest created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating contest:', error);
      alert('Failed to create contest');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Contest</h1>
              <p className="text-gray-600">Set up a new coding contest with problems</p>
            </div>
            <Link to="/admin" className="text-blue-600 hover:text-blue-800">← Back to Admin Panel</Link>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contest Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Contest Name *</label><input type="text" name="name" value={contestData.name} onChange={handleContestChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter contest name" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label><input type="text" name="duration" value={contestData.duration} onChange={handleContestChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 2 hours" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label><input type="datetime-local" name="startTime" value={contestData.startTime} onChange={handleContestChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label><input type="datetime-local" name="endTime" value={contestData.endTime} onChange={handleContestChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={contestData.description} onChange={handleContestChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter contest description" /></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Problems</h2>
              <button type="button" onClick={addProblem} className="bg-secondary-600 text-white px-4 py-2 rounded-md hover:bg-secondary-700 transition-colors">Add Problem</button>
            </div>
            {problems.map((problem, index) => (
              <div key={problem.id} className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Problem {index + 1}</h3>
                  {problems.length > 1 && <button type="button" onClick={() => removeProblem(index)} className="text-accent-600 hover:text-accent-800">Remove</button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Problem Title *</label><input type="text" value={problem.title} onChange={(e) => handleProblemChange(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter problem title" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label><select value={problem.difficulty} onChange={(e) => handleProblemChange(index, 'difficulty', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                  </select></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Points</label><input type="number" value={problem.points} onChange={(e) => handleProblemChange(index, 'points', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="1" /></div>
                </div>
                <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Problem Description *</label><textarea value={problem.description} onChange={(e) => handleProblemChange(index, 'description', e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter problem description" required /></div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Link to="/admin" className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors">Cancel</Link>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">Create Contest</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContest;