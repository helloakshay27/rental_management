
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Building2, ArrowLeft, Loader2, MapPin, Home, Calendar, Layers, Maximize2, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const PropertyMasterDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPropertyDetails();
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/pms/sites/${id}`);
            setProperty(data?.site || data);
        } catch (error) {
            console.error('Failed to fetch property details:', error);
            toast.error('Failed to load property details');
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

    if (!property) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Property not found</p>
                    <Button onClick={() => navigate('/masters/properties')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/properties')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Property Master
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{property.name}</h1>
                        <p className="text-sm font-medium text-gray-400">Master Asset ID: #{property.id}</p>
                    </div>
                </div>
                <Badge className="bg-blue-600 px-6 py-2 rounded-full text-white font-bold shadow-lg">
                    {property.property_type || 'Commercial Asset'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Physical Specifications */}
                <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-xl overflow-hidden">
                    <div className="h-2 bg-[#C72030]" />
                    <CardHeader className="border-b border-gray-100 p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-50 rounded-2xl text-[#C72030]">
                                <Home className="h-8 w-8" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Physical Asset Matrix</CardTitle>
                                <div className="flex items-center gap-2 mt-2 text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm font-medium">{property.address}, {property.city}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Built Year</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <p className="text-lg font-bold text-gray-900">{property.built_year || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Leasable Area</p>
                                <div className="flex items-center gap-2">
                                    <Maximize2 className="h-5 w-5 text-gray-400" />
                                    <p className="text-lg font-bold text-gray-900">{property.leasable_area} <small className="text-gray-400 uppercase">SQFT</small></p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Efficiency</p>
                                <div className="flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-gray-400" />
                                    <p className="text-lg font-bold text-gray-900">{property.area_efficiency || '0'}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-6">Asset Description</p>
                            <p className="text-gray-600 leading-relaxed font-medium bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                                "{property.description || 'No detailed architectural description provided for this asset.'}"
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Amenities & Tech */}
                <div className="space-y-8">
                    <Card className="bg-gray-900 text-white border-none shadow-2xl overflow-hidden relative">
                        <div className="absolute right-0 top-0 p-8 opacity-10">
                            <Building2 className="h-32 w-32" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-[#C72030]">Premium Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-2">
                                {property.amenities && property.amenities.length > 0 ? (
                                    property.amenities.map((amenity: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                                            <CheckCircle2 className="h-3 w-3 text-[#C72030]" />
                                            <span className="text-xs font-bold">{amenity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center w-full py-8 text-gray-500 italic">No amenities documented</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                                <Info className="h-3 w-3" /> System Trace
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">Record Origin</span>
                                <span className="font-bold text-gray-900">{new Date(property.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">Last System Sync</span>
                                <span className="font-bold text-gray-900">{new Date(property.updated_at).toLocaleDateString()}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-[10px] font-bold uppercase text-[#C72030] bg-red-50 p-2 rounded text-center tracking-wider">Master Record Verified</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PropertyMasterDetailsPage;
