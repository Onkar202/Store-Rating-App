import React, { useState } from "react";
import axios from "axios";
import './ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token'); // Ensure the token is available

      const response = await axios.post('http://localhost:5000/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authorization
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password');
    }
  };

  return (
    <div id="main">
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter-old-password"
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter-New-password"
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePassword;
