
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Edit, Trash2, Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getAuth, getToken, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';

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

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchExpenses(1);
  };

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

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Expense Tracking</CardTitle>
          <CardDescription className="text-gray-600">Track and manage all operational expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search expenses by description, subcategory or site..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-white text-gray-900 border border-gray-200"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-[#C72030] hover:bg-[#A01825]">Search</Button>
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg bg-white border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Expense ID</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Date</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Property</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Category</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Description</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3">Amount</TableHead>
                  <TableHead className="text-gray-900 font-semibold px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center px-4 py-3">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                        <span className="text-sm text-gray-500">Loading expenses...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-gray-500 px-4 py-3">
                      No expenses found.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="text-gray-900 font-medium px-4 py-3">EXP{expense.id.toString().padStart(3, '0')}</TableCell>
                      <TableCell className="text-gray-700 px-4 py-3">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-700 px-4 py-3">{expense.site?.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-700 px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{expense.expense_category?.name || 'N/A'}</span>
                          <span className="text-xs text-gray-400">{expense.subcategory}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 px-4 py-3">
                        <p className="max-w-[200px] truncate" title={expense.description}>
                          {expense.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-900 font-bold px-4 py-3">
                        ₹{parseFloat(expense.amount).toLocaleString()}
                        {expense.is_recurring && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500" title="Recurring"></span>}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/opex/${expense.id}`)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/opex/edit/${expense.id}`)}
                            className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} expenses
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
    </div>
  );
};

export default ExpenseTracking;
