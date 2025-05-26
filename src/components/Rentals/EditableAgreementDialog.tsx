
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, DollarSign, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agreement {
  id: string;
  propertyName: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  securityDeposit: number;
  leaseType: string;
}

interface EditableAgreementDialogProps {
  agreement: Agreement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditableAgreementDialog = ({ agreement, open, onOpenChange }: EditableAgreementDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    propertyName: agreement?.propertyName || '',
    tenantName: agreement?.tenantName || '',
    startDate: agreement?.startDate || '',
    endDate: agreement?.endDate || '',
    monthlyRent: agreement?.monthlyRent || 0,
    securityDeposit: agreement?.securityDeposit || 0,
    leaseType: agreement?.leaseType || '',
    landlordName: '',
    landlordContact: '',
    tenantContact: '',
    tenantEmail: ''
  });

  const handleSave = () => {
    toast({
      title: "Agreement Saved",
      description: `Agreement ${agreement?.id} has been updated successfully.`,
    });
    onOpenChange(false);
  };

  const handleAddTenant = () => {
    toast({
      title: "Add New Tenant",
      description: "Opening tenant master form...",
    });
  };

  const handleAddLandlord = () => {
    toast({
      title: "Add New Landlord",
      description: "Opening landlord master form...",
    });
  };

  if (!agreement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Agreement - {agreement.id}</span>
            <Button onClick={handleSave} className="bg-[#E74C3C] hover:bg-[#C0392B]">
              <Save className="h-4 w-4 mr-2" />
              Save Agreement
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-[#E74C3C]" />
              Property Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property">Property</Label>
                <Select value={formData.propertyName} onValueChange={(value) => setFormData({...formData, propertyName: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunset Apartments - Unit 2A">Sunset Apartments - Unit 2A</SelectItem>
                    <SelectItem value="Downtown Plaza - Unit 5B">Downtown Plaza - Unit 5B</SelectItem>
                    <SelectItem value="Green Valley - Unit 1C">Green Valley - Unit 1C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="leaseType">Lease Type</Label>
                <Select value={formData.leaseType} onValueChange={(value) => setFormData({...formData, leaseType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Lease Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Short-term">Short-term</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Landlord Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-[#E74C3C]" />
                Landlord Information
              </div>
              <Button variant="outline" size="sm" onClick={handleAddLandlord}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Landlord
              </Button>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="landlordName">Landlord Name</Label>
                <Input 
                  id="landlordName"
                  value={formData.landlordName}
                  onChange={(e) => setFormData({...formData, landlordName: e.target.value})}
                  placeholder="Enter landlord name"
                />
              </div>
              <div>
                <Label htmlFor="landlordContact">Contact Number</Label>
                <Input 
                  id="landlordContact"
                  value={formData.landlordContact}
                  onChange={(e) => setFormData({...formData, landlordContact: e.target.value})}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Tenant Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-[#E74C3C]" />
                Tenant Information
              </div>
              <Button variant="outline" size="sm" onClick={handleAddTenant}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Tenant
              </Button>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tenantName">Tenant Name</Label>
                <Input 
                  id="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                  placeholder="Enter tenant name"
                />
              </div>
              <div>
                <Label htmlFor="tenantContact">Contact Number</Label>
                <Input 
                  id="tenantContact"
                  value={formData.tenantContact}
                  onChange={(e) => setFormData({...formData, tenantContact: e.target.value})}
                  placeholder="Enter contact number"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="tenantEmail">Email Address</Label>
                <Input 
                  id="tenantEmail"
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({...formData, tenantEmail: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-[#E74C3C]" />
              Financial Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
                <Input 
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({...formData, monthlyRent: Number(e.target.value)})}
                  placeholder="Enter monthly rent"
                />
              </div>
              <div>
                <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                <Input 
                  id="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({...formData, securityDeposit: Number(e.target.value)})}
                  placeholder="Enter security deposit"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Lease Period */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#E74C3C]" />
              Lease Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditableAgreementDialog;
