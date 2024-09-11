import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../common/AuthContext';
import '../../assets/styles/Home.css';
import accountImage from '../../assets/images/user.png';

function Home() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', staySignedIn: false });
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const serverAuthURL = process.env.REACT_APP_SERVER_AUTH;
  const serverUserUrl = process.env.REACT_APP_SERVER_USER;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsername = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${serverUserUrl}/get-username`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json().catch(() => null); // Safely parse JSON
          if (data && data.username) {
            setUsername(data.username);
          } else {
            alert('Failed to fetch username.');
          }
        } else {
          alert('Failed to fetch username.');
        }
      };
      fetchUsername();
    }
  }, [isAuthenticated, serverUserUrl]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverAuthURL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        await handleSignIn();  // Call sign-in function programmatically after signup
      } else {
        alert(data.error || 'Sign up failed');
      }
    } catch (error) {
      alert('Sign up failed');
      console.error(error);
    }
  };




  const handleSignIn = async (e = null) => {
    // Prevent form submission only if `e` is passed (i.e., it's a form submit)
    if (e) {
      e.preventDefault();
    }
  
    try {
      console.log('Sending request to:', `${serverAuthURL}/signin`);
      const response = await fetch(`${serverAuthURL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          staySignedIn: formData.staySignedIn,
        }),
        credentials: 'include', // Include cookies if necessary
      });
  
      if (!response.ok) {
        console.log('Response not OK:', response);
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
        console.log('Error data:', errorData);
        alert('Sign in failed: ' + (errorData.error || 'Unknown error'));
      } else {
        const data = await response.json();
        console.log('Sign in success:', data);
        login(data.token); // Save the JWT in the AuthContext
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please try again later.');
    }
  };
  
  
  


  const handleWebBuilderClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${serverUserUrl}/check-builder-access`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok && data.builderAccess) {
        navigate('/webbuilder');
      } else {
        alert('You do not have access to the Web Builder.');
      }
    } catch (error) {
      alert('Failed to check access.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Info Squirrel</h1>
        {isAuthenticated && (
          <div className="account-section">
            <img
              src={accountImage}
              alt="Account"
              className="account-image"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <p>{username}</p>
                <button className="dropdown-button" onClick={handleAccountClick}>Account</button>
                <button className="dropdown-button" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </header>
      <div className="home-content">
        {isAuthenticated ? (
          <>
            <p>Welcome! You are signed in.</p>
            <button className="web-builder-button" onClick={handleWebBuilderClick}>
              Web Builder
            </button>
          </>
        ) : (
          !showSignUp ? (
            <form onSubmit={handleSignIn}>
              <input
                type="email"
                placeholder="Email"
                className="access-key-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="access-key-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="stay-signed-in">
                <input
                  type="checkbox"
                  id="staySignedIn"
                  checked={formData.staySignedIn}
                  onChange={(e) => setFormData({ ...formData, staySignedIn: e.target.checked })}
                />
                <label htmlFor="staySignedIn">Stay signed in</label>
              </div>
              <button className="submit-button" type="submit">Sign In</button>
              <button type="button" className="inactive-button" onClick={() => setShowSignUp(true)}>Sign Up</button>
            </form>
          ) : (
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Username"
                className="access-key-input"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="access-key-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="access-key-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button className="submit-button" type="submit">Sign Up</button>
              <button type="button" className="inactive-button" onClick={() => setShowSignUp(false)}>Sign In</button>
            </form>
          )
        )}
      </div>
    </div>
  );
}

export default Home;
