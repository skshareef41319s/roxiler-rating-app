import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);

      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'OWNER') navigate('/owner');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <style>{`
        body, .login-container {
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
        }
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .login-card {
          backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.13);
          padding: 48px 38px 38px;
          border-radius: 24px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.32);
          width: 100%;
          max-width: 400px;
          text-align: center;
          color: #fff;
          animation: fadeIn 0.7s ease-in-out;
          border: 2.5px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }
        .login-card h2 {
          margin-bottom: 26px;
          font-size: 2rem;
          font-weight: bold;
          color: #f1f1f1;
          letter-spacing: 0.2px;
          text-shadow: 0px 4px 16px rgba(74,144,226,0.23);
        }
        .input-wrapper {
          position: relative;
          margin: 18px 0;
        }
        .input-wrapper input {
          width: 80%;
          padding: 13px 48px;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          line-height: 1.2;
          outline: none;
          background: rgba(255,255,255,0.22);
          color: #fff;
          transition: 0.3s ease;
          box-shadow: 0 2px 8px rgba(74,144,226,0.12);
        }
        .input-wrapper input:focus {
          background: rgba(255,255,255,0.32);
          box-shadow: 0 0 10px rgba(74,144,226,0.23);
        }
        .input-wrapper input::placeholder {
          color: rgba(255,255,255,0.86);
          font-weight: 400;
        }
        .input-wrapper input:focus::placeholder {
          color: rgba(255,255,255,0.65);
        }
        .input-icon,
        .toggle-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #ddd;
        }
        .input-icon {
          left: 16px;
          font-size: 17px;
        }
        .toggle-icon {
          right: 16px;
          font-size: 20px;
          cursor: pointer;
        }
        .login-card button {
          width: 100%;
          padding: 15px 0;
          margin-top: 18px;
          background: linear-gradient(135deg, #4a90e2 60%, #357ab7 100%);
          color: #fff;
          font-size: 17px;
          font-weight: bold;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(74,144,226,0.14);
          transition: transform 0.2s ease, background 0.3s ease;
          letter-spacing: 0.3px;
        }
        .login-card button:hover {
          transform: translateY(-2px) scale(1.04);
          background: linear-gradient(135deg, #5aa0f2 65%, #4686d2 100%);
        }
        .error {
          margin-top: 16px;
          color: #ff6b6b;
          font-size: 15px;
          font-weight: 500;
          background: rgba(255,255,255,0.1);
          padding: 9px 0;
          border-radius: 8px;
        }
        .signup-link {
          margin-top: 26px;
          display: block;
          font-size: 15px;
          color: #a8d0ff;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s;
          font-weight: 500;
        }
        .signup-link strong {
          font-weight: bold;
        }
        .signup-link:hover {
          color: #fff;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 500px) {
          .login-card {
            padding: 28px 10px 24px;
            min-width: 0;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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

            <button type="submit">Login</button>
          </form>

          {error && <p className="error">{error}</p>}

          {/* Signup Link */}
          <Link to="/signup" className="signup-link">
            Don’t have an account? <strong>Sign Up</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}