import React, { useEffect, useState } from 'react';
import { PageContainer, StatsGrid, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { MapPin, Building2, Calendar, DollarSign, FileText, AlertTriangle, ArrowLeft, Edit, User } from 'lucide-react';
import { Heading } from '@/components/ui/typography';

export default function RentalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customFeilds, setCustomFeilds] = useState({})

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'object') return val.name || val.id?.toString() || JSON.stringify(val);
    return val.toString();
  };

  useEffect(() => {
    const fetchLeaseDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getAuth(`/leases/${id}`);
        setLease(data);
        setCustomFeilds(data.custom_fields || {})
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
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading lease details...</p>
        </div>
      </PageContainer>
    );
  }

  if (!lease) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-500">Lease not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </PageContainer>
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
    <PageContainer>
      <PageHeader
        title="Lease Details"
        backTo="/rental-dashboard"
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{lease.lease_number}</span>
            {lease.circle?.name && (
              <span className="border-l border-gray-300 pl-3">Circle: {lease.circle.name}</span>
            )}
            {lease.sap_number && (
              <span className="border-l border-gray-300 pl-3 font-medium text-brand">
                SAP ID: {lease.sap_number}
              </span>
            )}
          </span>
        }
        actions={
          <Button
            onClick={() => navigate(`/rental/edit/${id}`)}
            className="fm-button-fix fm-button-brand px-6 py-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Lease
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property & Landlord Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
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
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Property:</p>
                    <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.property?.name)}</p>
                    <p className="mt-1 text-[13px] text-brand-text-light">Address: {renderValue(lease.property?.address)}</p>
                    <p className="text-[13px] text-brand-text-light">City: {renderValue(lease.property?.pms_city?.name || lease.property?.city)}</p>
                    <p className="text-[13px] text-brand-text-light">Zone: {renderValue(lease.property?.zone?.name || lease.property?.zone)}</p>
                    <p className="text-[13px] text-brand-text-light">State: {renderValue(lease.property?.state)}</p>
                    <p className="text-[13px] text-brand-text-light">Country: {renderValue(lease.property?.country)}</p>
                    <p className="text-[13px] text-brand-text-light">Pin Code: {renderValue(lease.property?.postal_code)}</p>
                    <p className="text-[13px] text-brand-text-light">Built Year: {renderValue(lease.property?.built_year)}</p>
                    <p className="mt-1 text-[14px] font-medium text-brand-text">{renderValue(lease.property?.property_type || lease.lease_type)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Facility Details:</p>
                    <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Facility type:</span> {renderValue(lease.property?.pms_site_facility?.facility_type?.name)}</p>
                    <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Remarks:</span> {renderValue(lease.property?.description)}</p>
                    <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Owned/Leased:</span> {renderValue(lease.property?.ownership_type)}</p>
                    <p className="text-[14px] font-medium text-brand-text">
                      <span className="text-brand-text-light">ITES Certification:</span> {lease.property?.ites_certified ? 'Yes' : 'No'}
                      {lease.property?.ites_certified && lease.property?.ites_certified_till && (
                        <span className="text-gray-500 ml-2">(Valid till: {new Date(lease.property.ites_certified_till).toLocaleDateString()})</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Area Details:</p>
                    <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Chargable Area:</span> {renderValue(lease.property?.leasable_area)} sq ft</p>
                    {lease.property?.carpet_area && (
                      <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Carpet Area:</span> {renderValue(lease.property.carpet_area)} sq ft</p>
                    )}
                    {lease.property?.area_efficiency && (
                      <p className="text-[14px] font-medium text-brand-text"><span className="text-brand-text-light">Efficiency:</span> {renderValue(lease.property.area_efficiency)}%</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Landlord Details */}
              <div className="space-y-4">
                {lease.property?.landlord && (
                  <>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="flex-1">
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Landlord / Lessor Details:</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {renderValue(lease.property.landlord.contact_person)}
                        </p>
                        <p className="mt-1 text-[13px] text-brand-text-light">Company Name: {renderValue(lease.property.landlord.company_name)}</p>
                        <p className="text-[13px] text-brand-text-light">Email: {renderValue(lease.property.landlord.email)}</p>
                        <p className="text-[13px] text-brand-text-light">Phone No: {renderValue(lease.property.landlord.phone)}</p>
                        {lease.property.landlord.status && (
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[13px] text-brand-text-light">Status:</p>
                            <Badge variant="outline" className={`${lease.property.landlord.status.toLowerCase() === 'active'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                              } text-[10px] px-1.5 py-0`}>
                              {lease.property.landlord.status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="flex-1">
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Tax & Identity:</p>
                        {lease.property.landlord.pan && (
                          <p className="text-[14px] font-medium text-brand-text">PAN No: {renderValue(lease.property.landlord.pan)}</p>
                        )}
                        {lease.property.landlord.gst && (
                          <p className="text-[14px] font-medium text-brand-text">GST: {renderValue(lease.property.landlord.gst)}</p>
                        )}
                        {lease.property.landlord.aadhaar_number && (
                          <p className="text-[14px] font-medium text-brand-text">Aadhar No: {renderValue(lease.property.landlord.aadhaar_number)}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Lease Status:</p>
                    <Badge className={`${lease.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {lease.status || 'N/A'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Amenities:</p>
                    <p className="text-[14px] font-medium text-brand-text">
                      {lease.property?.amenities?.map((amenity: any) => amenity?.name)?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 text-gray-600" />
                  <div className="flex-1">
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Compliences:</p>
                    <p className="text-[14px] font-medium text-brand-text">
                      {lease.property?.property_compliances?.map((compliance: any) => compliance?.compliance_requirement?.title)?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
              <User className="h-5 w-5 text-gray-600" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lease.tenant ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="flex-1">
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Company Details:</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.tenant.company_name)}</p>
                        <p className="mt-1 text-[13px] text-brand-text-light">Tenant Type: {renderValue(lease.tenant.tenant_type)}</p>
                        <p className="text-[13px] text-brand-text-light">Company Type: {renderValue(lease.tenant.company_type)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-gray-600" />
                      <div className="flex-1">
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Contact Person:</p>
                        <p className="font-medium text-gray-900 capitalize">{renderValue(lease.tenant.contact_person)}</p>
                        <p className="mt-1 text-[13px] text-brand-text-light">Email: {renderValue(lease.tenant.email)}</p>
                        <p className="text-[13px] text-brand-text-light">Phone: {renderValue(lease.tenant.phone)}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  No tenant information available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rent Breakdown Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Rent Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <p className="text-gray-600">Total Monthly Rent:</p>
                <p className="text-xl font-bold text-[#C72030]">₹{(parseFloat(lease.basic_rent || 0) + parseFloat(lease.gst_amount || 0) - parseFloat(lease.tds_amount || 0)).toLocaleString()}</p>
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

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Chargable Area:</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.area || lease.notice_terms?.rent_area || lease.property?.leasable_area)} sq ft</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Rate per Sq Ft:</p>
                  <p className="text-[14px] font-medium text-brand-text">₹{parseFloat(lease.rate_per_sqft || 0).toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                  <p className="text-gray-900 font-medium">Basic Rent:</p>
                  <p className="font-bold text-gray-900">₹{parseFloat(lease.basic_rent || 0).toLocaleString()}</p>
                </div>

                {lease.gst_applicable && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-600">GST (Applicable):</p>
                      <p className="text-[14px] font-medium text-brand-text">₹{parseFloat(lease.gst_amount || 0).toLocaleString()}</p>
                    </div>
                    {(parseFloat(lease.cgst_percentage || 0) > 0 || parseFloat(lease.sgst_percentage || 0) > 0 || parseFloat(lease.igst_percentage || 0) > 0) && (
                      <div className="pl-4 space-y-1 mt-1 border-l-2 border-gray-100">
                        {parseFloat(lease.cgst_percentage || 0) > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>CGST ({lease.cgst_percentage}%):</span>
                            <span>₹{((parseFloat(lease.basic_rent || 0) * parseFloat(lease.cgst_percentage)) / 100).toLocaleString()}</span>
                          </div>
                        )}
                        {parseFloat(lease.sgst_percentage || 0) > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>SGST ({lease.sgst_percentage}%):</span>
                            <span>₹{((parseFloat(lease.basic_rent || 0) * parseFloat(lease.sgst_percentage)) / 100).toLocaleString()}</span>
                          </div>
                        )}
                        {parseFloat(lease.igst_percentage || 0) > 0 && (
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>IGST ({lease.igst_percentage}%):</span>
                            <span>₹{((parseFloat(lease.basic_rent || 0) * parseFloat(lease.igst_percentage)) / 100).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {parseFloat(lease.tds_amount || 0) > 0 && (
                  <div className="flex justify-between text-sm py-2">
                    <p className="text-gray-600">TDS Deduction ({lease.tds_percentage}%):</p>
                    <p className="font-medium text-red-600">-₹{parseFloat(lease.tds_amount).toLocaleString()}</p>
                  </div>
                )}

                <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                  <p className="text-gray-600">Security Deposit:</p>
                  <p className="text-[14px] font-medium text-brand-text">₹{parseFloat(lease.security_deposit || 0).toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Maintenance Charges:</p>
                  <p className="text-[14px] font-medium text-brand-text">₹{parseFloat(lease.maintenance_charges || 0).toLocaleString()}</p>
                </div>
              </div>

              {parseFloat(lease.annual_escalation_percentage || 0) > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-blue-700 font-medium">Next Escalation ({lease.annual_escalation_percentage}%):</p>
                    <p className="text-md font-bold text-blue-800">₹{escalatedRent.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

        </Card>

        {/* Lease Information Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
              <Calendar className="h-5 w-5 text-gray-600" />
              Lease Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Agreement Type</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.terms_conditions || lease.lease_type)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Takeover Condition</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.property_takeover_condition?.name)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Start Date</p>
                <p className="text-[14px] font-medium text-brand-text">
                  {lease.start_date ? new Date(lease.start_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">End Date</p>
                <p className="text-[14px] font-medium text-brand-text">
                  {lease.end_date ? new Date(lease.end_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Time Remaining</p>
                <p className={`text-brand-body-1 font-bold ${calculateTimeRemaining() === 'Expired' ? 'text-red-600' : 'text-gray-900'
                  }`}>
                  {calculateTimeRemaining()}
                </p>
                <p className="mt-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">YY:MM:DD</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Due Date</p>
                <p className="text-[14px] font-medium text-brand-text">{lease.rent_due_date ? `${renderValue(lease.rent_due_date)}th of every month` : 'N/A'}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Payment Mode</p>
                <p className="font-medium text-gray-900 capitalize">{renderValue(lease.rent_payment_type || 'Advance')}</p>
              </div>
            </div>
          </CardContent>

        </Card>



        {/* Escalation & Penalty Settings Card */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Escalation & Penalty Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Escalation Frequency </p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.escalation_type)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Escalation Interval</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.escalation_interval)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Escalation Percentage (%)</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.annual_escalation_percentage)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Penalty Applicable</p>
                <p className="text-[14px] font-medium text-brand-text">{lease.penalty_applicable ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Penalty Percentage (%)</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.penalty_percentage)}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Interest Applicable</p>
                <p className="text-[14px] font-medium text-brand-text">{lease.interest_applicable ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Interest Percentage (%)</p>
                <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.interest_percentage)}</p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Agreement Services Card */}
        {lease.agreement_services && lease.agreement_services.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
                <FileText className="h-5 w-5 text-gray-600" />
                Agreement Services
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {lease.agreement_services.map((service: any, index: number) => (
                  <div key={service.id || index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#C72030] hover:bg-[#C72030] text-white capitalize">
                          {renderValue(service.service_type)}
                        </Badge>
                        <span className="text-[14px] font-medium text-brand-text">{renderValue(service.provider_name)}</span>
                      </div>
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <StatsGrid>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Billing Details</p>
                        <p className="text-[14px] font-medium text-brand-text">Deposit: <span className="font-medium">₹{parseFloat(service.deposit || 0).toLocaleString()}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">Monthly Charge: <span className="font-medium">₹{parseFloat(service.fixed_monthly_charge || 0).toLocaleString()}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">Rate/sqft: <span className="font-medium">₹{parseFloat(service.rate_per_sqft || 0).toLocaleString()}</span></p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Payment Schedule</p>
                        <p className="text-[14px] font-medium text-brand-text">Cycle: <span className="font-medium capitalize">{renderValue(service.billing_cycle)}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">Due Date: <span className="font-medium">{renderValue(service.due_date)}th</span></p>
                        <p className="text-[14px] font-medium text-brand-text">Mode: <span className="font-medium capitalize">{renderValue(service.payment_mode)?.replace(/_/g, ' ')}</span></p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">IDs & Automation</p>
                        <p className="text-[14px] font-medium text-brand-text">Consumer #: <span className="font-medium">{renderValue(service.consumer_number)}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">SAP Code: <span className="font-medium">{renderValue(service.sap_vendor_code)}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">Automated: <span className="font-medium">{service.payment_automated ? 'Yes' : 'No'}</span></p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Accounting</p>
                        <p className="text-[14px] font-medium text-brand-text">Cost Center: <span className="font-medium">{renderValue(service.cost_center)}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">GL Code: <span className="font-medium">{renderValue(service.gl_code)}</span></p>
                        <p className="text-[14px] font-medium text-brand-text">IO Code: <span className="font-medium">{renderValue(service.io_code)}</span></p>
                      </div>
                    </StatsGrid>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Internal Contact</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(service.company_contact_name)}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">{renderValue(service.company_contact_email)} | {renderValue(service.company_contact_mobile)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Landlord Contact</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(service.landlord_contact_name)}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">{renderValue(service.landlord_contact_email)} | {renderValue(service.landlord_contact_mobile)}</p>
                      </div>
                    </div>
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
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
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
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(doc.name)}</p>
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                          {renderValue(doc.document_type)} • {(doc.file_size / 1024).toFixed(0)} KB
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          {/* <a
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
                          </a> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#C72030] hover:text-[#A01825] hover:bg-[#C72030]/10 h-auto p-0"
                            onClick={() => window.open(`https://rental-uat.lockated.com/${doc.url}`, '_blank')}
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
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
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
                      <p className="font-semibold text-gray-900 capitalize">{renderValue(parking.vehicle_type)}</p>
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

        {/* Signing Authority Card */}
        {lease.signing_authorities && lease.signing_authorities.length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
                <User className="h-5 w-5 text-gray-600" />
                Signing Authority Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lease.signing_authorities.map((auth: any) => (
                  <div key={auth.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Name</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(auth.name)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Designation</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(auth.designation)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Email</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(auth.email)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Phone</p>
                        <p className="text-[14px] font-medium text-brand-text">{renderValue(auth.phone_number)}</p>
                      </div>
                      {auth.aadhar_number && (
                        <div>
                          <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Aadhar Number</p>
                          <p className="text-[14px] font-mono text-brand-text">{renderValue(auth.aadhar_number)}</p>
                        </div>
                      )}
                      {auth.pan_number && (
                        <div>
                          <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">PAN Number</p>
                          <p className="text-[14px] font-mono text-brand-text">{renderValue(auth.pan_number)}</p>
                        </div>
                      )}
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Type</p>
                        <p className="text-sm text-gray-900 capitalize">{renderValue(auth.authority_type)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Sign Date</p>
                        <p className="text-[14px] font-medium text-brand-text">{auth.signed_at ? new Date(auth.signed_at).toLocaleDateString() : 'N/A'}</p>
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
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
                <FileText className="h-5 w-5 text-gray-600" />
                Notice Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">From Landlord (Days)</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.from_landlord_days)}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">From VIL (Days)</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.from_vil_days)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Termination Rights with LESSEE</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.termination_rights_lessee)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Termination Rights with LESSOR</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.termination_rights_lessor)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Handover Condition</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.handover_condition)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Additional Notes</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.notice_terms.additional_notes)}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Property Type</p>
                  <p className="font-medium text-[#c72030]">{renderValue(lease.notice_terms?.property_type)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Details (Detailed) */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Detailed Financial & Agreement Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Dates & Periods</h4>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Commencement Date</p>
                  <p className="text-[14px] font-medium text-brand-text">{lease.rent_commencement_date ? new Date(lease.rent_commencement_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Rent-free Period</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.rent_free_period_days)} Days</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Lock-in Period</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.lock_in_period_days)} Days</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Agreement Metadata</h4>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Agreement Sign-off Date</p>
                  <p className="text-[14px] font-medium text-brand-text">{lease.agreement_sign_off_date ? new Date(lease.agreement_sign_off_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Stamp Duty Sharing</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.stamp_duty_sharing)}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Purpose of Agreement</p>
                  <p className="text-[14px] font-medium text-brand-text">{renderValue(lease.purpose_of_agreement)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Late Payment Terms</h4>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Late Penalty</p>
                  <p className="text-[14px] font-medium text-brand-text">{lease.penalty_applicable ? `${lease.penalty_percentage}%` : 'Not Applicable'}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Late Interest</p>
                  <p className="text-[14px] font-medium text-brand-text">{lease.interest_applicable ? `${lease.interest_percentage}% per month` : 'Not Applicable'}</p>
                </div>
                <div>
                  <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Contract Value</p>
                  <p className="text-sm font-bold text-[#C72030]">₹{calculateTotalContractValue().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Custom Fields Card */}
        {Object.keys(customFeilds).length > 0 && (
          <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold text-brand-text">
                <FileText className="h-5 w-5 text-gray-600" />
                Additional Details (Custom Fields)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(customFeilds).map(([key, value]) => (
                  <div key={key}>
                    <p className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">{key}</p>
                    <p className="text-[14px] font-medium text-brand-text">{renderValue(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </PageContainer>
  );
}
