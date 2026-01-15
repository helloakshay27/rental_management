
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Zap } from 'lucide-react';
import { getAuth, patchAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const EditUtilityPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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

                // Fetch utility details
                if (id) {
                    const utilityRes = await getAuth(`/utilities/${id}.json`);
                    const utility = utilityRes?.utility || utilityRes;
                    if (utility) {
                        setFormData({
                            site_id: utility.site_id?.toString() || '',
                            utility_type: utility.utility_type || '',
                            provider: utility.provider || '',
                            monthly_cost: utility.monthly_cost?.toString() || '',
                            meter_number: utility.meter_number || '',
                            is_active: utility.is_active ?? true
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoadingResources(false);
            }
        };

        fetchResources();
    }, [id]);

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

            await patchAuth(`/utilities/${id}.json`, payload);
            toast.success('Utility updated successfully');
            navigate('/utilities');
        } catch (error: any) {
            console.error('Failed to update utility:', error);
            toast.error(error.message || 'Failed to update utility');
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

    const utilityTypes = [
        'Electricity',
        'Water',
        'Gas',
        'Internet',
        'Trash',
        'Other'
    ];

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Utility</h1>
                        <p className="text-sm text-gray-500">Update utility service details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="h-1 bg-[#C72030]"></div>
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-[#C72030]" />
                                Utility Connection Details
                            </CardTitle>
                            <CardDescription>Update the provider and connection information</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Selection */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-bold">Property (Site) *</Label>
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

                                {/* Utility Type */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-bold">Utility Type *</Label>
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

                                {/* Provider */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-bold">Provider / Company *</Label>
                                    <Input
                                        className="bg-white border-gray-300 text-gray-900 h-11"
                                        placeholder="e.g. MSEB, TPEL, etc."
                                        value={formData.provider}
                                        onChange={(e) => handleChange('provider', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Meter Number */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-bold">Meter Number</Label>
                                    <Input
                                        className="bg-white border-gray-300 text-gray-900 h-11"
                                        placeholder="Enter meter or account number"
                                        value={formData.meter_number}
                                        onChange={(e) => handleChange('meter_number', e.target.value)}
                                    />
                                </div>

                                {/* Monthly Cost */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-bold">Estimated Monthly Cost</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500 font-bold">₹</span>
                                        <Input
                                            type="number"
                                            className="pl-8 bg-white border-gray-300 text-gray-900 h-11"
                                            placeholder="0.00"
                                            value={formData.monthly_cost}
                                            onChange={(e) => handleChange('monthly_cost', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 h-11 self-end mt-auto mb-1">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-gray-900 font-bold">Is Active?</Label>
                                    </div>
                                    <Switch
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) => handleChange('is_active', checked)}
                                    />
                                </div>
                            </div>

                        </CardContent>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold h-11 px-6">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#C72030] hover:bg-[#A01825] text-white min-w-[160px] font-bold h-11 shadow-sm transition-all active:scale-95">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditUtilityPage;
