
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Palette, ArrowLeft, Loader2, Building2, Mail, MapPin, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const BrandingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBrandingDetails();
    }, [id]);

    const fetchBrandingDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/branding_profiles/${id}`);
            setProfile(data?.branding_profile || data);
        } catch (error) {
            console.error('Failed to fetch branding details:', error);
            toast.error('Failed to load branding details');
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

    if (!profile) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Branding profile not found</p>
                    <Button onClick={() => navigate('/masters/branding')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const logoDoc = profile.documents?.find((doc: any) => doc.document_type === 'company_logo');
    const baseUrl = 'https://rental-uat.lockated.com';
    const logoUrl = logoDoc?.file_url ? (logoDoc.file_url.startsWith('http') ? logoDoc.file_url : `${baseUrl}${logoDoc.file_url}`) : null;

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/branding')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Branding
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile View</h1>
                        <p className="text-sm font-medium text-gray-400">Master Identity System</p>
                    </div>
                </div>
                <Badge className={profile.is_active ? 'bg-green-600 px-4 py-1.5 rounded-full' : 'bg-gray-500 px-4 py-1.5 rounded-full'}>
                    {profile.is_active ? 'Active Profile' : 'Inactive Profile'}
                </Badge>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Branding Identity Card */}
                <Card className="xl:col-span-1 bg-white border border-gray-200 shadow-xl overflow-hidden self-start">
                    <div className="h-24 bg-gradient-to-r from-[#C72030] to-[#E53935]" />
                    <div className="-mt-12 flex justify-center">
                        <div className="p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
                            {logoUrl ? (
                                <img src={logoUrl} alt="Company Logo" className="w-32 h-32 object-contain rounded-xl" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                    <ImageIcon className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                    </div>
                    <CardContent className="pt-6 text-center pb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.company_name}</h2>
                        <p className="text-sm text-gray-500 mb-6 font-medium italic">{profile.profile_name}</p>

                        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <div
                                    className="w-10 h-10 rounded-full border-4 border-white shadow-md mx-auto mb-2"
                                    style={{ backgroundColor: profile.primary_color || '#C72030' }}
                                />
                                <span className="text-[10px] font-semibold uppercase text-gray-400">Primary</span>
                            </div>
                            <div className="text-center">
                                <div
                                    className="w-10 h-10 rounded-full border-4 border-white shadow-md mx-auto mb-2"
                                    style={{ backgroundColor: profile.secondary_color || '#1A1A1A' }}
                                />
                                <span className="text-[10px] font-semibold uppercase text-gray-400">Secondary</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Information */}
                <Card className="xl:col-span-3 bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-[#C72030]" />
                            Corporate Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Billing Communications
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{profile.billing_email || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Registered Office
                                    </p>
                                    <p className="text-gray-700 leading-relaxed font-medium">{profile.company_address || 'Address not defined'}</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 bg-gray-50/50">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">Identity Assets</p>
                                    {logoDoc ? (
                                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                            <div className="p-3 bg-red-50 rounded-xl text-[#C72030]">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{logoDoc.name}</p>
                                                <p className="text-xs text-gray-500">{(logoDoc.file_size / 1024).toFixed(1)} KB • {logoDoc.mime_type}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-[#C72030] hover:bg-red-50"
                                                onClick={() => window.open(logoUrl, '_blank')}
                                            >
                                                <Download className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                                            <p className="text-sm text-gray-400 italic">No branding documents attached</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">System ID</span>
                                        <span className="text-sm font-bold text-gray-900">#BRN-{profile.id.toString().padStart(4, '0')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tight">Last Synced</span>
                                        <span className="text-sm font-bold text-gray-900">{new Date(profile.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BrandingDetailsPage;
