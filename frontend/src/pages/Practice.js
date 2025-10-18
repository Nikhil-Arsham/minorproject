import React from 'react';

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Array", "HashMap"],
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    tags: ["Sliding Window", "String"],
  },
  {
    id: 3,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Binary Search", "Divide & Conquer"],
  },
];

const getColor = (difficulty) => {
  if (difficulty === "Easy") return "text-green-400";
  if (difficulty === "Medium") return "text-yellow-400";
  return "text-red-400"; 
};

const Practice = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Practice Problems</h1>
      <p className="text-center text-gray-400 mb-10">
        Solve problems to improve your coding skills. Choose from various difficulty levels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-2xl font-semibold mb-2">{problem.title}</h2>
            <p className={`mb-2 ${getColor(problem.difficulty)}`}>
              Difficulty: {problem.difficulty}
            </p>
            <div className="flex gap-2 flex-wrap mb-4">
              {problem.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
              Solve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Practice;
