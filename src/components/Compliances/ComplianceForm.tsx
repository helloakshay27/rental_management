
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComplianceFormProps {
  isEdit?: boolean;
  compliance?: any;
  onSave: () => void;
  onCancel: () => void;
}

const ComplianceForm = ({ isEdit = false, compliance, onSave, onCancel }: ComplianceFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="compliance-name">Compliance Name</Label>
        <Input 
          id="compliance-name" 
          placeholder="e.g., Fire Safety NOC" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.name : ''} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="compliance-type">Compliance Type</Label>
        <Select defaultValue={isEdit ? compliance?.type.toLowerCase() : ''}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="safety">Safety</SelectItem>
            <SelectItem value="operating">Operating</SelectItem>
            <SelectItem value="environmental">Environmental</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="tax">Tax</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          placeholder="Brief description of the compliance" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.description : ''} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="validity-period">Validity Period (Months)</Label>
        <Input 
          id="validity-period" 
          type="number" 
          placeholder="e.g., 12" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.validityPeriod : ''} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="renewal-notice">Renewal Notice (Days)</Label>
        <Input 
          id="renewal-notice" 
          type="number" 
          placeholder="e.g., 30" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.renewalNotice : ''} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="authority">Issuing Authority</Label>
        <Input 
          id="authority" 
          placeholder="e.g., Fire Department" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.authority : ''} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost">Approximate Cost</Label>
        <Input 
          id="cost" 
          placeholder="e.g., ₹5,000" 
          className="bg-white"
          defaultValue={isEdit ? compliance?.cost : ''} 
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="property-types">Applicable Property Types</Label>
        <Select>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select property types" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 col-span-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={onSave}>
          {isEdit ? 'Update' : 'Save'} Compliance
        </Button>
      </div>
    </div>
  );
};

export default ComplianceForm;
