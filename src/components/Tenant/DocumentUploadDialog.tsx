import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DocumentUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (documentData: any) => void;
}

const DocumentUploadDialog = ({ isOpen, onClose, onUpload }: DocumentUploadDialogProps) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        property: '',
        file: null as File | null
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    const handleSubmit = () => {
        onUpload(formData);
        onClose();
        setFormData({ name: '', type: '', property: '', file: null });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Upload Document</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900 font-medium">Document Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-white border-2 border-gray-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-gray-900 font-medium">Document Type *</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            value={formData.type}
                        >
                            <SelectTrigger className="bg-white border-2 border-gray-200">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="receipt">Receipt</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="bill">Bill</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                                <SelectItem value="insurance">Insurance</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="property" className="text-gray-900 font-medium">Property *</Label>
                        <Select
                            onValueChange={(value) => setFormData({ ...formData, property: value })}
                            value={formData.property}
                        >
                            <SelectTrigger className="bg-white border-2 border-gray-200">
                                <SelectValue placeholder="Select property" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="Sunset Apartments">Sunset Apartments</SelectItem>
                                <SelectItem value="Green Valley Villa">Green Valley Villa</SelectItem>
                                <SelectItem value="City Center Office">City Center Office</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file" className="text-gray-900 font-medium">File</Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="bg-white border-2 border-gray-200 file:bg-gray-50 file:border-0 file:mr-4 file:py-1 file:px-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-100"
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        Upload Document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentUploadDialog;
