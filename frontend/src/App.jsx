import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [contextData, setContextData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/context')
      .then(response => {
        setContextData(response.data);
      })
      .catch(error => console.error("Error fetching context:", error));
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar">
        <Dashboard data={contextData} />
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Your Financial Relationship Manager</h1>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}

export default App;