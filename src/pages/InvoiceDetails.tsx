
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Printer, Send, CreditCard, Building, User, Calendar, Receipt, DollarSign, FileText } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                setLoading(true);
                const data = await getAuth(`/invoices/${id}.json`);
                setInvoice(data);
            } catch (error) {
                console.error('Failed to fetch invoice details:', error);
                toast.error('Failed to load invoice details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInvoiceDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
                <Button variant="link" onClick={() => navigate('/invoicing')} className="mt-4 text-[#C72030]">Back to Invoices</Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
            case 'overdue':
                return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/invoicing')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                {invoice.invoice_number || `Invoice #${invoice.id}`}
                                {getStatusBadge(invoice.status)}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Issued on {new Date(invoice.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                        {invoice.status === 'pending' && (
                            <Button className="bg-[#C72030] hover:bg-[#A01825] text-white size-sm">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Record Payment
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-[#C72030]" />
                                    Invoice Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Base Amount</TableCell>
                                            <TableCell className="text-right font-medium">₹{invoice.amount?.toLocaleString()}</TableCell>
                                        </TableRow>
                                        {invoice.gst_amount > 0 && (
                                            <TableRow>
                                                <TableCell>GST (18%)</TableCell>
                                                <TableCell className="text-right font-medium text-blue-600">+₹{invoice.gst_amount?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        )}
                                        {invoice.tds_amount > 0 && (
                                            <TableRow>
                                                <TableCell>TDS</TableCell>
                                                <TableCell className="text-right font-medium text-red-600">-₹{invoice.tds_amount?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        )}
                                        {invoice.penalty_amount > 0 && (
                                            <TableRow>
                                                <TableCell>Penalty</TableCell>
                                                <TableCell className="text-right font-medium text-red-600">+₹{invoice.penalty_amount?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        )}
                                        {invoice.interest_amount > 0 && (
                                            <TableRow>
                                                <TableCell>Interest</TableCell>
                                                <TableCell className="text-right font-medium text-red-600">+₹{invoice.interest_amount?.toLocaleString()}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow className="bg-gray-50/50">
                                            <TableCell className="font-bold text-gray-900">Total Payable</TableCell>
                                            <TableCell className="text-right font-bold text-gray-900 text-lg">
                                                ₹{(
                                                    (invoice.amount || 0) +
                                                    (invoice.gst_amount || 0) +
                                                    (invoice.penalty_amount || 0) +
                                                    (invoice.interest_amount || 0) -
                                                    (invoice.tds_amount || 0)
                                                ).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Billing Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Bill To
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{invoice.billable?.tenant_name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{invoice.billable?.type}</p>
                                        <p className="text-sm text-gray-500 mt-2">Reference ID: {invoice.billable?.id}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Property
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="font-bold text-gray-900">{invoice.billable?.property_name || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#C72030]" />
                                    Dates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Invoice Date</p>
                                    <p className="text-sm font-medium text-gray-900">{new Date(invoice.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Due Date</p>
                                    <p className="text-sm font-medium text-red-600">{new Date(invoice.due_date).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-blue-50/50">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Notes & Terms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Please make payment by the due date to avoid penalty. For any queries regarding this invoice, please contact support.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
