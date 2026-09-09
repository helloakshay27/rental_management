
import React, { useState, useEffect } from 'react';
import { FormSection, FormActions } from '@/components/ui/form-section';
import { PageLoader, Spinner } from '@/components/ui/loader';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Zap } from 'lucide-react';
import { getAuth, postAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const AddUtilityPage = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingResources, setLoadingResources] = useState(true);

    const [formData, setFormData] = useState({
        site_id: '',
        utility_type: '',
        provider: '',
        monthly_cost: '',
        meter_number: '',
        is_active: true
    });

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setLoadingResources(true);
                // Fetch properties (sites)
                const sitesRes = await getAuth('/pms/sites.json');
                const sitesData = sitesRes?.sites || sitesRes || [];
                setProperties(Array.isArray(sitesData) ? sitesData : []);
            } catch (error) {
                console.error('Failed to fetch sites:', error);
                toast.error('Failed to load properties');
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

        if (!formData.site_id || !formData.utility_type || !formData.provider) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                utility: {
                    site_id: parseInt(formData.site_id),
                    utility_type: formData.utility_type,
                    provider: formData.provider,
                    monthly_cost: formData.monthly_cost ? parseFloat(formData.monthly_cost) : 0,
                    meter_number: formData.meter_number,
                    is_active: formData.is_active
                }
            };

            await postAuth('/utilities.json', payload);
            toast.success('Utility added successfully');
            navigate('/utilities');
        } catch (error: any) {
            console.error('Failed to add utility:', error);
            toast.error(error.message || 'Failed to add utility');
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingResources) {
        return (
            <PageLoader />
        );
    }

    const utilityTypes = [
        'Electricity',
        'Water',
        'Gas',
        'Internet',
        'Trash',
        'Other'
    ];

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
            </button>

            <div className="mb-6 mt-2 flex items-center gap-4">
                <h1 className="text-brand-body-1 font-bold text-[#1a1a1a]">ADD UTILITY</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <FormSection step={1} title="UTILITY CONNECTION DETAILS" className="mb-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">
                                    Property (Site)<span className="text-brand">*</span>
                                </Label>
                                <Select value={formData.site_id} onValueChange={(val) => handleChange('site_id', val)}>
                                    <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 h-11">
                                        <SelectValue placeholder="Select Property" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {properties.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">
                                    Utility Type<span className="text-brand">*</span>
                                </Label>
                                <Select value={formData.utility_type} onValueChange={(val) => handleChange('utility_type', val)}>
                                    <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 h-11">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {utilityTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">
                                    Provider / Company<span className="text-brand">*</span>
                                </Label>
                                <Input
                                    className="bg-white border-gray-300 text-gray-900 h-11"
                                    placeholder="e.g. MSEB, TPEL, etc."
                                    value={formData.provider}
                                    onChange={(e) => handleChange('provider', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Meter Number</Label>
                                <Input
                                    className="bg-white border-gray-300 text-gray-900 h-11"
                                    placeholder="Enter meter or account number"
                                    value={formData.meter_number}
                                    onChange={(e) => handleChange('meter_number', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Estimated Monthly Cost</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                    <Input
                                        type="number"
                                        className="pl-8 bg-white border-gray-300 text-gray-900 h-11"
                                        placeholder="0.00"
                                        value={formData.monthly_cost}
                                        onChange={(e) => handleChange('monthly_cost', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Status</Label>
                                <div className="flex items-center justify-between h-11 px-4 border border-gray-300 rounded-md bg-white">
                                    <span className="text-sm text-gray-700">
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => handleChange('is_active', checked)}
                                    />
                                </div>
                            </div>
                        </div>
                </FormSection>

                <FormActions className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="fm-button-fix px-8 py-2"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="fm-button-fix fm-button-brand px-6 py-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><Spinner className="mr-2" />Please wait...</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" />Submit</>
                        )}
                    </Button>
                </FormActions>
            </form>
        </div>
    );
};

export default AddUtilityPage;
