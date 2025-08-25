import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaStar } from "react-icons/fa";

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:4000/owner/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStores();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  if (loading)
    return (
      <div style={{
        textAlign: "center",
        marginTop: "60px",
        fontSize: "18px",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        Loading Owner Dashboard...
      </div>
    );

  return (
    <div>
      <style>{`
        body, .owner-dashboard {
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
        }
        .owner-dashboard {
          min-height: 100vh;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          position: relative;
        }
        .dashboard-main {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 0 0 0;
          position: relative;
        }
        .logout-btn {
          position: absolute;
          top: 32px;
          right: 32px;
          padding: 14px 22px;
          background: linear-gradient(135deg, #e74c3c 60%, #c0392b 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 600;
          font-size: 17px;
          box-shadow: 0 2px 18px rgba(231,76,60,0.18);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.3s;
          z-index: 5;
        }
        .logout-btn:hover { transform: translateY(-2px) scale(1.05); }
        .title {
          font-size: 2.1rem;
          font-weight: bold;
          margin-bottom: 38px;
          color: #f1f1f1;
          text-align: center;
          letter-spacing: 0.3px;
          text-shadow: 0px 4px 16px rgba(74,144,226,0.19);
        }
        .update-password-btn-fixed {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 10;
          padding: 15px 54px;
          font-size: 1.1rem;
          font-weight: bold;
          background: linear-gradient(135deg, #4a90e2 40%, #243b55 100%);
          color: #fff;
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(74,144,226,0.14);
          cursor: pointer;
          transition: transform 0.23s, background 0.3s;
          letter-spacing: 0.3px;
        }
        .update-password-btn-fixed:hover {
          transform: translateY(-2px) scale(1.04);
          background: linear-gradient(135deg, #5aa0f2 65%, #4686d2 100%);
        }
        .store-card {
          backdrop-filter: blur(9px);
          background: rgba(255,255,255,0.10);
          border-radius: 18px;
          padding: 32px 30px 14px;
          margin-bottom: 32px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.22);
          transition: transform 0.28s, box-shadow 0.28s;
          border: 2px solid rgba(255,255,255,0.08);
          animation: fadeIn 0.9s;
        }
        .store-card:hover {
          transform: scale(1.03) translateY(-5px);
          box-shadow: 0 14px 34px rgba(74,144,226,0.13);
        }
        .store-name {
          font-size: 1.35rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 10px;
          letter-spacing: 0.1px;
          text-shadow: 0px 2px 8px rgba(41,128,185,0.10);
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 1.08rem;
          margin-bottom: 15px;
          color: #fbd46d;
          font-weight: 500;
        }
        .star-icon {
          color: #FFD452;
          font-size: 1.3em;
          filter: drop-shadow(0 2px 8px rgba(255,212,82,0.11));
        }
        .raters-title {
          font-size: 1.03rem;
          font-weight: 600;
          margin-top: 13px;
          margin-bottom: 8px;
          color: #a8d0ff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid rgba(255,255,255,0.14);
          padding: 9px 11px;
          text-align: center;
          font-size: 15px;
          color: #fff;
          background: rgba(255,255,255,0.07);
        }
        th {
          font-weight: 600;
          background: rgba(255,255,255,0.12);
          color: #a8d0ff;
        }
        tr:hover td {
          background: rgba(255,255,255,0.10);
        }
        .no-ratings {
          color: #c9c9c9;
          font-style: italic;
          margin-top: 8px;
          font-size: 15px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
          .dashboard-main { padding: 24px 8px; }
          .store-card { padding: 18px 7px 8px; }
        }
        @media (max-width: 600px) {
          .dashboard-main { padding: 10px 1px; }
          .logout-btn { padding: 8px 13px; font-size: 15px; top: 12px; right: 8px;}
          .update-password-btn-fixed { padding: 10px 22px; font-size: 1rem; bottom: 12px; right: 8px;}
        }
      `}</style>

      <div className="owner-dashboard">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
        <div className="dashboard-main">
          <h2 className="title">Owner Dashboard</h2>
          {stores.length === 0 ? (
            <p style={{
              textAlign: "center",
              fontSize: "17px",
              color: "#a8d0ff",
              background: "rgba(255,255,255,0.07)",
              padding: "22px",
              borderRadius: "14px",
              boxShadow: "0 2px 10px rgba(74,144,226,0.08)"
            }}>
              No stores owned yet.
            </p>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="store-card">
                <h3 className="store-name">{store.name}</h3>
                <div className="rating">
                  <FaStar className="star-icon" />
                  Average Rating: {store.averageRating || 0}
                </div>
                <div className="raters-title">Raters:</div>
                {store.raters && store.raters.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.raters.map((r) => (
                        <tr key={r.id}>
                          <td>{r.name}</td>
                          <td>{r.email}</td>
                          <td>{r.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="no-ratings">No ratings yet</div>
                )}
              </div>
            ))
          )}
        </div>
        <button
          className="update-password-btn-fixed"
          onClick={() => navigate("/update-password")}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;