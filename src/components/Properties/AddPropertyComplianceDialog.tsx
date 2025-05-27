
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface AddPropertyComplianceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (complianceData: any) => void;
  propertyId: string;
}

// Mock compliance master data - in real app this would come from API
const availableCompliances = [
  { id: 'C001', name: 'Fire Safety NOC', type: 'Safety', authority: 'Fire Department' },
  { id: 'C002', name: 'Municipal Operating License', type: 'Operating', authority: 'Municipal Corporation' },
  { id: 'C003', name: 'Environmental Clearance', type: 'Environmental', authority: 'Pollution Control Board' },
];

const AddPropertyComplianceDialog = ({ isOpen, onClose, onSave, propertyId }: AddPropertyComplianceDialogProps) => {
  const [selectedCompliance, setSelectedCompliance] = useState('');
  const [issueDate, setIssueDate] = useState<Date>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [certificateNumber, setCertificateNumber] = useState('');

  const handleSave = () => {
    if (!selectedCompliance || !issueDate || !expiryDate || !certificateNumber) {
      alert('Please fill all required fields');
      return;
    }

    const compliance = availableCompliances.find(c => c.id === selectedCompliance);
    const complianceData = {
      id: `PC${Date.now()}`,
      complianceId: selectedCompliance,
      name: compliance?.name,
      type: compliance?.type,
      authority: compliance?.authority,
      issueDate: issueDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      certificateNumber,
      status: 'Active',
      propertyId,
      documents: []
    };

    onSave(complianceData);
    onClose();
    
    // Reset form
    setSelectedCompliance('');
    setIssueDate(undefined);
    setExpiryDate(undefined);
    setCertificateNumber('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>Add Compliance to Property</DialogTitle>
          <DialogDescription>
            Assign a compliance requirement to this property
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="compliance">Select Compliance</Label>
            <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose compliance type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableCompliances.map((compliance) => (
                  <SelectItem key={compliance.id} value={compliance.id}>
                    {compliance.name} - {compliance.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {issueDate ? format(issueDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={issueDate}
                  onSelect={setIssueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="certificate-number">Certificate Number</Label>
            <Input
              id="certificate-number"
              placeholder="Enter certificate/license number"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={handleSave}>
            Add Compliance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyComplianceDialog;
