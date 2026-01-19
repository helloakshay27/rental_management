
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Zap } from 'lucide-react';
import { getAuth } from '@/lib/api';

interface AgreementService {
    service_type: string;
    deposit: string;
    fixed_monthly_charge: string;
    rate_per_sqft: string;
    billing_cycle: string;
    due_date: string;
    payment_mode: string;
    provider_name: string;
    consumer_number: string;
    sap_vendor_code: string;
    payment_automated: boolean;
    automation_partner: string;
    cost_center: string;
    gl_code: string;
    io_code: string;
    company_contact_name: string;
    company_contact_email: string;
    company_contact_mobile: string;
    landlord_contact_name: string;
    landlord_contact_email: string;
    landlord_contact_mobile: string;
    active: boolean;
}

interface AgreementServicesSectionProps {
    services: AgreementService[];
    onChange: (services: AgreementService[]) => void;
}

const AgreementServicesSection: React.FC<AgreementServicesSectionProps> = ({ services, onChange }) => {
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const res = await getAuth('/service_types.json');
                const data = res?.service_types || res || [];
                setServiceTypes(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch service types:', error);
            }
        };
        fetchServiceTypes();
    }, []);

    const addService = () => {
        onChange([
            ...services,
            {
                service_type: '',
                deposit: '',
                fixed_monthly_charge: '',
                rate_per_sqft: '',
                billing_cycle: 'monthly',
                due_date: '5',
                payment_mode: 'bank_transfer',
                provider_name: '',
                consumer_number: '',
                sap_vendor_code: '',
                payment_automated: false,
                automation_partner: '',
                cost_center: '',
                gl_code: '',
                io_code: '',
                company_contact_name: '',
                company_contact_email: '',
                company_contact_mobile: '',
                landlord_contact_name: '',
                landlord_contact_email: '',
                landlord_contact_mobile: '',
                active: true
            }
        ]);
    };

    const removeService = (index: number) => {
        onChange(services.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: keyof AgreementService, value: any) => {
        const updated = [...services];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    return (
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#C72030]" />
                    Agreement Services
                </h3>
                <Button
                    type="button"
                    onClick={addService}
                    className="bg-[#C72030] hover:bg-[#A01825] text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                </Button>
            </div>

            <div className="space-y-6">
                {services.map((service, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50/50">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium text-gray-700">Service #{index + 1}</h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeService(index)}
                                className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Row 1: Basic Info */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Service Type *</Label>
                                <Select
                                    value={service.service_type}
                                    onValueChange={(value) => updateService(index, 'service_type', value)}
                                >
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.name}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Provider Name</Label>
                                <Input
                                    value={service.provider_name}
                                    onChange={(e) => updateService(index, 'provider_name', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. Electricity Co"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Consumer Number</Label>
                                <Input
                                    value={service.consumer_number}
                                    onChange={(e) => updateService(index, 'consumer_number', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. E12345"
                                />
                            </div>

                            {/* Row 2: Financials */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Deposit (₹)</Label>
                                <Input
                                    type="number"
                                    value={service.deposit}
                                    onChange={(e) => updateService(index, 'deposit', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Fixed Monthly Charge (₹)</Label>
                                <Input
                                    type="number"
                                    value={service.fixed_monthly_charge}
                                    onChange={(e) => updateService(index, 'fixed_monthly_charge', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Rate Per SqFt (₹)</Label>
                                <Input
                                    type="number"
                                    value={service.rate_per_sqft}
                                    onChange={(e) => updateService(index, 'rate_per_sqft', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="0"
                                />
                            </div>

                            {/* Row 3: Billing */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Billing Cycle</Label>
                                <Select
                                    value={service.billing_cycle}
                                    onValueChange={(value) => updateService(index, 'billing_cycle', value)}
                                >
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="bimonthly">Bi-Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Due Date (Day of Month)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={service.due_date}
                                    onChange={(e) => updateService(index, 'due_date', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Payment Mode</Label>
                                <Select
                                    value={service.payment_mode}
                                    onValueChange={(value) => updateService(index, 'payment_mode', value)}
                                >
                                    <SelectTrigger className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="online">Online</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Row 4: Codes & Automation */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">SAP Vendor Code</Label>
                                <Input
                                    value={service.sap_vendor_code}
                                    onChange={(e) => updateService(index, 'sap_vendor_code', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. SAP987"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">GL Code</Label>
                                <Input
                                    value={service.gl_code}
                                    onChange={(e) => updateService(index, 'gl_code', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. GL500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Cost Center</Label>
                                <Input
                                    value={service.cost_center}
                                    onChange={(e) => updateService(index, 'cost_center', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. CC100"
                                />
                            </div>

                            {/* Row 5: Automation Toggle */}
                            <div className="flex items-center space-x-2 border rounded-md p-3 bg-white">
                                <Switch
                                    id={`automation-${index}`}
                                    checked={service.payment_automated}
                                    onCheckedChange={(checked) => updateService(index, 'payment_automated', checked)}
                                />
                                <Label htmlFor={`automation-${index}`} className="text-gray-900 font-medium">Payment Automated</Label>
                            </div>

                            {service.payment_automated && (
                                <div className="space-y-2">
                                    <Label className="text-gray-900 font-medium">Automation Partner</Label>
                                    <Input
                                        value={service.automation_partner}
                                        onChange={(e) => updateService(index, 'automation_partner', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                        placeholder="e.g. XYZ"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">IO Code</Label>
                                <Input
                                    value={service.io_code}
                                    onChange={(e) => updateService(index, 'io_code', e.target.value)}
                                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                                    placeholder="e.g. IO200"
                                />
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Contact */}
                            <div className="space-y-4 p-3 border border-dashed border-gray-300 rounded-md">
                                <h5 className="font-semibold text-gray-700 underline">Company Contact</h5>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Name</Label>
                                    <Input
                                        value={service.company_contact_name}
                                        onChange={(e) => updateService(index, 'company_contact_name', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Email</Label>
                                    <Input
                                        value={service.company_contact_email}
                                        onChange={(e) => updateService(index, 'company_contact_email', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Mobile</Label>
                                    <Input
                                        value={service.company_contact_mobile}
                                        onChange={(e) => updateService(index, 'company_contact_mobile', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                            </div>

                            {/* Landlord Contact */}
                            <div className="space-y-4 p-3 border border-dashed border-gray-300 rounded-md">
                                <h5 className="font-semibold text-gray-700 underline">Landlord Contact</h5>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Name</Label>
                                    <Input
                                        value={service.landlord_contact_name}
                                        onChange={(e) => updateService(index, 'landlord_contact_name', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Email</Label>
                                    <Input
                                        value={service.landlord_contact_email}
                                        onChange={(e) => updateService(index, 'landlord_contact_email', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500">Mobile</Label>
                                    <Input
                                        value={service.landlord_contact_mobile}
                                        onChange={(e) => updateService(index, 'landlord_contact_mobile', e.target.value)}
                                        className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-8"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
                        No agreement services added yet. Click "Add Service" to add one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgreementServicesSection;
