
import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heading, Text } from '@/components/ui/typography';

interface ExpenseCategory {
    id: number;
    name: string;
    code: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Category Name', sortable: true, draggable: true },
    { key: 'code', label: 'Code', sortable: true, draggable: true },
    { key: 'active', label: 'Status', sortable: true, draggable: true },
    { key: 'created_at', label: 'Created At', sortable: true, draggable: true },
];

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

    const renderCell = (category: ExpenseCategory, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return <span className="font-medium text-brand-text">{category.name}</span>;
            case 'code':
                return <span className="font-mono text-[13px] text-brand-text-light">{category.code}</span>;
            case 'active':
                return category.active ? (
                    <div className="flex items-center text-brand-success gap-1.5 text-[13px] font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                    </div>
                ) : (
                    <div className="flex items-center text-brand-text-light gap-1.5 text-[13px] font-medium">
                        <XCircle className="h-3.5 w-3.5" />
                        Inactive
                    </div>
                );
            case 'created_at':
                return (
                    <span className="text-[13px] text-brand-text-light">
                        {new Date(category.created_at).toLocaleDateString()}
                    </span>
                );
            default:
                return category[columnKey as keyof ExpenseCategory] as React.ReactNode;
        }
    };

    const renderActions = (category: ExpenseCategory) => (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" title="View" onClick={() => handleViewClick(category)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditClick(category)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => handleDelete(category.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );


    const leftActions = (
            <Button onClick={() => setIsAddModalOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
            </Button>
        );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Expense Categories" description="Manage categories for operating expenses" backTo="/masters" />

                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) handleResetForm();
                }}>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <form onSubmit={handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Add Expense Category</DialogTitle>
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
                                        <span className="text-[13px] text-brand-text-light">Enable or disable this category</span>
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
                                <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                    {submitting ? <Spinner className="mr-2" /> : null}
                                    Save Category
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={categories}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(category) => String(category.id)}
                    storageKey="expense-categories-master-table"
                    leftActions={leftActions}
                    emptyMessage="No categories found."
                    loading={loading}
                    loadingMessage="Loading categories..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by name or code..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="expense-categories"
                    pagination={true}
                    pageSize={pagination.per_page}
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={(page) =>
                        setPagination(prev => ({ ...prev, current_page: page }))
                    }
                />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) handleResetForm();
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Edit Expense Category</DialogTitle>
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
                                    <span className="text-[13px] text-brand-text-light">Enable or disable this category</span>
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
                            <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                {submitting ? <Spinner className="mr-2" /> : null}
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
                        <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">View Expense Category</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Detailed information for this category.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Category Name</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingCategory?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Category Code</span>
                            <span className="text-[15px] font-medium font-mono text-brand-text">{viewingCategory?.code}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Status</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingCategory?.active ? (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-success">
                                        <CheckCircle2 className="h-4 w-4" />
                                        ACTIVE
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-text-light">
                                        <XCircle className="h-4 w-4" />
                                        INACTIVE
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Created On</span>
                            <span className="text-[15px] font-medium text-brand-text">
                                {viewingCategory && new Date(viewingCategory.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsViewModalOpen(false)} className="fm-button-fix fm-button-brand px-6 py-2">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
};

export default ExpenseCategoryMaster;
