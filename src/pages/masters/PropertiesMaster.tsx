
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, MapPin, Home, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postAuth, getAuth, patchAuth } from '@/lib/api';
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
  carpet_area: string;
  area_efficiency: string;
  created_at: string;
  updated_at: string;
}

const PropertiesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();

  // Dropdown data state
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    landlord_id: '',
    name: '',
    property_type: '',
    country_id: '',
    country: '',
    state_id: '',
    state: '',
    region_id: '',
    region: '',
    zone_id: '',
    address: '',
    city: '',
    postal_code: '',
    leasable_area: '',
    carpet_area: '',
    area_efficiency: '',
    built_year: '',
    description: '',
    amenities: [] as string[]
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
    fetchCountries();
  }, []);

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

  const handleViewProperty = (property) => {
    // Navigate to property details page - using a mock ID for now
    const mockId = property.id === 'P001' ? '1' : property.id === 'P002' ? '2' : '3';
    navigate(`/properties/${mockId}`);
  };

  const handleEditProperty = async (property: Property) => {
    try {
      setIsLoading(true); // Reuse the existing loading state or create a new one if preferred, but usually dialog loading logic is separate. 
      // Ideally show a toast or loader. Since we might not want to block the UI immediately, prompt feedback is good.
      // But here I'll just fetch.

      const detailedData = await getAuth(`/pms/sites/${property.id}`);
      const siteData = detailedData?.site || detailedData; // Handle potentially nested response if API wraps it in { site: ... }

      // Pre-fill the form with fresh API data
      setFormData({
        landlord_id: siteData.landlord_id?.toString() || '',
        name: siteData.name || '',
        property_type: siteData.property_type || '',
        country_id: '', // Logic to match country ID/Names would go here if needed, or rely on cascading effect if you implement it fully
        country: siteData.country || '',
        state_id: '',
        state: siteData.state || '',
        region_id: '',
        region: '',
        zone_id: siteData.zone_id?.toString() || '',
        address: siteData.address || '',
        city: siteData.city || '',
        postal_code: siteData.postal_code || '',
        leasable_area: siteData.leasable_area?.toString() || '',
        carpet_area: siteData.carpet_area?.toString() || '',
        area_efficiency: siteData.area_efficiency?.toString() || '',
        built_year: siteData.built_year?.toString() || '',
        description: siteData.description || '',
        amenities: siteData.amenities || []
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

  const handleDeleteProperty = (property) => {
    // Add delete functionality here
    console.log('Delete property:', property.id);
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
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          property_type: formData.property_type,
          description: formData.description,
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
        country_id: '',
        country: '',
        state_id: '',
        state: '',
        region_id: '',
        region: '',
        zone_id: '',
        address: '',
        city: '',
        postal_code: '',
        leasable_area: '',
        carpet_area: '',
        area_efficiency: '',
        built_year: '',
        description: '',
        amenities: []
      });
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Master</h1>
          <p className="text-gray-600">Central property database with all property details</p>
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
                    <SelectItem value="1">Suresh Enterprises</SelectItem>
                    <SelectItem value="2">Sharma Properties</SelectItem>
                    <SelectItem value="3">Metro Real Estate</SelectItem>
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
                    value={formData.property_type}
                    onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="city" className="text-gray-900 font-medium">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code" className="text-gray-900 font-medium">Postal Code</Label>
                  <Input
                    id="postal-code"
                    placeholder="Enter postal code"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leasable-area" className="text-gray-900 font-medium">Leasable Area (sq ft)</Label>
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
              </div>

              {/* Description - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900 font-medium">Description</Label>
                <textarea
                  id="description"
                  placeholder="Enter property description"
                  className="w-full min-h-[80px] px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Amenities - Full Width */}
              <div className="space-y-2">
                <Label className="text-gray-900 font-medium">Amenities</Label>
                <p className="text-xs text-gray-600">Select amenities available at this property</p>
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-md">
                  {['Lift', 'Power Backup', 'Parking', 'Security', 'Water Supply', 'Wi-Fi', 'CCTV', 'Fire Safety', 'Garden'].map((amenity) => (
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
                  <TableHead>Area & Year</TableHead>
                  <TableHead>Amenities</TableHead>
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
                          <span className="truncate max-w-32">{property.address}</span>
                        </div>
                        {property.city && (
                          <p className="text-xs text-gray-500">{property.city}, {property.state}</p>
                        )}
                        <Badge variant="outline">{property.property_type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">Area: {property.leasable_area} sq ft</p>
                        <p className="text-xs text-gray-500">Built: {property.built_year}</p>
                        {property.carpet_area && (
                          <p className="text-xs text-gray-500">Carpet: {property.carpet_area} sq ft</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {property.amenities && property.amenities.length > 0 ? (
                          property.amenities.slice(0, 3).map((amenity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No amenities</span>
                        )}
                        {property.amenities && property.amenities.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{property.amenities.length - 3}</Badge>
                        )}
                      </div>
                    </TableCell>
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
