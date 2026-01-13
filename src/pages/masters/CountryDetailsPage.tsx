
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Globe, ArrowLeft, Loader2, Landmark, Coins, Hash, Flag } from 'lucide-react';
import { toast } from 'sonner';

const CountryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [country, setCountry] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCountryDetails();
    }, [id]);

    const fetchCountryDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/pms/countries/${id}`);
            setCountry(data?.country || data);
        } catch (error) {
            console.error('Failed to fetch country details:', error);
            toast.error('Failed to load country details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!country) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Country not found</p>
                    <Button onClick={() => navigate('/masters/countries')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/countries')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Countries
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Country Details</h1>
                        <p className="text-gray-500">ID: {country.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={country.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}>
                        {country.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>

            <Card className="max-w-full mx-auto bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-2 bg-[#C72030]"></div>
                <CardHeader className="border-b border-gray-100 pb-8 pt-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-red-50 rounded-2xl text-[#C72030] shadow-inner">
                            <Globe className="h-10 w-10" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight uppercase">
                                {country.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-lg font-mono border-gray-300">
                                    {country.code}
                                </Badge>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm font-medium text-gray-500 italic block">Official Region Member</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Hash className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">ISO Numeric Code</p>
                                    <p className="text-lg font-bold text-gray-900">{country.iso_code || '---'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Landmark className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone Dial Code</p>
                                    <p className="text-lg font-bold text-gray-900">{country.phone_code || '---'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Coins className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Primary Currency</p>
                                    <p className="text-lg font-bold text-gray-900">{country.currency_code || '---'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Flag className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Geopolitical Status</p>
                                    <Badge className={country.is_active ? 'bg-green-100 text-green-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                                        {country.is_active ? 'Operational' : 'Restricted'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Last system audit: {new Date(country.updated_at).toLocaleDateString()}</span>
                            <span>Recorded since: {new Date(country.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CountryDetailsPage;
