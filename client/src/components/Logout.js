// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const serverURL = localStorage.getItem('serverURL');
      const response = await fetch(`${serverURL}/api/users/logout`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      console.log('Logout successful');
      localStorage.removeItem('isLoggedIn'); // Remove login state
      navigate('/login'); // Redirect to login page if not logged in
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle logout error (display message, reset state, etc.)
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
