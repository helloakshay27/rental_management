import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface MonitoryComplianceCardsProps {
    documents: any[];
}

const MonitoryComplianceCards = ({ documents }: MonitoryComplianceCardsProps) => {
    const total = documents.length;
    const approved = documents.filter(d => d.status?.toLowerCase() === 'approved').length;
    const pending = documents.filter(d => d.status?.toLowerCase() === 'pending').length;
    const rejected = documents.filter(d => d.status?.toLowerCase() === 'rejected').length;

    const stats = [
        { label: 'Total Compliance', value: total, icon: <FileText /> },
        { label: 'Approved', value: approved, icon: <CheckCircle2 /> },
        { label: 'Pending Review', value: pending, icon: <Clock /> },
        { label: 'Rejected', value: rejected, icon: <XCircle /> },
    ];

    return (
        <StatsGrid>
            {stats.map((stat) => (
                <StatsCard
                    key={stat.label}
                    title={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </StatsGrid>
    );
};

export default MonitoryComplianceCards;
