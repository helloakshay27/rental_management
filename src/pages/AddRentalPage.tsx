
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddRentalPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        property: '',
        leaseStart: '',
        leaseEnd: '',
        perSqFtRate: 0,
        basicRent: 0,
        gstApplicable: false,
        tdsApplicable: false,
        securityDeposit: 0,
        totalMonthlyRent: 0,
        rentPaymentType: 'advance',
        rentDueDate: '1st',
        escalationPercentage: 0,
        applyLatePenalty: false,
        applyLateInterest: false,
        agreementFile: null,
        notes: ''
    });

    return (
        <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Rental</h1>
                <p className="text-gray-500">Add a new rental property to your portfolio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Select Property *</Label>
                        <Select>
                            <SelectTrigger className="w-full bg-white border-gray-300">
                                <SelectValue placeholder="Select a property" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="prop1">Property 1</SelectItem>
                                <SelectItem value="prop2">Property 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Rent Breakdown</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Per Sq Ft Rate (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        className="pl-8"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="border border-gray-200 rounded-md p-4 space-y-4">
                                <h4 className="font-medium text-gray-700">Amount Details</h4>

                                <div className="space-y-2">
                                    <Label>Basic Rent (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-8"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="gst" />
                                    <Label htmlFor="gst" className="font-normal">GST Applicable</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="tds" />
                                    <Label htmlFor="tds" className="font-normal">TDS Applicable</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label>Security Deposit (₹)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                        <Input
                                            type="number"
                                            className="pl-8"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Total Monthly Rent (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        className="pl-8 bg-green-50 border-green-200 text-green-700"
                                        placeholder="0"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="tds2" />
                                <Label htmlFor="tds2" className="font-normal">TDS Applicable</Label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label>Lease Start Date</Label>
                            <div className="relative">
                                <Input placeholder="dd-mm-yyyy" />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Lease End Date</Label>
                            <div className="relative">
                                <Input placeholder="dd-mm-yyyy" />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Security Deposit</Label>
                        <Input placeholder="Enter security deposit amount" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-full border border-gray-400 p-0.5">
                                <span className="block w-2 H-2 rounded-full border border-gray-800"></span>
                            </div>
                            <h3 className="font-semibold text-lg">Rent Due Configuration</h3>
                        </div>

                        <div className="space-y-3">
                            <Label>Rent Payment Type</Label>
                            <RadioGroup defaultValue="advance">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="advance" id="advance" className="text-[#C72030] border-gray-400" />
                                    <div className="grid gap-0.5">
                                        <Label htmlFor="advance" className="font-medium">Advance Payment</Label>
                                        <span className="text-xs text-gray-500">Rent is paid before the month begins</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="post" id="post" className="text-[#C72030] border-gray-400" />
                                    <div className="grid gap-0.5">
                                        <Label htmlFor="post" className="font-medium">Post Usage Payment</Label>
                                        <span className="text-xs text-gray-500">Rent is paid after the month ends</span>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Rent Due Date</Label>
                            <Select defaultValue="1st">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1st">1st of every month</SelectItem>
                                    <SelectItem value="5th">5th of every month</SelectItem>
                                    <SelectItem value="10th">10th of every month</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">Rent will be due on this date before each month begins</p>
                        </div>
                    </div>

                    <div className="p-6 bg-[#FAF9F6] rounded-lg border border-gray-100 space-y-6">
                        <h3 className="font-semibold text-lg">Escalation & Penalty Settings</h3>

                        <div className="space-y-2">
                            <Label>Annual Escalation Percentage (%)</Label>
                            <Input className="bg-white" placeholder="0" />
                            <p className="text-xs text-gray-500">Rent will increase by this percentage annually</p>
                        </div>

                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                            <Label className="text-gray-600 font-normal">Apply penalty on late payments</Label>
                            <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-gray-600 font-normal">Apply interest on late payments</Label>
                            <Switch />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <div className="space-y-2">
                    <Label>Agreement File</Label>
                    <div className="flex items-center border rounded-md px-3 py-2 bg-white">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium mr-2">Choose file</span>
                        <span className="text-gray-500 text-sm">No file chosen</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea placeholder="Any additional notes or comments" className="min-h-[80px]" />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <Button variant="outline" onClick={() => navigate(-1)} className="border-red-600 text-red-600 hover:bg-red-50">Cancel</Button>
                <Button className="bg-[#C72030] hover:bg-[#A01825] text-white">Add Rental</Button>
            </div>
        </div>
    );
};

export default AddRentalPage;
