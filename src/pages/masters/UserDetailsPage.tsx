
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User as UserIcon, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit, Loader2, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const UserDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/users/${id}`);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            toast.error('Failed to load user details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">User not found</p>
                    <Button onClick={() => navigate('/masters/users')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/users')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Users
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                        <p className="text-gray-500">ID: {user.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={user.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <UserIcon className="h-5 w-5 text-[#C72030]" />
                            Public Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                                        <p className="text-lg font-medium text-gray-900">{user.full_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                        <p className="font-medium text-gray-900">{user.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</p>
                                        <p className="font-medium text-gray-900">{user.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Department</p>
                                        <p className="font-medium text-gray-900">{user.department || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Designation</p>
                                        <p className="font-medium text-gray-900">{user.designation || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Joining Date</p>
                                        <p className="font-medium text-gray-900">
                                            {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Information */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Shield className="h-5 w-5 text-[#C72030]" />
                            System Roles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Assigned Roles</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((role: any) => (
                                            <Badge key={role.id} variant="secondary" className="bg-red-50 text-[#C72030] hover:bg-red-100 border-none px-3 py-1">
                                                {role.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">No roles assigned</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-tight">Active Usage</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Created At</span>
                                        <span className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Last Meta Update</span>
                                        <span className="font-medium text-gray-900">{new Date(user.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserDetailsPage;
