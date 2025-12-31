
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Globe, ChevronLeft, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

const CountryMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/masters')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Country Master</h1>
                        <p className="text-gray-600">Manage countries with their codes and currency information</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Country
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
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
                                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingCountry ? 'Updating...' : 'Creating...') : (editingCountry ? 'Update Country' : 'Save Country')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Countries Database</CardTitle>
                            <CardDescription>Complete list of all countries in the system</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40 bg-white">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search countries..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingCountries ? (
                        <div className="text-center py-8 text-gray-500">Loading countries...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Country Details</TableHead>
                                    <TableHead>Codes</TableHead>
                                    <TableHead>Phone Code</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCountries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No countries found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCountries.map((country) => (
                                        <TableRow key={country.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <Globe className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{country.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {country.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <Badge variant="outline" className="mb-1">{country.code}</Badge>
                                                    {country.iso_code && (
                                                        <p className="text-xs text-gray-500">ISO: {country.iso_code}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{country.phone_code || 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-600 hover:bg-green-700">{country.currency_code || 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={country.status || 'Active'}
                                                    onValueChange={(value) => handleUpdateStatus(country.id, value)}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${country.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        <SelectItem value="Active">Active</SelectItem>
                                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/countries/${country.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditCountry(country)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteCountry(country.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CountryMaster;
