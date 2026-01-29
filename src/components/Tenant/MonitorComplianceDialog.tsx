import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';

interface MonitorComplianceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (documentData: any) => void;
    initialData?: any;
}

const MonitorComplianceDialog = ({ isOpen, onClose, onUpload, initialData }: MonitorComplianceDialogProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [complianceRequirements, setComplianceRequirements] = useState<any[]>([]);
    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        site_id: '',
        compliance_requirement_id: '',
        due_date: '',
        assigned_to: '',
        remarks: '',
        status: 'pending',
        document_name: '',
        document_type: 'document_type',
        file: null as File | null
    });

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            if (initialData) {
                // Pre-populate form for editing
                setFormData({
                    site_id: initialData.site_id?.toString() || '',
                    compliance_requirement_id: initialData.compliance_requirement_id?.toString() || '',
                    due_date: initialData.due_date || '',
                    assigned_to: initialData.assigned_to?.toString() || '',
                    remarks: initialData.remarks || '',
                    status: initialData.status || 'pending',
                    document_name: initialData.document_name || '',
                    document_type: initialData.document_type || 'document_type',
                    file: null
                });

                // If compliance requirement exists, filter property types
                if (initialData.compliance_requirement_id) {
                    const reqId = initialData.compliance_requirement_id.toString();
                    // We need complianceRequirements for this, so we might need to do it after fetch
                }
            } else {
                // Reset form for new entry
                setFormData({
                    site_id: '',
                    compliance_requirement_id: '',
                    due_date: '',
                    assigned_to: '',
                    remarks: '',
                    status: 'pending',
                    document_name: '',
                    document_type: 'document_type',
                    file: null
                });
                setFilteredPropertyTypes([]);
            }
        }
    }, [isOpen, initialData]);

    const fetchDropdownData = async () => {
        try {
            setIsLoading(true);
            const [complianceData, usersData] = await Promise.all([
                getAuth('/compliance_requirements'),
                getAuth('/users')
            ]);

            if (Array.isArray(complianceData)) {
                setComplianceRequirements(complianceData);
                // If editing, find and set property types
                if (initialData?.compliance_requirement_id) {
                    const selectedReq = complianceData.find(req => req.id.toString() === initialData.compliance_requirement_id.toString());
                    if (selectedReq) setFilteredPropertyTypes(selectedReq.property_types || []);
                }
            }
            if (Array.isArray(usersData)) setUsers(usersData);
        } catch (error) {
            console.error('Failed to fetch dropdown data', error);
            toast.error('Failed to load form data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplianceChange = (value: string) => {
        const selectedReq = complianceRequirements.find(req => req.id.toString() === value);
        setFormData({
            ...formData,
            compliance_requirement_id: value,
            site_id: '' // Reset site_id when requirement changes
        });
        setFilteredPropertyTypes(selectedReq?.property_types || []);
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

    const handleSubmit = async () => {
        const isEdit = !!initialData;

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
                    assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
                    remarks: formData.remarks || null,
                    status: formData.status
                },
                ...(formData.document_name && { document_name: formData.document_name }),
                ...(formData.document_type && { document_type: formData.document_type }),
                ...(base64Data && { base64_data: base64Data })
            };

            if (isEdit) {
                await patchAuth(`/property_compliances/${initialData.id}.json`, payload);
                toast.success('Compliance document updated successfully');
                onUpload(null); // Just to trigger refresh
            } else {
                onUpload(payload);
            }
            onClose();
        } catch (error: any) {
            console.error('Error submitting compliance', error);
            toast.error(error.message || 'Failed to submit compliance');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {initialData ? 'Edit Compliance' : 'Add Compliance'}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-4">
                    {/* Compliance Requirement Selection First */}
                    <div className="space-y-2">
                        <Label htmlFor="complianceRequirement" className="text-gray-900 font-medium">Compliance Requirement *</Label>
                        <Select
                            onValueChange={handleComplianceChange}
                            value={formData.compliance_requirement_id}
                        >
                            <SelectTrigger className="bg-white border-2 border-gray-200">
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

                    {/* Property Type filtered by selected Compliance */}
                    <div className="space-y-2">
                        <Label htmlFor="site" className="text-gray-900 font-medium">Property Type *</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, site_id: value })}
                            value={formData.site_id}
                            disabled={!formData.compliance_requirement_id}
                        >
                            <SelectTrigger className={`bg-white border-2 border-gray-200 ${!formData.compliance_requirement_id ? 'opacity-50' : ''}`}>
                                <SelectValue placeholder={formData.compliance_requirement_id ? "Select property type" : "Select requirement first"} />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                {filteredPropertyTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate" className="text-gray-900 font-medium">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="bg-white border-2 border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="assignedTo" className="text-gray-900 font-medium">Assigned To</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                            value={formData.assigned_to}
                        >
                            <SelectTrigger className="bg-white border-2 border-gray-200">
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

                    <div className="space-y-2">
                        <Label htmlFor="documentType" className="text-gray-900 font-medium">Document Type</Label>
                        <Input
                            id="documentType"
                            value={formData.document_type}
                            onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                            className="bg-white border-2 border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-gray-900 font-medium">Status</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                            value={formData.status}
                        >
                            <SelectTrigger className="bg-white border-2 border-gray-200">
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

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="remarks" className="text-gray-900 font-medium">Remarks</Label>
                        <Textarea
                            id="remarks"
                            placeholder="Enter any remarks..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            className="bg-white border-2 border-gray-200 min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="file" className="text-gray-900 font-medium">
                            {initialData ? 'Replace Document (optional)' : 'Upload Compliance Document *'}
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="bg-white border-2 border-gray-200 file:bg-gray-50 file:border-0 file:mr-4 file:py-1 file:px-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {formData.document_name && (
                            <p className="text-sm text-gray-500 mt-1">Current: {formData.document_name}</p>
                        )}
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : (initialData ? 'Update Compliance' : 'Submit Compliance')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default MonitorComplianceDialog;
