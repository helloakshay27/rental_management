
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User as UserIcon, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

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
            <PageLoader />
        );
    }

    if (!user) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">User not found</p>
                    <Button onClick={() => navigate('/masters/users')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="User Profile"
                backTo="/masters/users"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={user.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <DetailSection title="Public Profile" className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Full Name</p>
                                        <p className="text-lg font-medium text-gray-900">{user.full_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Email Address</p>
                                        <p className="text-[14px] font-medium text-brand-text">{user.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Phone Number</p>
                                        <p className="text-[14px] font-medium text-brand-text">{user.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Department</p>
                                        <p className="text-[14px] font-medium text-brand-text">{user.department || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Designation</p>
                                        <p className="text-[14px] font-medium text-brand-text">{user.designation || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Joining Date</p>
                                        <p className="text-[14px] font-medium text-brand-text">
                                            {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                {/* System Information */}
                <DetailSection title="System Roles">
                        <div className="space-y-5">
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
                                        <span className="text-[14px] font-medium text-brand-text">{new Date(user.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Last Meta Update</span>
                                        <span className="text-[14px] font-medium text-brand-text">{new Date(user.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>
            </div>
        </PageContainer>
    );
};

export default UserDetailsPage;
