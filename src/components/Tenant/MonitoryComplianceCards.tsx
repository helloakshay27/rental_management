import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        {
            label: 'Total Compliance',
            value: total.toString(),
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Approved',
            value: approved.toString(),
            icon: CheckCircle2,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Pending Review',
            value: pending.toString(),
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
        {
            label: 'Rejected',
            value: rejected.toString(),
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-white border-gray-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500 uppercase">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default MonitoryComplianceCards;
