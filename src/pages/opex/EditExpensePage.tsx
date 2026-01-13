
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { getAuth, patchAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const EditExpensePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [properties, setProperties] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingResources, setLoadingResources] = useState(true);

    const [formData, setFormData] = useState({
        site_id: '',
        vendor_id: '',
        expense_category_id: '',
        subcategory: '',
        description: '',
        amount: '',
        expense_date: '',
        is_recurring: false
    });

    useEffect(() => {
        const fetchResourcesAndExpense = async () => {
            try {
                setLoadingResources(true);
                const token = getToken();

                // Parallel fetching for performance
                const [sitesRes, vendorsRes, catsRes, expenseRes] = await Promise.all([
                    getAuth(`/pms/sites.json${token ? `?token=${token}` : ''}`),
                    getAuth('/vendors.json'),
                    getAuth('/expense_categories.json'),
                    getAuth(`/expenses/${id}.json${token ? `?token=${token}` : ''}`)
                ]);

                // Set Resources
                const sitesData = sitesRes?.sites || sitesRes || [];
                setProperties(Array.isArray(sitesData) ? sitesData : []);

                const vData = vendorsRes?.vendors || vendorsRes?.amc_vendors || vendorsRes || [];
                setVendors(Array.isArray(vData) ? vData : []);

                const cData = catsRes?.expense_categories || catsRes || [];
                setCategories(Array.isArray(cData) ? cData : []);

                // Set Expense Data
                const exp = expenseRes?.expense || expenseRes;
                if (exp) {
                    setFormData({
                        site_id: exp.site_id?.toString() || '',
                        vendor_id: exp.vendor_id?.toString() || '',
                        expense_category_id: exp.expense_category_id?.toString() || '',
                        subcategory: exp.subcategory || '',
                        description: exp.description || '',
                        amount: exp.amount?.toString() || '',
                        expense_date: exp.expense_date || '',
                        is_recurring: exp.is_recurring || false
                    });
                }

            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load expense data');
            } finally {
                setLoadingResources(false);
            }
        };

        if (id) fetchResourcesAndExpense();
    }, [id]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.site_id || !formData.expense_category_id || !formData.amount || !formData.expense_date) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);
            const token = getToken();
            const payload = {
                expense: {
                    site_id: parseInt(formData.site_id),
                    vendor_id: formData.vendor_id ? parseInt(formData.vendor_id) : null,
                    expense_category_id: parseInt(formData.expense_category_id),
                    subcategory: formData.subcategory,
                    description: formData.description,
                    amount: parseFloat(formData.amount),
                    expense_date: formData.expense_date,
                    is_recurring: formData.is_recurring
                }
            };

            await patchAuth(`/expenses/${id}.json${token ? `?token=${token}` : ''}`, payload);
            toast.success('Expense updated successfully');
            navigate(`/opex/${id}`); // Navigate to details page
        } catch (error: any) {
            console.error('Failed to update expense:', error);
            toast.error(error.message || 'Failed to update expense');
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
            <div className="max-w-full mx-auto space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="p-0 hover:bg-transparent">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
                        <p className="text-sm text-gray-500">Update operational expense record</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">Expense Details</CardTitle>
                            <CardDescription>Enter the details for the operational expense</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Property Selection */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Property (Site) *</Label>
                                    <Select value={formData.site_id} onValueChange={(val) => handleChange('site_id', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {properties.map(p => (
                                                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category Selection */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Expense Category *</Label>
                                    <Select value={formData.expense_category_id} onValueChange={(val) => handleChange('expense_category_id', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Vendor Selection */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Vendor</Label>
                                    <Select value={formData.vendor_id} onValueChange={(val) => handleChange('vendor_id', val)}>
                                        <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Vendor" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {vendors.map(v => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    {v.vendor_name || v.name || 'N/A'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Subcategory */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Subcategory</Label>
                                    <Input
                                        className="bg-white border-gray-300 text-gray-900"
                                        placeholder="e.g. Maintenance test"
                                        value={formData.subcategory}
                                        onChange={(e) => handleChange('subcategory', e.target.value)}
                                    />
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Amount *</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <Input
                                            type="number"
                                            className="pl-8 bg-white border-gray-300 text-gray-900"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => handleChange('amount', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Expense Date *</Label>
                                    <Input
                                        type="date"
                                        className="bg-white border-gray-300 text-gray-900"
                                        value={formData.expense_date}
                                        onChange={(e) => handleChange('expense_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Description</Label>
                                <Textarea
                                    className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                                    placeholder="Enter expense description..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>

                            {/* Recurring Switch */}
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="space-y-0.5">
                                    <Label className="text-gray-900 font-medium text-base">Is Recurring?</Label>
                                    <p className="text-sm text-gray-500">Enable if this is a repeating expense</p>
                                </div>
                                <Switch
                                    checked={formData.is_recurring}
                                    onCheckedChange={(checked) => handleChange('is_recurring', checked)}
                                />
                            </div>

                        </CardContent>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#C72030] hover:bg-[#A01825] text-white min-w-[140px] font-medium shadow-sm transition-all active:scale-95">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Update Expense
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default EditExpensePage;
