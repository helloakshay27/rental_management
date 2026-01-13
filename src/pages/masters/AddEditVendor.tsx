
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAuth, getAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';

interface BankDetail {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    account_type: string;
    bank_branch: string;
}

const AddEditVendor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [formData, setFormData] = useState({
        vendor_name: '',
        contact_person: '',
        email: '',
        phone: '',
        alternate_phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        gst_number: '',
        pan_number: '',
        vendor_type: '',
        is_active: true,
        created_by: 1,
        // Bank Details
        bank_account_number: '',
        bank_name: '',
        bank_ifsc_code: '',
        bank_account_type: '',
        bank_branch: ''
    });

    const vendorTypes = [
        'Material Supplier',
        'Service Provider',
        'Equipment Supplier',
        'Contractor',
        'Consultant',
        'Other'
    ];

    const accountTypes = [
        'Savings',
        'Current',
        'Cash Credit',
        'Overdraft'
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchVendorDetails();
        }
    }, [id]);

    const fetchVendorDetails = async () => {
        try {
            setIsLoading(true);
            const vendorData = await getAuth(`/vendors/${id}`);
            const data = vendorData?.vendor || vendorData;

            setFormData({
                vendor_name: data.vendor_name || '',
                contact_person: data.contact_person || '',
                email: data.email || '',
                phone: data.phone || '',
                alternate_phone: data.alternate_phone || '',
                address: data.address || '',
                city: data.city || '',
                state: data.state || '',
                postal_code: data.postal_code || '',
                country: data.country || '',
                gst_number: data.gst_number || '',
                pan_number: data.pan_number || '',
                vendor_type: data.vendor_type || '',
                is_active: data.is_active !== undefined ? data.is_active : true,
                created_by: data.created_by || 1,
                // Bank Details
                bank_account_number: data.bank_detail?.account_number || '',
                bank_name: data.bank_detail?.bank_name || '',
                bank_ifsc_code: data.bank_detail?.ifsc_code || '',
                bank_account_type: data.bank_detail?.account_type || '',
                bank_branch: data.bank_detail?.bank_branch || ''
            });

            if (data.rating) {
                setRating(Number(data.rating));
            }
        } catch (error: any) {
            toast.error('Failed to fetch vendor details');
            navigate('/masters/vendors');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            // Validation
            if (!formData.vendor_name.trim()) {
                toast.error('Vendor name is required');
                return;
            }

            // Prepare payload
            const payload: any = {
                vendor: {
                    vendor_name: formData.vendor_name,
                    contact_person: formData.contact_person,
                    email: formData.email,
                    phone: formData.phone,
                    alternate_phone: formData.alternate_phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.postal_code,
                    country: formData.country,
                    gst_number: formData.gst_number,
                    pan_number: formData.pan_number,
                    vendor_type: formData.vendor_type,
                    is_active: formData.is_active,
                    created_by: formData.created_by
                }
            };

            // Add rating if selected
            if (rating > 0) {
                payload.vendor.rating = rating;
            }

            // Add bank details if any field is filled
            if (formData.bank_account_number || formData.bank_name || formData.bank_ifsc_code) {
                payload.vendor.bank_detail_attributes = {
                    account_number: formData.bank_account_number,
                    bank_name: formData.bank_name,
                    ifsc_code: formData.bank_ifsc_code,
                    account_type: formData.bank_account_type,
                    bank_branch: formData.bank_branch
                };
            }

            // Make API call
            if (isEditMode) {
                await patchAuth(`/vendors/${id}`, payload);
                toast.success('Vendor updated successfully');
            } else {
                await postAuth('/vendors', payload);
                toast.success('Vendor created successfully');
            }

            navigate('/masters/vendors');

        } catch (error: any) {
            let errorMessage = isEditMode ? 'Failed to update vendor' : 'Failed to create vendor';

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

    const renderStarRating = () => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <Star
                            className={`h-8 w-8 ${star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-300'
                                }`}
                        />
                    </button>
                ))}
                {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">({rating} out of 5)</span>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-4 max-w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/vendors')}
                        className="hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Vendor' : 'Add New Vendor'}
                        </h1>
                        <p className="text-gray-600">
                            {isEditMode ? 'Update vendor information' : 'Enter vendor details'}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Basic Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Essential vendor details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="vendor-name" className="text-gray-900 font-medium">Vendor Name *</Label>
                                <Input
                                    id="vendor-name"
                                    placeholder="e.g., ABC Suppliers"
                                    value={formData.vendor_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact-person" className="text-gray-900 font-medium">Contact Person</Label>
                                <Input
                                    id="contact-person"
                                    placeholder="e.g., John Doe"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor-type" className="text-gray-900 font-medium">Vendor Type</Label>
                                <Select
                                    value={formData.vendor_type}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, vendor_type: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select vendor type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {vendorTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Rating</Label>
                                {renderStarRating()}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Status *</Label>
                                <div className="flex items-center space-x-6 pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === true}
                                            onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === false}
                                            onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        />
                                        <span className="text-sm text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tax Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax Information</CardTitle>
                            <CardDescription>GST and PAN details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gst-number" className="text-gray-900 font-medium">GST Number</Label>
                                <Input
                                    id="gst-number"
                                    placeholder="e.g., GSTABCDE1234F"
                                    value={formData.gst_number}
                                    onChange={(e) => setFormData(prev => ({ ...prev, gst_number: e.target.value.toUpperCase() }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pan-number" className="text-gray-900 font-medium">PAN Number</Label>
                                <Input
                                    id="pan-number"
                                    placeholder="e.g., ABCDE1234F"
                                    value={formData.pan_number}
                                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                    maxLength={10}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>Email and phone information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-900 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="e.g., abc@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-900 font-medium">Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="e.g., 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alternate-phone" className="text-gray-900 font-medium">Alternate Phone</Label>
                                <Input
                                    id="alternate-phone"
                                    placeholder="e.g., 9123456789"
                                    value={formData.alternate_phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, alternate_phone: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                            <CardDescription>Location details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-900 font-medium">Street Address</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g., Street 1, Road 2"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-gray-900 font-medium">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="e.g., Mumbai"
                                        value={formData.city}
                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-gray-900 font-medium">State</Label>
                                    <Input
                                        id="state"
                                        placeholder="e.g., Maharashtra"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal-code" className="text-gray-900 font-medium">Postal Code</Label>
                                    <Input
                                        id="postal-code"
                                        placeholder="e.g., 400001"
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-gray-900 font-medium">Country</Label>
                                    <Input
                                        id="country"
                                        placeholder="e.g., India"
                                        value={formData.country}
                                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Details Card - Full Width */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                            <CardDescription>Banking information for transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="account-number" className="text-gray-900 font-medium">Account Number</Label>
                                    <Input
                                        id="account-number"
                                        placeholder="e.g., 1234567890"
                                        value={formData.bank_account_number}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bank-name" className="text-gray-900 font-medium">Bank Name</Label>
                                    <Input
                                        id="bank-name"
                                        placeholder="e.g., SBI Bank"
                                        value={formData.bank_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ifsc-code" className="text-gray-900 font-medium">IFSC Code</Label>
                                    <Input
                                        id="ifsc-code"
                                        placeholder="e.g., SBIN0012345"
                                        value={formData.bank_ifsc_code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bank_ifsc_code: e.target.value.toUpperCase() }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="account-type" className="text-gray-900 font-medium">Account Type</Label>
                                    <Select
                                        value={formData.bank_account_type}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, bank_account_type: value }))}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            {accountTypes.map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="bank-branch" className="text-gray-900 font-medium">Bank Branch</Label>
                                    <Input
                                        id="bank-branch"
                                        placeholder="e.g., Mumbai"
                                        value={formData.bank_branch}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bank_branch: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/masters/vendors')}
                        disabled={isLoading}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : (isEditMode ? 'Update Vendor' : 'Save Vendor')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddEditVendor;
