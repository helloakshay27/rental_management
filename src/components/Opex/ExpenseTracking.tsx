
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { getAuth, getToken, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  { key: 'id', label: 'Expense ID', sortable: true, draggable: true },
  { key: 'expense_date', label: 'Date', sortable: true, draggable: true },
  { key: 'site', label: 'Property', sortable: true, draggable: true },
  { key: 'expense_category', label: 'Category', sortable: true, draggable: true },
  { key: 'description', label: 'Description', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
];

const ExpenseTracking = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_entries: 0
  });

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      const token = getToken();
      let url = `/expenses.json?page=${page}${token ? `&token=${token}` : ''}`;

      if (searchTerm) {
        url += `&q[description_or_subcategory_or_site_name_cont]=${searchTerm}`;
      }

      const data = await getAuth(url);

      if (data.expenses) {
        setExpenses(data.expenses);
        if (data.pagination) setPagination(data.pagination);
      } else if (Array.isArray(data)) {
        setExpenses(data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(pagination.current_page);
  }, [pagination.current_page]);

  // Server-side search: refetch from page 1 whenever the debounced term settles.
  useEffect(() => {
    const handle = setTimeout(() => {
      setPagination(prev => (prev.current_page === 1 ? prev : { ...prev, current_page: 1 }));
      fetchExpenses(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const token = getToken();
      await deleteAuth(`/expenses/${id}.json${token ? `?token=${token}` : ''}`);
      toast.success('Expense deleted successfully');
      fetchExpenses(pagination.current_page);
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const renderCell = (expense: any, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return (
          <span className="font-medium text-brand-text">
            EXP{expense.id.toString().padStart(3, '0')}
          </span>
        );
      case 'expense_date':
        return new Date(expense.expense_date).toLocaleDateString();
      case 'site':
        return expense.site?.name || 'N/A';
      case 'expense_category':
        return (
          <div className="flex flex-col">
            <span className="font-medium">{expense.expense_category?.name || 'N/A'}</span>
            <span className="text-brand-caption text-brand-text-light">{expense.subcategory}</span>
          </div>
        );
      case 'description':
        return (
          <p className="max-w-[200px] truncate" title={expense.description}>
            {expense.description}
          </p>
        );
      case 'amount':
        return (
          <span className="font-bold text-brand-text">
            ₹{parseFloat(expense.amount).toLocaleString()}
            {expense.is_recurring && (
              <span
                className="ml-2 inline-block w-2 h-2 rounded-full bg-brand-info"
                title="Recurring"
              ></span>
            )}
          </span>
        );
      default:
        return expense[columnKey];
    }
  };

  const renderActions = (expense: any) => (
    <div className="flex justify-end space-x-1">
      <Button
        variant="ghost"
        size="icon"
        title="View"
        onClick={() => navigate(`/opex/${expense.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Edit"
        onClick={() => navigate(`/opex/edit/${expense.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        title="Delete"
        className="text-brand-error"
        onClick={() => handleDelete(expense.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <Button onClick={() => navigate('/opex/new')} className="fm-button-fix fm-button-brand px-6 py-2">
      <Plus className="w-4 h-4 mr-2" />
      Add Expense
    </Button>
  );

  return (
    <div className="space-y-5">
      <div>
        <EnhancedTable
          data={expenses}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(expense) => String(expense.id)}
          storageKey="expenses-table"
          leftActions={leftActions}
          emptyMessage="No expenses found."
          loading={loading}
          loadingMessage="Loading expenses..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search expenses by description, subcategory or site..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          exportFileName="expenses"
          pagination={true}
          pageSize={pagination.per_page}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={(page) =>
            setPagination(prev => ({ ...prev, current_page: page }))
          }
        />
      </div>
    </div>
  );
};

export default ExpenseTracking;
