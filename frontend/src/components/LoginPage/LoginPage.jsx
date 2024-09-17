import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPage.css'; // Optional: for styling

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Admin'); // Default role
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ email, password, role });
        await login();
    };

    const login = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    // Store the JWT token in localStorage
                    localStorage.setItem('token', data.token);

                    // Redirect based on the role
                    if (role === 'Admin') {
                        navigate('/adminDashboard');
                    } else if (role === 'Store-Owner') {
                        navigate('/storeOwnerDashboard');
                    } else {
                        navigate('/normalDashboard');
                    }
                } else {
                    setError(data.message || 'Login failed');
                }
            } else {
                setError(data.message || 'Network error or server issue');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Admin">Admin</option>
                        <option value="Normal-User">Normal-User</option>
                        <option value="Store-Owner">Store-Owner</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Your Email'
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter Your Password'
                        required
                    />
                </div>
                <div className='form-group'>
                    <button className='login-btn' type="submit">Login</button>
                </div>
            </form>
            <div className="register-link">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
            <p className="message">{message}</p>
            <p className="error">{error}</p>
        </div>
    );
};

export default LoginPage;
