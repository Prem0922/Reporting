import React, { useState, useEffect } from 'react';

function App() {
  const [testSuites, setTestSuites] = useState([]);
  const [selectedTestSuite, setSelectedTestSuite] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);

  useEffect(() => {
    // Fetch high-level status of all test suites on initial load
    fetch('/api/tests') // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => setTestSuites(data))
      .catch(error => console.error('Error fetching test suites:', error));
  }, []);

  const handleTestSuiteClick = (testId) => {
    setSelectedTestSuite(testId);
    // Fetch detailed results for the selected test suite
    fetch(`/api/tests/${testId}`) // Replace with your actual API endpoint
      .then(response => response.json())
      .then(data => setDetailedResults(data))
      .catch(error => console.error('Error fetching details:', error));
  };

  return (
    <div>
      <h1>Test Results Dashboard</h1>
      <div className="tab-menu">
        {testSuites.map(suite => (
          <button key={suite.test_id} onClick={() => handleTestSuiteClick(suite.test_id)}>
            {suite.test_id} ({suite.pass_percentage.toFixed(2)}% Pass)
          </button>
        ))}
      </div>

      <div className="tab-content">
        {selectedTestSuite && detailedResults && (
          <div>
            <h2>{detailedResults.test_id} - Detailed Results</h2>
            <p>Total Tests: {detailedResults.summary.total_tests}</p>
            <p>Passed: {detailedResults.summary.passed}</p>
            <p>Failed: {detailedResults.summary.failed}</p>
            <p>Pass Percentage: {detailedResults.summary.pass_percentage.toFixed(2)}%</p>

            <table>
              <thead>
                <tr>
                  <th>Test Case ID</th>
                  <th>Name</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {detailedResults.test_cases.map(testCase => (
                  <tr key={testCase.id}>
                    <td>{testCase.id}</td>
                    <td>{testCase.name}</td>
                    <td>{testCase.result === 0 ? 'Pass' : 'Fail'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;