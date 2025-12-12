
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Upload, Palette } from 'lucide-react';
import { postAuth, getAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';

const BrandingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brandingProfiles, setBrandingProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [editingProfile, setEditingProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    profile_name: '',
    company_name: '',
    billing_email: '',
    company_address: '',
    primary_color: '#C72030',
    secondary_color: '#1A1A1A'
  });

  const fetchBrandingProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const data = await getAuth('/branding_profiles');
      if (Array.isArray(data)) {
        setBrandingProfiles(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch branding profiles', error);
      toast.error('Failed to load branding profiles');
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchBrandingProfiles();
  }, []);

  const handleEditProfile = async (profileId: number) => {
    try {
      setIsLoading(true);
      const profileData = await getAuth(`/branding_profiles/${profileId}`);
      const data = profileData?.branding_profile || profileData;

      setEditingProfile(data);
      setFormData({
        profile_name: data.profile_name || '',
        company_name: data.company_name || '',
        billing_email: data.billing_email || '',
        company_address: data.company_address || '',
        primary_color: data.primary_color || '#C72030',
        secondary_color: data.secondary_color || '#1A1A1A'
      });

      // Set logo preview from documents array if exists
      if (data.documents && data.documents.length > 0) {
        const logoDoc = data.documents.find((doc: any) => doc.document_type === 'company_logo');
        if (logoDoc && logoDoc.file_url) {
          // Construct full URL (prepend base URL if needed)
          const baseUrl = 'https://rental-uat.lockated.com';
          const fullUrl = logoDoc.file_url.startsWith('http') ? logoDoc.file_url : `${baseUrl}${logoDoc.file_url}`;
          setLogoPreview(fullUrl);
          // Store the document info for download
          setEditingProfile({ ...data, currentLogoDoc: logoDoc });
        }
      }

      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error('Failed to fetch branding profile details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    setFormData({
      profile_name: '',
      company_name: '',
      billing_email: '',
      company_address: '',
      primary_color: '#C72030',
      secondary_color: '#1A1A1A'
    });
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.profile_name.trim() || !formData.company_name.trim() || !formData.billing_email.trim()) {
        toast.error('Profile name, company name, and billing email are required');
        return;
      }

      // Prepare payload
      const payload: any = {
        branding_profile: {
          profile_name: formData.profile_name,
          company_name: formData.company_name,
          billing_email: formData.billing_email,
          company_address: formData.company_address,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color
        }
      };

      // Add document if logo file is selected (only for new uploads)
      if (logoFile) {
        const base64 = await convertFileToBase64(logoFile);
        payload.document = {
          file_name: logoFile.name,
          document_type: 'company_logo',
          base64: base64
        };
      }

      // Make API call - PATCH for editing, POST for creating
      if (editingProfile) {
        await patchAuth(`/branding_profiles/${editingProfile.id}`, payload);
        toast.success('Branding profile updated successfully');
      } else {
        await postAuth('/branding_profiles', payload);
        toast.success('Branding profile created successfully');
      }

      // Reset form and close dialog
      handleCloseDialog();

      // Refresh profiles list
      fetchBrandingProfiles();

    } catch (error: any) {
      let errorMessage = editingProfile ? 'Failed to update branding profile' : 'Failed to create branding profile';

      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
        errorMessage = error.response.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = brandingProfiles.filter(profile =>
    profile.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Branding Management</h1>
          <p className="text-gray-600">Manage branding profiles for invoices and communications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branding Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">
                {editingProfile ? 'Edit Branding Profile' : 'Create New Branding Profile'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingProfile ? 'Update branding information' : 'Set up branding for property invoices and communications'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="profile-name" className="text-gray-900 font-medium">Profile Name *</Label>
                <Input
                  id="profile-name"
                  placeholder="e.g., Premium Properties Branding"
                  value={formData.profile_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, profile_name: e.target.value }))}
                  className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-gray-900 font-medium">Company Name *</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-900 font-medium">Billing Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="billing@company.com"
                  value={formData.billing_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, billing_email: e.target.value }))}
                  className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address" className="text-gray-900 font-medium">Company Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.company_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_address: e.target.value }))}
                  className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="logo" className="text-gray-900 font-medium">Company Logo</Label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-[#C72030] text-gray-900"
                  onClick={() => document.getElementById('logo')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {logoFile ? logoFile.name : (editingProfile?.currentLogoDoc ? 'Change Logo' : 'Upload Logo')}
                </Button>
                {logoPreview && (
                  <div className="mt-2 p-3 border rounded bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <img src={logoPreview} alt="Logo preview" className="h-20 w-auto rounded border bg-white" />
                      <div className="flex-1">
                        {editingProfile?.currentLogoDoc && !logoFile && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">{editingProfile.currentLogoDoc.name}</p>
                            <p className="text-xs text-gray-500">
                              {editingProfile.currentLogoDoc.mime_type} • {(editingProfile.currentLogoDoc.file_size / 1024).toFixed(0)} KB
                            </p>
                            <a
                              href={logoPreview}
                              download={editingProfile.currentLogoDoc.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-[#C72030] hover:text-[#A01825] font-medium"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          </div>
                        )}
                        {logoFile && (
                          <p className="text-sm text-gray-600">New logo selected: {logoFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#C72030] hover:bg-[#A01825] text-white"
              >
                {isLoading ? 'Saving...' : (editingProfile ? 'Update Profile' : 'Save Branding Profile')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Branding Profiles</CardTitle>
              <CardDescription>Manage invoice branding and company information</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search branding profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile Details</TableHead>
                <TableHead>Company Info</TableHead>
                <TableHead>Brand Colors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProfiles ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading branding profiles...
                  </TableCell>
                </TableRow>
              ) : filteredProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No branding profiles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {profile.logo_url && (
                          <img src={profile.logo_url} alt="Logo" className="w-8 h-8 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-medium">{profile.profile_name}</p>
                          <p className="text-sm text-gray-500">ID: {profile.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{profile.company_name}</p>
                        <p className="text-sm text-gray-500">{profile.billing_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {profile.primary_color && (
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: profile.primary_color }}
                            title={`Primary: ${profile.primary_color}`}
                          />
                        )}
                        {profile.secondary_color && (
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: profile.secondary_color }}
                            title={`Secondary: ${profile.secondary_color}`}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={profile.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {profile.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProfile(profile.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandingManagement;
