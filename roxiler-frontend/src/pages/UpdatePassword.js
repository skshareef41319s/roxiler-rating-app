import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // 'USER' or 'OWNER'

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const endpoint = role === 'OWNER' ? '/owner/update-password' : '/user/update-password';
      const res = await api.put(
        endpoint,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');

      setTimeout(() => {
        if (role === 'OWNER') navigate('/owner');
        else navigate('/user');
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const handleBack = () => {
    if (role === 'OWNER') navigate('/owner');
    else navigate('/user');
  };

  return (
    <div>
      <style>{`
        body, .update-password-bg {
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
        }
        .update-password-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .update-password-card {
          backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.13);
          padding: 44px 34px 34px;
          border-radius: 24px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.32);
          width: 100%;
          max-width: 400px;
          color: #fff;
          animation: fadeIn 0.7s ease-in-out;
          border: 2.5px solid rgba(255,255,255,0.08);
          text-align: center;
          position: relative;
        }
        .back-btn {
          position: absolute;
          left: 22px;
          top: 19px;
          background: linear-gradient(135deg, #4a90e2 60%, #357ab7 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(74,144,226,0.13);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.18s, background 0.25s;
        }
        .back-btn:hover {
          transform: scale(1.06) translateY(-1px);
          background: linear-gradient(135deg, #5aa0f2 80%, #4686d2 100%);
        }
        .update-password-card h2 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 26px;
          letter-spacing: 0.2px;
          color: #f1f1f1;
          text-shadow: 0px 4px 16px rgba(74,144,226,0.19);
        }
        .input-wrapper {
          position: relative;
          margin-bottom: 25px;
        }
        .input-wrapper input {
          width: 80%;
          padding: 13px 45px;
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
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #ddd;
          font-size: 17px;
        }
        .update-btn {
          width: 100%;
          padding: 15px 0;
          margin-top: 8px;
          background: linear-gradient(135deg, #4a90e2 60%, #357ab7 100%);
          color: #fff;
          font-size: 17px;
          font-weight: bold;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(74,144,226,0.14);
          transition: transform 0.2s, background 0.3s;
          letter-spacing: 0.3px;
        }
        .update-btn:hover {
          transform: translateY(-2px) scale(1.04);
          background: linear-gradient(135deg, #5aa0f2 65%, #4686d2 100%);
        }
        .update-message {
          margin-top: 18px;
          color: #ffdf80;
          font-size: 15px;
          font-weight: 500;
          background: rgba(255,255,255,0.1);
          padding: 9px 0;
          border-radius: 8px;
          text-align: center;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 600px) {
          .update-password-card { padding: 28px 10px 18px; }
          .back-btn { left: 8px; top: 8px; padding: 7px 11px; font-size: .9rem;}
        }
      `}</style>

      <div className="update-password-bg">
        <div className="update-password-card">
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>
          <h2>Update Password</h2>
          <form onSubmit={handleUpdate}>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="update-btn">
              Update
            </button>
          </form>
          {message && <div className="update-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}