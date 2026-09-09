import React, { useState, useEffect } from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import MonitoryComplianceTable from '@/components/Tenant/MonitoryComplianceTable';
import MonitoryComplianceCards from '@/components/Tenant/MonitoryComplianceCards';
import { Heading } from '@/components/ui/typography';

const MonitoryCompliancePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth('/property_compliances.json');
            if (Array.isArray(data)) {
                setDocuments(data);
            }
        } catch (error) {
            console.error('Failed to fetch documents', error);
            toast.error('Failed to load compliance documents');
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (id: string) => navigate(`/compliance/view/${id}`);
    const handleEdit = (id: string) => navigate(`/compliance/edit/${id}`);
    const handleDownload = (id: string) => {
        const doc = documents.find(d => d.id.toString() === id.toString());
        if (doc?.document_url) {
            window.open(doc.document_url, '_blank');
        } else {
            toast.error('No download link available');
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.document_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.site?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.compliance_requirement?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageContainer>
            <PageHeader title="Compliance" description="Manage all property compliance documents" />

            <MonitoryComplianceCards documents={documents} />

            <div>
                {isLoading ? (
                    <SectionLoader message="Fetching compliance records..." />
                ) : (
                    <div className="p-0">
                        <MonitoryComplianceTable
                            documents={filteredDocuments}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDownload={handleDownload}
                            leftActions={
                                <Button
                                    onClick={() => navigate('/compliance/new')}
                                    className="fm-button-fix fm-button-brand px-6 py-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Compliance
                                </Button>
                            }
                        />
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default MonitoryCompliancePage;
