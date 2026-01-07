import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import POS Screen from the 'pos' feature folder
import POSScreen from './pos/POSScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* REDIRECT: Automatically go to /pos when the app starts */}
        <Route path="/" element={<Navigate to="/pos" replace />} />
        
        {/* TERMINAL ROUTE: This is your isolated workspace */}
        <Route path="/pos" element={<POSScreen />} />
      </Routes>
    </Router>
  );
}

export default App;