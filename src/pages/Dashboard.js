import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, Activity, TrendingUp, Clock, Shield, Award,
  Calendar, MapPin, Smartphone, Globe, ArrowUpRight,
  BarChart3, PieChart, Zap, Star, Target, Sparkles
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/useAuth';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    weeklyGrowth: 0,
    securityScore: 0,
    lastActive: null,
    achievements: 0,
    streak: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API calls with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalSessions: Math.floor(Math.random() * 150) + 50,
          weeklyGrowth: Math.floor(Math.random() * 20) + 5,
          securityScore: Math.floor(Math.random() * 30) + 70,
          lastActive: new Date(),
          achievements: Math.floor(Math.random() * 8) + 3,
          streak: Math.floor(Math.random() * 15) + 5
        });

        setRecentActivities([
          {
            id: 1,
            type: 'login',
            message: 'Successful login from MacBook Pro',
            time: '2 minutes ago',
            location: 'San Francisco, CA',
            icon: Smartphone,
            color: 'text-green-500'
          },
          {
            id: 2,
            type: 'security',
            message: 'Password strength updated',
            time: '1 hour ago',
            icon: Shield,
            color: 'text-blue-500'
          },
          {
            id: 3,
            type: 'profile',
            message: 'Profile information updated',
            time: '3 hours ago',
            icon: Users,
            color: 'text-purple-500'
          },
          {
            id: 4,
            type: 'achievement',
            message: 'Security milestone reached!',
            time: '1 day ago',
            icon: Award,
            color: 'text-yellow-500'
          }
        ]);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, change, description, gradient }) => (
    <Card className="card-hover group overflow-hidden relative">
      <div className={`absolute inset-0 opacity-5 ${gradient}`}></div>
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground group-hover:scale-110 transition-transform duration-200" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="flex items-center text-sm">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-500 font-medium">{change}%</span>
          <span className="text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-8 fade-in">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-96 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <Users className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button variant="gradient" onClick={() => navigate('/settings')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade Account
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Activity}
          title="Total Sessions"
          value={stats.totalSessions}
          change={stats.weeklyGrowth}
          description="this week"
          gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Shield}
          title="Security Score"
          value={`${stats.securityScore}%`}
          change="2"
          description="improvement"
          gradient="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Award}
          title="Achievements"
          value={stats.achievements}
          change="12"
          description="this month"
          gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
        />
        <StatCard
          icon={Zap}
          title="Daily Streak"
          value={`${stats.streak} days`}
          change="5"
          description="vs last week"
          gradient="bg-gradient-to-br from-purple-500 to-pink-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Activity Overview
                </CardTitle>
                <CardDescription>Your account activity over the past 7 days</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {[40, 60, 45, 80, 65, 90, 70].map((height, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div
                    className={`w-full bg-gradient-to-t from-primary to-chart-2 rounded-t transition-all duration-500 hover:scale-105`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest account events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 group">
                  <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.location && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{activity.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Commonly used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/profile')}>
                <Users className="w-5 h-5" />
                <span className="text-sm">Edit Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" onClick={() => navigate('/settings')}>
                <Shield className="w-5 h-5" />
                <span className="text-sm">Security</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Globe className="w-5 h-5" />
                <span className="text-sm">Preferences</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">Feedback</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Account Status
            </CardTitle>
            <CardDescription>Your account health summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-bold">85%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div className="bg-gradient-to-r from-primary to-chart-2 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Level</span>
                <span className="text-sm font-bold text-green-500">High</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '92%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Activity Level</span>
                <span className="text-sm font-bold text-blue-500">Very Active</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
