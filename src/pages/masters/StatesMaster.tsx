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
import { Plus, Edit, Trash2, MapPin, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface State {
    id: number;
    name: string;
    code: string;
    country_id: number;
    status: string;
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

const columns: ColumnConfig[] = [
    { key: 'name', label: 'State Details', sortable: true, draggable: true },
    { key: 'code', label: 'State Code', sortable: true, draggable: true },
    { key: 'country', label: 'Country', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const StatesMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingState, setEditingState] = useState<State | null>(null);
    const [states, setStates] = useState<State[]>([]);
    const [loadingStates, setLoadingStates] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        country_id: '',
        status: 'Active'
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
            let url = '/pms/states';
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
    }, [statusFilter]);

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
                country_id: data.country_id?.toString() || '',
                status: data.status || 'Active'
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
            country_id: '',
            status: 'Active'
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
                    country_id: parseInt(formData.country_id),
                    status: formData.status
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
    const handleDeleteState = async (stateId: number) => {
        if (window.confirm('Are you sure you want to delete this state?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/states/${stateId}`);
                toast.success('State deleted successfully');
                fetchStates();
            } catch (error: any) {
                toast.error('Failed to delete state');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (stateId: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/states/${stateId}`, {
                pms_state: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchStates();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (state: State, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <MapPin className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{state.name}</p>
                        </div>
                        <p className="text-brand-caption text-brand-text-light">ID: {state.id}</p>
                    </div>
                );
            case 'code':
                return <Badge variant="outline">{state.code}</Badge>;
            case 'country':
                return (
                    <div>
                        <p className="font-medium text-brand-body-5">{state.country?.name || 'N/A'}</p>
                        {state.country?.code && (
                            <Badge variant="secondary" className="mt-1">{state.country.code}</Badge>
                        )}
                    </div>
                );
            case 'status':
                return (
                    <Select
                        value={state.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(state.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${state.status?.toLowerCase() === 'active'
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
                return state[columnKey as keyof State] as React.ReactNode;
        }
    };

    const renderActions = (state: State) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/states/${state.id}`)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditState(state)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteState(state.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add State
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
                <PageHeader title="States Master" description="Manage states and their association with countries" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
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
                                {isLoading ? (editingState ? 'Updating...' : 'Creating...') : (editingState ? 'Update State' : 'Save State')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredStates}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(item) => String(item.id)}
                    storageKey="states-master-table"
                    emptyMessage="No states found"
                    loading={loadingStates}
                    loadingMessage="Loading states..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search states..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="states"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default StatesMaster;
