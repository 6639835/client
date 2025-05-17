import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserCircle, Mail, Pencil, Calendar, Save } from 'lucide-react';

import Navbar from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/useAuth';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const { isAuthenticated, user, getUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setProfile(userData);
        setFormData({
          name: userData.name,
          email: userData.email
        });
      } catch (error) {
        toast.error('Failed to fetch profile data');
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, getUserProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This would normally update the profile, but we'll just simulate it for now
    setProfile({ ...profile, ...formData });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>
          
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Name</span>
                      <span className="font-medium">{profile.name}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Email</span>
                      <span className="font-medium">{profile.email}</span>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                      <span className="font-medium">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {!isEditing && (
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="ml-auto"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile; 