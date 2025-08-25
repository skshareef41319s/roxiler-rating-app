import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaStore, FaStar, FaSignOutAlt, FaUserPlus, FaBuilding } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(null);
  const [details, setDetails] = useState([]);
  const [message, setMessage] = useState("");
  const [userForm, setUserForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [owners, setOwners] = useState([]);
  const [showForms, setShowForms] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/users?role=OWNER", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOwners(res.data);
    } catch (err) {
      console.error("Failed to fetch owners:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Improved: toggle table on card click (open/close if clicking same card)
  const handleCardClick = async (type) => {
    if (view === type) {
      setView(null);
      setDetails([]);
      return;
    }
    setView(type);
    try {
      let endpoint =
        type === "ratings"
          ? "http://localhost:4000/admin/stores"
          : `http://localhost:4000/admin/${type}`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === "ratings") {
        const mapped = res.data.map((store) => ({
          ...store,
          raters: store.ratings
            ? store.ratings.map((r) => ({
                name: r.userName,
                score: r.score,
              }))
            : [],
        }));
        setDetails(mapped);
      } else setDetails(res.data);
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch ${type} details ❌`);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`http://localhost:4000/admin/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted successfully ✅");
      handleCardClick(type);
      fetchStats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete ❌");
    }
  };

  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/admin/users",
        userForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`User created successfully (ID: ${res.data.id}) ✅`);
      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });
      fetchStats();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to create user ❌");
    }
  };

  const handleStoreChange = (e) =>
    setStoreForm({ ...storeForm, [e.target.name]: e.target.value });
  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...storeForm };
    if (!payload.ownerId) delete payload.ownerId;
    try {
      const res = await axios.post(
        "http://localhost:4000/admin/stores",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Store created successfully (ID: ${res.data.id}) ✅`);
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStats();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to create store ❌");
    }
  };

  if (loading)
    return <div className="loading">Loading Admin Dashboard...</div>;
  if (!stats) return <div className="loading">No data available.</div>;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FaUser />,
      color: "linear-gradient(135deg, #4A90E2 25%, #243B55 75%)",
      shadow: "0 8px 32px rgba(74,144,226,0.2)",
      type: "users",
    },
    {
      label: "Total Stores",
      value: stats.totalStores,
      icon: <FaStore />,
      color: "linear-gradient(135deg, #43E97B 15%, #38F9D7 85%)",
      shadow: "0 8px 32px rgba(67,233,123,0.18)",
      type: "stores",
    },
    {
      label: "Total Ratings",
      value: stats.totalRatings,
      icon: <FaStar />,
      color: "linear-gradient(135deg, #FFD452 20%, #FF7E5F 100%)",
      shadow: "0 8px 32px rgba(255,212,82,0.16)",
      type: "ratings",
    },
  ];

  return (
    <div>
      <style>{`
        body, .admin-dashboard {
          background: linear-gradient(135deg, #141e30, #243b55);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fff;
        }
        .admin-dashboard-main {
          min-height: 100vh;
          padding: 40px 0;
          max-width: 1100px;
          margin: 0 auto;
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
          font-size: 18px;
          box-shadow: 0 2px 18px rgba(231,76,60,0.32);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.3s;
          z-index: 5;
        }
        .logout-btn:hover { transform: translateY(-2px) scale(1.05); }
        .dashboard-title {
          text-align: center;
          margin-bottom: 48px;
          font-size: 2.7rem;
          font-weight: bold;
          letter-spacing: 0.3px;
          color: #f1f1f1;
          text-shadow: 0px 4px 16px rgba(74,144,226,0.28);
        }
        .cards-premium {
          display: flex;
          gap: 36px;
          justify-content: center;
          margin-bottom: 48px;
        }
        .card-premium {
          flex: 1;
          min-width: 240px;
          padding: 40px 26px 30px;
          border-radius: 22px;
          text-align: center;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0,0,0,0.22);
          backdrop-filter: blur(18px);
          cursor: pointer;
          transition: transform 0.27s cubic-bezier(.44,1.02,.62,1.11), box-shadow 0.2s;
          border: 2.5px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.9s;
        }
        .card-premium:hover {
          transform: scale(1.04) translateY(-3px);
          box-shadow: 0 12px 44px rgba(74,144,226,0.23);
        }
        .card-icon-premium {
          font-size: 54px;
          margin-bottom: 16px;
          filter: drop-shadow(0 6px 18px rgba(255,255,255,0.18));
        }
        .card-label {
          font-size: 21px;
          font-weight: 600;
          margin-bottom: 10px;
          letter-spacing: 0.15px;
        }
        .card-value {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 0.8px;
        }
        .form-toggle-premium {
          margin: 0 auto 35px auto;
          display: block;
          padding: 18px 54px;
          font-size: 1.1rem;
          font-weight: bold;
          color: #fff;
          background: linear-gradient(135deg, #4a90e2 40%, #243b55 100%);
          border: none;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(74,144,226,0.14);
          cursor: pointer;
          transition: transform 0.23s, background 0.3s;
          letter-spacing: 0.3px;
        }
        .form-toggle-premium:hover {
          transform: translateY(-2px) scale(1.04);
          background: linear-gradient(135deg, #5aa0f2 65%, #4686d2 100%);
        }
        .form-section-premium {
          margin: 0 auto;
          margin-bottom: 35px;
          background: rgba(255,255,255,0.13);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 6px 32px rgba(0,0,0,0.15);
          padding: 32px;
          max-width: 720px;
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .form-box {
          width: 50%;
          padding: 12px 18px 15px;
          background: rgba(255,255,255,0.08);
          border-radius: 16px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.07);
        }
        .form-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 17px;
          font-weight: 600;
          margin-bottom: 10px;
          color: #a8d0ff;
        }
        form input, form select {
          width: 80%;
          padding: 12px;
          margin-bottom: 11px;
          border-radius: 10px;
          border: none;
          outline: none;
          background: rgba(255,255,255,0.20);
          color: #fff;
          font-size: 15px;
        }
        form input::placeholder { color: rgba(255,255,255,0.78); }
        form button {
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-weight: bold;
          color: #fff;
          cursor: pointer;
          font-size: 15px;
          width: 100%;
          margin-top: 2px;
          background: linear-gradient(135deg,#27ae60 60%,#1e8449 100%);
          box-shadow: 0 2px 18px rgba(39,174,96,0.24);
          transition: transform 0.2s;
        }
        .form-box .store-btn {
          background: linear-gradient(135deg,#2980b9 60%,#21618c 100%);
          box-shadow: 0 2px 18px rgba(41,128,185,0.22);
        }
        form button:hover { transform: translateY(-2px) scale(1.05);}
        .details-premium {
          margin-top: 42px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(15px);
          padding: 26px 22px;
          border-radius: 18px;
          box-shadow: 0 7px 32px rgba(0,0,0,0.18);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .details-premium h3 {
          text-align: center;
          margin-bottom: 18px;
          font-size: 1.3rem;
          color: #a8d0ff;
        }
        .details-premium table {
          width: 100%;
          border-collapse: collapse;
          color: #fff;
        }
        .details-premium th, .details-premium td {
          padding: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.16);
          font-size: 15px;
        }
        .details-premium th {
          color: #a8d0ff;
          font-weight: 600;
          background: rgba(255,255,255,0.07);
        }
        .delete-btn {
          background: linear-gradient(135deg, #e74c3c 60%, #c0392b 100%);
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(231,76,60,0.12);
          transition: transform 0.22s;
        }
        .delete-btn:hover { transform: scale(1.08); }
        .message-premium {
          margin-top: 22px;
          background: rgba(255,255,255,0.12);
          padding: 14px;
          border-radius: 10px;
          text-align: center;
          color: #fff;
          font-size: 17px;
          font-weight: 500;
          box-shadow: 0 2px 15px rgba(0,0,0,0.09);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
          .cards-premium { flex-direction: column; gap: 30px; }
          .form-section-premium { flex-direction: column; gap: 18px; max-width: 98vw; }
          .form-box { width: 100%; }
        }
      `}</style>

      <div className="admin-dashboard-main">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
        <div className="dashboard-title">Admin Dashboard</div>
        
        {/* Stats Cards */}
        <div className="cards-premium">
          {cards.map((c, idx) => (
            <div
              key={idx}
              className="card-premium"
              style={{ background: c.color, boxShadow: c.shadow }}
              onClick={() => handleCardClick(c.type)}
            >
              <div className="card-icon-premium">{c.icon}</div>
              <div className="card-label">{c.label}</div>
              <div className="card-value">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Toggle Forms Button */}
        <button
          className="form-toggle-premium"
          onClick={() => setShowForms(f => !f)}
        >
          {showForms ? "Hide Add User & Store Forms" : "Add User & Store"}
        </button>

        {/* User & Store Forms Section */}
        {showForms && (
          <div className="form-section-premium">
            {/* Add User Form */}
            <div className="form-box">
              <div className="form-title"><FaUserPlus /> Add User</div>
              <form onSubmit={handleUserSubmit}>
                <input name="name" placeholder="Name" value={userForm.name} onChange={handleUserChange} required />
                <input name="email" placeholder="Email" value={userForm.email} onChange={handleUserChange} required />
                <input name="address" placeholder="Address" value={userForm.address} onChange={handleUserChange} required />
                <input type="password" name="password" placeholder="Password" value={userForm.password} onChange={handleUserChange} required />
                <select name="role" value={userForm.role} onChange={handleUserChange}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                </select>
                <button type="submit">Create User</button>
              </form>
            </div>

            {/* Add Store Form */}
            <div className="form-box">
              <div className="form-title"><FaBuilding /> Add Store</div>
              <form onSubmit={handleStoreSubmit}>
                <input name="name" placeholder="Store Name" value={storeForm.name} onChange={handleStoreChange} required />
                <input name="email" placeholder="Store Email" value={storeForm.email} onChange={handleStoreChange} required />
                <input name="address" placeholder="Address" value={storeForm.address} onChange={handleStoreChange} required />
                <select name="ownerId" value={storeForm.ownerId} onChange={handleStoreChange}>
                  <option value="">Select Owner (optional)</option>
                  {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
                </select>
                <button className="store-btn" type="submit">Create Store</button>
              </form>
            </div>
          </div>
        )}

        {/* Details Section (table for card click, togglable) */}
        {view && (
          <div className="details-premium">
            <h3>{view.toUpperCase()} DETAILS</h3>
            <table>
              <thead>
                <tr>
                  {view === "users" && <><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></>}
                  {view === "stores" && <><th>Store</th><th>Owner</th><th>Actions</th></>}
                  {view === "ratings" && <><th>Store</th><th>Rater</th><th>Score</th></>}
                </tr>
              </thead>
              <tbody>
                {view === "users" && details.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                    <td>{u.role !== "ADMIN" && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(u.id, "users")}
                      >Delete</button>
                    )}</td>
                  </tr>
                ))}
                {view === "stores" && details.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td><td>{s.ownerName || "N/A"}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(s.id, "stores")}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                {view === "ratings" && details.map(store =>
                  (store.raters || []).length > 0 ? store.raters.map((r, idx) => (
                    <tr key={`${store.id}-${idx}`}>
                      <td>{store.name}</td><td>{r.name}</td><td>{r.score}</td>
                    </tr>
                  )) : <tr key={store.id}><td>{store.name}</td><td colSpan="2">No ratings yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {message && <div className="message-premium">{message}</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;