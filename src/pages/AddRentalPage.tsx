
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Car, Bike, Plus, Trash2, MapPin, Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, getToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import AgreementServicesSection from '@/components/Rental/AgreementServicesSection';

const AddRentalPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [properties, setProperties] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<any>(null);
    const [selectedTenantDetails, setSelectedTenantDetails] = useState<any>(null);
    const [customFields, setCustomFields] = useState<any[]>([]);
    const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: any }>({});

    const renderValue = (val: any) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return val.name || val.id?.toString() || JSON.stringify(val);
        return val.toString();
    };
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingTenants, setLoadingTenants] = useState(true);

    const [formData, setFormData] = useState({
        property: '',
        tenant: '',
        leaseStart: '',
        leaseEnd: '',
        status: 'active',
        area: 0,
        perSqFtRate: 0,
        basicRent: 0,
        gstApplicable: false,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstAmount: 0,
        tdsApplicable: false,
        tdsPercentage: 0,
        tdsAmount: 0,
        securityDeposit: 0,
        totalMonthlyRent: 0,
        maintenanceCharges: 0,
        rentPaymentType: 'advance',
        rentDueDate: '1st',
        escalationPercentage: 0,
        escalation_type: 'annual',
        escalation_interval: 1,
        applyLatePenalty: false,
        penaltyPercentage: 0,
        applyLateInterest: false,
        interestPercentage: 0,
        from_landlord_days: 0,
        from_vil_days: 0,
        termination_rights_lessee: '',
        termination_rights_lessor: '',
        handover_condition: '',
        purpose_of_agreement: '',
        stamp_duty_sharing: '',
        agreement_sign_off_date: '',
        rent_commencement_date: '',
        rent_free_period_days: 0,
        lock_in_period_days: 0,
        signing_authority_name: '',
        signing_authority_designation: '',
        signing_authority_email: '',
        signing_authority_phone: '',
        agreementFile: null,
        notes: '',
        sap_number: '',
        property_type: ''
    });

    const [parkings, setParkings] = useState([{
        vehicle_type: '2wheeler',
        parking_type: 'free',
        count: '',
        charge: ''
    }]);

    const [agreementServices, setAgreementServices] = useState<any[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoadingProperties(true);
                const token = getToken();
                const data = await getAuth(`/pms/sites.json${token ? `?token=${token}` : ''}`);
                if (Array.isArray(data)) {
                    setProperties(data);
                } else if (data?.sites) {
                    setProperties(data.sites);
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setLoadingProperties(false);
            }
        };

        const fetchTenants = async () => {
            try {
                setLoadingTenants(true);
                const token = getToken();
                const data = await getAuth(`/tenants${token ? `?token=${token}` : ''}`);
                if (Array.isArray(data)) {
                    setTenants(data);
                } else if (data?.tenants) {
                    setTenants(data.tenants);
                }
            } catch (error) {
                console.error('Failed to fetch tenants:', error);
            } finally {
                setLoadingTenants(false);
            }
        };

        const fetchCustomFields = async () => {
            try {
                const response = await getAuth('/lease_custom_fields');
                const fields = response?.data || response;
                if (Array.isArray(fields)) {
                    setCustomFields(fields.filter((f: any) => f.status !== 'Inactive'));
                    // Initialize values
                    const initialValues: any = {};
                    fields.forEach((f: any) => {
                        if (f.field_type === 'boolean') initialValues[f.name] = false;
                        else initialValues[f.name] = '';
                    });
                    setCustomFieldValues(initialValues);
                }
            } catch (error) {
                console.error('Failed to fetch custom fields:', error);
            }
        };

        fetchProperties();
        fetchTenants();
        fetchCustomFields();
    }, []);

    const handlePropertySelect = async (propertyId: string) => {
        setFormData(prev => ({ ...prev, property: propertyId }));

        // Find the selected property details
        const property = properties.find(p => p.id.toString() === propertyId);
        if (property) {
            setSelectedPropertyDetails(property);
        }
    };

    const handleTenantSelect = (tenantId: string) => {
        setFormData(prev => ({ ...prev, tenant: tenantId }));
        const tenant = tenants.find(t => t.id.toString() === tenantId);
        if (tenant) {
            setSelectedTenantDetails(tenant);
        }
    };

    const addParking = () => {
        setParkings([...parkings, {
            vehicle_type: '2wheeler',
            parking_type: 'free',
            count: '',
            charge: ''
        }]);
    };

    const removeParking = (index: number) => {
        setParkings(parkings.filter((_, i) => i !== index));
    };

    const updateParking = (index: number, field: string, value: any) => {
        const updated = [...parkings];
        updated[index] = { ...updated[index], [field]: value };
        setParkings(updated);
    };

    const handleSubmit = async () => {
        try {
            // Validation
            if (formData.signing_authority_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.signing_authority_email)) {
                toast({
                    variant: "destructive",
                    title: "Invalid Email",
                    description: "Please enter a valid email for the signing authority.",
                });
                return;
            }
            if (formData.signing_authority_phone && !/^\d{10}$/.test(formData.signing_authority_phone)) {
                toast({
                    variant: "destructive",
                    title: "Invalid Phone",
                    description: "Please enter a valid 10-digit phone number for the signing authority.",
                });
                return;
            }

            setIsSubmitting(true);

            // Convert file to base64 if exists
            let base64File = '';
            if (formData.agreementFile) {
                const reader = new FileReader();
                base64File = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(formData.agreementFile as File);
                });
            }

            const payload = {
                lease: {
                    tenant_id: parseInt(formData.tenant) || null,
                    property_id: parseInt(formData.property) || 1,
                    start_date: formData.leaseStart,
                    end_date: formData.leaseEnd,
                    monthly_rent: (formData.basicRent + formData.gstAmount - formData.tdsAmount).toFixed(2),
                    basic_rent: formData.basicRent.toString(),
                    security_deposit: formData.securityDeposit.toString(),
                    status: 'active',
                    lease_type: 'commercial',
                    charges: formData.maintenanceCharges?.toString() || '0',
                    late_fee_percentage: formData.penaltyPercentage.toString(),
                    terms_conditions: formData.notes,
                    purpose_of_agreement: formData.purpose_of_agreement,
                    stamp_duty_sharing: formData.stamp_duty_sharing,
                    agreement_sign_off_date: formData.agreement_sign_off_date,
                    rent_commencement_date: formData.rent_commencement_date,
                    rent_free_period_days: formData.rent_free_period_days,
                    lock_in_period_days: formData.lock_in_period_days,
                    rate_per_sqft: formData.perSqFtRate,
                    tds_amount: formData.tdsAmount,
                    tds_percentage: formData.tdsPercentage,
                    gst_amount: formData.gstAmount,
                    gst_applicable: formData.gstApplicable,
                    cgst_percentage: formData.cgst,
                    sgst_percentage: formData.sgst,
                    igst_percentage: formData.igst,
                    annual_escalation_percentage: formData.escalationPercentage,
                    penalty_percentage: formData.penaltyPercentage,
                    interest_percentage: formData.interestPercentage,
                    tds_applicable: formData.tdsApplicable,
                    penalty_applicable: formData.applyLatePenalty,
                    interest_applicable: formData.applyLateInterest,
                    rent_due_type: 'monthly',
                    rent_due_date: parseInt(formData.rentDueDate) || 1,
                    escalation_interval: formData.escalation_interval,
                    escalation_type: formData.escalation_type,
                    notice_terms: {
                        from_landlord_days: formData.from_landlord_days,
                        from_vil_days: formData.from_vil_days,
                        termination_rights_lessee: formData.termination_rights_lessee,
                        termination_rights_lessor: formData.termination_rights_lessor,
                        handover_condition: formData.handover_condition,
                        additional_notes: formData.notes,
                        property_type: formData.property_type,
                        rent_area: formData.area
                    },
                    signing_authorities_attributes: [
                        {
                            name: formData.signing_authority_name,
                            designation: formData.signing_authority_designation,
                            email: formData.signing_authority_email,
                            phone_number: formData.signing_authority_phone,
                            authority_type: 'landlord',
                            signed_at: new Date().toISOString()
                        }
                    ],
                    sap_number: formData.sap_number,
                    documents: base64File ? [
                        {
                            document_type: 'agreement',
                            file_name: (formData.agreementFile as File)?.name || 'agreement.pdf',
                            base64_data: base64File
                        }
                    ] : [],
                    parkings_attributes: parkings.map(p => ({
                        vehicle_type: p.vehicle_type === '2wheeler' ? 'bike' : 'car',
                        parking_type: p.parking_type,
                        count: parseInt(p.count as string) || 0,
                        charge: (p.charge || 0).toString()
                    })),
                    agreement_services_attributes: agreementServices.map(s => ({
                        ...s,
                        deposit: s.deposit || '0',
                        fixed_monthly_charge: s.fixed_monthly_charge || '0',
                        rate_per_sqft: s.rate_per_sqft || '0',
                        due_date: parseInt(s.due_date) || 5
                    })),
                    custom_fields: customFieldValues
                }
            };

            const response = await postAuth('/leases', payload);
            console.log('Lease created:', response);
            toast({
                title: "Success",
                description: "Rental added successfully!",
            });
            navigate(-1);
        } catch (error: any) {
            console.error('Error creating lease:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || 'Failed to create rental',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 w-full bg-white rounded-lg shadow-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Rental</h1>
                <p className="text-gray-500">Add a new rental property to your portfolio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium text-[#c72030]">SAP ID (SAP Number)</Label>
                        <Input
                            type="text"
                            className="bg-white border-2 border-[#c72030]/30 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="e.g., SAP000013"
                            value={formData.sap_number}
                            onChange={(e) => setFormData(prev => ({ ...prev, sap_number: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Lessee *</Label>
                        <Select value={formData.tenant} onValueChange={handleTenantSelect}>
                            <SelectTrigger className="w-full bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                <SelectValue placeholder={loadingTenants ? "Loading tenants..." : "Select a Lessee"} />
                            </SelectTrigger>
                            <SelectContent>
                                {tenants.map((tenant) => (
                                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                                        {tenant.name || tenant.company_name} {tenant.email ? `- ${tenant.email}` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedTenantDetails && (
                        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-md mb-4 text-gray-900">Signing Authority:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 mt-1 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Name:</p>
                                            <p className="font-medium text-gray-900">
                                                {renderValue(selectedTenantDetails.full_name)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-4 w-4 mt-1 flex items-center justify-center">
                                            <span className="text-gray-600 text-[10px] font-bold">@</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email ID</p>
                                            <p className="text-sm text-gray-900">{renderValue(selectedTenantDetails.email)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-4 w-4 mt-1 flex items-center justify-center">
                                            <span className="text-gray-600 text-[10px] font-bold">#</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone No:</p>
                                            <p className="text-sm text-gray-900">{renderValue(selectedTenantDetails.phone || selectedTenantDetails.phone_number)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Designation:</p>
                                            <p className="text-sm text-gray-900">{renderValue(selectedTenantDetails.designation)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-4 w-4 mt-1 flex items-center justify-center">
                                            {/* <span className="text-gray-600 text-[10px] font-bold">ID</span> */}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Aadhar Number:</p>
                                            <p className="text-sm text-gray-900">{renderValue(selectedTenantDetails.aadhar_number)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-4 w-4 mt-1 flex items-center justify-center">
                                            {/* <span className="text-gray-600 text-[10px] font-bold">PAN</span> */}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">PAN Number:</p>
                                            <p className="text-sm text-gray-900">{renderValue(selectedTenantDetails.pan_number)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-2 w-full">
                        <Label className="text-gray-900 font-medium">Select Property *</Label>
                        <Select value={formData.property} onValueChange={handlePropertySelect}>
                            <SelectTrigger className="w-full bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                <SelectValue placeholder={loadingProperties ? "Loading properties..." : "Select a property"} />
                            </SelectTrigger>
                            <SelectContent>
                                {properties.map((property) => (
                                    <SelectItem key={property.id} value={property.id.toString()}>
                                        {property.name} - {property.city || property.address}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedPropertyDetails && (
                        <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg w-full">
                            <h4 className="font-semibold text-md mb-4 text-gray-900">Property & Landlord Details:</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Property:</p>
                                            <p className="font-medium text-gray-900">
                                                {renderValue(selectedPropertyDetails.name)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {renderValue(selectedPropertyDetails.address)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {renderValue(selectedPropertyDetails.property_type)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-1 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Location:</p>
                                            <p className="text-sm text-gray-900">
                                                {renderValue(selectedPropertyDetails.city)}, {renderValue(selectedPropertyDetails.state)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {renderValue(selectedPropertyDetails.postal_code)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Area Details:</p>
                                            <p className="text-sm text-gray-900">
                                                Leasable Area: {renderValue(selectedPropertyDetails.leasable_area)} sq ft
                                            </p>
                                            {selectedPropertyDetails.carpet_area && (
                                                <p className="text-sm text-gray-600">
                                                    Carpet Area: {renderValue(selectedPropertyDetails.carpet_area)} sq ft
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Built: {renderValue(selectedPropertyDetails.built_year)}
                                            </p>
                                            {selectedPropertyDetails.area_efficiency && (
                                                <p className="text-sm text-gray-600">
                                                    Efficiency: {renderValue(selectedPropertyDetails.area_efficiency)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {selectedPropertyDetails.amenities && selectedPropertyDetails.amenities.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Amenities:</p>
                                                <p className="text-sm text-gray-900">
                                                    {selectedPropertyDetails.amenities.join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPropertyDetails.landlord && (
                                        <div className="flex items-start gap-2">
                                            <User className="h-4 w-4 mt-1 text-gray-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Landlord / Lessor Details:</p>
                                                {selectedPropertyDetails.landlord.company_name && (
                                                    <p className="font-medium text-gray-900">
                                                        {renderValue(selectedPropertyDetails.landlord.company_name)}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-900">
                                                    Contact Person: <span className="capitalize">{renderValue(selectedPropertyDetails.landlord.contact_person)}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Email: {renderValue(selectedPropertyDetails.landlord.email)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Phone No: {renderValue(selectedPropertyDetails.landlord.phone)}
                                                </p>
                                                {selectedPropertyDetails.landlord.pan && (
                                                    <p className="text-sm text-gray-600">
                                                        PAN No: {renderValue(selectedPropertyDetails.landlord.pan)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}





                    <div>
                        <h3 className="font-semibold text-lg mb-6 text-gray-900">Rent Breakdown</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Rent Area (sq ft)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g., 30000"
                                    value={formData.area || ''}
                                    onChange={(e) => {
                                        const area = parseFloat(e.target.value) || 0;
                                        const basicRent = area * formData.perSqFtRate;
                                        const gstAmount = ((formData.cgst + formData.sgst + formData.igst) * basicRent / 100);
                                        const tdsAmount = (formData.tdsPercentage * basicRent / 100);
                                        setFormData(prev => ({
                                            ...prev,
                                            area,
                                            basicRent,
                                            gstAmount,
                                            tdsAmount
                                        }));
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Per Sq Ft Rate (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                        placeholder="0"
                                        value={formData.perSqFtRate || ''}
                                        onChange={(e) => {
                                            const perSqFtRate = parseFloat(e.target.value) || 0;
                                            const basicRent = perSqFtRate * formData.area;
                                            const gstAmount = ((formData.cgst + formData.sgst + formData.igst) * basicRent / 100);
                                            const tdsAmount = (formData.tdsPercentage * basicRent / 100);
                                            setFormData(prev => ({
                                                ...prev,
                                                perSqFtRate,
                                                basicRent,
                                                gstAmount,
                                                tdsAmount
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            {formData.perSqFtRate > 0 && formData.area > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-2">
                                    <span className="text-blue-600">ℹ️</span>
                                    <span>{formData.perSqFtRate} × {formData.area.toLocaleString()} sq ft = ₹{formData.basicRent.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="border border-gray-200 rounded-md p-4 space-y-4">
                                <h4 className="font-medium text-gray-700">Amount Details</h4>

                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium"> Rent Amount (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-8 bg-gray-50 border-2 border-gray-300 text-gray-700 font-medium"
                                            placeholder="0"
                                            value={formData.basicRent || ''}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="gst"
                                            checked={formData.gstApplicable}
                                            onCheckedChange={(checked) => {
                                                if (!checked) {
                                                    setFormData(prev => ({ ...prev, gstApplicable: false, gstAmount: 0 }));
                                                } else {
                                                    const gstAmount = ((formData.cgst + formData.sgst + formData.igst) * formData.basicRent / 100);
                                                    setFormData(prev => ({ ...prev, gstApplicable: true, gstAmount }));
                                                }
                                            }}
                                        />
                                        <Label htmlFor="gst" className="font-semibold text-gray-900">GST Applicable</Label>
                                    </div>

                                    {formData.gstApplicable && (
                                        <div className="space-y-3 pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-900 font-medium">CGST (%)</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                                            placeholder="0"
                                                            value={formData.cgst || ''}
                                                            disabled={formData.igst > 0}
                                                            onChange={(e) => {
                                                                const cgst = parseFloat(e.target.value) || 0;
                                                                const gstAmount = ((cgst + formData.sgst) * formData.basicRent / 100);
                                                                setFormData(prev => ({ ...prev, cgst, igst: 0, gstAmount }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-900 font-medium">SGST (%)</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                                            placeholder="0"
                                                            value={formData.sgst || ''}
                                                            disabled={formData.igst > 0}
                                                            onChange={(e) => {
                                                                const sgst = parseFloat(e.target.value) || 0;
                                                                const gstAmount = ((formData.cgst + sgst) * formData.basicRent / 100);
                                                                setFormData(prev => ({ ...prev, sgst, igst: 0, gstAmount }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-gray-900 font-medium">IGST (%)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                                        placeholder="0"
                                                        value={formData.igst || ''}
                                                        disabled={formData.cgst > 0 || formData.sgst > 0}
                                                        onChange={(e) => {
                                                            const igst = parseFloat(e.target.value) || 0;
                                                            const gstAmount = (igst * formData.basicRent / 100);
                                                            setFormData(prev => ({ ...prev, igst, cgst: 0, sgst: 0, gstAmount }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">IGST is not applicable if CGST/SGST is added and vice versa</p>

                                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                <span className="text-sm font-medium text-gray-700">GST Amount:</span>
                                                <span className="text-sm font-semibold text-gray-900">₹{formData.gstAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="tds"
                                            checked={formData.tdsApplicable}
                                            onCheckedChange={(checked) => {
                                                if (!checked) {
                                                    setFormData(prev => ({ ...prev, tdsApplicable: false, tdsAmount: 0 }));
                                                } else {
                                                    const tdsAmount = (formData.tdsPercentage * formData.basicRent / 100);
                                                    setFormData(prev => ({ ...prev, tdsApplicable: true, tdsAmount }));
                                                }
                                            }}
                                        />
                                        <Label htmlFor="tds" className="font-semibold text-gray-900">TDS Applicable</Label>
                                    </div>

                                    {formData.tdsApplicable && (
                                        <div className="space-y-3 pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-gray-900 font-medium">TDS Percentage (%)</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                                            placeholder="10"
                                                            value={formData.tdsPercentage || ''}
                                                            onChange={(e) => {
                                                                const tdsPercentage = parseFloat(e.target.value) || 0;
                                                                const tdsAmount = (tdsPercentage * formData.basicRent / 100);
                                                                setFormData(prev => ({ ...prev, tdsPercentage, tdsAmount }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-900 font-medium">TDS Amount (₹)</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                                        <Input
                                                            type="number"
                                                            className="pl-8 bg-gray-50 border-2 border-gray-300 text-gray-700 font-medium"
                                                            placeholder="0"
                                                            value={formData.tdsAmount.toFixed(2)}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Security Deposit (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                            placeholder="0"
                                            value={formData.securityDeposit || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, securityDeposit: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Maintenance Charges (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                            placeholder="0"
                                            value={formData.maintenanceCharges || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, maintenanceCharges: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Total Monthly Rent (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        className="pl-8 bg-green-50 border-2 border-green-200 text-green-700 font-medium"
                                        placeholder="0"
                                        value={(formData.basicRent + formData.gstAmount - formData.tdsAmount).toFixed(2)}
                                        readOnly
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium"> Circle *</Label>
                            <Select value={formData.property} onValueChange={handlePropertySelect}>
                                <SelectTrigger className="w-full bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                    <SelectValue placeholder={loadingProperties ? "Loading properties..." : "Select a property"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {properties.map((property) => (
                                        <SelectItem key={property.id} value={property.id.toString()}>
                                            {property.name} - {property.city || property.address}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium">Lease Start Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    value={formData.leaseStart}
                                    onChange={(e) => setFormData(prev => ({ ...prev, leaseStart: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium">Lease End Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    value={formData.leaseEnd}
                                    onChange={(e) => setFormData(prev => ({ ...prev, leaseEnd: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                                <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium">Additional Notes</Label>
                            <Textarea
                                placeholder="Any additional notes or comments"
                                className="min-h-[80px] bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-start items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-900" />
                            <h3 className="font-semibold text-lg text-gray-900">Rent Due Configuration</h3>
                        </div>
                        -
                        <div className="space-y-3">
                            <Label className="text-gray-900 font-medium">Rent Payment Type</Label>
                            <RadioGroup defaultValue="advance">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="advance" id="advance" className="text-[#C72030] border-gray-400" />
                                    <div className="grid gap-0.5">
                                        <Label htmlFor="advance" className="text-gray-900 font-medium">Advance Payment</Label>
                                        <span className="text-xs text-gray-500">Rent is paid before the month begins</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="post" id="post" className="text-[#C72030] border-gray-400" />
                                    <div className="grid gap-0.5">
                                        <Label htmlFor="post" className="text-gray-900 font-medium">Post Usage Payment</Label>
                                        <span className="text-xs text-gray-500">Rent is paid after the month ends</span>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-gray-900 font-medium"><Calendar className="h-4 w-4" /> Rent Due Date</Label>
                            <Select value={formData.rentDueDate} onValueChange={val => setFormData(prev => ({ ...prev, rentDueDate: val }))}>
                                <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                    <SelectValue placeholder="Select date" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <SelectItem key={i + 1} value={`${i + 1}`}>{`${i + 1}${['st', 'nd', 'rd'][((i + 1) % 10) - 1] && ![11, 12, 13].includes(i + 1) ? ['st', 'nd', 'rd'][((i + 1) % 10) - 1] : 'th'} of every month`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">Rent will be due on this date before each month begins</p>
                        </div>
                    </div>

                    <div className="p-6 bg-[#FAF9F6] rounded-lg border border-gray-100 space-y-6">
                        <h3 className="font-semibold text-lg mb-6 text-gray-900">Escalation & Penalty Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Escalation Frequency </Label>
                                <Select value={formData.escalation_type} onValueChange={(value) => setFormData(prev => ({ ...prev, escalation_type: value }))}>
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue placeholder="Select Escalation Frequency " />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="annual">In Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Escalation Interval</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="1"
                                    value={formData.escalation_interval || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, escalation_interval: parseInt(e.target.value) || 1 }))}
                                />
                                <p className="text-xs text-gray-500">Rent increases every {formData.escalation_interval} {formData.escalation_type === 'monthly' ? 'month(s)' : formData.escalation_type === 'quarterly' ? 'quarter(s)' : 'year(s)'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 font-medium">Escalation Percentage (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                placeholder="0"
                                value={formData.escalationPercentage || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, escalationPercentage: parseFloat(e.target.value) || 0 }))}
                            />
                            <p className="text-xs text-gray-500">Rent will increase by this percentage</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                <Label className="text-gray-600 font-normal">Apply penalty on late payments</Label>
                                <Switch
                                    checked={formData.applyLatePenalty}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, applyLatePenalty: checked }))}
                                />
                            </div>

                            {formData.applyLatePenalty && (
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Penalty Percentage (%)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                            placeholder="0"
                                            value={formData.penaltyPercentage || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, penaltyPercentage: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">One-time penalty applied on overdue amount</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                                <Label className="text-gray-600 font-normal">Apply interest on late payments</Label>
                                <Switch
                                    checked={formData.applyLateInterest}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, applyLateInterest: checked }))}
                                />
                            </div>

                            {formData.applyLateInterest && (
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Interest Percentage per Month (%)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="pl-8 bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                            placeholder="0"
                                            value={formData.interestPercentage || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, interestPercentage: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Monthly interest compounded on overdue amount</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-900">Additional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Purpose of Agreement</Label>
                        <Select value={formData.purpose_of_agreement} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose_of_agreement: value }))}>
                            <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New Office">New Office</SelectItem>
                                <SelectItem value="Renewal">Renewal</SelectItem>
                                <SelectItem value="Change of Location">Change of Location</SelectItem>
                                <SelectItem value="Change of Area">Change of Area</SelectItem>
                                <SelectItem value="Change of ownership">Change of ownership</SelectItem>
                                <SelectItem value="Name Change">Name Change</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Stamp Duty and Registration Charges Sharing</Label>
                        <Select value={formData.stamp_duty_sharing} onValueChange={(value) => setFormData(prev => ({ ...prev, stamp_duty_sharing: value }))}>
                            <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                <SelectValue placeholder="Select sharing option" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tenant">Tenant</SelectItem>
                                <SelectItem value="Landlord">Landlord</SelectItem>
                                <SelectItem value="Shared">Shared (50-50)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>



                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Property Type</Label>
                        <Select value={formData.property_type} onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}>
                            <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CLA">CLA</SelectItem>
                                <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                                <SelectItem value="Leave & License Agreement">Leave & License Agreement</SelectItem>
                                <SelectItem value="Sale Deed">Sale Deed</SelectItem>
                                <SelectItem value="Addendum">Addendum</SelectItem>
                                <SelectItem value="Side Letter">Side Letter</SelectItem>
                                <SelectItem value="Annexure">Annexure</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Agreement Sign off Date</Label>
                        <div className="relative">
                            <Input
                                type="date"
                                placeholder="dd-mm-yyyy"
                                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                value={formData.agreement_sign_off_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, agreement_sign_off_date: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Rent Commencement Date</Label>
                        <div className="relative">
                            <Input
                                type="date"
                                placeholder="dd-mm-yyyy"
                                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                value={formData.rent_commencement_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, rent_commencement_date: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Rent-free Period (Days)</Label>
                        <Input
                            type="number"
                            min="0"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="e.g., 30"
                            value={formData.rent_free_period_days || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, rent_free_period_days: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Lock in Period (Days)</Label>
                        <Input
                            type="number"
                            min="0"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="e.g., 180"
                            value={formData.lock_in_period_days || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, lock_in_period_days: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    {/* Dynamic Custom Fields */}
                    {customFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <Label className="text-gray-900 font-medium">
                                {field.name} {field.required && <span className="text-red-500">*</span>}
                            </Label>
                            {field.field_type === 'text' || field.field_type === 'number' ? (
                                <Input
                                    type={field.field_type}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder={`Enter ${field.name}`}
                                    value={customFieldValues[field.name] || ''}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                />
                            ) : field.field_type === 'date' ? (
                                <Input
                                    type="date"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    value={customFieldValues[field.name] || ''}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                />
                            ) : field.field_type === 'boolean' ? (
                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        checked={customFieldValues[field.name] || false}
                                        onCheckedChange={(checked) => setCustomFieldValues(prev => ({ ...prev, [field.name]: checked }))}
                                    />
                                    <span className="text-sm text-gray-600">{customFieldValues[field.name] ? 'Yes' : 'No'}</span>
                                </div>
                            ) : field.field_type === 'textarea' ? (
                                <Textarea
                                    placeholder={`Enter ${field.name}`}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    value={customFieldValues[field.name] || ''}
                                    onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-900">Notice Period & Terms</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">From Landlord (Days)</Label>
                        <Input
                            type="number"
                            min="0"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="30"
                            value={formData.from_landlord_days || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, from_landlord_days: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">From VIL (Days)</Label>
                        <Input
                            type="number"
                            min="0"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="60"
                            value={formData.from_vil_days || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, from_vil_days: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Termination Rights with LESSEE</Label>
                        <Textarea
                            placeholder="e.g., Lessee can terminate with 30 days notice"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            rows={3}
                            value={formData.termination_rights_lessee}
                            onChange={(e) => setFormData(prev => ({ ...prev, termination_rights_lessee: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Termination Rights with LESSOR</Label>
                        <Textarea
                            placeholder="e.g., Lessor can terminate with 60 days notice"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            rows={3}
                            value={formData.termination_rights_lessor}
                            onChange={(e) => setFormData(prev => ({ ...prev, termination_rights_lessor: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-gray-900 font-medium">Handover Condition</Label>
                        <Textarea
                            placeholder="e.g., Property must be handed over clean and in good condition"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            rows={3}
                            value={formData.handover_condition}
                            onChange={(e) => setFormData(prev => ({ ...prev, handover_condition: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-6 text-gray-900">Signing Authorities</h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Name</Label>
                        <Input
                            type="text"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="Enter name"
                            value={formData.signing_authority_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, signing_authority_name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Designation</Label>
                        <Input
                            type="text"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="Enter designation"
                            value={formData.signing_authority_designation}
                            onChange={(e) => setFormData(prev => ({ ...prev, signing_authority_designation: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Email</Label>
                        <Input
                            type="email"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="Enter email address"
                            value={formData.signing_authority_email}
                            onChange={(e) => setFormData(prev => ({ ...prev, signing_authority_email: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-900 font-medium">Phone Number</Label>
                        <Input
                            type="tel"
                            className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                            placeholder="Enter phone number"
                            value={formData.signing_authority_phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, signing_authority_phone: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">Parking Details</h3>
                    <Button
                        type="button"
                        onClick={addParking}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Parking
                    </Button>
                </div>

                <div className="space-y-4">
                    {parkings.map((parking, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-md">
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Vehicle Type</Label>
                                <Select
                                    value={parking.vehicle_type}
                                    onValueChange={(value) => updateParking(index, 'vehicle_type', value)}
                                >
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2wheeler">
                                            <div className="flex items-center gap-2">
                                                <Bike className="h-4 w-4" />
                                                2 Wheeler
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="4wheeler">
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4" />
                                                4 Wheeler
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Parking Type</Label>
                                <Select
                                    value={parking.parking_type}
                                    onValueChange={(value) => {
                                        const updated = [...parkings];
                                        updated[index] = {
                                            ...updated[index],
                                            parking_type: value,
                                            charge: value === 'free' ? '' : updated[index].charge
                                        };
                                        setParkings(updated);
                                    }}
                                >
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="free">Free</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Size</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="0"
                                    value={parking.count}
                                    onChange={(e) => updateParking(index, 'count', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Parking Charges (₹)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="0"
                                    value={parking.charge}
                                    disabled={parking.parking_type === 'free'}
                                    onChange={(e) => updateParking(index, 'charge', e.target.value)}
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => removeParking(index)}
                                    disabled={parkings.length === 1}
                                    className="border-red-600 text-red-600 hover:bg-red-50 w-full"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AgreementServicesSection services={agreementServices} onChange={setAgreementServices} />

            <div className="mt-8 space-y-6">
                <div className="space-y-2">
                    <Label className="text-gray-900 font-medium">Agreement File</Label>
                    <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                        onChange={(e) => setFormData(prev => ({ ...prev, agreementFile: e.target.files?.[0] || null }))}
                    />
                </div>


            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline" onClick={() => navigate(-1)} className="border-red-600 text-red-600 hover:bg-red-50" disabled={isSubmitting}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Rental'}
                </Button>
            </div>
        </div >
    );
};

export default AddRentalPage;
