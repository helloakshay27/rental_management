
import React, { useState, useEffect, useRef } from 'react';
import './add-rental.css';
import { FormSection, FormGrid, FormActions } from '@/components/ui/form-section';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RentalPartyDetails } from '@/components/Rental/RentalPartyDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar, Car, Bike, Plus, Trash2, FileText, Download, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, patchAuth, getToken, getBaseUrl } from '@/lib/api';
import { toast } from 'sonner';
import AgreementServicesSection from '@/components/Rental/AgreementServicesSection';
import { Heading, Text } from '@/components/ui/typography';
import { trackUpdated, trackFailed } from '@/utils/analytics';

const STEPS = ['Property & Lessee', 'Agreement & Dates', 'Rent & Taxes', 'Terms & Payments', 'Facilities', 'Documents & Review'];
const STEP_HELP = [
    'Choose the property and lessee for this rental.',
    'Set the agreement details, lease dates and applicable periods.',
    'Configure rent, taxes, deposit and maintenance charges.',
    'Set payment dates, escalation, penalties and notice terms.',
    'Add parking spaces and select the included amenities.',
    'Complete additional fields, attach the agreement and review your rental.',
];

const EditRentalPage = () => {
    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
    const { id } = useParams();
    const [properties, setProperties] = useState<any[]>([]);
    const [tenants, setTenants] = useState<any[]>([]);
    const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<any>(null);
    const [selectedTenantDetails, setSelectedTenantDetails] = useState<any>(null);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [loadingTenants, setLoadingTenants] = useState(true);
    const [loadingLease, setLoadingLease] = useState(true);
    const [customFields, setCustomFields] = useState<any[]>([]);
    const [customFieldValues, setCustomFieldValues] = useState<{ [key: string]: any }>({});
    const [propertyTakeoverConditions, setPropertyTakeoverConditions] = useState<any[]>([]);
    const [loadingTakeoverConditions, setLoadingTakeoverConditions] = useState(true);
    const [circles, setCircles] = useState<any[]>([])
    const [loadingCircles, setLoadingCircles] = useState(false)
    const [selectedCircleDetails, setSelectedCircleDetails] = useState<any>(null);
    const [amenities, setAmenities] = useState<any[]>([])
    const [loadingAmenities, setLoadingAmenities] = useState(true)
    const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
    const [deletedDocuments, setDeletedDocuments] = useState<any[]>([]);

    const [step, setStep] = useState(0);
    const stepHeadingRef = useRef<HTMLDivElement>(null);
    const goToStep = (n: number) => { setStep(n); setTimeout(() => stepHeadingRef.current?.focus(), 50); };

    const renderValue = (val: any) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return val.name || val.id?.toString() || JSON.stringify(val);
        return val.toString();
    };

    const [formData, setFormData] = useState({
        circle: '',
        property: '',
        tenant: '',
        leaseStart: '',
        leaseEnd: '',
        status: 'active',
        aggreement_type: "",
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
        maintenanceCharges: 0,
        totalMonthlyRent: 0,
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
        signing_authority_id: null,
        signing_authority_name: '',
        signing_authority_designation: '',
        signing_authority_email: '',
        signing_authority_phone: '',
        agreementFile: null,
        notes: '',
        sap_number: '',
        property_type: '',
        property_takeover_condition_id: '',
        amenities: [] as string[],
    });

    const [parkings, setParkings] = useState<any[]>([{
        vehicle_type: '2wheeler',
        parking_type: 'free',
        count: '',
        charge: ''
    }]);
    const [deletedParkings, setDeletedParkings] = useState<number[]>([]);

    const [agreementServices, setAgreementServices] = useState<any[]>([]);
    const [deletedAgreementServices, setDeletedAgreementServices] = useState<number[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingAgreementUrl, setExistingAgreementUrl] = useState<string | null>(null);
    const [existingAgreementName, setExistingAgreementName] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoadingProperties(true);
                const token = getToken();
                const data = await getAuth(`/pms/sites.json${token ? `?token=${token}` : ''}`);
                if (Array.isArray(data)) {
                    setProperties(data);
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
                }
            } catch (error) {
                console.error('Failed to fetch custom fields:', error);
            }
        };

        const fetchPropertyTakeoverConditions = async () => {
            try {
                setLoadingTakeoverConditions(true);
                const data = await getAuth('/property_takeover_conditions');
                if (Array.isArray(data)) {
                    setPropertyTakeoverConditions(data);
                } else if (data?.property_takeover_conditions) {
                    setPropertyTakeoverConditions(data.property_takeover_conditions);
                }
            } catch (error) {
                console.error('Failed to fetch property takeover conditions:', error);
            } finally {
                setLoadingTakeoverConditions(false);
            }
        };

        const fetchCircles = async () => {
            try {
                setLoadingCircles(true);
                const token = getToken();
                const data = await getAuth(`/pms/circles${token ? `?token=${token}` : ''}`);
                if (Array.isArray(data.data)) {
                    setCircles(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch circles:', error);
            } finally {
                setLoadingCircles(false);
            }
        };

        const fetchAmenities = async () => {
            try {
                setLoadingAmenities(true);
                const data = await getAuth('/pms/amenities');
                if (Array.isArray(data.amenities)) {
                    setAmenities(data.amenities);
                }
            } catch (error) {
                console.error('Failed to fetch amenities:', error);
            } finally {
                setLoadingAmenities(false);
            }
        };

        fetchProperties();
        fetchTenants();
        fetchCustomFields();
        fetchPropertyTakeoverConditions();
        fetchCircles();
        fetchAmenities();
    }, []);

    useEffect(() => {
        const fetchLease = async () => {
            if (!id) return;

            try {
                setLoadingLease(true);
                const data = await getAuth(`/leases/${id}`);

                // Map API response to formData
                if (data) {
                    setFormData({
                        circle: data.circle_id?.toString() || '',
                        property: data.property?.id?.toString() || '',
                        tenant: data.tenant?.id?.toString() || '',
                        leaseStart: data.start_date || '',
                        leaseEnd: data.end_date || '',
                        status: data.status || 'active',
                        aggreement_type: data.terms_conditions || '',
                        area: data.notice_terms?.rent_area || data.area || 0,
                        perSqFtRate: parseFloat(data.rate_per_sqft) || 0,
                        basicRent: parseFloat(data.basic_rent) || 0,
                        gstApplicable: data.gst_applicable || false,
                        cgst: parseFloat(data.cgst_percentage) || 0,
                        sgst: parseFloat(data.sgst_percentage) || 0,
                        igst: parseFloat(data.igst_percentage) || 0,
                        gstAmount: parseFloat(data.gst_amount) || 0,
                        tdsApplicable: data.tds_applicable || false,
                        tdsPercentage: parseFloat(data.tds_percentage) || 0,
                        tdsAmount: parseFloat(data.tds_amount) || 0,
                        securityDeposit: parseFloat(data.security_deposit) || 0,
                        maintenanceCharges: parseFloat(data.charges) || 0,
                        totalMonthlyRent: parseFloat(data.monthly_rent) || 0,
                        rentPaymentType: 'advance',
                        rentDueDate: data.rent_due_date?.toString() || '1st',
                        escalationPercentage: parseFloat(data.annual_escalation_percentage) || 0,
                        escalation_type: data.escalation_type || 'annual',
                        escalation_interval: data.escalation_interval || 1,
                        applyLatePenalty: data.penalty_applicable || false,
                        penaltyPercentage: parseFloat(data.penalty_percentage) || 0,
                        applyLateInterest: data.interest_applicable || false,
                        interestPercentage: parseFloat(data.interest_percentage) || 0,
                        from_landlord_days: data.notice_terms?.from_landlord_days || 0,
                        from_vil_days: data.notice_terms?.from_vil_days || 0,
                        termination_rights_lessee: data.notice_terms?.termination_rights_lessee || '',
                        termination_rights_lessor: data.notice_terms?.termination_rights_lessor || '',
                        handover_condition: data.notice_terms?.handover_condition || '',
                        purpose_of_agreement: data.purpose_of_agreement || '',
                        stamp_duty_sharing: data.stamp_duty_sharing || '',
                        agreement_sign_off_date: data.agreement_sign_off_date || '',
                        rent_commencement_date: data.rent_commencement_date || '',
                        rent_free_period_days: data.rent_free_period_days || 0,
                        lock_in_period_days: data.lock_in_period_days || 0,
                        signing_authority_id: data.signing_authorities?.[0]?.id || null,
                        signing_authority_name: data.signing_authorities?.[0]?.name || '',
                        signing_authority_designation: data.signing_authorities?.[0]?.designation || '',
                        signing_authority_email: data.signing_authorities?.[0]?.email || '',
                        signing_authority_phone: data.signing_authorities?.[0]?.phone_number || '',
                        agreementFile: null,
                        notes: data.notice_terms?.additional_notes || '',
                        sap_number: data.sap_number || '',
                        property_type: data.notice_terms?.property_type || '',
                        property_takeover_condition_id: data.property?.property_takeover_condition?.id?.toString() || '',
                        amenities: data?.property?.amenities?.map((amenity: any) => amenity.id) || [],
                    });

                    // Set existing agreement details
                    if (data.documents && Array.isArray(data.documents)) {
                        const agreement = data.documents.find((doc: any) => doc.document_type === 'agreement');
                        if (agreement) {
                            setExistingAgreementUrl(agreement.file_url || agreement.url);
                            setExistingAgreementName(agreement.file_name);
                        }
                    } else if (data.agreement_url) {
                        // Fallback if it's directly on the object
                        setExistingAgreementUrl(data.agreement_url);
                    }

                    // Set custom field values
                    const fields = data.custom_fields || data.custom_field_values;
                    if (fields) {
                        setCustomFieldValues(fields);
                    }

                    // Set parkings if available
                    if (data.parkings && data.parkings.length > 0) {
                        setParkings(data.parkings.map((p: any) => ({
                            id: p.id,
                            vehicle_type: p.vehicle_type === 'bike' ? '2wheeler' : '4wheeler',
                            parking_type: p.parking_type,
                            count: p.count || '',
                            charge: parseFloat(p.charge) || ''
                        })));
                    }

                    // Set agreement services if available
                    if (data.agreement_services && data.agreement_services.length > 0) {
                        setAgreementServices(data.agreement_services.map((s: any) => ({
                            id: s.id,
                            service_type: s.service_type,
                            deposit: s.deposit || '0',
                            fixed_monthly_charge: s.fixed_monthly_charge || '0',
                            rate_per_sqft: s.rate_per_sqft || '0',
                            billing_cycle: s.billing_cycle || 'monthly',
                            due_date: s.due_date || 5,
                            payment_mode: s.payment_mode || 'bank_transfer',
                            provider_name: s.provider_name || '',
                            consumer_number: s.consumer_number || '',
                            sap_vendor_code: s.sap_vendor_code || '',
                            payment_automated: s.payment_automated || false,
                            automation_partner: s.automation_partner || '',
                            cost_center: s.cost_center || '',
                            gl_code: s.gl_code || '',
                            io_code: s.io_code || '',
                            company_contact_name: s.company_contact_name || '',
                            company_contact_email: s.company_contact_email || '',
                            company_contact_mobile: s.company_contact_mobile || '',
                            landlord_contact_name: s.landlord_contact_name || '',
                            landlord_contact_email: s.landlord_contact_email || '',
                            landlord_contact_mobile: s.landlord_contact_mobile || '',
                            active: s.active
                        })));
                    }
                    console.log(data)

                    // Set existing documents
                    if (data.documents && data.documents.length > 0) {
                        setExistingDocuments(data.documents);
                    }

                    // Set selected property details if property exists
                    if (data.property) {
                        setSelectedPropertyDetails(data.property);
                    } else if (data.property?.id && properties.length > 0) {
                        const property = properties.find(p => p.id === data.property.id);
                        if (property) {
                            setSelectedPropertyDetails(property);
                        }
                    }

                    // Set selected tenant details if tenant exists
                    if (data.tenant) {
                        setSelectedTenantDetails(data.tenant);
                    } else if (data.tenant?.id && tenants.length > 0) {
                        const tenant = tenants.find(t => t.id === data.tenant.id);
                        if (tenant) {
                            setSelectedTenantDetails(tenant);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch lease:', error);
                toast.error('Failed to load lease data');
            } finally {
                setLoadingLease(false);
            }
        };

        if (properties.length > 0) {
            fetchLease();
        }
    }, [id, properties]);

    console.log(selectedPropertyDetails)

    const handlePropertySelect = async (propertyId: string) => {
        setFormData(prev => ({ ...prev, property: propertyId }));
        setFieldErrors(prev => ({ ...prev, property: false }));
        const property = properties.find(p => p.id.toString() === propertyId);
        if (property) {
            setSelectedPropertyDetails(property);
        }
    };

    const handleCircleSelect = (circleId: string) => {
        setFormData(prev => ({ ...prev, circle: circleId }));
        setFieldErrors(prev => ({ ...prev, circle: false }));
        const circle = circles.find(c => c.id.toString() === circleId);
        if (circle) {
            setSelectedCircleDetails(circle);
        }
    };

    const handleTenantSelect = (tenantId: string) => {
        setFormData(prev => ({ ...prev, tenant: tenantId }));
        setFieldErrors(prev => ({ ...prev, tenant: false }));
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
        const parkingToRemove = parkings[index];
        if (parkingToRemove.id) {
            setDeletedParkings(prev => [...prev, parkingToRemove.id]);
        }
        setParkings(parkings.filter((_, i) => i !== index));
    };

    const updateParking = (index: number, field: string, value: any) => {
        const updated = [...parkings];
        updated[index] = { ...updated[index], [field]: value };
        setParkings(updated);
    };

    const handleSubmit = async () => {
        try {
            // Mandatory field validation
            const errors: { [key: string]: boolean } = {};
            const missingFields: string[] = [];

            if (!formData.circle) {
                errors.circle = true;
                missingFields.push('Circle');
            }
            if (!formData.property) {
                errors.property = true;
                missingFields.push('Property');
            }
            if (!formData.tenant) {
                errors.tenant = true;
                missingFields.push('Lessee');
            }
            if (!formData.aggreement_type) {
                errors.aggreement_type = true;
                missingFields.push('Agreement Type');
            }
            if (!formData.property_takeover_condition_id) {
                errors.property_takeover_condition_id = true;
                missingFields.push('Property Takeover Condition');
            }
            if (!formData.leaseStart) {
                errors.leaseStart = true;
                missingFields.push('Lease Start Date');
            }
            if (!formData.leaseEnd) {
                errors.leaseEnd = true;
                missingFields.push('Lease End Date');
            }

            if (missingFields.length > 0) {
                setFieldErrors(errors);
                toast.error(`Please fill in the following mandatory fields: ${missingFields.join(', ')}`);
                return;
            }

            // Clear field errors
            setFieldErrors({});

            // Additional validations
            if (formData.signing_authority_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.signing_authority_email)) {
                toast.error('Please enter a valid email for the signing authority.');
                return;
            }
            if (formData.signing_authority_phone && !/^\d{10}$/.test(formData.signing_authority_phone)) {
                toast.error('Please enter a valid 10-digit phone number for the signing authority.');
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
                    circle_id: parseInt(formData.circle) || null,
                    tenant_id: parseInt(formData.tenant) || null,
                    property_id: parseInt(formData.property) || 1,
                    start_date: formData.leaseStart,
                    end_date: formData.leaseEnd,
                    monthly_rent: (formData.basicRent + formData.gstAmount - formData.tdsAmount).toFixed(2),
                    basic_rent: formData.basicRent.toString(),
                    security_deposit: formData.securityDeposit.toString(),
                    status: formData.status,
                    lease_type: 'commercial',
                    charges: formData.maintenanceCharges?.toString() || '0',
                    late_fee_percentage: formData.penaltyPercentage.toString(),
                    terms_conditions: formData.aggreement_type,
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
                    amenity_ids: formData.amenities,
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
                            ...(formData.signing_authority_id ? { id: formData.signing_authority_id } : {}),
                            name: formData.signing_authority_name,
                            designation: formData.signing_authority_designation,
                            email: formData.signing_authority_email,
                            phone_number: formData.signing_authority_phone,
                            authority_type: 'landlord',
                            signed_at: new Date().toISOString()
                        }
                    ],
                    sap_number: formData.sap_number,
                    documents: [
                        ...deletedDocuments.map(doc => ({
                            ...doc,
                            _destroy: true
                        })),
                        ...(base64File ? [{
                            document_type: 'agreement',
                            file_name: (formData.agreementFile as File)?.name || 'agreement.pdf',
                            base64_data: base64File
                        }] : [])
                    ],
                    property_takeover_condition_id: parseInt(formData.property_takeover_condition_id) || null,
                    parkings_attributes: [
                        ...parkings.map((p: any) => ({
                            id: p.id,
                            vehicle_type: p.vehicle_type === '2wheeler' ? 'bike' : 'car',
                            parking_type: p.parking_type,
                            count: parseInt(p.count as string) || 0,
                            charge: (p.charge || 0).toString()
                        })),
                        ...deletedParkings.map(id => ({
                            id,
                            _destroy: true
                        }))
                    ],
                    agreement_services_attributes: [
                        ...agreementServices.map((s: any) => ({
                            ...(s.id ? { id: s.id } : {}),
                            service_type: s.service_type,
                            deposit: s.deposit || '0',
                            fixed_monthly_charge: s.fixed_monthly_charge || '0',
                            rate_per_sqft: s.rate_per_sqft || '0',
                            billing_cycle: s.billing_cycle || 'monthly',
                            due_date: parseInt(s.due_date) || 5,
                            payment_mode: s.payment_mode || 'bank_transfer',
                            provider_name: s.provider_name,
                            consumer_number: s.consumer_number,
                            sap_vendor_code: s.sap_vendor_code,
                            payment_automated: s.payment_automated,
                            automation_partner: s.automation_partner,
                            cost_center: s.cost_center,
                            gl_code: s.gl_code,
                            io_code: s.io_code,
                            company_contact_name: s.company_contact_name,
                            company_contact_email: s.company_contact_email,
                            company_contact_mobile: s.company_contact_mobile,
                            landlord_contact_name: s.landlord_contact_name,
                            landlord_contact_email: s.landlord_contact_email,
                            landlord_contact_mobile: s.landlord_contact_mobile,
                            active: s.active
                        })),
                        ...deletedAgreementServices.map(id => ({
                            id,
                            _destroy: true
                        }))
                    ],
                    custom_fields: customFieldValues
                }
            };

            const response = await patchAuth(`/leases/${id}`, payload);
            trackUpdated('Rental', { record_id: id, source: 'form' });
            console.log('Lease updated:', response);
            toast.success('Rental updated successfully!');
            navigate(-1);
        } catch (error: any) {
            trackFailed('Rental', 'Update', { error_message: error?.message ?? 'unknown' });
            console.error('Error updating lease:', error);
            toast.error(error.message || 'Failed to update rental');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer className="rental-wizard">
            <PageHeader title="Edit Rental" subtitle="Update rental agreement details" />

            <Tabs value={String(step)} onValueChange={(value) => goToStep(Number(value))} activationMode="manual">
                <TabsList>
                    {STEPS.map((label, index) => (
                        <TabsTrigger key={index} value={String(index)} id={`rental-tab-${index}`} aria-controls={`rental-step-${index}`}>
                            <span className="rental-step-number">{index + 1}</span>
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="rental-step-heading" ref={stepHeadingRef} tabIndex={-1}>
                <h2>{STEPS[step]}</h2>
                <p>{STEP_HELP[step]}</p>
            </div>

            {/* Step 0: Property & Lessee */}
            <div role="tabpanel" id="rental-step-0" aria-labelledby="rental-tab-0" hidden={step !== 0} className="rental-step-panel">
                <FormSection title="Property & Lessee">
                    <div className="space-y-2 w-full">
                        <Label className="text-sm text-gray-900 font-medium">Circle *</Label>
                        <Select value={formData.circle} onValueChange={handleCircleSelect}>
                            <SelectTrigger className={`h-9 w-full ${fieldErrors.circle ? 'border-red-500 ring-2 ring-red-200' : ''}`}>
                                <SelectValue placeholder={loadingCircles ? "Loading circles..." : "Select a circle"} />
                            </SelectTrigger>
                            <SelectContent>
                                {circles.map((circle: any) => (
                                    <SelectItem key={circle.id} value={circle.id.toString()}>
                                        {circle.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 w-full">
                        <Label className="text-sm text-gray-900 font-medium">Select Property *</Label>
                        <Select value={formData.property} onValueChange={handlePropertySelect}>
                            <SelectTrigger className={`h-9 w-full ${fieldErrors.property ? 'border-red-500 ring-2 ring-red-200' : ''}`}>
                                <SelectValue placeholder={loadingProperties ? "Loading properties..." : "Select a property"} />
                            </SelectTrigger>
                            <SelectContent>
                                {properties.map((property: any) => (
                                    <SelectItem key={property.id} value={property.id.toString()}>
                                        {property.name} - {property.city || property.address}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <RentalPartyDetails property={selectedPropertyDetails} tenant={null} />

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Property Takeover Condition *</Label>
                        <Select
                            value={formData.property_takeover_condition_id}
                            onValueChange={(value) => { setFormData(prev => ({ ...prev, property_takeover_condition_id: value })); setFieldErrors(prev => ({ ...prev, property_takeover_condition_id: false })); }}
                        >
                            <SelectTrigger className={`h-9 w-full ${fieldErrors.property_takeover_condition_id ? 'border-red-500 ring-2 ring-red-200' : ''}`}>
                                <SelectValue placeholder={loadingTakeoverConditions ? "Loading conditions..." : "Select takeover condition"} />
                            </SelectTrigger>
                            <SelectContent>
                                {propertyTakeoverConditions.map((condition) => (
                                    <SelectItem key={condition.id} value={condition.id.toString()}>
                                        {condition.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </FormSection>

                <FormSection title="Lessee & Signing Authority">
                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Lessee *</Label>
                        <Select value={formData.tenant} onValueChange={handleTenantSelect}>
                            <SelectTrigger className={`h-9 w-full ${fieldErrors.tenant ? 'border-red-500 ring-2 ring-red-200' : ''}`}>
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

                    <RentalPartyDetails property={null} tenant={selectedTenantDetails} />

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </FormSection>
            </div>

            {/* Step 1: Agreement & Dates */}
            <div role="tabpanel" id="rental-step-1" aria-labelledby="rental-tab-1" hidden={step !== 1} className="rental-step-panel">
                <FormSection title="Agreement & Dates">
                    <FormGrid>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Agreement Type *</Label>
                            <Select
                                value={formData.aggreement_type}
                                onValueChange={(value) => { setFormData(prev => ({ ...prev, aggreement_type: value })); setFieldErrors(prev => ({ ...prev, aggreement_type: false })); }}
                            >
                                <SelectTrigger className={`h-9 w-full ${fieldErrors.aggreement_type ? 'border-red-500 ring-2 ring-red-200' : ''}`}>
                                    <SelectValue placeholder={"Select agreement type"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {["Lease Agreement", "Leave & License Agreement", "Sale Deed", "Addendum", "Side Letter", "Annexure"].map((condition) => (
                                        <SelectItem key={condition} value={condition}>
                                            {condition}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Purpose of Agreement</Label>
                            <Select value={formData.purpose_of_agreement} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose_of_agreement: value }))}>
                                <SelectTrigger className="h-9">
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

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Stamp Duty and Registration Charges Sharing</Label>
                            <Input
                                type="text"
                                className="h-9"
                                value={formData.stamp_duty_sharing}
                                onChange={(e) => setFormData(prev => ({ ...prev, stamp_duty_sharing: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Agreement Sign off Date</Label>
                            <Input
                                type="date"
                                placeholder="dd-mm-yyyy"
                                className="h-9"
                                value={formData.agreement_sign_off_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, agreement_sign_off_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Lease Start Date *</Label>
                            <Input
                                type="date"
                                className={`h-9 ${fieldErrors.leaseStart ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                                value={formData.leaseStart}
                                onChange={(e) => { setFormData(prev => ({ ...prev, leaseStart: e.target.value })); setFieldErrors(prev => ({ ...prev, leaseStart: false })); }}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Lease End Date *</Label>
                            <Input
                                type="date"
                                className={`h-9 ${fieldErrors.leaseEnd ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                                value={formData.leaseEnd}
                                onChange={(e) => { setFormData(prev => ({ ...prev, leaseEnd: e.target.value })); setFieldErrors(prev => ({ ...prev, leaseEnd: false })); }}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Rent Commencement Date</Label>
                            <Input
                                type="date"
                                placeholder="dd-mm-yyyy"
                                className="h-9"
                                value={formData.rent_commencement_date}
                                onChange={(e) => setFormData(prev => ({ ...prev, rent_commencement_date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Rent-free Period (Days)</Label>
                            <Input
                                type="number"
                                min="0"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 30"
                                value={formData.rent_free_period_days || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, rent_free_period_days: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Lock in Period (Days)</Label>
                            <Input
                                type="number"
                                min="0"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 180"
                                value={formData.lock_in_period_days || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, lock_in_period_days: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </FormGrid>
                </FormSection>
            </div>

            {/* Step 2: Rent & Taxes */}
            <div role="tabpanel" id="rental-step-2" aria-labelledby="rental-tab-2" hidden={step !== 2} className="rental-step-panel">
                <FormSection title="Rent & Charges">
                    <FormGrid>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Rent Area (sq ft)</Label>
                            <Input
                                type="number"
                                min="0"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Per Sq Ft Rate (₹)</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    </FormGrid>

                    {formData.perSqFtRate > 0 && formData.area > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-2">
                            <span className="text-blue-600">ℹ️</span>
                            <span>{formData.perSqFtRate} × {formData.area.toLocaleString()} sq ft = ₹{formData.basicRent.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="border border-gray-200 rounded-md p-4 space-y-4">
                        <h4 className="font-medium text-gray-700">Amount Details</h4>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Basic Rent (₹)</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                                <Input
                                    type="number"
                                    className="h-9 pl-8 bg-gray-50 text-gray-700 font-medium text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    value={formData.basicRent || ''}
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* GST Section */}
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
                                <Label htmlFor="gst" className="text-sm font-semibold text-gray-900">GST Applicable</Label>
                            </div>

                            {formData.gstApplicable && (
                                <div className="space-y-3 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-gray-900 font-medium">CGST (%)</Label>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-gray-900 font-medium">SGST (%)</Label>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                    <div className="space-y-1.5">
                                        <Label className="text-sm text-gray-900 font-medium">IGST (%)</Label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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

                        {/* TDS Section */}
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
                                <Label htmlFor="tds" className="text-sm font-semibold text-gray-900">TDS Applicable</Label>
                            </div>

                            {formData.tdsApplicable && (
                                <div className="space-y-3 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-gray-900 font-medium">TDS Percentage (%)</Label>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                        <div className="space-y-1.5">
                                            <Label className="text-sm text-gray-900 font-medium">TDS Amount (₹)</Label>
                                            <div className="relative">
                                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                                                <Input
                                                    type="number"
                                                    className="h-9 pl-8 bg-gray-50 text-gray-700 font-medium text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    </div>

                    <FormGrid>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Security Deposit (₹)</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    value={formData.securityDeposit || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, securityDeposit: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Maintenance Charges (₹)</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    value={formData.maintenanceCharges || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maintenanceCharges: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>
                    </FormGrid>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Total Monthly Rent (₹)</Label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">₹</span>
                            <Input
                                type="number"
                                className="h-9 pl-8 bg-green-50 border-green-200 text-green-700 font-medium text-[13px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                                value={(formData.basicRent + formData.gstAmount - formData.tdsAmount).toFixed(2)}
                                readOnly
                            />
                        </div>
                    </div>
                </FormSection>
            </div>

            {/* Step 3: Terms & Payments */}
            <div role="tabpanel" id="rental-step-3" aria-labelledby="rental-tab-3" hidden={step !== 3} className="rental-step-panel">
                <FormSection title="Rent Due Configuration">
                    <div className="space-y-3">
                        <Label className="text-sm text-gray-900 font-medium">Rent Payment Type</Label>
                        <RadioGroup defaultValue="advance">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="advance" id="advance" />
                                <div className="grid gap-0.5">
                                    <Label htmlFor="advance" className="text-sm text-gray-900 font-medium">Advance Payment</Label>
                                    <span className="text-xs text-gray-500">Rent is paid before the month begins</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="post" id="post" />
                                <div className="grid gap-0.5">
                                    <Label htmlFor="post" className="text-sm text-gray-900 font-medium">Post Usage Payment</Label>
                                    <span className="text-xs text-gray-500">Rent is paid after the month ends</span>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm flex items-center gap-2 text-gray-900 font-medium"><Calendar className="h-4 w-4" /> Rent Due Date of the Month</Label>
                        <Select value={formData.rentDueDate} onValueChange={val => setFormData(prev => ({ ...prev, rentDueDate: val }))}>
                            <SelectTrigger className="h-9">
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
                </FormSection>

                <FormSection title="Escalation & Penalty">
                    <FormGrid>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Escalation Frequency</Label>
                            <Select value={formData.escalation_type} onValueChange={(value) => setFormData(prev => ({ ...prev, escalation_type: value }))}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select Escalation Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="annual">In Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Escalation Interval</Label>
                            <Input
                                type="number"
                                min="1"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="1"
                                value={formData.escalation_interval || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, escalation_interval: parseInt(e.target.value) || 1 }))}
                            />
                            <p className="text-xs text-gray-500">Rent increases every {formData.escalation_interval} {formData.escalation_type === 'monthly' ? 'month(s)' : formData.escalation_type === 'quarterly' ? 'quarter(s)' : 'year(s)'}</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Escalation Percentage (%)</Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="0"
                                value={formData.escalationPercentage || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, escalationPercentage: parseFloat(e.target.value) || 0 }))}
                            />
                            <p className="text-xs text-gray-500">Rent will increase by this percentage</p>
                        </div>
                    </FormGrid>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                            <Label className="text-sm text-gray-600 font-normal">Apply penalty on late payments</Label>
                            <Switch
                                checked={formData.applyLatePenalty}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, applyLatePenalty: checked }))}
                            />
                        </div>

                        {formData.applyLatePenalty && (
                            <div className="space-y-1.5">
                                <Label className="text-sm text-gray-900 font-medium">Penalty Percentage (%)</Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                            <Label className="text-sm text-gray-600 font-normal">Apply interest on late payments</Label>
                            <Switch
                                checked={formData.applyLateInterest}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, applyLateInterest: checked }))}
                            />
                        </div>

                        {formData.applyLateInterest && (
                            <div className="space-y-1.5">
                                <Label className="text-sm text-gray-900 font-medium">Interest Percentage per Month (%)</Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-500">%</span>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="h-9 pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                        value={formData.interestPercentage || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, interestPercentage: parseFloat(e.target.value) || 0 }))}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Monthly interest compounded on overdue amount</p>
                            </div>
                        )}
                    </div>
                </FormSection>

                <FormSection title="Notice Period & Terms">
                    <FormGrid>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">From Landlord (Days)</Label>
                            <Input
                                type="number"
                                min="0"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="30"
                                value={formData.from_landlord_days || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, from_landlord_days: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">From VIL (Days)</Label>
                            <Input
                                type="number"
                                min="0"
                                className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="60"
                                value={formData.from_vil_days || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, from_vil_days: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Termination Rights with LESSEE</Label>
                            <Textarea
                                placeholder="e.g., Lessee can terminate with 30 days notice"
                                className="bg-white text-gray-900 text-[13px]"
                                rows={3}
                                value={formData.termination_rights_lessee}
                                onChange={(e) => setFormData(prev => ({ ...prev, termination_rights_lessee: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-900 font-medium">Termination Rights with LESSOR</Label>
                            <Textarea
                                placeholder="e.g., Lessor can terminate with 60 days notice"
                                className="bg-white text-gray-900 text-[13px]"
                                rows={3}
                                value={formData.termination_rights_lessor}
                                onChange={(e) => setFormData(prev => ({ ...prev, termination_rights_lessor: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2 col-span-full">
                            <Label className="text-sm text-gray-900 font-medium">Handover Condition</Label>
                            <Textarea
                                placeholder="e.g., Property must be handed over clean and in good condition"
                                className="bg-white text-gray-900 text-[13px]"
                                rows={3}
                                value={formData.handover_condition}
                                onChange={(e) => setFormData(prev => ({ ...prev, handover_condition: e.target.value }))}
                            />
                        </div>
                    </FormGrid>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Additional Notes</Label>
                        <Textarea
                            placeholder="Any additional notes or comments"
                            className="min-h-[80px] bg-white text-gray-900 text-[13px]"
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>
                </FormSection>
            </div>

            {/* Step 4: Facilities */}
            <div role="tabpanel" id="rental-step-4" aria-labelledby="rental-tab-4" hidden={step !== 4} className="rental-step-panel">
                <FormSection title="Common Amenities">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-md">
                        {amenities.map((amenity: any) => (
                            <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.amenities.includes(amenity.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) setFormData({ ...formData, amenities: [...formData.amenities, amenity.id] });
                                        else setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity.id) });
                                    }}
                                    className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                                />
                                <span className="text-sm text-gray-700">{amenity.name}</span>
                            </label>
                        ))}
                    </div>
                </FormSection>

                <FormSection title="Parking Details">
                    <div className="flex justify-end mb-4">
                        <Button
                            type="button"
                            onClick={addParking}
                            className="fm-button-fix fm-button-brand px-6 py-2"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Parking
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {parkings.map((parking, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-md">
                                <div className="space-y-1.5">
                                    <Label className="text-sm text-gray-900 font-medium">Vehicle Type</Label>
                                    <Select
                                        value={parking.vehicle_type}
                                        onValueChange={(value) => updateParking(index, 'vehicle_type', value)}
                                    >
                                        <SelectTrigger className="h-9">
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

                                <div className="space-y-1.5">
                                    <Label className="text-sm text-gray-900 font-medium">Parking Type</Label>
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
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm text-gray-900 font-medium">Size</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                        value={parking.count}
                                        onChange={(e) => updateParking(index, 'count', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm text-gray-900 font-medium">Parking Charges (₹)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                        className="w-full"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </FormSection>
            </div>

            {/* Step 5: Documents & Review */}
            <div role="tabpanel" id="rental-step-5" aria-labelledby="rental-tab-5" hidden={step !== 5} className="rental-step-panel">
                {customFields.length > 0 && (
                    <FormSection title="Additional Details">
                        <FormGrid>
                            {customFields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <Label className="text-sm text-gray-900 font-medium">
                                        {field.name} {field.required && <span className="text-red-500">*</span>}
                                    </Label>
                                    {field.field_type === 'text' || field.field_type === 'number' ? (
                                        <Input
                                            type={field.field_type}
                                            className="h-9"
                                            placeholder={`Enter ${field.name}`}
                                            value={customFieldValues[field.name] || ''}
                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                        />
                                    ) : field.field_type === 'date' ? (
                                        <Input
                                            type="date"
                                            className="h-9"
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
                                            className="bg-white text-gray-900 text-[13px]"
                                            value={customFieldValues[field.name] || ''}
                                            onChange={(e) => setCustomFieldValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </FormGrid>
                    </FormSection>
                )}

                <AgreementServicesSection
                    services={agreementServices}
                    onChange={setAgreementServices}
                />

                <FormSection title="Attachments">
                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-900 font-medium">Agreement File</Label>

                        {/* Show existing documents */}
                        {existingDocuments.length > 0 && (
                            <div className="space-y-2 mb-3">
                                <p className="text-sm text-gray-600 font-medium">Existing Documents:</p>
                                {existingDocuments.map((doc) => {
                                    const fileUrl = doc.url?.startsWith('http') ? doc.url : `${getBaseUrl()}${doc.url}`;
                                    const fileSizeKB = doc.file_size ? (doc.file_size / 1024).toFixed(1) : null;
                                    const fileSizeMB = doc.file_size && doc.file_size > 1048576 ? (doc.file_size / 1048576).toFixed(2) : null;
                                    return (
                                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-[#C72030]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{doc.name || 'Agreement Document'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {doc.document_type && <span className="capitalize">{doc.document_type}</span>}
                                                    {fileSizeMB ? ` • ${fileSizeMB} MB` : fileSizeKB ? ` • ${fileSizeKB} KB` : ''}
                                                    {doc.mime_type ? ` • ${doc.mime_type}` : ''}
                                                </p>
                                            </div>
                                            <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#C72030] bg-white border border-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                View
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeletedDocuments(prev => [...prev, doc]);
                                                    setExistingDocuments(prev => prev.filter(d => d.id !== doc.id));
                                                }}
                                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                                                title="Delete document"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <p className="text-xs text-gray-500">{existingDocuments.length > 0 ? 'Upload a new file to replace the existing document:' : 'Upload agreement file:'}</p>
                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="h-9"
                            onChange={(e) => setFormData(prev => ({ ...prev, agreementFile: e.target.files?.[0] || null }))}
                        />
                        {existingAgreementUrl && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <FileText className="h-6 w-6 text-[#C72030]" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900">Previously Uploaded Agreement</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px] md:max-w-xs">{existingAgreementName || 'agreement.pdf'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(`https://rental-uat.lockated.com/${existingAgreementUrl}`, '_blank')}
                                        className="h-9 px-4 border-[#C72030] text-[#C72030] hover:bg-red-50 flex-1 md:flex-none"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </FormSection>

                <FormActions>
                    <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting || loadingLease}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        className="fm-button-fix fm-button-brand px-6 py-2"
                        disabled={isSubmitting || loadingLease}
                    >
                        {isSubmitting ? 'Updating...' : loadingLease ? 'Loading...' : 'Update Rental'}
                    </Button>
                </FormActions>
            </div>
        </PageContainer>
    );
};

export default EditRentalPage;
