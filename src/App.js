import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import WebBuilder from './components/pages/WebBuilder';
import { AuthProvider } from './components/common/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
              path="/webbuilder"
              element={
                <ProtectedRoute>
                  <WebBuilder />
                </ProtectedRoute>
              }
            />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
