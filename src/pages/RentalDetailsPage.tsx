import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { MapPin, Building2, Calendar, DollarSign, FileText, AlertTriangle, ArrowLeft, Edit, User } from 'lucide-react';

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
        {/* Property & Landlord Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5 text-gray-600" />
              Property & Landlord Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Property:</p>
                    <p className="font-medium text-gray-900">{lease.property?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600 mt-1">{lease.property?.address || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{lease.property?.property_type || lease.lease_type || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Location:</p>
                    <p className="text-sm text-gray-900">
                      {lease.property?.city || 'N/A'}, {lease.property?.state || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">{lease.property?.postal_code || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Status:</p>
                    <Badge className={`${
                      lease.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lease.status || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Landlord Details */}
              {lease.property?.landlord && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-1 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Landlord:</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {lease.property.landlord.contact_person || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{lease.property.landlord.company_name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Contact:</p>
                      <p className="text-sm text-gray-900">{lease.property.landlord.email || 'N/A'}</p>
                      <p className="text-sm text-gray-600">{lease.property.landlord.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {(lease.property.landlord.pan || lease.property.landlord.gst) && (
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Tax Details:</p>
                        {lease.property.landlord.pan && (
                          <p className="text-sm text-gray-900">PAN: {lease.property.landlord.pan}</p>
                        )}
                        {lease.property.landlord.gst && (
                          <p className="text-sm text-gray-600">GST: {lease.property.landlord.gst}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
            </div>
          </CardContent>
        </Card>

        {/* Escalation & Penalty Settings Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Escalation & Penalty Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Escalation Type</p>
                <p className="font-medium text-gray-900">{lease.escalation_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Escalation Interval</p>
                <p className="font-medium text-gray-900">{lease.escalation_interval || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Escalation Percentage (%)</p>
                <p className="font-medium text-gray-900">{lease.annual_escalation_percentage || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Penalty Applicable</p>
                <p className="font-medium text-gray-900">{lease.penalty_applicable ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Penalty Percentage (%)</p>
                <p className="font-medium text-gray-900">{lease.penalty_percentage || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Interest Applicable</p>
                <p className="font-medium text-gray-900">{lease.interest_applicable ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Interest Percentage (%)</p>
                <p className="font-medium text-gray-900">{lease.interest_percentage || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-gray-600" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Purpose of Agreement</p>
                <p className="font-medium text-gray-900">{lease.purpose_of_agreement || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Stamp Duty Sharing</p>
                <p className="font-medium text-gray-900">{lease.stamp_duty_sharing || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Agreement Sign Off Date</p>
                <p className="font-medium text-gray-900">{lease.agreement_sign_off_date ? new Date(lease.agreement_sign_off_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rent Commencement Date</p>
                <p className="font-medium text-gray-900">{lease.rent_commencement_date ? new Date(lease.rent_commencement_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Rent Free Period (Days)</p>
                <p className="font-medium text-gray-900">{lease.rent_free_period_days || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Lock-in Period (Days)</p>
                <p className="font-medium text-gray-900">{lease.lock_in_period_days || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signing Authority Card */}
        {lease.signing_authorities && lease.signing_authorities.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5 text-gray-600" />
                Signing Authority
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lease.signing_authorities.map((auth: any) => (
                  <div key={auth.id} className="space-y-2 p-4 border border-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{auth.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-1">Designation</p>
                    <p className="font-medium text-gray-900">{auth.designation || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{auth.email || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{auth.phone_number || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-1">Authority Type</p>
                    <p className="font-medium text-gray-900">{auth.authority_type || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mb-1">Signed At</p>
                    <p className="font-medium text-gray-900">{auth.signed_at ? new Date(auth.signed_at).toLocaleDateString() : 'N/A'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Card */}
        {lease.documents && lease.documents.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm ">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-gray-600" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {lease.documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.document_type} • {(doc.file_size / 1024).toFixed(0)} KB
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <a
                            href={doc.url || doc.file_url}
                            download={doc.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-[#C72030] hover:text-[#A01825] font-medium"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#C72030] hover:text-[#A01825] hover:bg-[#C72030]/10 h-auto p-0"
                            onClick={() => window.open(doc.url || doc.file_url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
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

        {/* Notice Terms Card */}
        {lease.notice_terms && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-gray-600" />
                Notice Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">From Landlord (Days)</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.from_landlord_days ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">From VIL (Days)</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.from_vil_days ?? 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Termination Rights with LESSEE</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.termination_rights_lessee || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Termination Rights with LESSOR</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.termination_rights_lessor || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Handover Condition</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.handover_condition || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                  <p className="font-medium text-gray-900">{lease.notice_terms.additional_notes || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
