
import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Globe, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface Country {
    id: number;
    name: string;
    code: string;
    iso_code: string;
    phone_code: string;
    currency_code: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Country Details', sortable: true, draggable: true },
    { key: 'code', label: 'Codes', sortable: true, draggable: true },
    { key: 'phone_code', label: 'Phone Code', sortable: true, draggable: true },
    { key: 'currency_code', label: 'Currency', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const CountryMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        iso_code: '',
        phone_code: '',
        currency_code: '',
        status: 'Active'
    });

    const fetchCountries = async () => {
        try {
            setLoadingCountries(true);
            let url = '/pms/countries';
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            const data = await getAuth(url);
            if (Array.isArray(data)) {
                setCountries(data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch countries';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingCountries(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, [statusFilter]);

    const filteredCountries = countries.filter(country =>
        country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.iso_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCountry = async (country: Country) => {
        try {
            setIsLoading(true);
            const countryData = await getAuth(`/pms/countries/${country.id}`);
            const data = countryData?.country || countryData;

            setEditingCountry(data);
            setFormData({
                name: data.name || '',
                code: data.code || '',
                iso_code: data.iso_code || '',
                phone_code: data.phone_code || '',
                currency_code: data.currency_code || '',
                status: data.status || 'Active'
            });
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error('Failed to fetch country details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCountry(null);
        setFormData({
            name: '',
            code: '',
            iso_code: '',
            phone_code: '',
            currency_code: '',
            status: 'Active'
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.code.trim()) {
                toast.error('Country name and code are required');
                return;
            }

            // Prepare payload
            const payload = {
                pms_country: {
                    name: formData.name,
                    code: formData.code,
                    iso_code: formData.iso_code,
                    phone_code: formData.phone_code,
                    currency_code: formData.currency_code,
                    status: formData.status
                }
            };

            // Make API call
            if (editingCountry) {
                await patchAuth(`/pms/countries/${editingCountry.id}`, payload);
                toast.success('Country updated successfully');
            } else {
                await postAuth('/pms/countries', payload);
                toast.success('Country created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh countries list
            fetchCountries();

        } catch (error: any) {
            let errorMessage = editingCountry ? 'Failed to update country' : 'Failed to create country';

            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCountry = async (countryId: number) => {
        if (window.confirm('Are you sure you want to delete this country?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/countries/${countryId}`);
                toast.success('Country deleted successfully');
                fetchCountries();
            } catch (error: any) {
                toast.error('Failed to delete country');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (countryId: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/countries/${countryId}`, {
                pms_country: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchCountries();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (country: Country, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <Globe className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{country.name}</p>
                        </div>
                        <p className="text-brand-caption text-brand-text-light">ID: {country.id}</p>
                    </div>
                );
            case 'code':
                return (
                    <div>
                        <Badge variant="outline" className="mb-1">{country.code}</Badge>
                        {country.iso_code && (
                            <p className="text-brand-caption text-brand-text-light">ISO: {country.iso_code}</p>
                        )}
                    </div>
                );
            case 'phone_code':
                return <Badge variant="secondary">{country.phone_code || 'N/A'}</Badge>;
            case 'currency_code':
                return <Badge variant="success">{country.currency_code || 'N/A'}</Badge>;
            case 'status':
                return (
                    <Select
                        value={country.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(country.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${country.status?.toLowerCase() === 'active'
                                ? 'bg-brand-success-bg text-brand-success'
                                : 'bg-brand-muted text-brand-text'}`}
                        >
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                );
            default:
                return country[columnKey as keyof Country];
        }
    };

    const renderActions = (country: Country) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/countries/${country.id}`)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditCountry(country)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteCountry(country.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Country
            </Button>

            <TableFilterDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                onApply={() => setStatusFilter(pendingStatus)}
                onReset={() => {
                    setPendingStatus('all');
                    setStatusFilter('all');
                }}
            >
                <FilterField label="Status">
                    <Select value={pendingStatus} onValueChange={setPendingStatus}>
                        <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </FilterField>
            </TableFilterDialog>
        </div>
    );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Country Master" description="Manage countries with their codes and currency information" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                                {editingCountry ? 'Edit Country' : 'Add New Country'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingCountry ? 'Update the country details below' : 'Enter country information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="country-name" className="text-gray-900 font-medium">Country Name *</Label>
                                    <Input
                                        id="country-name"
                                        placeholder="e.g., India"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country-code" className="text-gray-900 font-medium">Country Code *</Label>
                                    <Input
                                        id="country-code"
                                        placeholder="e.g., IN"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="iso-code" className="text-gray-900 font-medium">ISO Code</Label>
                                    <Input
                                        id="iso-code"
                                        placeholder="e.g., 356"
                                        value={formData.iso_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, iso_code: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone-code" className="text-gray-900 font-medium">Phone Code</Label>
                                    <Input
                                        id="phone-code"
                                        placeholder="e.g., +91"
                                        value={formData.phone_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone_code: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency-code" className="text-gray-900 font-medium">Currency Code</Label>
                                    <Input
                                        id="currency-code"
                                        placeholder="e.g., INR"
                                        value={formData.currency_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, currency_code: e.target.value.toUpperCase() }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                        maxLength={3}
                                    />
                                </div>
                            </div>

                            {/* Status Field */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Status *</Label>
                                <div className="flex items-center space-x-6 pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'Active'}
                                            onChange={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            checked={formData.status === 'Inactive'}
                                            onChange={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        />
                                        <span className="text-sm text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={handleCloseDialog}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="fm-button-fix fm-button-brand px-6 py-2"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingCountry ? 'Updating...' : 'Creating...') : (editingCountry ? 'Update Country' : 'Save Country')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredCountries}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(country) => String(country.id)}
                    storageKey="countries-master-table"
                    emptyMessage="No countries found"
                    loading={loadingCountries}
                    loadingMessage="Loading countries..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search countries..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="countries"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default CountryMaster;
