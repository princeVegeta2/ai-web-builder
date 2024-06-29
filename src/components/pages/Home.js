import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import '../../assets/styles/Home.css';

function Home() {
  const [accessKey, setAccessKey] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctKey = process.env.REACT_APP_ACCESS_KEY;
    if (accessKey === correctKey) {
      login();
      navigate('/webbuilder');
    } else {
      alert('Incorrect Access Key');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Info Squirrel</h1>
      </header>
      <div className="home-content">
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter access key"
            className="access-key-input"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
          />
          <button className="submit-button" type="submit">Submit</button>
        </form>
        <div className="button-group">
          <button className="inactive-button">Sign Up</button>
          <button className="inactive-button">Sign In</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
