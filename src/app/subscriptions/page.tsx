// app/subscriptions/page.tsx
"use client";

import { useState } from 'react';
import SubscriptionTable from './SubscriptionTable';
import CreateSubscription from './CreateSubscription';

export default function SubscriptionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubscriptionCreated = () => {
    setRefreshKey(prev => prev + 1); // Trigger table refresh
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <CreateSubscription onSuccess={handleSubscriptionCreated} />
      </div>
      <SubscriptionTable key={refreshKey} />
    </div>
  );
}