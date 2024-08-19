// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from './components/pages/Home';
import WebBuilder from './components/pages/WebBuilder';
import Result from './components/pages/Result';
import Account from './components/pages/Account';
import { AuthProvider } from './components/common/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
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
              <Route path="/result" element={<Result />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </DndProvider>
  );
}

export default App;