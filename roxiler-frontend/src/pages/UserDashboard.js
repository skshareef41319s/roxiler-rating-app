import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaStar } from "react-icons/fa";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState({}); 
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user/stores", {
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

  const handleStarClick = (storeId, score) => {
    setRatingInput((prev) => ({
      ...prev,
      [storeId]: score,
    }));
  };

  const handleRate = async (storeId) => {
    const score = ratingInput[storeId];
    if (!score) return;
    try {
      await axios.post(
        `http://localhost:4000/user/rate/${storeId}`,
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted ✅");

      const res = await axios.get("http://localhost:4000/user/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
      setRatingInput((prev) => ({
        ...prev,
        [storeId]: undefined,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating ❌");
    }
  };

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
        Loading User Dashboard...
      </div>
    );

  return (
    <div>
      <style>{`
        body, .user-dashboard {
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
        }
        .user-dashboard {
          min-height: 100vh;
          padding: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dashboard-title {
          font-size: 2.1rem;
          font-weight: bold;
          margin: 48px 0 38px 0;
          text-align: center;
          color: #f1f1f1;
          letter-spacing: 0.2px;
          text-shadow: 0px 4px 16px rgba(74,144,226,0.18);
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
        .dashboard-content {
          width: 100%;
          max-width: 800px;
          margin-bottom: 80px;
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
        .rating-info {
          font-size: 1.06rem;
          margin-bottom: 8px;
          color: #fbd46d;
          font-weight: 500;
        }
        .star-rating {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 12px;
          margin-bottom: 2px;
        }
        .star {
          cursor: pointer;
          font-size: 2em;
          color: #d3d3d3;
          transition: color 0.2s, transform 0.15s;
          filter: drop-shadow(0 2px 8px rgba(255,212,82,0.08));
        }
        .star.selected {
          color: #FFD452;
          transform: scale(1.1);
        }
        .star:hover {
          color: #FFB400;
          transform: scale(1.2);
        }
        .rate-btn {
          margin-top: 14px;
          padding: 11px 22px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          color: #fff;
          background: linear-gradient(135deg, #4a90e2 60%, #357ab7 100%);
          box-shadow: 0 2px 10px rgba(74,144,226,0.11);
          cursor: pointer;
          transition: transform 0.18s, background 0.25s;
        }
        .rate-btn:hover {
          transform: scale(1.06) translateY(-1px);
          background: linear-gradient(135deg, #5aa0f2 80%, #4686d2 100%);
        }
        .no-stores {
          text-align: center;
          font-size: 1.15rem;
          color: #a8d0ff;
          background: rgba(255,255,255,0.07);
          padding: 22px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(74,144,226,0.08);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
          .dashboard-content { padding: 24px 8px; }
          .store-card { padding: 18px 7px 8px; }
        }
        @media (max-width: 600px) {
          .dashboard-content { padding: 10px 1px; }
          .logout-btn { padding: 8px 13px; font-size: 15px; top: 12px; right: 8px;}
          .update-password-btn-fixed { padding: 10px 22px; font-size: 1rem; bottom: 12px; right: 8px;}
          .star { font-size: 1.4em; }
        }
      `}</style>

      <div className="user-dashboard">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>

        <div className="dashboard-title">User Dashboard</div>
        <div className="dashboard-content">
          {stores.length === 0 ? (
            <div className="no-stores">No stores available.</div>
          ) : (
            stores.map((store) => {
              const selectedRating = ratingInput[store.id] || 0;
              return (
                <div key={store.id} className="store-card">
                  <h3 className="store-name">{store.name}</h3>
                  <div className="rating-info">
                    Average Rating: {(store.averageRating || 0).toFixed(2)}
                  </div>
                  <div className="rating-info">
                    My Rating: {store.myRating != null ? store.myRating.toFixed(2) : "N/A"}
                  </div>
                  {/* Interactive star rating */}
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <FaStar
                        key={score}
                        className={`star${selectedRating >= score ? " selected" : ""}`}
                        onClick={() => handleStarClick(store.id, score)}
                      />
                    ))}
                  </div>
                  <button
                    className="rate-btn"
                    disabled={!selectedRating}
                    onClick={() => handleRate(store.id)}
                  >
                    Submit Rating
                  </button>
                </div>
              );
            })
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

export default UserDashboard;