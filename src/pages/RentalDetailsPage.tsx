import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { MapPin, Building2, Calendar, DollarSign, FileText, AlertTriangle, ArrowLeft, Edit } from 'lucide-react';

export default function RentalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaseDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getAuth(`/leases/${id}`);
        setLease(data);
      } catch (error) {
        console.error('Failed to fetch lease details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 w-full bg-white rounded-lg shadow-sm">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-8 w-full bg-white rounded-lg shadow-sm">
        <div className="text-center py-12">
          <p className="text-gray-500">Lease not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const calculateTimeRemaining = () => {
    if (!lease.end_date) return 'N/A';
    const endDate = new Date(lease.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    
    let result = [];
    if (years > 0) result.push(`${years}Y`);
    if (months > 0) result.push(`${months}M`);
    if (days > 0) result.push(`${days}D`);
    
    return result.join(' ') || '0 days';
  };

  const calculateTotalContractValue = () => {
    if (!lease.start_date || !lease.end_date || !lease.monthly_rent) return 0;
    const start = new Date(lease.start_date);
    const end = new Date(lease.end_date);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months * parseFloat(lease.monthly_rent || lease.basic_rent || 0);
  };

  const isPaymentOverdue = () => {
    // This is placeholder logic - adjust based on actual payment tracking
    return false;
  };

  const monthlyRent = parseFloat(lease.monthly_rent || lease.basic_rent || 0);
  const escalatedRent = monthlyRent * (1 + parseFloat(lease.annual_escalation_percentage || 0) / 100);

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lease Details</h1>
            <p className="text-gray-500">{lease.lease_number}</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/rental/edit/${id}`)}
          className="bg-[#C72030] hover:bg-[#A01825] text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5 text-gray-600" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Property Name</p>
                <p className="font-medium text-gray-900">{lease.property?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Property Type</p>
                <p className="font-medium text-gray-900">{lease.property?.property_type || lease.lease_type || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="font-medium text-gray-900">{lease.property?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">City</p>
                <p className="font-medium text-gray-900">{lease.property?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Badge className={`${
                  lease.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {lease.status || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rent Breakdown Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Rent Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <p className="text-gray-600">Monthly Rent:</p>
                <p className="text-xl font-bold text-[#C72030]">₹{monthlyRent.toLocaleString()}</p>
              </div>
              
              {isPaymentOverdue() && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-700">Payment Overdue</p>
                      <p className="text-sm text-red-600 mt-1">15 days overdue</p>
                    </div>
                  </div>
                </div>
              )}
              
              {parseFloat(lease.annual_escalation_percentage || 0) > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">Escalated Rent (+{lease.annual_escalation_percentage}%):</p>
                  <p className="text-lg font-semibold text-gray-900">₹{escalatedRent.toLocaleString()}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Basic Rent:</p>
                  <p className="font-medium text-gray-900">₹{parseFloat(lease.basic_rent || 0).toLocaleString()}</p>
                </div>
                {parseFloat(lease.gst_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">GST Amount:</p>
                    <p className="font-medium text-gray-900">₹{parseFloat(lease.gst_amount).toLocaleString()}</p>
                  </div>
                )}
                {parseFloat(lease.tds_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">TDS Amount:</p>
                    <p className="font-medium text-red-600">-₹{parseFloat(lease.tds_amount).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lease Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Calendar className="h-5 w-5 text-gray-600" />
              Lease Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <p className="font-medium text-gray-900">
                  {lease.start_date ? new Date(lease.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="font-medium text-gray-900">
                  {lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Time Remaining</p>
                <p className={`text-2xl font-bold ${
                  calculateTimeRemaining() === 'Expired' ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {calculateTimeRemaining()}
                </p>
                <p className="text-xs text-gray-400 mt-1">YY:MM:DD</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Security Deposit</p>
                <p className="font-medium text-gray-900">₹{parseFloat(lease.security_deposit || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Due Date</p>
                <p className="font-medium text-gray-900">{lease.rent_due_date ? `${lease.rent_due_date} (${lease.rent_due_type || 'monthly'})` : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Terms Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Financial Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Total Contract Value</p>
                <p className="text-3xl font-bold text-[#C72030]">₹{calculateTotalContractValue().toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Based on lease period × monthly rent</p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Rate per Sq Ft:</p>
                  <p className="font-medium text-gray-900">₹{parseFloat(lease.rate_per_sqft || 0).toLocaleString()}</p>
                </div>
                {lease.rent_free_period_days > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Rent Free Period:</p>
                    <p className="font-medium text-gray-900">{lease.rent_free_period_days} days</p>
                  </div>
                )}
                {lease.lock_in_period_days > 0 && (
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Lock-in Period:</p>
                    <p className="font-medium text-gray-900">{lease.lock_in_period_days} days</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information Card */}
        {lease.tenant && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Building2 className="h-5 w-5 text-gray-600" />
                Tenant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-900">{lease.tenant.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company Name</p>
                  <p className="font-medium text-gray-900">{lease.tenant.company_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{lease.tenant.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{lease.tenant.phone || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Landlord Information Card */}
        {lease.property?.landlord && (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Building2 className="h-5 w-5 text-gray-600" />
                Landlord Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                  <p className="font-medium text-gray-900">{lease.property.landlord.contact_person || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company Name</p>
                  <p className="font-medium text-gray-900">{lease.property.landlord.company_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{lease.property.landlord.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{lease.property.landlord.phone || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Card */}
        {lease.documents && lease.documents.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-gray-600" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lease.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.document_type} • {(doc.file_size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parking Details Card */}
        {lease.parkings && lease.parkings.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Building2 className="h-5 w-5 text-gray-600" />
                Parking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {lease.parkings.map((parking: any, index: number) => (
                  <div key={parking.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-gray-600" />
                      <p className="font-semibold text-gray-900 capitalize">{parking.vehicle_type}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline" className="capitalize">{parking.parking_type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Count:</span>
                        <span className="font-medium">{parking.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Charge:</span>
                        <span className="font-medium">₹{parseFloat(parking.charge || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
