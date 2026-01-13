
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ExpenseCategory {
    id: number;
    name: string;
    code: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

const ExpenseCategoryMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_entries: 0
    });

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
    const [viewingCategory, setViewingCategory] = useState<ExpenseCategory | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        active: true
    });

    const fetchCategories = async (page = 1) => {
        try {
            setLoading(true);
            let url = `/expense_categories.json?page=${page}`;
            if (searchTerm) {
                url += `&q[name_or_code_cont]=${searchTerm}`;
            }
            const data = await getAuth(url);

            if (data.expense_categories) {
                setCategories(data.expense_categories);
                if (data.pagination) setPagination(data.pagination);
            } else if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching expense categories:', error);
            toast.error('Failed to load expense categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(pagination.current_page);
    }, [pagination.current_page]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchCategories(1);
    };

    const handleResetForm = () => {
        setFormData({ name: '', code: '', active: true });
        setEditingCategory(null);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = { expense_category: formData };
            await postAuth('/expense_categories.json', payload);
            toast.success('Expense category created successfully');
            setIsAddModalOpen(false);
            handleResetForm();
            fetchCategories(1);
        } catch (error: any) {
            console.error('Error creating category:', error);
            toast.error(error.message || 'Failed to create category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewClick = (category: ExpenseCategory) => {
        setViewingCategory(category);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (category: ExpenseCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            code: category.code,
            active: category.active
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        try {
            setSubmitting(true);
            const payload = { expense_category: formData };
            await patchAuth(`/expense_categories/${editingCategory.id}.json`, payload);
            toast.success('Expense category updated successfully');
            setIsEditModalOpen(false);
            handleResetForm();
            fetchCategories(pagination.current_page);
        } catch (error: any) {
            console.error('Error updating category:', error);
            toast.error(error.message || 'Failed to update category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteAuth(`/expense_categories/${id}.json`);
            toast.success('Category deleted successfully');
            fetchCategories(pagination.current_page);
        } catch (error: any) {
            toast.error('Failed to delete category');
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
                        <h1 className="text-2xl font-bold text-gray-900">Expense Categories</h1>
                        <p className="text-gray-600">Manage categories for operating expenses</p>
                    </div>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) handleResetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825] text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <form onSubmit={handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 font-bold text-xl">Add Expense Category</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Create a new category for expense tracking.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-gray-900 font-medium">Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Maintenance"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="code" className="text-gray-900 font-medium">Code *</Label>
                                    <Input
                                        id="code"
                                        placeholder="e.g. MTN001"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                    <Label htmlFor="active" className="flex flex-col gap-1 text-gray-900 font-medium">
                                        <span>Status</span>
                                        <span className="font-normal text-xs text-muted-foreground text-gray-500">Enable or disable this category</span>
                                    </Label>
                                    <Switch
                                        id="active"
                                        checked={formData.active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="bg-[#C72030] hover:bg-[#A01825]">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Category
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch} variant="outline">Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                                                <span className="text-sm text-gray-500">Loading categories...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
                                            <TableCell className="text-gray-600 font-mono text-xs">{category.code}</TableCell>
                                            <TableCell>
                                                {category.active ? (
                                                    <div className="flex items-center text-green-600 gap-1.5 text-xs font-medium">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Active
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-400 gap-1.5 text-xs font-medium">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Inactive
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-xs">
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewClick(category)}>
                                                        <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                                                        <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} categories
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-xs font-medium">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === pagination.total_pages}
                                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) handleResetForm();
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-bold text-xl">Edit Expense Category</DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Update categories for expense tracking.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name" className="text-gray-900 font-medium">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-code" className="text-gray-900 font-medium">Code</Label>
                                <Input
                                    id="edit-code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                <Label htmlFor="edit-active" className="flex flex-col gap-1 text-gray-900 font-medium">
                                    <span>Status</span>
                                    <span className="font-normal text-xs text-muted-foreground text-gray-500">Enable or disable this category</span>
                                </Label>
                                <Switch
                                    id="edit-active"
                                    checked={formData.active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-[#C72030] hover:bg-[#A01825]">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Update Category
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 font-bold text-xl">View Expense Category</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Detailed information for this category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Category Name</span>
                            <span className="text-sm font-medium text-gray-900">{viewingCategory?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Category Code</span>
                            <span className="text-sm font-medium text-gray-900 font-mono">{viewingCategory?.code}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingCategory?.active ? (
                                    <div className="flex items-center text-green-600 gap-1 text-xs font-semibold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        ACTIVE
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-400 gap-1 text-xs font-semibold">
                                        <XCircle className="h-4 w-4" />
                                        INACTIVE
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Created On</span>
                            <span className="text-sm font-medium text-gray-900">
                                {viewingCategory && new Date(viewingCategory.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsViewModalOpen(false)} className="bg-[#C72030] hover:bg-[#A01825]">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseCategoryMaster;
