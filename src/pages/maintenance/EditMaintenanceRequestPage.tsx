import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Upload, X, FileText } from 'lucide-react';
import { getAuth, putAuth } from '@/lib/api';
import { toast } from 'sonner';

const EditMaintenanceRequestPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingResources, setLoadingResources] = useState(true);
    const [sites, setSites] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        issue_type: '',
        priority: 'medium',
        site_id: '',
        unit_id: '',
        tenant_id: '',
        maintenance_scope: 'corrective',
        estimated_cost: '',
        status: 'pending',
        documents: [] as any[]
    });

    useEffect(() => {
        const fetchResourcesAndRequest = async () => {
            try {
                setLoadingResources(true);

                const [sitesRes, tenantsRes, requestRes] = await Promise.all([
                    getAuth('/pms/sites.json'),
                    getAuth('/tenants'),
                    getAuth(`/maintenance_requests/${id}.json`)
                ]);

                const sitesData = sitesRes?.sites || sitesRes || [];
                setSites(Array.isArray(sitesData) ? sitesData : []);

                const tenantsData = tenantsRes?.tenants || tenantsRes || [];
                setTenants(Array.isArray(tenantsData) ? tenantsData : []);

                if (requestRes) {
                    const data = requestRes.maintenance_request || requestRes;
                    setFormData({
                        title: data.title || '',
                        description: data.description || '',
                        issue_type: data.issue_type || '',
                        priority: data.priority || 'medium',
                        site_id: data.site_id?.toString() || '',
                        unit_id: data.unit_id?.toString() || '',
                        tenant_id: data.tenant_id?.toString() || '',
                        maintenance_scope: data.maintenance_scope || 'corrective',
                        estimated_cost: data.estimated_cost || '',
                        status: data.status || 'pending',
                        documents: data.documents || []
                    });
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load maintenance request');
            } finally {
                setLoadingResources(false);
            }
        };

        if (id) {
            fetchResourcesAndRequest();
        }
    }, [id]);

    useEffect(() => {
        if (formData.site_id) {
            const selectedSite = sites.find(s => s.id.toString() === formData.site_id);
            if (selectedSite?.units) {
                setUnits(selectedSite.units);
            } else {
                setUnits([
                    { id: 45, name: 'Unit 5B' },
                    { id: 46, name: 'Unit 5C' }
                ]);
            }
        } else {
            setUnits([]);
        }
    }, [formData.site_id, sites]);


    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newDocs = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                newDocs.push({
                    file_name: file.name,
                    document_type: 'maintenance_request',
                    base64_data: base64
                });
            }
            setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newDocs] }));
        }
    };

    const removeDocument = (index: number) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.site_id || !formData.issue_type) {
            toast.error('Please fill in required fields');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                maintenance_request: {
                    title: formData.title,
                    description: formData.description,
                    issue_type: formData.issue_type,
                    priority: formData.priority,
                    unit_id: formData.unit_id ? parseInt(formData.unit_id) : null,
                    tenant_id: formData.tenant_id ? parseInt(formData.tenant_id) : null,
                    site_id: parseInt(formData.site_id),
                    maintenance_scope: formData.maintenance_scope,
                    estimated_cost: formData.estimated_cost,
                    status: formData.status,
                    documents: formData.documents
                    // Note: In a real app, we might need to handle existing documents vs new base64 ones differently
                    // usually existing ones just send ID or 'keep' logic, but for now we follow the 'documents' array structure
                }
            };

            await putAuth(`/maintenance_requests/${id}.json`, payload);
            toast.success('Maintenance request updated successfully');
            navigate(-1);
        } catch (error: any) {
            console.error('Failed to update request:', error);
            toast.error(error.message || 'Failed to update maintenance request');
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingResources) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Maintenance Request</h1>
                        <p className="text-sm text-gray-500">Update maintenance ticket details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900">Request Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Title *</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                        placeholder="e.g. AC not cooling"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 min-h-[100px]"
                                        placeholder="Detailed description of the issue..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Property (Site) *</Label>
                                    <Select value={formData.site_id} onValueChange={(val) => handleChange('site_id', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sites.map(site => (
                                                <SelectItem key={site.id} value={site.id.toString()}>{site.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Tenant</Label>
                                    <Select value={formData.tenant_id} onValueChange={(val) => handleChange('tenant_id', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tenants.map(tenant => (
                                                <SelectItem key={tenant.id} value={tenant.id.toString()}>
                                                    {tenant.company_name || tenant.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Unit</Label>
                                    <Select value={formData.unit_id} onValueChange={(val) => handleChange('unit_id', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map(unit => (
                                                <SelectItem key={unit.id} value={unit.id.toString()}>{unit.name}</SelectItem>
                                            ))}
                                            {units.length === 0 && <SelectItem value="temp_disabled" disabled>No units available</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Issue Type *</Label>
                                    <Select value={formData.issue_type} onValueChange={(val) => handleChange('issue_type', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ac">AC / HVAC</SelectItem>
                                            <SelectItem value="plumbing">Plumbing</SelectItem>
                                            <SelectItem value="electrical">Electrical</SelectItem>
                                            <SelectItem value="civil">Civil / Structural</SelectItem>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="furniture">Furniture</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Priority</Label>
                                    <Select value={formData.priority} onValueChange={(val) => handleChange('priority', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Status</Label>
                                    <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Scope</Label>
                                    <Select value={formData.maintenance_scope} onValueChange={(val) => handleChange('maintenance_scope', val)}>
                                        <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                            <SelectValue placeholder="Select Scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="corrective">Corrective</SelectItem>
                                            <SelectItem value="preventive">Preventive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Estimated Cost (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.estimated_cost}
                                        onChange={(e) => handleChange('estimated_cost', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <Label className="text-gray-900 font-medium">Attachments</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                    <Input
                                        type="file"
                                        multiple
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">Images, PDF (Max 10MB)</p>
                                </div>

                                {formData.documents.length > 0 && (
                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                        {formData.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-[#C72030]" />
                                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">{doc.file_name}</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDocument(index)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </CardContent>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold h-11 px-6">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#C72030] hover:bg-[#A01825] text-white min-w-[160px] font-bold h-11 shadow-sm transition-all active:scale-95">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Update Request
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditMaintenanceRequestPage;
