import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAuth, postAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface MonitorComplianceFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const MonitorComplianceForm = ({ initialData, isEdit = false }: MonitorComplianceFormProps) => {
    const navigate = useNavigate();
    const getActiveData = (data: any) => {
        if (!data) return null;
        let active = data.property_compliance || data.data || data;
        if (Array.isArray(active)) active = active[0];
        return active;
    };

    const initialActiveData = getActiveData(initialData);

    const [recordId, setRecordId] = useState<string | number | null>(initialActiveData?.id || null);
    const [isLoading, setIsLoading] = useState(false);
    const [complianceRequirements, setComplianceRequirements] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        site_id: initialActiveData?.site_id?.toString() || '',
        compliance_requirement_id: initialActiveData?.compliance_requirement_id?.toString() || '',
        due_date: initialActiveData?.due_date ? initialActiveData.due_date.substring(0, 10) : '',
        issue_date: initialActiveData?.issue_date ? initialActiveData.issue_date.substring(0, 10) : '',
        expiry_date: initialActiveData?.expiry_date ? initialActiveData.expiry_date.substring(0, 10) : '',
        assigned_to: initialActiveData?.assigned_to?.toString() || '',
        remarks: initialActiveData?.remarks || '',
        status: initialActiveData?.status || 'pending',
        document_name: initialActiveData?.documents?.[0]?.name || initialActiveData?.document_name || '',
        document_url: initialActiveData?.documents?.[0]?.url || initialActiveData?.document_url || '',
        document_type: initialActiveData?.documents?.[0]?.document_type || initialActiveData?.document_type || 'compliance',
        file: null as File | null
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        if (initialData) {
            const activeData = getActiveData(initialData);
            if (activeData) {
                setRecordId(activeData.id);
                const document = activeData.documents?.[0];
                setFormData({
                    site_id: activeData.site_id?.toString() || '',
                    compliance_requirement_id: activeData.compliance_requirement_id?.toString() || '',
                    due_date: activeData.due_date ? activeData.due_date.substring(0, 10) : '',
                    issue_date: activeData.issue_date ? activeData.issue_date.substring(0, 10) : '',
                    expiry_date: activeData.expiry_date ? activeData.expiry_date.substring(0, 10) : '',
                    assigned_to: activeData.assigned_to?.toString() || '',
                    remarks: activeData.remarks || '',
                    status: activeData.status || 'pending',
                    document_name: document?.name || activeData.document_name || '',
                    document_url: document?.url || activeData.document_url || '',
                    document_type: document?.document_type || activeData.document_type || 'compliance',
                    file: null
                });
            }
        }
    }, [initialData]);

    const fetchDropdownData = async () => {
        try {
            setIsLoading(true);
            const [complianceData, usersData, sitesData] = await Promise.all([
                getAuth('/compliance_requirements'),
                getAuth('/users'),
                getAuth('/pms/sites')
            ]);

            if (Array.isArray(complianceData)) {
                setComplianceRequirements(complianceData);
            }
            if (Array.isArray(usersData)) setUsers(usersData);
            if (Array.isArray(sitesData)) setSites(sitesData);
        } catch (error) {
            console.error('Failed to fetch dropdown data', error);
            toast.error('Failed to load form data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplianceChange = (value: string) => {
        setFormData({
            ...formData,
            compliance_requirement_id: value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({
                ...formData,
                file: file,
                document_name: file.name
            });
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.site_id || !formData.compliance_requirement_id || (!isEdit && !formData.file)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            let base64Data = null;
            if (formData.file) {
                base64Data = await fileToBase64(formData.file);
            }

            const payload = {
                property_compliance: {
                    site_id: parseInt(formData.site_id),
                    compliance_requirement_id: parseInt(formData.compliance_requirement_id),
                    due_date: formData.due_date || null,
                    issue_date: formData.issue_date || null,
                    expiry_date: formData.expiry_date || null,
                    assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
                    remarks: formData.remarks || null,
                    status: formData.status
                },
                ...(formData.document_name && { document_name: formData.document_name }),
                ...(formData.document_type && { document_type: formData.document_type }),
                ...(base64Data && { base64_data: base64Data })
            };

            if (isEdit && recordId) {
                await patchAuth(`/property_compliances/${recordId}.json`, payload);
                toast.success('Compliance document updated successfully');
            } else {
                await postAuth('/property_compliances', payload);
                toast.success('Compliance document submitted successfully');
            }
            navigate('/monitor-compliance');
        } catch (error: any) {
            console.error('Error submitting compliance', error);
            toast.error(error.message || 'Failed to submit compliance');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="bg-white border-gray-200 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="complianceRequirement" className="text-[#1a1a1a] font-bold text-base">Compliance Requirement *</Label>
                            <Select
                                onValueChange={handleComplianceChange}
                                value={formData.compliance_requirement_id}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                    <SelectValue placeholder="Select requirement" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {complianceRequirements.map((req) => (
                                        <SelectItem key={req.id} value={req.id.toString()}>
                                            {req.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="site" className="text-[#1a1a1a] font-bold text-base">Property *</Label>
                            <Select
                                onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                                value={formData.site_id}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                    <SelectValue placeholder="Select Property" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {sites.map((site) => (
                                        <SelectItem key={site.id} value={site.id.toString()}>
                                            {site.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="dueDate" className="text-[#1a1a1a] font-bold text-base">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 px-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="issueDate" className="text-[#1a1a1a] font-bold text-base">Issue Date</Label>
                            <Input
                                id="issueDate"
                                type="date"
                                value={formData.issue_date}
                                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 px-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="expiryDate" className="text-[#1a1a1a] font-bold text-base">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                type="date"
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 px-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="assignedTo" className="text-[#1a1a1a] font-bold text-base">Assigned To</Label>
                            <Select
                                onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                                value={formData.assigned_to}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                    <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            {user.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="documentType" className="text-[#1a1a1a] font-bold text-base">Document Type</Label>
                            <Input
                                id="documentType"
                                value={formData.document_type}
                                onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 px-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="status" className="text-[#1a1a1a] font-bold text-base">Status</Label>
                            <Select
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                value={formData.status}
                            >
                                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className='bg-white'>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <Label htmlFor="remarks" className="text-[#1a1a1a] font-bold text-base">Remarks</Label>
                            <Textarea
                                id="remarks"
                                placeholder="Enter any remarks..."
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                className="bg-white border-gray-300 text-gray-900 p-4 resize-none min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <Label htmlFor="file" className="text-[#1a1a1a] font-bold text-base">
                                {isEdit ? 'Replace Document (optional)' : 'Upload Compliance Document *'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="bg-gray-50 border-2 border-dashed border-gray-300 h-24 rounded-2xl file:hidden flex items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formData.file ? formData.file.name : 'Click to select or drag and drop file'}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, JPG or PNG (Max 10MB)</p>
                                </div>
                            </div>
                            {formData.document_name && !formData.file && (
                                <div className="mt-2 flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <p className="text-sm text-[#C72030] font-semibold flex items-center gap-1">
                                        Current File: {formData.document_name}
                                    </p>
                                    {formData.document_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#C72030] hover:bg-red-50 font-bold"
                                            onClick={() => window.open(formData.document_url, '_blank')}
                                        >
                                            Download Existing File
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-12">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/monitor-compliance')}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 h-14 px-10 rounded-xl font-bold transition-all text-base"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#C72030] hover:bg-[#A01825] text-white h-14 px-12 rounded-xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95 text-base"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : (isEdit ? 'Update Compliance' : 'Submit Compliance')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default MonitorComplianceForm;
