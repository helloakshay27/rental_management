
import React, { useState, useEffect } from 'react';
import { FormSection, FormActions } from '@/components/ui/form-section';
import { PageLoader, Spinner } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { getAuth, postAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const AmcContractAdd = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingResources, setLoadingResources] = useState(true);

    const [formData, setFormData] = useState({
        site_id: '',
        vendor_id: '',
        service_type: '',
        contract_value: '',
        annual_cost: '',
        start_date: '',
        end_date: '',
        payment_terms: '',
        terms_conditions: '',
        auto_renewal: false,
        renewal_notice_days: 30,
        status: 'active',
        remarks: ''
    });

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoadingResources(true);
                const token = getToken();

                // Fetch Properties
                const propertiesData = await getAuth(`/pms/sites.json${token ? `?token=${token}` : ''}`);
                if (Array.isArray(propertiesData)) {
                    setProperties(propertiesData);
                } else if (propertiesData?.sites) {
                    setProperties(propertiesData.sites);
                }

                // Fetch Vendors
                try {
                    const vendorsData = await getAuth('/vendors');
                    if (Array.isArray(vendorsData)) {
                        setVendors(vendorsData);
                    } else if (vendorsData?.vendors) {
                        setVendors(vendorsData.vendors);
                    }
                } catch (e) {
                    console.warn('Failed to fetch vendors, using mock data', e);
                    setVendors([
                        { id: 1, vendor_name: 'CoolAir Services', contact_person: 'John Doe' },
                        { id: 2, vendor_name: 'LiftTech', contact_person: 'Mike Smith' },
                        { id: 3, vendor_name: 'SafeGuard Systems', contact_person: 'Sarah Wilson' },
                        { id: 4, vendor_name: 'SecureWatch', contact_person: 'Robert Brown' }
                    ]);
                }

            } catch (error) {
                console.error('Failed to fetch resources:', error);
                toast.error('Failed to load properties or vendors');
            } finally {
                setLoadingResources(false);
            }
        };

        fetchResources();
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.site_id || !formData.vendor_id || !formData.service_type) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                amc_contract: {
                    site_id: parseInt(formData.site_id),
                    vendor_id: parseInt(formData.vendor_id),
                    service_type: formData.service_type,
                    contract_value: parseFloat(formData.contract_value) || 0,
                    annual_cost: parseFloat(formData.annual_cost) || 0,
                    start_date: formData.start_date,
                    end_date: formData.end_date,
                    payment_terms: formData.payment_terms,
                    terms_conditions: formData.terms_conditions,
                    auto_renewal: formData.auto_renewal,
                    renewal_notice_days: parseInt(formData.renewal_notice_days.toString()) || 30,
                    status: formData.status,
                    remarks: formData.remarks,
                    created_by: 10 // Hardcoded as per request example
                }
            };

            await postAuth('/amc_contracts', payload);
            toast.success('AMC Contract created successfully');
            navigate('/amc'); // Navigate back to list
        } catch (error) {
            console.error('Failed to create AMC:', error);
            toast.error('Failed to create AMC Contract');
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingResources) {
        return (
            <PageLoader />
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Add New AMC"
                description="Create a new Annual Maintenance Contract"
                backTo="/amc"
            />

                <form onSubmit={handleSubmit}>
                    <FormSection step={1} title="Contract Details" className="mb-5">

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Property (Site) <span className="text-red-500">*</span></Label>
                                    <Select value={formData.site_id} onValueChange={(val) => handleChange('site_id', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-[#C72030] focus:border-[#C72030]">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {properties.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Vendor <span className="text-red-500">*</span></Label>
                                    <Select value={formData.vendor_id} onValueChange={(val) => handleChange('vendor_id', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-[#C72030] focus:border-[#C72030]">
                                            <SelectValue placeholder="Select Vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors.map(v => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.name || v.vendor_name || v.company_name} {v.contact_person ? `(${v.contact_person})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Service Type <span className="text-red-500">*</span></Label>
                                    <Input
                                        className="bg-white border-gray-300"
                                        placeholder="Enter Service Type"
                                        value={formData.service_type}
                                        onChange={(e) => handleChange('service_type', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Status</Label>
                                    <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-[#C72030] focus:border-[#C72030]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>

                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Financials & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Contract Value</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <Input
                                            type="number"
                                            className="pl-8 bg-white border-gray-300"
                                            placeholder="0.00"
                                            value={formData.contract_value}
                                            onChange={(e) => handleChange('contract_value', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Annual Cost</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <Input
                                            type="number"
                                            className="pl-8 bg-white border-gray-300"
                                            placeholder="0.00"
                                            value={formData.annual_cost}
                                            onChange={(e) => handleChange('annual_cost', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Start Date</Label>
                                    <Input
                                        type="date"
                                        className="bg-white border-gray-300"
                                        value={formData.start_date}
                                        onChange={(e) => handleChange('start_date', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">End Date</Label>
                                    <Input
                                        type="date"
                                        className="bg-white border-gray-300"
                                        value={formData.end_date}
                                        onChange={(e) => handleChange('end_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-gray-700 font-medium">Payment Terms</Label>
                                    <Select value={formData.payment_terms} onValueChange={(val) => handleChange('payment_terms', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 focus:ring-[#C72030] focus:border-[#C72030]">
                                            <SelectValue placeholder="Select Payment Terms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                                            <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                                            <SelectItem value="Annual">Annual</SelectItem>
                                            <SelectItem value="One-Time">One-Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="space-y-0.5">
                                        <Label className="text-gray-700 font-medium">Auto Renewal</Label>
                                        <p className="text-xs text-gray-500">Automatically renew contract at end of term</p>
                                    </div>
                                    <Switch
                                        checked={formData.auto_renewal}
                                        onCheckedChange={(checked) => handleChange('auto_renewal', checked)}
                                    />
                                </div>

                                {formData.auto_renewal && (
                                    <div className="space-y-1.5">
                                        <Label className="text-gray-700 font-medium">Renewal Notice Days</Label>
                                        <Input
                                            type="number"
                                            className="bg-white border-gray-300"
                                            value={formData.renewal_notice_days}
                                            onChange={(e) => handleChange('renewal_notice_days', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 font-medium">Terms & Conditions</Label>
                                <Textarea
                                    className="bg-white border-gray-300 text-gray-900 min-h-[100px] focus:border-[#C72030] focus:ring-[#C72030]"
                                    placeholder="Enter terms and conditions..."
                                    value={formData.terms_conditions}
                                    onChange={(e) => handleChange('terms_conditions', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 font-medium">Remarks</Label>
                                <Textarea
                                    className="bg-white border-gray-300 text-gray-900 min-h-[80px] focus:border-[#C72030] focus:ring-[#C72030]"
                                    placeholder="Any additional remarks..."
                                    value={formData.remarks}
                                    onChange={(e) => handleChange('remarks', e.target.value)}
                                />
                            </div>

                    </FormSection>

            <FormActions>
                            <Button type="button" variant="outline" onClick={() => navigate('/amc')} className="fm-button-fix px-8 py-2">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="fm-button-fix fm-button-brand px-8 py-2">
                                {isLoading ? <Spinner className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Create Contract
                            </Button>
            </FormActions>
                </form>
        </PageContainer>
    );
};

export default AmcContractAdd;
