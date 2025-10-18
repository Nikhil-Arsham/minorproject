import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContestLeaderboard = ({ user }) => {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestResp, leaderboardResp] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}`),
          axios.get(`${process.env.REACT_APP_API_URL}/contests/${contestId}/leaderboard`)
        ]);
        setContest(contestResp.data);
        setLeaderboard(leaderboardResp.data);
      } catch (error) {
        console.error('Error fetching contest leaderboard:', error);
      }
    };
    fetchData();
  }, [contestId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {contest?.title} - Leaderboard
        </h1>
        {/* Add leaderboard content here */}
      </div>
    </div>
  );
};

export default ContestLeaderboard;
