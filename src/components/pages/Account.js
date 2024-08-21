import React, { useState, useEffect } from 'react';
import { useAuth } from '../common/AuthContext';
import '../../assets/styles/Account.css';

function Account() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [builderAccess, setBuilderAccess] = useState(null);
  const { isAuthenticated } = useAuth();

  const serverUserURL = process.env.REACT_APP_SERVER_USER;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        // Fetch username
        try {
          const usernameResponse = await fetch(`${serverUserURL}/get-username`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const usernameData = await usernameResponse.json();
          if (usernameResponse.ok) {
            setUsername(usernameData.username);
          } else {
            alert('Failed to fetch username.');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }

        // Fetch email
        try {
          const emailResponse = await fetch(`${serverUserURL}/get-email`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const emailData = await emailResponse.json();
          if (emailResponse.ok) {
            setEmail(emailData.email);
          } else {
            alert('Failed to fetch email.');
          }
        } catch (error) {
          console.error('Error fetching email:', error);
        }

        // Fetch builder access
        try {
          const accessResponse = await fetch(`${serverUserURL}/check-builder-access`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const accessData = await accessResponse.json();
          if (accessResponse.ok) {
            setBuilderAccess(accessData.builder_access ? 'Yes' : 'No');
          } else {
            alert('Failed to fetch WebBuilder access status.');
          }
        } catch (error) {
          console.error('Error fetching WebBuilder access status:', error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, serverUserURL]);

  return (
    <div className="account-container">
      <div className="account-content">
        <h2>Account Information</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>WebBuilder access:</strong> {builderAccess}</p>
      </div>
    </div>
  );
}

export default Account;
