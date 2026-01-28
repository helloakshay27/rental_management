import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { ArrowLeft, Edit, Calendar, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const MaintenanceRequestDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getAuth(`/maintenance_requests/${id}.json`);
                setRequest(data.maintenance_request || data);
            } catch (error) {
                console.error('Failed to fetch request details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="p-8 w-full bg-white rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Maintenance Request not found</p>
                <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
                        <p className="text-gray-500">ID: {request.id}</p>
                    </div>
                </div>
                <Button
                    onClick={() => navigate(`/maintenance/edit/${id}`)}
                    className="bg-[#C72030] hover:bg-[#A01825] text-white"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Request
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            {request.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                            <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Issue Type</h3>
                                <p className="text-gray-900 font-medium capitalize">{request.issue_type}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Scope</h3>
                                <p className="text-gray-900 font-medium capitalize">{request.maintenance_scope}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Cost</h3>
                                <p className="text-gray-900 font-medium">₹{request.estimated_cost || '0.00'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Created Date</h3>
                                <div className="flex items-center gap-2 text-gray-900 font-medium">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    {new Date(request.created_at || Date.now()).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        {request.documents && request.documents.length > 0 && (
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Attachments</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {request.documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{doc.document_type}</p>
                                                {doc.url && (
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-[#C72030] hover:underline mt-1 inline-block"
                                                    >
                                                        View Document
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Status & Priority</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                                <Badge className={`${getStatusColor(request.status)} px-3 py-1 capitalize`}>
                                    {request.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Priority Level</p>
                                <Badge variant="outline" className={`${getPriorityColor(request.priority)} px-3 py-1 capitalize`}>
                                    {request.priority}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Card */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Property</p>
                                <p className="text-gray-900 font-medium">{request.site?.name || request.site_id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Unit</p>
                                <p className="text-gray-900 font-medium">{request.unit?.name || request.unit_id || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tenant</p>
                                <p className="text-gray-900 font-medium">{request.tenant?.name || request.tenant?.company_name || request.tenant_id || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceRequestDetailsPage;
