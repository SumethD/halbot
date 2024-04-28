import React from 'react';
import ChatInterface from './components/chatInterface';
import "dotenv/config";

const App = () => {
  return (
    <div className="app">
      <ChatInterface />
    </div>
  );
};

export default App;
