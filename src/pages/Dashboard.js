import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserCircle, Calendar, Clock, Mail, 
  ActivitySquare, Shield, LogOut,
  TrendingUp, Settings, ArrowRight
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    daysActive: 0,
    loginCount: 0,
    lastLogin: null,
    securityScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      try {
        const userData = await getUserProfile();
        setProfile(userData);
        
        // Set some mock stats
        setStats({
          daysActive: Math.floor(Math.random() * 30) + 1,
          loginCount: Math.floor(Math.random() * 50) + 1,
          lastLogin: new Date().toISOString(),
          securityScore: Math.floor(Math.random() * 40) + 60 // 60-100 range
        });
      } catch (error) {
        toast.error('Failed to fetch profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, getUserProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  // Activity data (mock)
  const recentActivities = [
    { id: 1, type: 'login', date: new Date(Date.now() - 3600000).toISOString(), location: 'San Francisco, US' },
    { id: 2, type: 'profile_update', date: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, type: 'login', date: new Date(Date.now() - 172800000).toISOString(), location: 'New York, US' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-slate-800 rounded mb-8"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-slate-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-slate-400 mt-1">Here's your account overview and recent activity</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/profile')}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <section className="mb-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Days Active
                <Calendar className="h-5 w-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.daysActive} days</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+2%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Login Count
                <ActivitySquare className="h-5 w-5 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.loginCount}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+5%</span> from last week
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Last Login
                <Clock className="h-5 w-5 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.lastLogin ? formatDate(stats.lastLogin).split(',')[0] : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.lastLogin ? new Date(stats.lastLogin).getFullYear() : ''}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between items-center">
                Security Score
                <Shield className="h-5 w-5 text-amber-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.securityScore}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${stats.securityScore}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Main Content */}
      {profile && (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Account Information */}
          <section className="md:col-span-7">
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Account Information</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Your profile details and account settings</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/profile')}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardHeader>
              <div className="p-5 space-y-5">
                <div className="flex items-center">
                  <UserCircle className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground w-32">Name:</span>
                  <span>{profile.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground w-32">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground w-32">Account Created:</span>
                  <span>
                    {formatDate(profile.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          </section>
          
          {/* Activity Summary */}
          <section className="md:col-span-5">
            <Card>
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Activity Summary</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Your login activity over time</p>
                  </div>
                </div>
              </CardHeader>
              <div className="p-6 flex flex-col items-center justify-center">
                <div className="flex justify-center items-center h-48 opacity-30">
                  <svg className="w-48 h-48" viewBox="0 0 200 100">
                    <rect x="10" y="70" width="20" height="30" fill="currentColor" />
                    <rect x="40" y="40" width="20" height="60" fill="currentColor" />
                    <rect x="70" y="60" width="20" height="40" fill="currentColor" />
                    <rect x="100" y="20" width="20" height="80" fill="currentColor" />
                    <rect x="130" y="50" width="20" height="50" fill="currentColor" />
                    <rect x="160" y="30" width="20" height="70" fill="currentColor" />
                  </svg>
                </div>
                <p className="text-center text-muted-foreground text-sm mt-4">
                  Detailed analytics will be available soon
                </p>
              </div>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
