// src/App.tsx
import React from 'react';
import './App.css';
import FlowEditor from './features/editor/FlowEditor';

const App: React.FC = () => {
  return (
    <div className="App">
      <FlowEditor />
    </div>
  );
};

export default App;
