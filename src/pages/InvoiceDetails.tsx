
import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/loader';
import { PageContainer } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { ArrowLeft, Printer, Send, CreditCard, Building, User, Calendar, Receipt, FileText } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

/** One row of the invoice summary breakdown. `tone` drives the amount colour. */
interface InvoiceLine {
    id: string;
    description: string;
    amount: number;
    /** Rendered prefix: '+' for charges, '-' for deductions, '' for base/total. */
    sign: '' | '+' | '-';
    tone: 'default' | 'credit' | 'debit';
    isTotal?: boolean;
}

const columns: ColumnConfig[] = [
    { key: 'description', label: 'Description', sortable: false, draggable: false, hideable: false },
    { key: 'amount', label: 'Amount', sortable: false, draggable: false, hideable: false },
];

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
            <div className="flex justify-center items-center h-screen bg-brand-bg">
                <Spinner className="h-6 w-6 text-brand" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-brand-body-1 font-semibold text-brand-text">Invoice not found</h2>
                <Button variant="link" onClick={() => navigate('/invoicing')} className="mt-4">Back to Invoices</Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return <Badge variant="success">Paid</Badge>;
            case 'pending':
                return <Badge variant="pending">Pending</Badge>;
            case 'overdue':
                return <Badge variant="rejected">Overdue</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const totalPayable =
        (invoice.amount || 0) +
        (invoice.gst_amount || 0) +
        (invoice.penalty_amount || 0) +
        (invoice.interest_amount || 0) -
        (invoice.tds_amount || 0);

    const invoiceLines: InvoiceLine[] = [
        { id: 'base', description: 'Base Amount', amount: invoice.amount || 0, sign: '', tone: 'default' },
        ...(invoice.gst_amount > 0
            ? [{ id: 'gst', description: 'GST (18%)', amount: invoice.gst_amount, sign: '+', tone: 'credit' } as InvoiceLine]
            : []),
        ...(invoice.tds_amount > 0
            ? [{ id: 'tds', description: 'TDS', amount: invoice.tds_amount, sign: '-', tone: 'debit' } as InvoiceLine]
            : []),
        ...(invoice.penalty_amount > 0
            ? [{ id: 'penalty', description: 'Penalty', amount: invoice.penalty_amount, sign: '+', tone: 'debit' } as InvoiceLine]
            : []),
        ...(invoice.interest_amount > 0
            ? [{ id: 'interest', description: 'Interest', amount: invoice.interest_amount, sign: '+', tone: 'debit' } as InvoiceLine]
            : []),
        { id: 'total', description: 'Total Payable', amount: totalPayable, sign: '', tone: 'default', isTotal: true },
    ];

    const renderLineCell = (line: InvoiceLine, columnKey: string) => {
        if (columnKey === 'description') {
            return (
                <span className={line.isTotal ? 'font-bold text-brand-text' : undefined}>
                    {line.description}
                </span>
            );
        }

        const toneClass =
            line.tone === 'credit'
                ? 'text-brand-info'
                : line.tone === 'debit'
                    ? 'text-brand-error'
                    : 'text-brand-text';

        return (
            <span
                className={`block text-right ${toneClass} ${line.isTotal ? 'font-bold text-brand-body-2' : 'font-medium'}`}
            >
                {line.sign}₹{line.amount?.toLocaleString()}
            </span>
        );
    };

    return (
        <PageContainer>
            <div className="max-w-full mx-auto space-y-6">

                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/invoicing')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-brand-h2 font-bold text-brand-text flex items-center gap-3">
                                {invoice.invoice_number || `Invoice #${invoice.id}`}
                                {getStatusBadge(invoice.status)}
                            </h1>
                            <p className="text-brand-body-5 text-brand-text-light mt-1">
                                Issued on {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
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
                            <Button size="sm">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Record Payment
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-system-sm bg-white">
                            <CardContent className="pt-6">
                                <EnhancedTable
                                    data={invoiceLines}
                                    columns={columns}
                                    renderCell={renderLineCell}
                                    getItemId={(line) => line.id}
                                    rowClassName={(line) => (line.isTotal ? 'bg-brand-bg' : '')}
                                    storageKey="invoice-summary-table"
                                    emptyMessage="No line items"
                                    leftActions={
                                        <span className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
                                            <Receipt className="h-4 w-4 text-brand" />
                                            Invoice Summary
                                        </span>
                                    }
                                    enableSearch={true}
                                    enableSelection={false}
                                    hideTableExport={true}
                                    hideColumnsButton={true}
                                    pagination={false}
                                />
                            </CardContent>
                        </Card>

                        {/* Billing Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-system-sm">
                                <CardHeader>
                                    <CardTitle className="text-brand-body-5 font-semibold text-brand-text-light uppercase tracking-wider flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Bill To
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="font-bold text-brand-text">{invoice.billable?.tenant_name || 'N/A'}</p>
                                        <p className="text-brand-body-5 text-brand-text-light">{invoice.billable?.type}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-system-sm">
                                <CardHeader>
                                    <CardTitle className="text-brand-body-5 font-semibold text-brand-text-light uppercase tracking-wider flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        Property
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1">
                                        <p className="font-bold text-brand-text">{invoice.billable?.property_name || 'N/A'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <Card className="border-none shadow-system-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-brand" />
                                    Dates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-brand-body-5 text-brand-text-light">Invoice Date</p>
                                    <p className="text-brand-body-5 font-medium text-brand-text">{new Date(invoice.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-brand-body-5 text-brand-text-light">Due Date</p>
                                    <p className="text-brand-body-5 font-medium text-brand-error">{new Date(invoice.due_date).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-system-sm bg-brand-teal-light">
                            <CardHeader>
                                <CardTitle className="text-brand-body-5 font-semibold text-brand-text flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Notes & Terms
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-brand-caption text-brand-text leading-relaxed">
                                    Please make payment by the due date to avoid penalty. For any queries regarding this invoice, please contact support.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default InvoiceDetails;
