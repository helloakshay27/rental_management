import React from 'react';
import { Building2, ChevronDown, MapPin, Ruler, ShieldCheck, User } from 'lucide-react';

type RecordData = Record<string, any>;
type DetailRow = [string, unknown];

function display(value: unknown): string {
    if (value === null || value === undefined || value === '') return 'Not provided';
    if (typeof value === 'object') {
        const record = value as RecordData;
        return String(record.name ?? record.title ?? record.id ?? 'Not provided');
    }
    return String(value);
}

function measure(value: unknown, unit: string) {
    return value === null || value === undefined || value === '' ? null : `${display(value)} ${unit}`;
}

function DetailGroup({ title, icon: Icon, rows, wide = false }: {
    title: string;
    icon: typeof Building2;
    rows: DetailRow[];
    wide?: boolean;
}) {
    return (
        <section className={`rental-info-group${wide ? ' rental-info-wide' : ''}`}>
            <h3><span className="rental-info-icon"><Icon aria-hidden="true" /></span>{title}</h3>
            <dl>
                {rows.map(([label, value]) => (
                    <div key={label} className={value === null || value === undefined || value === '' ? 'rental-info-missing' : undefined}>
                        <dt>{label}</dt>
                        <dd>{display(value)}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function DetailsPanel({ title, subtitle, icon: Icon, children }: {
    title: string;
    subtitle: string;
    icon: typeof Building2;
    children: React.ReactNode;
}) {
    return (
        <details className="rental-details rental-party-details">
            <summary>
                <span className="rental-party-icon"><Icon aria-hidden="true" /></span>
                <span className="rental-party-heading"><strong>{title}</strong><span>{subtitle}</span></span>
                <ChevronDown className="rental-party-chevron" aria-hidden="true" />
            </summary>
            <div className="rental-info-grid">{children}</div>
        </details>
    );
}

export function RentalPartyDetails({ property, tenant }: { property: RecordData | null; tenant: RecordData | null }) {
    const landlord = property?.landlord;
    return (
        <>
            {property && (
                <DetailsPanel title="Property & Landlord Details" subtitle={display(property.name)} icon={Building2}>
                    <DetailGroup title="Property & Location" icon={MapPin} rows={[
                        ['Property name', property.name], ['Address', property.address],
                        ['City', property.pms_city?.name], ['Zone', property.zone?.name],
                        ['State', property.state], ['Country', property.country],
                        ['PIN code', property.postal_code], ['Built year', property.built_year],
                        ['Property type', property.property_type],
                    ]} />
                    <DetailGroup title="Landlord / Lessor" icon={User} rows={[
                        ['Company', landlord?.company_name], ['Contact person', landlord?.contact_person],
                        ['Email', landlord?.email], ['Phone', landlord?.phone],
                        ['PAN number', landlord?.pan], ['GST number', landlord?.gst],
                        ['Aadhaar number', landlord?.aadhaar_number],
                    ]} />
                    <DetailGroup title="Area Details" icon={Ruler} rows={[
                        ['Chargeable area', measure(property.leasable_area, 'sq ft')],
                        ['Carpet area', measure(property.carpet_area, 'sq ft')],
                        ['Efficiency', measure(property.area_efficiency, '%')],
                    ]} />
                    <DetailGroup title="Facility & Ownership" icon={Building2} rows={[
                        ['Facility type', property.pms_site_facility?.facility_type?.name],
                        ['Ownership', property.ownership_type], ['Remarks', property.description],
                        ['ITES certified', property.ites_certified == null ? null : property.ites_certified ? 'Yes' : 'No'],
                        ...(property.ites_certified ? [['Certificate valid until', property.ites_certified_till] as DetailRow] : []),
                    ]} />
                    <DetailGroup title="Amenities & Compliances" icon={ShieldCheck} wide rows={[
                        ['Amenities', property.amenities?.map(display).join(', ')],
                        ['Compliances', property.property_compliances?.map((item: RecordData) => item.compliance_requirement?.title).filter(Boolean).join(', ')],
                    ]} />
                </DetailsPanel>
            )}
            {tenant && (
                <DetailsPanel title="Lessee & Signing Authority" subtitle={display(tenant.full_name || tenant.name)} icon={User}>
                    <DetailGroup title="Signing Authority" icon={User} rows={[
                        ['Name', tenant.full_name], ['Designation', tenant.designation],
                        ['Email', tenant.email], ['Phone', tenant.phone || tenant.phone_number],
                    ]} />
                    <DetailGroup title="Identification" icon={ShieldCheck} rows={[
                        ['Aadhaar number', tenant.aadhar_number], ['PAN number', tenant.pan_number],
                    ]} />
                </DetailsPanel>
            )}
        </>
    );
}
