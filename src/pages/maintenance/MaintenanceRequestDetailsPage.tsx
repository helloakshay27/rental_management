import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Calendar, FileText, Receipt, Plus, Loader2 } from 'lucide-react';
import AddMaintenanceCostModal from '@/components/maintenance/AddMaintenanceCostModal';

const MaintenanceRequestDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCostModalOpen, setIsCostModalOpen] = useState(false);

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

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            const payload = {
                maintenance_request: {
                    status: newStatus
                }
            };
            await patchAuth(`/maintenance_requests/${id}.json`, payload);
            toast.success('Status updated successfully');
            fetchRequest(); // Refresh data
        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.message || 'Failed to update status');
        }
    };

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
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsCostModalOpen(true)}
                        className="border-[#C72030] text-[#C72030] hover:bg-red-50 font-bold"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        ADD COST
                    </Button>
                    <Button
                        onClick={() => navigate(`/maintenance/edit/${id}`)}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Request
                    </Button>
                </div>
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

                        {/* Maintenance Costs Section */}
                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-[#C72030]" />
                                    Maintenance Costs
                                </h3>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Maintenance Cost</p>
                                    <p className="text-xl font-black text-[#C72030]">
                                        ₹{request.maintenance_costs?.reduce((acc: number, curr: any) => acc + parseFloat(curr.amount || 0), 0).toLocaleString() || '0'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {request.maintenance_costs && request.maintenance_costs.length > 0 ? (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {request.maintenance_costs.map((cost: any, index: number) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <Badge variant="outline" className="capitalize text-[10px] font-bold border-gray-300">
                                                                {cost.cost_type}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-700">{cost.description}</td>
                                                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">₹{parseFloat(cost.amount).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50">
                                        <Receipt className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">No costs added yet for this request</p>
                                        <Button
                                            variant="link"
                                            onClick={() => setIsCostModalOpen(true)}
                                            className="text-[#C72030] font-bold mt-1"
                                        >
                                            Click here to add the first cost
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        {request.documents && request.documents.length > 0 && (
                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-[#C72030]" />
                                    Attachments
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {request.documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all group">
                                            <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                                <FileText className="h-6 w-6 text-[#C72030]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{doc.file_name}</p>
                                                <p className="text-xs text-gray-500 capitalize mt-0.5">{doc.document_type}</p>
                                                {doc.url && (
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-[#C72030] font-bold hover:underline mt-2 inline-flex items-center gap-1"
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
                                <Select
                                    value={request.status}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger className={`w-full h-11 border-2 font-bold capitalize ${getStatusColor(request.status)}`}>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In-Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
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

                    {/* Vendor Card */}
                    {request.vendor && (
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardHeader className="border-b border-gray-100 pb-4">
                                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Vendor Information</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Vendor Name</p>
                                    <p className="text-gray-900 font-medium">{request.vendor.vendor_name || 'N/A'}</p>
                                </div>
                                {request.vendor.contact_person && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                                        <p className="text-gray-900 font-medium">{request.vendor.contact_person}</p>
                                    </div>
                                )}
                                {request.vendor.mobile && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                                        <p className="text-gray-900 font-medium">{request.vendor.mobile}</p>
                                    </div>
                                )}
                                {request.vendor.email && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-900 font-medium">{request.vendor.email}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <AddMaintenanceCostModal
                isOpen={isCostModalOpen}
                onClose={() => setIsCostModalOpen(false)}
                maintenanceRequestId={id || ''}
                onSuccess={fetchRequest}
            />
        </div>
    );
};

export default MaintenanceRequestDetailsPage;
