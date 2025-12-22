import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Edit, FileText } from 'lucide-react';

interface MonitoryComplianceTableProps {
    documents: any[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDownload: (id: string) => void;
}

const MonitoryComplianceTable = ({ documents, onView, onEdit, onDownload }: MonitoryComplianceTableProps) => {
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="border rounded-xl bg-white border-gray-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="text-gray-900 font-semibold py-4 px-4 text-sm uppercase">Document Details</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">Requirement</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">Property</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">Due Date</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">Assigned To</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase">Status</TableHead>
                        <TableHead className="text-gray-900 font-semibold text-sm uppercase text-right px-4">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-gray-500 font-medium italic">
                                No compliance documents found
                            </TableCell>
                        </TableRow>
                    ) : (
                        documents.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                                <TableCell className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <FileText className="h-5 w-5 text-[#C72030]" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{doc.document_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {doc.id}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-700">{doc.compliance_requirement?.title || 'N/A'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium text-gray-700">{doc.site?.name || 'N/A'}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-gray-600">
                                        {doc.due_date ? new Date(doc.due_date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-100 uppercase">
                                            {doc.assigned_user?.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="text-sm font-medium text-gray-700">{doc.assigned_user?.full_name || 'Unassigned'}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(doc.status)}`}>
                                        {doc.status || 'Pending'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right px-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                            onClick={() => onView(doc.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                            onClick={() => onEdit(doc.id)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-[#C72030] hover:bg-red-50"
                                            onClick={() => onDownload(doc.id)}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default MonitoryComplianceTable;
