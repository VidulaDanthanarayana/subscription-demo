// app/subscriptions/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionTransaction {
  id: number;
  onepay_transaction_id: string;
  status: boolean;
  status_description: string;
  created_at: string;
}

interface SubscriptionDetails {
  status: number;
  message: string;
  data: {
    subscription_id: string;
    app_id: string;
    subscription_transactions: SubscriptionTransaction[];
  };
}

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://onepay-subscription-uat-bnf3bvbybtdaajay.centralindia-01.azurewebsites.net/v3/subscription/${params.id}/`,
          {
            headers: {
              Authorization: `ca00d67bf74d77b01fa26dc6780d7ff9522d8f82d30ff813d4c605f2662cea9ad332054cc66aff68.EYAW1189D04CD635D8B20`,
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          setSubscription(result);
        } else {
          setError(result.message || "Failed to fetch subscription details");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!subscription) return <div className="text-center py-8">No subscription found</div>;

  const { subscription_id, app_id, subscription_transactions } = subscription.data;

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Subscription Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">Subscription ID:</span> {subscription_id}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold text-gray-900">App ID:</span> {app_id}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscription_transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {txn.onepay_transaction_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {txn.status ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Success
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.status_description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(txn.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800">Successful Payments</p>
            <p className="text-2xl font-bold text-green-600">
              {subscription_transactions.filter(t => t.status).length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-800">Failed Payments</p>
            <p className="text-2xl font-bold text-red-600">
              {subscription_transactions.filter(t => !t.status).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-600">
              {subscription_transactions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}