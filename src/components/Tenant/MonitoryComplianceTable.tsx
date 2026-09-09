import React from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Download, Eye, Edit, FileText } from 'lucide-react';

interface MonitoryComplianceTableProps {
    documents: any[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDownload: (id: string) => void;
    leftActions?: React.ReactNode;
    onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
    { key: 'document_name', label: 'Document Details', sortable: true, draggable: true },
    { key: 'requirement', label: 'Requirement', sortable: true, draggable: true },
    { key: 'property', label: 'Property', sortable: true, draggable: true },
    { key: 'due_date', label: 'Due Date', sortable: true, draggable: true },
    { key: 'assigned_to', label: 'Assigned To', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const MonitoryComplianceTable = ({ documents, onView, onEdit, onDownload, leftActions, onFilterClick }: MonitoryComplianceTableProps) => {
    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-brand-success-bg text-brand-success';
            case 'rejected': return 'bg-brand-error-bg text-brand-error';
            case 'pending': return 'bg-brand-warning-light text-brand-text';
            default: return 'bg-brand-muted text-brand-text';
        }
    };

    const renderCell = (doc: any, columnKey: string) => {
        switch (columnKey) {
            case 'document_name':
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-light rounded-md">
                            <FileText className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                            <div className="font-semibold text-brand-text">{doc.document_name}</div>
                            <div className="text-brand-caption text-brand-text-light font-bold uppercase tracking-wider">
                                ID: {doc.id}
                            </div>
                        </div>
                    </div>
                );
            case 'requirement':
                return (
                    <div className="text-brand-body-5 font-medium text-brand-text">
                        {doc.compliance_requirement?.title || 'N/A'}
                    </div>
                );
            case 'property':
                return (
                    <div className="text-brand-body-5 font-medium text-brand-text">
                        {doc.site?.name || 'N/A'}
                    </div>
                );
            case 'due_date':
                return (
                    <div className="text-brand-body-5 text-brand-text-light">
                        {doc.due_date ? new Date(doc.due_date).toLocaleDateString() : 'N/A'}
                    </div>
                );
            case 'assigned_to':
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-light flex items-center justify-center text-brand-caption font-bold text-brand border border-brand uppercase">
                            {doc.assigned_user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="text-brand-body-5 font-medium text-brand-text">
                            {doc?.assigned_user?.name || 'Unassigned'}
                        </div>
                    </div>
                );
            case 'status':
                return (
                    <span className={`px-2 py-0.5 rounded text-brand-caption font-bold uppercase tracking-wider ${getStatusStyle(doc.status)}`}>
                        {doc.status || 'Pending'}
                    </span>
                );
            default:
                return doc[columnKey];
        }
    };

    const renderActions = (doc: any) => (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" title="View" onClick={() => onView(doc.id)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={() => onEdit(doc.id)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                title="Download"
                onClick={() => window.open(`https://rental-uat.lockated.com/${doc.documents?.[0]?.url}`, '_blank')}
            >
                <Download className="h-4 w-4" />
            </Button>
        </div>
    );

    return (
        <EnhancedTable
            data={documents}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            getItemId={(doc) => String(doc.id)}
            storageKey="monitory-compliance-table"
            leftActions={leftActions}
            onFilterClick={onFilterClick}
            emptyMessage="No compliance documents found"
            searchPlaceholder="Search compliance documents..."
            enableSearch={true}
            enableSelection={false}
            exportFileName="compliance-documents"
            pagination={true}
            pageSize={10}
        />
    );
};

export default MonitoryComplianceTable;
