
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getAuth, postAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';

interface PropertyType {
  id: number;
  name: string;
}

interface ComplianceFormProps {
  isEdit?: boolean;
  compliance?: any;
  onSave: () => void;
  onCancel: () => void;
}

const ComplianceForm = ({ isEdit = false, compliance, onSave, onCancel }: ComplianceFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  const [formData, setFormData] = useState({
    requirement_type: '',
    title: '',
    description: '',
    regulatory_body: '',
    due_date: '',
    status: 'pending',
    responsible_party: '',
    assigned_to: '',
    reminder_days: '',
    is_recurring: true,
    validity_months: '',
    approx_cost: '',
    property_type_ids: [] as number[]
  });

  useEffect(() => {
    fetchPropertyTypes();

    // If editing, populate the form
    if (isEdit && compliance) {
      setFormData({
        requirement_type: compliance.requirement_type || '',
        title: compliance.title || '',
        description: compliance.description || '',
        regulatory_body: compliance.regulatory_body || '',
        due_date: compliance.due_date || '',
        status: compliance.status || 'pending',
        responsible_party: compliance.responsible_party || '',
        assigned_to: compliance.assigned_to?.toString() || '',
        reminder_days: compliance.reminder_days?.toString() || '',
        is_recurring: compliance.is_recurring ?? true,
        validity_months: compliance.validity_months?.toString() || '',
        approx_cost: compliance.approx_cost || '',
        property_type_ids: compliance.property_types?.map((pt: any) => pt.id) || []
      });
    }
  }, [isEdit, compliance]);

  const fetchPropertyTypes = async () => {
    try {
      const data = await getAuth('/compliance_requirements/property_types');
      if (Array.isArray(data)) {
        setPropertyTypes(data);
      }
    } catch (error) {
      console.error('Failed to fetch property types', error);
      toast.error('Failed to load property types');
    }
  };

  const handlePropertyTypeToggle = (propertyTypeId: number) => {
    setFormData(prev => ({
      ...prev,
      property_type_ids: prev.property_type_ids.includes(propertyTypeId)
        ? prev.property_type_ids.filter(id => id !== propertyTypeId)
        : [...prev.property_type_ids, propertyTypeId]
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.title || !formData.requirement_type) {
        toast.error('Please fill in all required fields (Title, Type)');
        return;
      }

      const payload = {
        compliance_requirement: {
          requirement_type: formData.requirement_type,
          title: formData.title,
          description: formData.description,
          regulatory_body: formData.regulatory_body,
          due_date: formData.due_date || null,
          status: formData.status,
          responsible_party: formData.responsible_party,
          assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
          reminder_days: formData.reminder_days ? parseInt(formData.reminder_days) : null,
          is_recurring: formData.is_recurring,
          validity_months: formData.validity_months ? parseInt(formData.validity_months) : null,
          approx_cost: formData.approx_cost ? parseFloat(formData.approx_cost) : null,
          property_type_ids: formData.property_type_ids
        }
      };

      if (isEdit && compliance) {
        await patchAuth(`/compliance_requirements/${compliance.id}`, payload);
        toast.success('Compliance requirement updated successfully');
      } else {
        await postAuth('/compliance_requirements', payload);
        toast.success('Compliance requirement created successfully');
      }

      // Reset form
      setFormData({
        requirement_type: '',
        title: '',
        description: '',
        regulatory_body: '',
        due_date: '',
        status: 'pending',
        responsible_party: '',
        assigned_to: '',
        reminder_days: '',
        is_recurring: true,
        validity_months: '',
        approx_cost: '',
        property_type_ids: []
      });

      onSave();
    } catch (error: any) {
      let errorMessage = isEdit ? 'Failed to update compliance requirement' : 'Failed to create compliance requirement';
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

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="compliance-name" className="text-gray-900 font-medium">Compliance Title *</Label>
        <Input
          id="compliance-name"
          placeholder="e.g., Fire Safety NOC"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="compliance-type" className="text-gray-900 font-medium">Compliance Type *</Label>
        <Select
          value={formData.requirement_type}
          onValueChange={(value) => setFormData({ ...formData, requirement_type: value })}
        >
          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Fire Safety">Fire Safety</SelectItem>
            <SelectItem value="Safety">Safety</SelectItem>
            <SelectItem value="Operating">Operating</SelectItem>
            <SelectItem value="Environmental">Environmental</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
            <SelectItem value="Tax">Tax</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="description" className="text-gray-900 font-medium">Description</Label>
        <Input
          id="description"
          placeholder="Brief description of the compliance"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="validity-period" className="text-gray-900 font-medium">Validity Period (Months)</Label>
        <Input
          id="validity-period"
          type="number"
          placeholder="e.g., 12"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.validity_months}
          onChange={(e) => setFormData({ ...formData, validity_months: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="renewal-notice" className="text-gray-900 font-medium">Reminder Days</Label>
        <Input
          id="renewal-notice"
          type="number"
          placeholder="e.g., 30"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.reminder_days}
          onChange={(e) => setFormData({ ...formData, reminder_days: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="authority" className="text-gray-900 font-medium">Regulatory Body</Label>
        <Input
          id="authority"
          placeholder="e.g., Fire Department"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.regulatory_body}
          onChange={(e) => setFormData({ ...formData, regulatory_body: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost" className="text-gray-900 font-medium">Approximate Cost</Label>
        <Input
          id="cost"
          type="number"
          placeholder="e.g., 5000"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.approx_cost}
          onChange={(e) => setFormData({ ...formData, approx_cost: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="due-date" className="text-gray-900 font-medium">Due Date</Label>
        <Input
          id="due-date"
          type="date"
          className="bg-white border-gray-300 text-gray-900"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsible-party" className="text-gray-900 font-medium">Responsible Party</Label>
        <Input
          id="responsible-party"
          placeholder="e.g., Maintenance Team"
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          value={formData.responsible_party}
          onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label className="text-gray-900 font-medium">Applicable Property Types</Label>
        <div className="grid grid-cols-3 gap-3 p-4 border-2 border-gray-300 rounded-md bg-white">
          {propertyTypes.map((propertyType) => (
            <div key={propertyType.id} className="flex items-center space-x-2">
              <Checkbox
                id={`property-type-${propertyType.id}`}
                checked={formData.property_type_ids.includes(propertyType.id)}
                onCheckedChange={() => handlePropertyTypeToggle(propertyType.id)}
                className="border-2 border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
              />
              <Label htmlFor={`property-type-${propertyType.id}`} className="text-sm text-gray-900 cursor-pointer">
                {propertyType.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2 col-span-2 pt-4">
        <Button
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className="bg-[#C72030] hover:bg-[#A01825] text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update' : 'Save')} Compliance
        </Button>
      </div>
    </div>
  );
};

export default ComplianceForm;
