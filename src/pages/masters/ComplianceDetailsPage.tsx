
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { ShieldCheck, ArrowLeft, Loader2, Calendar, Building2, User, Clock, FileText, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const ComplianceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [compliance, setCompliance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplianceDetails();
    }, [id]);

    const fetchComplianceDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/compliance_requirements/${id}`);
            setCompliance(data);
        } catch (error) {
            console.error('Failed to fetch compliance details:', error);
            toast.error('Failed to load compliance details');
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

    if (!compliance) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Compliance requirement not found</p>
                    <Button onClick={() => navigate('/masters/compliances')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusVariant = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'active' || s === 'completed') return 'bg-green-600';
        if (s === 'pending') return 'bg-yellow-600';
        if (s === 'overdue') return 'bg-red-600';
        return 'bg-gray-500';
    };

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/compliances')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Compliances
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Compliance Requirement</h1>
                        <p className="text-sm font-medium text-gray-400">Master Record Database</p>
                    </div>
                </div>
                <Badge className={`${getStatusVariant(compliance.status)} px-6 py-2 rounded-full text-white font-bold shadow-lg`}>
                    {compliance.status?.toUpperCase() || 'UNKNOWN'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Core Details */}
                <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-xl overflow-hidden">
                    <div className="bg-[#C72030] h-2 w-full" />
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-8">
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-2">
                                <Badge variant="outline" className="text-[#C72030] border-[#C72030] font-semibold">{compliance.requirement_type}</Badge>
                                <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                                    {compliance.title}
                                </CardTitle>
                                <p className="text-gray-500 font-medium">{compliance.description || 'No detailed description provided.'}</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 text-[#C72030]">
                                <ShieldCheck className="h-10 w-10" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Regulatory Body</p>
                                        <p className="text-lg font-medium text-gray-900">{compliance.regulatory_body || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Responsible Party</p>
                                        <p className="text-lg font-medium text-gray-900">{compliance.responsible_party || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Notification Period</p>
                                        <p className="text-lg font-medium text-gray-900">{compliance.reminder_days || 0} Days Prior</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Applicability Scope</p>
                                <div className="flex flex-wrap gap-2">
                                    {compliance.property_types && compliance.property_types.length > 0 ? (
                                        compliance.property_types.map((type: any) => (
                                            <Badge key={type.id} className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none px-4 py-1.5 rounded-lg text-sm font-semibold">
                                                {type.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Universal Applicability</p>
                                    )}
                                </div>
                                {compliance.is_recurring && (
                                    <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">Recurring Requirement Policy</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Logistics Card */}
                <div className="space-y-8">
                    <Card className="bg-gray-900 border-none shadow-2xl text-white transform hover:scale-[1.02] transition-transform duration-300">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-[#C72030]">Validity & Economics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex justify-between items-baseline">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Validity Term</p>
                                    <p className="text-3xl font-bold">{compliance.validity_months || 0}<span className="text-lg text-[#C72030] ml-1 font-semibold">MOS</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Approx Cost</p>
                                    <div className="flex items-center text-2xl font-bold gap-1">
                                        <IndianRupee className="h-5 w-5" />
                                        {compliance.approx_cost || '0'}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-md">
                                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-wider"><Calendar className="h-3 w-3" /> Targeted Due Date</span>
                                    <span className="text-sm font-bold">{compliance.due_date ? new Date(compliance.due_date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                {compliance.completion_date && (
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-md">
                                        <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-wider"><ShieldCheck className="h-3 w-3" /> Execution Proof Date</span>
                                        <span className="text-sm font-bold text-green-400">{new Date(compliance.completion_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Document Registry</span>
                            <Badge variant="outline" className="rounded-full">{compliance.documents?.length || 0} Files</Badge>
                        </div>
                        <CardContent className="p-6">
                            {compliance.documents && compliance.documents.length > 0 ? (
                                <div className="space-y-3">
                                    {/* Map through docs if they exist (need structure) */}
                                    <p className="text-xs text-center text-gray-400">Document handling system active</p>
                                </div>
                            ) : (
                                <div className="text-center py-10 space-y-4">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 italic">No supporting documents uploaded to this master record.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ComplianceDetailsPage;
