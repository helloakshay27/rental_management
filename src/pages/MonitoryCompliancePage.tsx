import React, { useState, useEffect } from 'react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import MonitoryComplianceTable from '@/components/Tenant/MonitoryComplianceTable';
import MonitoryComplianceCards from '@/components/Tenant/MonitoryComplianceCards';

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
        <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Compliance</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage all property compliance documents</p>
                </div>
                <Button
                    onClick={() => navigate('/compliance/new')}
                    className="bg-[#C72030] hover:bg-[#A01825] text-white px-6 py-6 rounded-xl flex items-center gap-2 shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Add Compliance
                </Button>
            </div>

            <MonitoryComplianceCards documents={documents} />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, property or requirement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all h-11 rounded-xl"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-32 gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-[#C72030]" />
                        <p className="text-gray-500 font-medium italic">Fetching compliance records...</p>
                    </div>
                ) : (
                    <div className="p-0">
                        <MonitoryComplianceTable
                            documents={filteredDocuments}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDownload={handleDownload}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonitoryCompliancePage;
