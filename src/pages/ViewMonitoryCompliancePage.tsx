import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, Calendar, User, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ViewMonitoryCompliancePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplianceDetails();
    }, [id]);

    const fetchComplianceDetails = async () => {
        try {
            setIsLoading(true);
            const res = await getAuth(`/property_compliances/${id}.json`);
            setData(res);
        } catch (error) {
            console.error('Failed to fetch details', error);
            toast.error('Failed to load compliance details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-8 space-y-8 bg-white min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/monitor-compliance')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">View Monitory Compliance</h1>
                        <p className="text-sm text-gray-500">Document Detail: {data.document_name}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/monitory-compliance/edit/${id}`)}
                        className="border-gray-200"
                    >
                        Edit Details
                    </Button>
                    {data.document_url && (
                        <Button
                            className="bg-[#C72030] hover:bg-[#A01825]"
                            onClick={() => window.open(data.document_url, '_blank')}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            View Document
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-white border-gray-200">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Info className="h-5 w-5 text-[#C72030]" />
                            General Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                            <div>
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Document Name</Label>
                                <p className="text-gray-900 font-medium mt-1">{data.document_name}</p>
                            </div>
                            <div>
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Property</Label>
                                <p className="text-gray-900 font-medium mt-1">{data.site?.name}</p>
                            </div>
                            <div>
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Compliance Requirement</Label>
                                <p className="text-gray-900 font-medium mt-1">{data.compliance_requirement?.title}</p>
                            </div>
                            <div>
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Status</Label>
                                <div className="mt-1">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${data.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        data.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {data.status}
                                    </span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Remarks</Label>
                                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{data.remarks || 'No remarks provided'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 h-fit">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-[#C72030]" />
                            Timelines & Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Calendar className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Due Date</span>
                            </div>
                            <p className="text-gray-900 font-medium">{data.due_date ? new Date(data.due_date).toLocaleDateString() : 'Not Set'}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <User className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Assigned To</span>
                            </div>
                            <p className="text-gray-900 font-medium">{data.assigned_user?.full_name || 'Unassigned'}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wider">Created At</span>
                            </div>
                            <p className="text-gray-900 font-medium">{new Date(data.created_at).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`block ${className}`}>{children}</span>
);

export default ViewMonitoryCompliancePage;
