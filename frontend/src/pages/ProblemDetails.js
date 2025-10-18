import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const ProblemDetails = ({ user }) => {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const actualProblemId = problemId || contestId; // Handle both routes
  const [activeTab, setActiveTab] = useState('problem');
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n    \n}');
  const [language, setLanguage] = useState('javascript');
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/challenges/${actualProblemId}`);
        setProblem(response.data);
        const testResponse = await axios.get(`${process.env.REACT_APP_API_URL}/testcases/challenge/${actualProblemId}`);
        setTestCases(testResponse.data.filter(tc => !tc.isHidden || user.role === 'admin'));
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [actualProblemId, user.role]);

  const getDifficultyColor = (difficulty) => {
    const colors = { Easy: 'text-green-600 bg-green-100', Medium: 'text-yellow-600 bg-yellow-100', Hard: 'text-red-600 bg-red-100' };
    return colors[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      console.log('Submitting code for problem:', actualProblemId);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submissions`, {
        challengeId: actualProblemId,
        code,
        language,
        contestId
      });

      console.log('Submission response:', response.data);

      const { status, score, passedTests, totalTests, message, contestScore } = response.data;

      if (status === 'accepted') {
        let alertMessage = `🎉 ${message}\nScore: ${score}%\nPassed: ${passedTests}/${totalTests} test cases`;
        if (contestScore !== null) {
          alertMessage += `\n\n📊 Contest Score: +${response.data.contestParticipation?.problemScores?.[0]?.score || 0} points\nTotal: ${contestScore} points`;
        }
        alert(alertMessage);
        
        // Navigate back to contest problems after success
        if (contestId) {
          setTimeout(() => {
            navigate(`/contest/${contestId}`);
          }, 500);
        }
      } else {
        alert(`❌ ${message}\nScore: ${score}%\nPassed: ${passedTests}/${totalTests} test cases`);
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Submission failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTest = async () => {
    try {
      setIsRunning(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submissions/run`, { 
        code, 
        challengeId: actualProblemId,
        language
      });
      setTestResults(response.data.results || []);
      
      const passedCount = response.data.results.filter(r => r.passed).length;
      const totalCount = response.data.results.length;
      alert(`Test Results: ${passedCount}/${totalCount} test cases passed`);
    } catch (error) {
      console.error('Error running test:', error);
      alert('Test execution failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsRunning(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const getLanguageTemplate = (lang) => {
    const templates = {
      javascript: '// Write your solution here\nfunction solution() {\n    \n}',
      python: '# Write your solution here\ndef solution():\n    pass',
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello" << endl;\n    return 0;\n}'
    };
    return templates[lang] || templates.javascript;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(getLanguageTemplate(newLanguage));
  };

  if (!problem) return <div className="min-h-screen bg-gray-50 text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={contestId && problemId ? `/contest/${contestId}` : "/problems"} 
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to {contestId && problemId ? "Contest" : "Problems"}
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-600">{problem.points} points</span>
                </div>
              </div>
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
          <div className="w-1/2 bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Description</h3>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{problem.description}</p>
                {problem.examples && problem.examples.map((example, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Example {index + 1}:</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700 mb-2"><strong>Input:</strong> {example.input}</p>
                      <p className="text-gray-700 mb-2"><strong>Output:</strong> {example.output}</p>
                      {example.explanation && <p className="text-gray-700"><strong>Explanation:</strong> {example.explanation}</p>}
                    </div>
                  </div>
                ))}
                <h4 className="text-md font-semibold text-gray-900 mb-2">Constraints:</h4>
                <div className="text-gray-700 whitespace-pre-line">{problem.constraints}</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={handleRunTest} 
                    disabled={isRunning}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? 'Running...' : 'Run Test'}
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isRunning}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Language:</label>
                <select 
                  value={language} 
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="mb-4 border border-gray-300 rounded-md overflow-hidden">
                <Editor
                  height="400px"
                  language={language}
                  value={code}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Test Cases</h4>
                <div className="space-y-3">
                  {testCases.map((tc, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Test Case {i + 1}</div>
                      <div className="text-sm text-gray-900">Input: {tc.input}</div>
                      <div className="text-sm text-gray-900">Expected Output: {tc.expectedOutput}</div>
                      {testResults[i] && (
                        <div className={`text-sm ${testResults[i].passed ? 'text-green-600' : 'text-red-600'}`}>
                          {testResults[i].passed ? '✓ Passed' : '✗ Failed'}
                          {testResults[i].output && <div>Your Output: {testResults[i].output}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
