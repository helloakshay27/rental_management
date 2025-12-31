
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, ChevronLeft, Layout } from 'lucide-react';
import { postAuth, getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface TakeoverCondition {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

const TakeoverConditionsManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCondition, setEditingCondition] = useState<TakeoverCondition | null>(null);
    const [conditions, setConditions] = useState<TakeoverCondition[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });

    const fetchConditions = async () => {
        try {
            setLoadingData(true);
            const data = await getAuth('/property_takeover_conditions');
            setConditions(data);
        } catch (error: any) {
            toast.error("Failed to fetch takeover conditions");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchConditions();
    }, []);

    const filteredConditions = conditions.filter(condition =>
        (condition.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (condition.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleEditCondition = (condition: TakeoverCondition) => {
        setEditingCondition(condition);
        setFormData({
            name: condition.name,
            description: condition.description,
            status: condition.status || 'Active'
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCondition(null);
        setFormData({
            name: '',
            description: '',
            status: 'Active'
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            if (!formData.name.trim()) {
                toast.error("Name is required");
                return;
            }

            const payload = {
                property_takeover_condition: {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status
                }
            };

            if (editingCondition) {
                await patchAuth(`/property_takeover_conditions/${editingCondition.id}`, payload);
                toast.success("Condition updated successfully");
            } else {
                await postAuth('/property_takeover_conditions', payload);
                toast.success("Condition created successfully");
            }

            handleCloseDialog();
            fetchConditions();
        } catch (error: any) {
            let errorMessage = editingCondition ? "Failed to update condition" : "Failed to create condition";
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(", ");
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCondition = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this condition?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/property_takeover_conditions/${id}`);
                toast.success('Condition deleted successfully');
                fetchConditions();
            } catch (error: any) {
                toast.error('Failed to delete condition');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/property_takeover_conditions/${id}`, {
                property_takeover_condition: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchConditions();
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
                        <h1 className="text-2xl font-bold text-gray-900">Property Takeover Conditions</h1>
                        <p className="text-gray-600">Manage conditions under which properties are taken over</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) handleCloseDialog();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Condition
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">{editingCondition ? 'Edit Condition' : 'Add New Condition'}</DialogTitle>
                            <DialogDescription className="text-gray-600">Enter the details for the property takeover condition</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-900 font-medium font-outfit">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Fully Furnished"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-white border-2 border-gray-100 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-900 font-medium font-outfit">Status *</Label>
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
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-900 font-medium font-outfit">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter condition description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-white border-2 border-gray-100 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 min-h-[100px] rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                className="border-2 border-gray-100 text-gray-600 hover:bg-gray-50 h-11 rounded-xl px-6"
                                onClick={handleCloseDialog}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#C72030] hover:bg-[#A01825] text-white h-11 rounded-xl px-6"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingCondition ? 'Updating...' : 'Adding...') : (editingCondition ? 'Update Condition' : 'Add Condition')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Takeover Conditions List</CardTitle>
                            <CardDescription>View and manage all property takeover conditions</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64 bg-white border-2 border-gray-100 focus:border-[#C72030] h-10 rounded-xl"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                                <TableHead className="rounded-l-2xl">Condition Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="rounded-r-2xl">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingData ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredConditions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        No conditions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredConditions.map((condition) => (
                                    <TableRow key={condition.id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-[#C72030]/10 flex items-center justify-center mr-3">
                                                    <Layout className="h-5 w-5 text-[#C72030]" />
                                                </div>
                                                <span className="font-semibold text-gray-900">{condition.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 max-w-md truncate">{condition.description || '-'}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={condition.status || 'Active'}
                                                onValueChange={(value) => handleUpdateStatus(condition.id, value)}
                                            >
                                                <SelectTrigger className={`w-32 h-8 rounded-full ${condition.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl">
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg h-9 w-9" onClick={() => handleEditCondition(condition)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 rounded-lg h-9 w-9" onClick={() => handleDeleteCondition(condition.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default TakeoverConditionsManagement;
