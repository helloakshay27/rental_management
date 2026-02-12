
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, MapPin, Home, Calendar, ChevronLeft, Upload, FileText, X, Building, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postAuth, getAuth, patchAuth, deleteAuth, API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

interface Property {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  property_type: string;
  leasable_area: string;
  built_year: number;
  description: string;
  amenities: string[];
  zone_id: number;
  landlord_id: number;
  circle: string;
  property_takeover_condition_id: number;
  property_takeover_condition_name?: string;
  pms_site_facilities?: any[];
  carpet_area: string;
  updated_at: string;
  ites_certification?: string;
  ites_valid_till?: string;
  ownership_type?: string;
}

const PropertiesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  const renderValue = (val: any) => {
    if (!val) return '';
    if (typeof val === 'object') return val.name || val.id?.toString() || '';
    return val.toString();
  };

  // Dropdown data state
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [landlords, setLandlords] = useState<any[]>([]);
  const [facilityTypes, setFacilityTypes] = useState<any[]>([]);
  const [takeoverConditions, setTakeoverConditions] = useState<any[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    landlord_id: '',
    name: '',
    property_type: '',
    property_type_id: '',
    country_id: '',
    country: '',
    state_id: '',
    state: '',
    region_id: '',
    region: '',
    zone_id: '',
    city_id: '',
    circle_id: '',
    address: '',
    city: '',
    postal_code: '',
    leasable_area: '',
    carpet_area: '',
    area_efficiency: '',
    built_year: '',
    description: '',
    amenities: [] as string[],
    facility_type_ids: "",
    circle: '',
    property_takeover_condition_id: '',
    ites_certification: 'No',
    ites_valid_till: '',
    ownership_type: 'Owned'
  });

  // Fetch countries on component mount
  React.useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAuth('/pms/countries');
        if (Array.isArray(data)) {
          setCountries(data);
        }
      } catch (error) {
        console.error('Failed to fetch countries', error);
        toast.error('Failed to load countries');
      }
    };

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

    const fetchLandlords = async () => {
      try {
        const data = await getAuth('/landlords');
        if (Array.isArray(data)) {
          setLandlords(data);
        }
      } catch (error) {
        console.error('Failed to fetch landlords', error);
      }
    };

    const fetchFacilityTypes = async () => {
      try {
        const data = await getAuth('/facility_types');
        if (Array.isArray(data)) {
          setFacilityTypes(data);
        }
      } catch (error) {
        console.error('Failed to fetch facility types', error);
      }
    };

    const fetchTakeoverConditions = async () => {
      try {
        const data = await getAuth('/property_takeover_conditions');
        if (Array.isArray(data)) {
          setTakeoverConditions(data);
        }
      } catch (error) {
        console.error('Failed to fetch takeover conditions', error);
      }
    };

    fetchCountries();
    fetchPropertyTypes();
    fetchLandlords();
    fetchFacilityTypes();
    fetchTakeoverConditions();
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Data = await convertFileToBase64(file);
        const newDoc = {
          file_name: file.name,
          document_type: documentType,
          base64_data: base64Data,
          preview: URL.createObjectURL(file)
        };
        setSelectedDocuments(prev => [...prev, newDoc]);
      } catch (error) {
        toast.error('Failed to process file');
      }
    }
  };

  const removeDocument = (index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch states when country changes
  React.useEffect(() => {
    const fetchStates = async () => {
      if (formData.country_id) {
        try {
          const data = await getAuth(`/pms/states?q[country_id_eq]=${formData.country_id}`);
          if (Array.isArray(data)) {
            setStates(data);
          }
        } catch (error) {
          console.error('Failed to fetch states', error);
          toast.error('Failed to load states');
        }
      } else {
        setStates([]);
      }
    };
    fetchStates();
  }, [formData.country_id]);

  // Fetch regions when state changes
  React.useEffect(() => {
    const fetchRegions = async () => {
      if (formData.state_id) {
        try {
          const data = await getAuth(`/pms/regions?q[state_id_eq]=${formData.state_id}`);
          if (Array.isArray(data)) {
            setRegions(data);
          }
        } catch (error) {
          console.error('Failed to fetch regions', error);
          toast.error('Failed to load regions');
        }
      } else {
        setRegions([]);
      }
    };
    fetchRegions();
  }, [formData.state_id]);

  // Fetch zones when region changes
  React.useEffect(() => {
    const fetchZones = async () => {
      if (formData.region_id) {
        try {
          const data = await getAuth(`/pms/zones?q[region_id_eq]=${formData.region_id}`);
          if (Array.isArray(data)) {
            setZones(data);
          }
        } catch (error) {
          console.error('Failed to fetch zones', error);
          toast.error('Failed to load zones');
        }
      } else {
        setZones([]);
      }
    };
    fetchZones();
  }, [formData.region_id]);

  // Fetch cities when zone changes
  React.useEffect(() => {
    const fetchCities = async () => {
      if (formData.zone_id) {
        try {
          const data = await getAuth(`/pms/cities?q[zone_id_eq]=${formData.zone_id}`);
          if (Array.isArray(data.data)) {
            setCities(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch cities', error);
          toast.error('Failed to load cities');
        }
      } else {
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.zone_id]);

  React.useEffect(() => {
    const fetchCircles = async () => {
      if (formData.city_id) {
        try {
          const data = await getAuth(`/pms/circles?q[city_id_eq]=${formData.city_id}`);
          if (Array.isArray(data.data)) {
            setCircles(data.data);
          }
        } catch (error) {
          console.error('Failed to fetch circles', error);
          toast.error('Failed to load circles');
        }
      } else {
        setCircles([]);
      }
    };
    fetchCircles();
  }, [formData.city_id]);

  // Auto-calculate area efficiency when carpet_area or leasable_area changes
  React.useEffect(() => {
    if (formData.carpet_area && formData.leasable_area) {
      const carpetArea = parseFloat(formData.carpet_area);
      const leasableArea = parseFloat(formData.leasable_area);
      if (carpetArea > 0 && leasableArea > 0) {
        const efficiency = ((carpetArea / leasableArea) * 100).toFixed(2);
        setFormData(prev => ({ ...prev, area_efficiency: efficiency }));
      }
    }
  }, [formData.carpet_area, formData.leasable_area]);

  const fetchProperties = async () => {
    try {
      setIsLoadingData(true);
      const data = await getAuth('/pms/sites');
      if (Array.isArray(data)) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to fetch properties', error);
      toast.error('Failed to load properties');
    } finally {
      setIsLoadingData(false);
    }
  };

  React.useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property =>
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProperty = (property: Property) => {
    navigate(`/masters/properties/${property.id}`);
  };

  const handleEditProperty = async (property: Property) => {
    try {
      setIsLoading(true); // Reuse the existing loading state or create a new one if preferred, but usually dialog loading logic is separate. 
      // Ideally show a toast or loader. Since we might not want to block the UI immediately, prompt feedback is good.
      // But here I'll just fetch.

      const detailedData = await getAuth(`/pms/sites/${property.id}`);
      const siteData = detailedData?.site || detailedData;

      // Match Country/State IDs from names
      if (siteData.documents && Array.isArray(siteData.documents)) {
        const mappedDocs = await Promise.all(siteData.documents.map(async (doc: any) => {
          const preview = doc.url?.startsWith('http') ? doc.url : `${API_BASE_URL}${doc.url}`;
          let base64 = '';
          try {
            const resp = await fetch(preview);
            const blob = await resp.blob();
            base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
              };
              reader.readAsDataURL(blob);
            });
          } catch (e) {
            console.error("Failed to fetch image for base64 conversion", e);
          }
          return {
            file_name: doc.name || doc.file_name,
            document_type: doc.document_type || 'site_image',
            preview,
            id: doc.id,
            base64_data: base64
          };
        }));
        setSelectedDocuments(mappedDocs);
      } else {
        setSelectedDocuments([]);
      }

      // Match Country/State IDs from names
      let matchedCountryId = siteData.country_id?.toString() || '';
      if (!matchedCountryId && siteData.country) {
        const matchedCountry = countries.find(c => c.name === siteData.country);
        if (matchedCountry) matchedCountryId = matchedCountry.id.toString();
      }

      let matchedStateId = siteData.state_id?.toString() || '';
      if (matchedCountryId && siteData.state) {
        try {
          // Pre-fetch states for this country to match IDs and populate dropdown
          const statesData = await getAuth(`/pms/states?q[country_id_eq]=${matchedCountryId}`);
          if (Array.isArray(statesData)) {
            setStates(statesData);
            const matchedState = statesData.find((s: any) => s.name === siteData.state);
            if (matchedState) matchedStateId = matchedState.id.toString();
          }
        } catch (e) {
          console.error("Could not pre-fetch states for matching", e);
        }
      }

      // Pre-fill the form with fresh API data
      setFormData({
        landlord_id: siteData.landlord_id?.toString() || siteData.landlord?.id?.toString() || '',
        name: siteData.name || '',
        property_type: siteData.property_type?.name || siteData.property_type || '',
        property_type_id: siteData.property_type_id?.toString() || siteData.property_type?.id?.toString() || '',
        country_id: matchedCountryId,
        country: siteData.country || '',
        state_id: matchedStateId,
        state: siteData.state || '',
        region_id: siteData.region_id?.toString() || '',
        region: siteData.region || '',
        zone_id: siteData.zone_id?.toString() || siteData.zone?.id?.toString() || '',
        city_id: siteData.city_id?.toString() || siteData.city?.id?.toString() || '',
        circle_id: siteData.circle_id?.toString() || siteData.circle?.id?.toString() || '',
        address: siteData.address || '',
        city: siteData.city || '',
        postal_code: siteData.postal_code || '',
        leasable_area: siteData.leasable_area?.toString() || '',
        carpet_area: siteData.carpet_area?.toString() || '',
        area_efficiency: siteData.area_efficiency?.toString() || '',
        built_year: siteData.built_year?.toString() || '',
        description: siteData.description || '',
        amenities: siteData.amenities || [],
        facility_type_ids: siteData.facility_type_ids ||
          siteData.pms_site_facilities?.map((f: any) => f.facility_type_id) ||
          siteData.facility_types?.map((f: any) => f.id) || [],
        circle: siteData.circle || siteData.circuit || '',
        property_takeover_condition_id: siteData.property_takeover_condition_id?.toString() || siteData.property_takeover_condition?.id?.toString() || '',
        ites_certification: siteData.ites_certification || (siteData.ites_certified ? 'Yes' : 'No') || 'No',
        ites_valid_till: siteData.ites_valid_till || siteData.ites_certified_till || '',
        ownership_type: siteData.ownership_type || 'Owned'
      });

      setEditingProperty(siteData);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch property details', error);
      toast.error('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    if (window.confirm(`Are you sure you want to delete "${property.name}"?`)) {
      try {
        setIsLoading(true);
        await deleteAuth(`/pms/sites/${property.id}`);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error: any) {
        toast.error('Failed to delete property');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.name || !formData.property_type) {
        toast.error('Please fill in required fields (Property Name, Type)');
        return;
      }

      // Build payload with only fields present in the form
      const payload: any = {
        site: {
          user_id: 1, // Default user_id
          name: formData.name,
          address: formData.address,
          // city: formData.city,
          city_id: formData.city_id ? parseInt(formData.city_id) : null,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          property_type: formData.property_type,
          property_type_id: formData.property_type_id ? parseInt(formData.property_type_id) : null,
          description: formData.description,
          pms_site_facilities_attributes: [
            {
              facility_type_id: formData.facility_type_ids
            }
          ],
          documents: selectedDocuments.map(doc => {
            if (!doc.id) {
              return {
                file_name: doc.file_name,
                document_type: doc.document_type,
                base64_data: doc.base64_data
              };
            }

          }),
          // circle: formData.circle,
          circle_id: formData.circle_id ? parseInt(formData.circle_id) : null,
          property_takeover_condition_id: formData.property_takeover_condition_id ? parseInt(formData.property_takeover_condition_id) : null,
          ites_certification: formData.ites_certification,
          ites_certified: formData.ites_certification === 'Yes',
          ites_valid_till: formData.ites_certification === 'Yes' ? formData.ites_valid_till : null,
          ites_certified_till: formData.ites_certification === 'Yes' ? formData.ites_valid_till : null,
          ownership_type: formData.ownership_type
        }
      };

      // Add optional fields only if they have values
      if (formData.leasable_area) {
        payload.site.leasable_area = parseFloat(formData.leasable_area);
      }
      if (formData.carpet_area) {
        payload.site.carpet_area = parseFloat(formData.carpet_area);
      }
      if (formData.area_efficiency) {
        payload.site.area_efficiency = parseFloat(formData.area_efficiency);
      }
      if (formData.built_year) {
        payload.site.built_year = parseInt(formData.built_year);
      }
      if (formData.zone_id) {
        payload.site.zone_id = parseInt(formData.zone_id);
      }
      if (formData.landlord_id) {
        payload.site.landlord_id = parseInt(formData.landlord_id);
      }
      // Add amenities array if there are any amenities selected
      if (formData.amenities && formData.amenities.length > 0) {
        payload.site.amenities = formData.amenities;
      }

      if (editingProperty) {
        await patchAuth(`/pms/sites/${editingProperty.id}`, payload);
        toast.success('Property updated successfully');
      } else {
        await postAuth('/pms/sites', payload);
        toast.success('Property created successfully');
      }

      // Reset form
      setFormData({
        landlord_id: '',
        name: '',
        property_type: '',
        property_type_id: '',
        country_id: '',
        country: '',
        state_id: '',
        state: '',
        region_id: '',
        region: '',
        zone_id: '',
        city_id: '',
        circle_id: '',
        address: '',
        city: '',
        postal_code: '',
        leasable_area: '',
        carpet_area: '',
        area_efficiency: '',
        built_year: '',
        description: '',
        amenities: [],
        facility_type_ids: "",
        circle: '',
        property_takeover_condition_id: '',
        ites_certification: 'No',
        ites_valid_till: '',
        ownership_type: 'Owned'
      });
      setSelectedDocuments([]);
      setIsDialogOpen(false);
      fetchProperties(); // Refresh list

    } catch (error: any) {
      let errorMessage = 'Failed to create property';
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/masters')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties Master</h1>
            <p className="text-gray-600">Central property database with all property details</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
              <DialogDescription className="text-gray-600">{editingProperty ? 'Update the property details below' : 'Enter complete property information'}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              {/* Landlord - Full Width at Top */}
              <div className="space-y-2 bg-blue-50 p-4 rounded-md">
                <Label htmlFor="landlord" className="text-gray-900 font-medium">Select Landlord *</Label>
                <p className="text-xs text-gray-600">Choose the landlord who owns this property</p>
                <Select
                  value={formData.landlord_id}
                  onValueChange={(value) => setFormData({ ...formData, landlord_id: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="-- Select a landlord --" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {landlords.map((landlord) => (
                      <SelectItem key={landlord.id} value={landlord.id.toString()}>
                        {landlord.contact_person || landlord.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Two Column Grid for Other Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property-name" className="text-gray-900 font-medium">Property Name *</Label>
                  <Input
                    id="property-name"
                    placeholder="Enter property name"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property-type" className="text-gray-900 font-medium">Property Type *</Label>
                  <Select
                    value={formData.property_type_id}
                    onValueChange={(value) => {
                      const selectedType = propertyTypes.find(t => t.id.toString() === value);
                      setFormData({
                        ...formData,
                        property_type_id: value,
                        property_type: selectedType?.name || ''
                      });
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-900 font-medium">Facility Types</Label>
                  <Select
                    value={formData.facility_type_ids}
                    onValueChange={(value) => {
                      setFormData({ ...formData, facility_type_ids: value });
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {facilityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-white border-gray-300 text-gray-900 hover:bg-gray-50 h-10 px-3 font-normal"
                      >
                        <span className="truncate">
                          {formData.facility_type_ids.length > 0
                            ? facilityTypes
                              .filter(f => formData.facility_type_ids.includes(f.id))
                              .map(f => f.name)
                              .join(', ')
                            : "Select facilities"}
                        </span>
                        <Plus className="h-4 w-4 opacity-50 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 bg-white" align="start">
                      <ScrollArea className="h-64 p-2">
                        <div className="space-y-2">
                          {facilityTypes.map((facility) => (
                            <div key={facility.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                              onClick={() => {
                                const isChecked = formData.facility_type_ids.includes(facility.id);
                                if (!isChecked) {
                                  setFormData({ ...formData, facility_type_ids: [...formData.facility_type_ids, facility.id] });
                                } else {
                                  setFormData({ ...formData, facility_type_ids: formData.facility_type_ids.filter(id => id !== facility.id) });
                                }
                              }}
                            >
                              <Checkbox
                                checked={formData.facility_type_ids.includes(facility.id)}
                                onCheckedChange={(checked) => {
                                  // The onClick on the parent div handles this, 
                                  // but we prevent propagation to avoid double triggering if necessary.
                                }}
                                className="border-[#C72030] data-[state=checked]:bg-[#C72030]"
                              />
                              <span className="text-sm text-gray-700 font-medium">{facility.name}</span>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover> */}
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="takeover-condition" className="text-gray-900 font-medium"> Property Takeover Condition</Label>
                  <Select
                    value={formData.property_takeover_condition_id}
                    onValueChange={(value) => setFormData({ ...formData, property_takeover_condition_id: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {takeoverConditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id.toString()}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-900 font-medium">Country *</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) => {
                      const selectedCountry = countries.find(c => c.id.toString() === value);
                      setFormData({
                        ...formData,
                        country_id: value,
                        country: selectedCountry?.name || '',
                        state_id: '',
                        state: '',
                        region_id: '',
                        region: '',
                        zone_id: ''
                      });
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-900 font-medium">State *</Label>
                  <Select
                    value={formData.state_id}
                    onValueChange={(value) => {
                      const selectedState = states.find(s => s.id.toString() === value);
                      setFormData({
                        ...formData,
                        state_id: value,
                        state: selectedState?.name || '',
                        region_id: '',
                        region: '',
                        zone_id: ''
                      });
                    }}
                    disabled={!formData.country_id}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder={!formData.country_id ? "Select country first" : "Select state"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-gray-900 font-medium">Region *</Label>
                  <Select
                    value={formData.region_id}
                    onValueChange={(value) => {
                      const selectedRegion = regions.find(r => r.id.toString() === value);
                      setFormData({
                        ...formData,
                        region_id: value,
                        region: selectedRegion?.name || '',
                        zone_id: ''
                      });
                    }}
                    disabled={!formData.state_id}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder={!formData.state_id ? "Select state first" : "Select region"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone" className="text-gray-900 font-medium">Zone *</Label>
                  <Select
                    value={formData.zone_id}
                    onValueChange={(value) => setFormData({ ...formData, zone_id: value })}
                    disabled={!formData.region_id}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder={!formData.region_id ? "Select region first" : "Select zone"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-900 font-medium">City *</Label>
                  <Select
                    value={formData.city_id}
                    onValueChange={(value) => {
                      const selectedCity = cities.find(
                        (city) => city.id.toString() === value
                      );

                      setFormData({
                        ...formData,
                        city_id: value,
                        city: selectedCity?.name || "",
                      });
                    }}
                    disabled={!formData.zone_id}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder={!formData.zone_id ? "Select zone first" : "Select city"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {cities.map((circle) => (
                        <SelectItem key={circle.id} value={circle.id.toString()}>
                          {circle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="circle" className="text-gray-900 font-medium">Circle *</Label>
                  <Select
                    value={formData.circle_id}
                    onValueChange={(value) => {
                      const selectedCircle = circles.find(
                        (circle) => circle.id.toString() === value
                      );

                      setFormData({
                        ...formData,
                        circle_id: value,
                        circle: selectedCircle?.name || "",
                      });
                    }}
                    disabled={!formData.city_id}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder={!formData.city_id ? "Select city first" : "Select circle"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {circles.map((circle) => (
                        <SelectItem key={circle.id} value={circle.id.toString()}>
                          {circle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-900 font-medium">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter complete address"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code" className="text-gray-900 font-medium">Pin Code</Label>
                  <Input
                    id="postal-code"
                    placeholder="Enter pin code"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leasable-area" className="text-gray-900 font-medium">Chargable Area (sq ft)</Label>
                  <Input
                    id="leasable-area"
                    type="number"
                    placeholder="Enter leasable area"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.leasable_area}
                    onChange={(e) => setFormData({ ...formData, leasable_area: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carpet-area" className="text-gray-900 font-medium">Carpet Area (sq ft)</Label>
                  <Input
                    id="carpet-area"
                    type="number"
                    placeholder="Enter carpet area"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.carpet_area}
                    onChange={(e) => setFormData({ ...formData, carpet_area: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area-efficiency" className="text-gray-900 font-medium">Area Efficiency (%)</Label>
                  <Input
                    id="area-efficiency"
                    placeholder="Auto-calculated"
                    className="bg-gray-100 border-gray-300 text-gray-900"
                    value={formData.area_efficiency}
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-500">Automatically calculated as (Carpet Area / Leasable Area) × 100</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="built-year" className="text-gray-900 font-medium">Built Year</Label>
                  <Input
                    id="built-year"
                    type="number"
                    placeholder="e.g., 2020"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.built_year}
                    onChange={(e) => setFormData({ ...formData, built_year: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership-type" className="text-gray-900 font-medium">Owned/Leased</Label>
                  <Select
                    value={formData.ownership_type}
                    onValueChange={(value) => setFormData({ ...formData, ownership_type: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select ownership" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Leased">Leased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ites-certification" className="text-gray-900 font-medium">ITES Certification</Label>
                  <Select
                    value={formData.ites_certification}
                    onValueChange={(value) => setFormData({ ...formData, ites_certification: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="ITES Certified?" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.ites_certification === 'Yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="ites-valid-till" className="text-gray-900 font-medium">ITES Certificate is Valid till</Label>
                    <Input
                      id="ites-valid-till"
                      type="date"
                      className="bg-white border-gray-300 text-gray-900"
                      value={formData.ites_valid_till}
                      onChange={(e) => setFormData({ ...formData, ites_valid_till: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900 font-medium">Remarks</Label>
                <textarea
                  id="description"
                  placeholder="Enter property Remarks"
                  className="w-full min-h-[80px] px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Amenities - Full Width */}
              {/* <div className="space-y-2">
                <Label className="text-gray-900 font-medium"> Common Amenities</Label>
                <p className="text-xs text-gray-600">Select amenities available at this property</p>
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-md">
                  {['Gym', 'Gaming Zone', 'Creche', `common cafeteria`].map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
                          } else {
                            setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
                          }
                        }}
                        className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Documents & Images */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-t pt-4">
                  <Label className="text-gray-900 font-semibold text-lg">Documents & Images</Label>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Property Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Property Image</Label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-[#C72030] bg-gray-50 cursor-pointer text-center"
                      onClick={() => document.getElementById('property_image_input')?.click()}
                    >
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium font-outfit">Click to upload Property Image</p>
                      <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG (Max 5MB)</p>
                      <input
                        id="property_image_input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'site_image')}
                      />
                    </div>
                  </div>
                </div>

                {/* Document Previews */}
                {selectedDocuments.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    {selectedDocuments.map((doc, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-md p-2 bg-white flex flex-col items-center">
                        <button
                          onClick={() => removeDocument(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="h-24 w-full flex items-center justify-center overflow-hidden rounded bg-gray-50 mb-2">
                          {doc.document_type === 'site_image' ? (
                            <img src={doc.preview} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <FileText className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 truncate w-full text-center font-medium">{doc.file_name}</p>
                        <Badge variant="outline" className="text-[8px] py-0 px-1 mt-1 uppercase">{doc.document_type.replace('_', ' ')}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingProperty ? 'Update Property' : 'Save Property')}
              </Button>
            </div>
          </DialogContent>
        </Dialog >
      </div >

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Properties Database</CardTitle>
              <CardDescription>Complete inventory of all properties in the system</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className="text-center py-8 text-gray-500">Loading properties...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Details</TableHead>
                  <TableHead>Location & Type</TableHead>
                  <TableHead>Facilities & Tech</TableHead>
                  <TableHead>Area & Year</TableHead>
                  {/* <TableHead>Amenities</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{property.name}</p>
                        <p className="text-sm text-gray-500">ID: {property.id}</p>
                        {property.description && (
                          <p className="text-xs text-gray-500">{property.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center text-sm mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-32">{renderValue(property.address)}</span>
                        </div>
                        {property.city && (
                          <p className="text-xs text-gray-500">{renderValue(property.city)}, {renderValue(property.state)}</p>
                        )}
                        <Badge variant="outline">{renderValue(property.property_type)}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center text-sm font-medium mb-1">
                          <Building className="h-3 w-3 mr-1 text-blue-600" />
                          <span>{property.pms_site_facilities?.length || 0} Facilities</span>
                        </div>
                        {property.circle && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Layers className="h-3 w-3 mr-1" />
                            <span>Circle: {renderValue(property.circle)}</span>
                          </div>
                        )}
                        {(property.property_takeover_condition_name || property as any).property_takeover_condition?.name && (
                          <div className="mt-1">
                            <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-amber-100 italic">
                              {property.property_takeover_condition_name || (property as any).property_takeover_condition?.name}
                            </Badge>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {property.ownership_type && (
                            <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700 bg-blue-50/30">
                              {property.ownership_type}
                            </Badge>
                          )}
                          {property.ites_certification === 'Yes' && (
                            <Badge variant="outline" className="text-[10px] border-green-200 text-green-700 bg-green-50/30">
                              ITES Certified {property.ites_valid_till ? `(Till: ${new Date(property.ites_valid_till).toLocaleDateString()})` : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">Area: {renderValue(property.leasable_area)} sq ft</p>
                        <p className="text-xs text-gray-500">Built: {renderValue(property.built_year)}</p>
                        {property.carpet_area && (
                          <p className="text-xs text-gray-500">Carpet: {renderValue(property.carpet_area)} sq ft</p>
                        )}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {property.amenities && property.amenities.length > 0 ? (
                          property.amenities.slice(0, 3).map((amenity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {renderValue(amenity)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No amenities</span>
                        )}
                        {property.amenities && property.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{property.amenities.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewProperty(property)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditProperty(property)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteProperty(property)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


    </div >
  );
};

export default PropertiesMaster;
