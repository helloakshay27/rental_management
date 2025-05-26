
import React from 'react';
import { Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BillingTab = () => {
  const invoices = [
    { date: 'Nov 1, 2024', amount: '₹8,250.00', status: 'Paid' },
    { date: 'Oct 1, 2024', amount: '₹8,250.00', status: 'Paid' },
    { date: 'Sep 1, 2024', amount: '₹8,250.00', status: 'Paid' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Billing & Subscription</span>
        </CardTitle>
        <CardDescription>Manage your subscription and billing information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Professional Plan</h4>
              <p className="text-sm text-blue-700">₹8,250/month • Billed annually</p>
            </div>
            <Button variant="outline" size="sm">Upgrade Plan</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Payment Method</h4>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Billing History</h4>
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{invoice.date}</span>
                  <span className="font-medium text-gray-900">{invoice.amount}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{invoice.status}</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingTab;
