import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../context/useAuth';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const { isAuthenticated, user, getUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setProfile(userData);
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, getUserProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <h1>Dashboard</h1>
        
        {user && (
          <div className="user-welcome">
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
          </div>
        )}
        
        {profile && (
          <div className="profile-info">
            <h3>Account Info</h3>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Account created: {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        )}
        
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
