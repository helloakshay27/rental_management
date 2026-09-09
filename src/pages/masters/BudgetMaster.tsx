
import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, Building2, Wallet, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, patchAuth, deleteAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heading, Text } from '@/components/ui/typography';

interface Budget {
    id: number;
    expense_category_id: number;
    site_id: number;
    year: number;
    amount: string | number;
    expense_category?: {
        id: number;
        name: string;
    };
    site?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface ExpenseCategory {
    id: number;
    name: string;
}

interface Site {
    id: number;
    name: string;
}

const columns: ColumnConfig[] = [
    { key: 'site', label: 'Property', sortable: true, draggable: true },
    { key: 'expense_category', label: 'Category', sortable: true, draggable: true },
    { key: 'year', label: 'Year', sortable: true, draggable: true },
    { key: 'amount', label: 'Amount (₹)', sortable: true, draggable: true },
];

const BudgetMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
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
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [viewingBudget, setViewingBudget] = useState<Budget | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        expense_category_id: '',
        site_id: '',
        year: new Date().getFullYear().toString(),
        amount: ''
    });

    const fetchResources = async () => {
        try {
            const token = getToken();
            const [catsData, sitesData] = await Promise.all([
                getAuth('/expense_categories.json'),
                getAuth(`/pms/sites.json${token ? `?token=${token}` : ''}`)
            ]);

            if (catsData.expense_categories) {
                setCategories(catsData.expense_categories);
            } else if (Array.isArray(catsData)) {
                setCategories(catsData);
            }

            if (sitesData.sites) {
                setSites(sitesData.sites);
            } else if (Array.isArray(sitesData)) {
                setSites(sitesData);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchBudgets = async (page = 1) => {
        try {
            setLoading(true);
            let url = `/budgets.json?page=${page}`;
            if (searchTerm) {
                // Assuming Ransack search for category name or site name
                url += `&q[expense_category_name_or_site_name_cont]=${searchTerm}`;
            }
            const data = await getAuth(url);

            if (data.budgets) {
                setBudgets(data.budgets);
                if (data.pagination) setPagination(data.pagination);
            } else if (Array.isArray(data)) {
                setBudgets(data);
            }
        } catch (error) {
            console.error('Error fetching budgets:', error);
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
        fetchBudgets(pagination.current_page);
    }, [pagination.current_page]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchBudgets(1);
    };

    const handleResetForm = () => {
        setFormData({
            expense_category_id: '',
            site_id: '',
            year: new Date().getFullYear().toString(),
            amount: ''
        });
        setEditingBudget(null);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                budget: {
                    expense_category_id: parseInt(formData.expense_category_id),
                    site_id: parseInt(formData.site_id),
                    year: parseInt(formData.year),
                    amount: parseFloat(formData.amount)
                }
            };
            await postAuth('/budgets.json', payload);
            toast.success('Budget created successfully');
            setIsAddModalOpen(false);
            handleResetForm();
            fetchBudgets(1);
        } catch (error: any) {
            console.error('Error creating budget:', error);
            toast.error(error.message || 'Failed to create budget');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewClick = (budget: Budget) => {
        setViewingBudget(budget);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (budget: Budget) => {
        setEditingBudget(budget);
        // Ensure we support both direct and nested IDs in case the API structure varies
        setFormData({
            expense_category_id: (budget.expense_category_id || budget.expense_category?.id || '').toString(),
            site_id: (budget.site_id || budget.site?.id || '').toString(),
            year: (budget.year || new Date().getFullYear()).toString(),
            amount: (budget.amount || '').toString()
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBudget) return;
        try {
            setSubmitting(true);
            const payload = {
                budget: {
                    expense_category_id: parseInt(formData.expense_category_id) || 0,
                    site_id: parseInt(formData.site_id) || 0,
                    year: parseInt(formData.year) || new Date().getFullYear(),
                    amount: parseFloat(formData.amount) || 0
                }
            };
            await patchAuth(`/budgets/${editingBudget.id}.json`, payload);
            toast.success('Budget updated successfully');
            setIsEditModalOpen(false);
            handleResetForm();
            fetchBudgets(pagination.current_page);
        } catch (error: any) {
            console.error('Error updating budget:', error);
            toast.error(error.message || 'Failed to update budget');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this budget?')) return;
        try {
            await deleteAuth(`/budgets/${id}.json`);
            toast.success('Budget deleted successfully');
            fetchBudgets(pagination.current_page);
        } catch (error: any) {
            toast.error('Failed to delete budget');
        }
    };

    const renderCell = (budget: Budget, columnKey: string) => {
        switch (columnKey) {
            case 'site':

                return (
                    <div className="flex items-center gap-2 text-[13px] font-medium text-brand-text">
                        <Building2 className="h-3 w-3 text-brand-text-light" />
                        {budget.site?.name || 'N/A'}
                    </div>
                );
            case 'expense_category':
                return (
                    <div className="flex items-center gap-2 text-[13px] text-brand-text-light">
                        <Wallet className="h-3 w-3 text-brand-text-light" />
                        {budget.expense_category?.name || 'N/A'}
                    </div>
                );
            case 'year':
                return (
                    <div className="flex items-center gap-2 text-[13px] font-mono text-brand-text-light">
                        <Calendar className="h-3 w-3 text-brand-text-light" />
                        {budget.year}
                    </div>
                );
            case 'amount':
                return (
                    <span className="font-semibold text-[13px] text-brand-text">
                        ₹{parseFloat(budget.amount.toString()).toLocaleString()}
                    </span>
                );
            default:
                return budget[columnKey as keyof Budget] as React.ReactNode;
        }
    };

    const renderActions = (budget: Budget) => (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" title="View" onClick={() => handleViewClick(budget)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditClick(budget)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => handleDelete(budget.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
                        <Button onClick={() => setIsAddModalOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Budget
                        </Button>
                    );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Budget Master" description="Plan and track budgets for different properties and expense categories" backTo="/masters" />

                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) handleResetForm();
                }}>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <form onSubmit={handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Add New Budget</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Set a budget limit for a specific category and site.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="site_id" className="text-gray-900 font-medium">Property (Site) *</Label>
                                    <Select
                                        value={formData.site_id}
                                        onValueChange={(val) => setFormData({ ...formData, site_id: val })}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Property" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {sites.map(s => (
                                                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category_id" className="text-gray-900 font-medium">Expense Category *</Label>
                                    <Select
                                        value={formData.expense_category_id}
                                        onValueChange={(val) => setFormData({ ...formData, expense_category_id: val })}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="year" className="text-gray-900 font-medium">Year *</Label>
                                        <Input
                                            id="year"
                                            type="number"
                                            placeholder="2026"
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="bg-white border-gray-300 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount" className="text-gray-900 font-medium">Amount (₹) *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="50000"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            className="bg-white border-gray-300 text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                    {submitting ? <Spinner className="mr-2" /> : null}
                                    Save Budget
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={budgets}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(budget) => String(budget.id)}
                    storageKey="budgets-master-table"
                    leftActions={leftActions}
                    emptyMessage="No budgets found."
                    loading={loading}
                    loadingMessage="Loading budgets..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search budgets..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="budgets"
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
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Edit Budget</DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Update budget details for this year.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-site-id" className="text-gray-900 font-medium">Property (Site) *</Label>
                                <Select
                                    value={formData.site_id}
                                    onValueChange={(val) => setFormData({ ...formData, site_id: val })}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select Property" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {sites.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-category-id" className="text-gray-900 font-medium">Expense Category *</Label>
                                <Select
                                    value={formData.expense_category_id}
                                    onValueChange={(val) => setFormData({ ...formData, expense_category_id: val })}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-year" className="text-gray-900 font-medium">Year *</Label>
                                    <Input
                                        id="edit-year"
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-amount" className="text-gray-900 font-medium">Amount (₹) *</Label>
                                    <Input
                                        id="edit-amount"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                {submitting ? <Spinner className="mr-2" /> : null}
                                Update Budget
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">View Budget Details</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Detailed budget allocation info.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Property (Site)</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingBudget?.site?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Expense Category</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingBudget?.expense_category?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Budget Year</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingBudget?.year}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Allocated Amount</span>
                            <span className="text-sm font-bold text-gray-900">₹{parseFloat(viewingBudget?.amount?.toString() || '0').toLocaleString()}</span>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Created On</span>
                            <span className="text-[15px] font-medium text-brand-text">
                                {viewingBudget && new Date(viewingBudget.created_at).toLocaleDateString(undefined, {
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

export default BudgetMaster;
