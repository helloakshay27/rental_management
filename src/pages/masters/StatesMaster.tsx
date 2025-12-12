
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { postAuth, getAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';

interface State {
    id: number;
    name: string;
    code: string;
    country_id: number;
    country?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    updated_at: string;
}

interface Country {
    id: number;
    name: string;
    code: string;
}

const StatesMaster = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingState, setEditingState] = useState<State | null>(null);
    const [states, setStates] = useState<State[]>([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        country_id: ''
    });

    const fetchCountries = async () => {
        try {
            const data = await getAuth('/pms/countries');
            if (Array.isArray(data)) {
                setCountries(data);
            }
        } catch (error: any) {
            console.error('Failed to fetch countries', error);
            toast.error('Failed to load countries');
        }
    };

    const fetchStates = async () => {
        try {
            setLoadingStates(true);
            const data = await getAuth('/pms/states');
            if (Array.isArray(data)) {
                setStates(data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch states';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingStates(false);
        }
    };

    useEffect(() => {
        fetchCountries();
        fetchStates();
    }, []);

    const filteredStates = states.filter(state =>
        state.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditState = async (state: State) => {
        try {
            setIsLoading(true);
            const stateData = await getAuth(`/pms/states/${state.id}`);
            const data = stateData?.state || stateData;

            setEditingState(data);
            setFormData({
                name: data.name || '',
                code: data.code || '',
                country_id: data.country_id?.toString() || ''
            });
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error('Failed to fetch state details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingState(null);
        setFormData({
            name: '',
            code: '',
            country_id: ''
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.code.trim() || !formData.country_id) {
                toast.error('State name, code, and country are required');
                return;
            }

            // Prepare payload
            const payload = {
                pms_state: {
                    name: formData.name,
                    code: formData.code,
                    country_id: parseInt(formData.country_id)
                }
            };

            // Make API call
            if (editingState) {
                await patchAuth(`/pms/states/${editingState.id}`, payload);
                toast.success('State updated successfully');
            } else {
                await postAuth('/pms/states', payload);
                toast.success('State created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh states list
            fetchStates();

        } catch (error: any) {
            let errorMessage = editingState ? 'Failed to update state' : 'Failed to create state';

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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">States Master</h1>
                    <p className="text-gray-600">Manage states and their association with countries</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add State
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
                                {editingState ? 'Edit State' : 'Add New State'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingState ? 'Update the state details below' : 'Enter state information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-gray-900 font-medium">Country *</Label>
                                <Select
                                    value={formData.country_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.id.toString()}>
                                                {country.name} ({country.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state-name" className="text-gray-900 font-medium">State Name *</Label>
                                    <Input
                                        id="state-name"
                                        placeholder="e.g., Maharashtra"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state-code" className="text-gray-900 font-medium">State Code *</Label>
                                    <Input
                                        id="state-code"
                                        placeholder="e.g., MH"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                        maxLength={2}
                                    />
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
                                {isLoading ? (editingState ? 'Updating...' : 'Creating...') : (editingState ? 'Update State' : 'Save State')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>States Database</CardTitle>
                            <CardDescription>Complete list of all states in the system</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search states..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingStates ? (
                        <div className="text-center py-8 text-gray-500">Loading states...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>State Details</TableHead>
                                    <TableHead>State Code</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No states found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStates.map((state) => (
                                        <TableRow key={state.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <MapPin className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{state.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {state.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{state.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{state.country?.name || 'N/A'}</p>
                                                    {state.country?.code && (
                                                        <Badge variant="secondary" className="mt-1">{state.country.code}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditState(state)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600">
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

export default StatesMaster;
