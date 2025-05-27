
import React from 'react';
import InvoiceManagement from '@/components/Dashboard/InvoiceManagement';

const Invoicing = () => {
  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Invoice Management</h1>
          <p className="text-[#1a1a1a]/70 mt-2">
            Create, manage, and track invoices for your properties
          </p>
        </div>
      </div>

      <InvoiceManagement />
    </div>
  );
};

export default Invoicing;
