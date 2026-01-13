
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Calendar, Building2, User, Wallet, Info, IndianRupee, Clock, RotateCcw } from 'lucide-react';
import { getAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const ExpenseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [expense, setExpense] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExpenseDetails = async () => {
            try {
                setIsLoading(true);
                const token = getToken();
                const data = await getAuth(`/expenses/${id}.json${token ? `?token=${token}` : ''}`);
                setExpense(data?.expense || data);
            } catch (error) {
                console.error('Failed to fetch expense details:', error);
                toast.error('Failed to load expense details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchExpenseDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <RotateCcw className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!expense) {
        return (
            <div className="p-8 text-center bg-gray-50 h-screen">
                <Card className="max-w-md mx-auto mt-12">
                    <CardContent className="pt-6">
                        <p className="text-gray-500 mb-4">Expense not found</p>
                        <Button onClick={() => navigate('/opex')}>Back to Expenses</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate('/opex')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Expense Details</h1>
                            <p className="text-sm text-gray-500">EXP{expense.id?.toString().padStart(3, '0')}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(`/opex/edit/${id}`)}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white font-medium shadow-sm"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Expense
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1 bg-[#C72030]"></div>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">Financial Summary</CardTitle>
                                        <CardDescription>Breakdown of the expense amount and categorization</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-2xl font-black text-gray-900">
                                            <IndianRupee className="h-5 w-5 mr-1" />
                                            {parseFloat(expense.amount || 0).toLocaleString()}
                                        </div>
                                        {expense.is_recurring && (
                                            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                                                <Clock className="h-3 w-3 mr-1" /> Recurring
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Wallet className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                                                <p className="font-bold text-gray-900">{expense.expense_category?.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">{expense.subcategory || 'No subcategory'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Calendar className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Transaction Date</p>
                                                <p className="font-bold text-gray-900">
                                                    {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Building2 className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Property</p>
                                                <p className="font-bold text-gray-900">{expense.site?.name || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Vendor</p>
                                                <p className="font-bold text-gray-900">{expense.vendor?.vendor_name || expense.vendor?.name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <Info className="h-4 w-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Internal Note / Description</p>
                                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                                "{expense.description || 'No detailed description provided for this expense.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Meta Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black text-gray-500">Created At</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {expense.created_at ? new Date(expense.created_at).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-black text-gray-500">Last Modified</span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {expense.updated_at ? new Date(expense.updated_at).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-900 text-white border-none shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#C72030]">Management Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-2">
                                <p className="text-xs text-gray-400">Need to make changes? You can update categorization or notes here.</p>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-white border-white/20 hover:bg-white/10"
                                    onClick={() => navigate(`/opex/edit/${id}`)}
                                >
                                    <Edit className="h-4 w-4 mr-2" /> Modify Entry
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-red-400 border-red-400/20 hover:bg-red-400/10"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" /> Flag for Review
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseDetailsPage;
