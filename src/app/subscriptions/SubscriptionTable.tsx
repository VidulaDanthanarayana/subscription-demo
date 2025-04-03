"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Subscription {
  subscription_id: string;
  name: string;
  amount: string;
  currency: string;
  trial_period_days: number;
  interval: string;
  interval_count: number;
  is_active: boolean;
  status_description: string;
  next_action_at: string;
}

export default function SubscriptionTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://onepay-subscription-uat-bnf3bvbybtdaajay.centralindia-01.azurewebsites.net/v3/subscription", {
          headers: {
            Authorization: `ca00d67bf74d77b01fa26dc6780d7ff9522d8f82d30ff813d4c605f2662cea9ad332054cc66aff68.EYAW1189D04CD635D8B20`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setSubscriptions(result.data);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (subscriptionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/subscriptions/${subscriptionId}`);
  };

  const handleEdit = (subscriptionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/subscriptions/edit/${subscriptionId}`);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Currency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Interval
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Status Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Next Action At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((sub) => (
            <tr 
              key={sub.subscription_id} 
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.subscription_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b border-gray-200">
                {sub.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.interval.toUpperCase()} ({sub.interval_count})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.status_description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                {sub.is_active ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                {sub.next_action_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => handleView(sub.subscription_id, e)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => handleEdit(sub.subscription_id, e)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}