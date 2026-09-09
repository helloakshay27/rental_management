import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, StatsGrid, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth, API_BASE_URL } from '@/lib/api';
import { Building2, ArrowLeft, MapPin, Home, Calendar, Layers, Maximize2, Info, CheckCircle2, User, Globe, Map, Hash, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Heading } from '@/components/ui/typography';

const PropertyMasterDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const renderValue = (val: any) => {
        if (!val) return 'N/A';
        if (typeof val === 'object') return val.name || val.id?.toString() || JSON.stringify(val);
        return val.toString();
    };

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
            <PageLoader />
        );
    }

    if (!property) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Property not found</p>
                    <Button onClick={() => navigate('/masters/properties')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    // Identify site image
    const siteImage = property.documents?.find((doc: any) => doc.document_type === 'site_image');
    const imageUrl = siteImage ? (siteImage.url?.startsWith('http') ? siteImage.url : `${API_BASE_URL}${siteImage.url}`) : null;

    return (
        <PageContainer>
            <PageHeader
                title={property.name}
                backTo="/masters/properties"
                actions={
                    <>
                        <Badge variant="outline">{renderValue(property.property_type)}</Badge>
                        <Badge>{property.ownership_type || 'Owned'}</Badge>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Physical Specifications */}
                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="h-1 bg-[#C72030]" />
                        <CardHeader className="border-b border-gray-50 p-6 bg-gray-50/30">
                            <div className="flex items-center gap-3">
                                <Home className="h-5 w-5 text-[#C72030]" />
                                <CardTitle className="text-lg font-bold text-gray-900">Physical Asset Matrix</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <StatsGrid>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Built Year</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.built_year)}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Leasable Area</p>
                                    <div className="flex items-center gap-2">
                                        <Maximize2 className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.leasable_area)} <small className="text-[10px] text-gray-400">SQFT</small></p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Carpet Area</p>
                                    <div className="flex items-center gap-2">
                                        <Maximize2 className="h-4 w-4 text-[#C72030]/50" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.carpet_area)} <small className="text-[10px] text-gray-400">SQFT</small></p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Efficiency</p>
                                    <div className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.area_efficiency)}%</p>
                                    </div>
                                </div>
                            </StatsGrid>
                        </CardContent>
                    </Card>

                    {/* Location Matrix */}
                    <DetailSection title="Location Intelligence">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Country</p>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.country)}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">State</p>
                                    <div className="flex items-center gap-2">
                                        <Map className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.state)}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">City</p>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.city)}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Postal Code</p>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-bold text-gray-900">{renderValue(property.postal_code)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Full Address</p>
                                <p className="text-sm font-medium text-gray-700 leading-relaxed">{property.address}</p>
                            </div>
                    </DetailSection>

                    {/* Description */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Asset Description</p>
                            <p className="text-gray-600 leading-relaxed italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                                "{property.description || 'No detailed architectural description provided for this asset.'}"
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-5">
                    {/* Property Image */}
                    {imageUrl && (
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1 bg-[#C72030]" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Property Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                    <img
                                        src={imageUrl}
                                        alt={property.name}
                                        className="w-full h-auto object-contain max-h-[200px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Landlord Card */}
                    <Card className="bg-white border-2 border-blue-100 shadow-md overflow-hidden">
                        <div className="h-1 bg-blue-500" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-blue-600 font-bold uppercase tracking-widest flex items-center gap-2">
                                <User className="h-4 w-4" /> Ownership Detail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Landlord Name</p>
                                <p className="text-sm font-bold text-gray-900">{renderValue(property.landlord?.company_name || property.landlord?.name || 'N/A')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Contact Person</p>
                                <p className="text-sm font-medium text-gray-700">{renderValue(property.landlord?.contact_person)}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-50">
                                <p className="text-xs text-blue-600 font-bold">{renderValue(property.landlord?.email)}</p>
                                <p className="text-xs text-gray-500">{renderValue(property.landlord?.phone)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Asset Intelligence */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                                <Info className="h-3 w-3" /> Asset Intelligence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">Zone</span>
                                <span className="font-bold text-gray-900">{renderValue(property.zone)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">ITES Certification</span>
                                <span className={`font-bold ${property.ites_certification === 'Yes' || property.ites_certified ? 'text-green-600' : 'text-gray-900'}`}>
                                    {property.ites_certification || (property.ites_certified ? 'Yes' : 'No') || 'No'}
                                </span>
                            </div>
                            {(property.ites_certification === 'Yes' || property.ites_certified) && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-gray-500 uppercase tracking-tight">ITES Certificate is Valid till</span>
                                    <span className="font-bold text-gray-900">{renderValue(property.ites_valid_till || property.ites_certified_till)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">Circle</span>
                                <span className="font-bold text-gray-900">
                                    {renderValue(property.circle || property.circuit)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500 uppercase tracking-tight">Takeover Condition</span>
                                <span className="font-bold text-[#C72030] bg-[#C72030]/10 px-2 py-0.5 rounded text-[10px]">
                                    {renderValue(property.property_takeover_condition_name || property.property_takeover_condition)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Premium Amenities */}
                    {/* <Card className="bg-gray-900 text-white border-none shadow-xl overflow-hidden relative">
                        <div className="absolute right-0 top-0 p-8 opacity-10">
                            <Building2 className="h-24 w-24" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#C72030]">Premium Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="flex flex-wrap gap-2">
                                {property.amenities && property.amenities.length > 0 ? (
                                    property.amenities.map((amenity: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/5">
                                            <CheckCircle2 className="h-3 w-3 text-[#C72030]" />
                                            <span className="text-[10px] font-bold">{renderValue(amenity)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center w-full py-4 text-gray-500 text-[10px] italic">No amenities documented</div>
                                )}
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Registered Facilities */}
                    <DetailSection title="Details">
                            <div className="flex flex-wrap gap-2">
                                {property.pms_site_facilities && property.pms_site_facilities.length > 0 ? (
                                    property.pms_site_facilities.map((fac: any, idx: number) => (
                                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold px-3 py-1">
                                            {renderValue(fac.facility_type?.name || fac.name)}
                                        </Badge>
                                    ))
                                ) : property.facility_types && property.facility_types.length > 0 ? (
                                    property.facility_types.map((fac: any, idx: number) => (
                                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold px-3 py-1">
                                            {renderValue(fac.name)}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center w-full py-4">No specialized facilities registered</p>
                                )}
                            </div>
                    </DetailSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default PropertyMasterDetailsPage;
