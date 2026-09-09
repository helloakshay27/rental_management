
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Shield, ArrowLeft, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const RoleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRoleDetails();
    }, [id]);

    const fetchRoleDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/roles/${id}`);
            setRole(data);
        } catch (error) {
            console.error('Failed to fetch role details:', error);
            toast.error('Failed to load role details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!role) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Role not found</p>
                    <Button onClick={() => navigate('/masters/roles')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Role Details"
                backTo="/masters/roles"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={role.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}>
                        {role.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Information */}
                <DetailSection title="General Information" className="lg:col-span-2">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Role Name</p>
                                <p className="text-brand-body-1 font-bold text-gray-900">{role.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Description</p>
                                <p className="text-gray-700 leading-relaxed">{role.description || 'No description provided.'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Permissions</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {role.permissions && role.permissions.length > 0 ? (
                                        role.permissions.map((permission: string, index: number) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="text-sm font-medium text-gray-700">{permission}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400">No permissions assigned</span>
                                    )}
                                </div>
                            </div>
                        </div>
                </DetailSection>

                {/* Usage Statistics */}
                <DetailSection title="Associated Users">
                        <div className="space-y-5">
                            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-brand-h1 font-bold text-[#C72030]">{role.users_count || 0}</p>
                                <p className="text-[10px] text-red-600 uppercase font-semibold tracking-wider mt-1">Active Users</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Recent Users with this Role</p>
                                <div className="space-y-3">
                                    {role.users && role.users.length > 0 ? (
                                        role.users.slice(0, 5).map((user: any) => (
                                            <div key={user.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                                                    <p className="text-[10px] text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-xs text-gray-400 italic">No users currently assigned to this role</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Created At</span>
                                    <span className="text-gray-900">{new Date(role.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 font-medium">Last Modified</span>
                                    <span className="text-gray-900">{new Date(role.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                </DetailSection>
            </div>
        </PageContainer>
    );
};

export default RoleDetailsPage;
