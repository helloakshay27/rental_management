
import React, { useState, useEffect, useRef } from 'react';
import { User, Loader2, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAuth, putAuth, API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

const ProfileTab = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userData, setUserData] = useState<any>({
    full_name: '',
    email: '',
    phone: '',
    roles: [],
    department: '',
    joining_date: '',
    bio: '',
    avatar_url: ''
  });
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [rolesList, setRolesList] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.id) {
          const data = await getAuth(`/users/${storedUser.id}.json`);
          const avatarUrl = data.profile_image?.url
            ? (data.profile_image.url.startsWith('http') ? data.profile_image.url : `${API_BASE_URL}${data.profile_image.url}`)
            : '';

          setUserData({
            ...data,
            roles: data.roles || [],
            joining_date: data.joining_date || '',
            department: data.department || '',
            avatar_url: avatarUrl
          });

          // Also update localStorage with the latest avatar_url
          localStorage.setItem('user', JSON.stringify({ ...storedUser, avatar_url: avatarUrl }));
          window.dispatchEvent(new Event('auth-changed'));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAuth('/roles.json');
        setRolesList(data.roles || data || []);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        user: {
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          roles: Array.isArray(userData.roles) ? userData.roles : [userData.roles],
          department: userData.department,
          joining_date: userData.joining_date
        },
        ...(base64Image && { base64_data: base64Image })
      };

      const data = await putAuth(`/users/${storedUser.id}`, payload);
      toast.success('Profile updated successfully');

      // Refresh avatar_url from the response if available, or fetch again
      const updatedAvatarUrl = data.profile_image?.url
        ? (data.profile_image.url.startsWith('http') ? data.profile_image.url : `${API_BASE_URL}${data.profile_image.url}`)
        : userData.avatar_url;

      // Update local storage name/email/avatar if they changed
      const updatedUser = {
        ...storedUser,
        full_name: userData.full_name,
        email: userData.email,
        avatar_url: updatedAvatarUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData({ ...userData, avatar_url: updatedAvatarUrl });
      setBase64Image(null); // Clear the preview as we now have the saved URL
      window.dispatchEvent(new Event('auth-changed'));

    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const initials = userData.full_name
    ? userData.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm p-8">
      <CardHeader className="pt-0 pb-6 px-0">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription className="text-gray-500">Update your personal and contact information</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-8">
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={base64Image || userData.avatar_url} />
              <AvatarFallback className="bg-[#C72030] text-white text-2xl font-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:text-[#C72030] transition-colors"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-red-600 text-red-600 hover:bg-red-50 font-bold"
            >
              Change Photo
            </Button>
            <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Full Name</Label>
            <Input
              value={userData.full_name}
              onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium focus:bg-white transition-all"
              placeholder="Enter full name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Email Address</Label>
            <Input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium focus:bg-white transition-all"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Phone Number</Label>
            <Input
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium focus:bg-white transition-all"
              placeholder="+91 0000000000"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Department / Company</Label>
            <Input
              value={userData.department}
              onChange={(e) => setUserData({ ...userData, department: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium focus:bg-white transition-all"
              placeholder="Finance, IT, etc."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Role</Label>
            <Select
              value={userData.roles?.[0]?.toString() || ''}
              onValueChange={(val) => setUserData({ ...userData, roles: [parseInt(val)] })}
            >
              <SelectTrigger className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {rolesList.map((role: any) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-900 font-bold text-sm block">Joining Date</Label>
            <Input
              type="date"
              value={userData.joining_date}
              onChange={(e) => setUserData({ ...userData, joining_date: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 h-12 text-gray-700 font-medium focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-gray-900 font-bold text-sm block">Bio</Label>
            <Textarea
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              className="bg-gray-50 border-2 border-gray-100 min-h-[120px] text-gray-700 font-medium focus:bg-white transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-start">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#C72030] hover:bg-[#A01825] text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
