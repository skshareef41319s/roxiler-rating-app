import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaHome, FaLock } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/signup', { name, email, address, password });
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div>
      <style>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .signup-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.12);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 420px;
          text-align: center;
          color: #fff;
          animation: fadeIn 0.7s ease-in-out;
        }
        .signup-card h2 {
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: bold;
          color: #f1f1f1;
        }
        .input-wrapper {
          position: relative;
          margin: 15px 0;
        }
        .input-wrapper input {
          width: 77%;
          padding: 12px 45px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          line-height: 1.2;
          outline: none;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          transition: 0.3s ease;
        }
        .input-wrapper input:focus {
          background: rgba(255, 255, 255, 0.28);
          box-shadow: 0 0 8px rgba(74,144,226,0.6);
        }
        .input-wrapper input::placeholder {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 400;
        }
        .input-wrapper input:focus::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
        .input-icon,
        .toggle-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #ddd;
        }
        .input-icon {
          left: 15px;
          font-size: 16px;
        }
        .toggle-icon {
          right: 15px;
          font-size: 18px;
          cursor: pointer;
        }
        .signup-card button {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          background: linear-gradient(135deg, #4a90e2, #357ab7);
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s ease;
        }
        .signup-card button:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #5aa0f2, #4686d2);
        }
        .signup-message {
          margin-top: 15px;
          font-size: 14px;
        }
        .signup-error { color: #ff6b6b; }
        .signup-success { color: #5cb85c; }
        .login-link {
          margin-top: 20px;
          display: block;
          font-size: 14px;
          color: #a8d0ff;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s;
        }
        .login-link:hover {
          color: #fff;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <h2>Create Account 🔐</h2>
          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Address */}
            <div className="input-wrapper">
              <FaHome className="input-icon" />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {showPassword ? (
                <IoEyeOff
                  className="toggle-icon"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoEye
                  className="toggle-icon"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <button type="submit">Sign Up</button>
          </form>

          {error && <p className="signup-message signup-error">{error}</p>}
          {success && <p className="signup-message signup-success">{success}</p>}

          {/* Login Link */}
          <Link to="/" className="login-link">
            Already have an account? <strong>Login</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
