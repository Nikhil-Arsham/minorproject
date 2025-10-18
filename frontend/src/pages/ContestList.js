import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ContestList = ({ user }) => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('`${process.env.REACT_APP_API_URL}`/contests');
        setContests(response.data);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Contests</h1>
        <div className="grid gap-6">
          {contests.map(contest => (
            <div key={contest._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">{contest.title}</h3>
              <p className="text-gray-600 mt-2">{contest.description}</p>
              <Link 
                to={`/contest/${contest._id}`}
                className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
              >
                View Contest
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestList;
