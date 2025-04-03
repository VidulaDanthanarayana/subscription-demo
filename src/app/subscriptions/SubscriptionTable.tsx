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
    <div className="overflow-x-auto p-4 bg-white rounded-lg shadow-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Currency
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Interval
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Next Action At
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((sub) => (
            <tr 
              key={sub.subscription_id} 
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.subscription_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {sub.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.currency}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.interval.toUpperCase()} ({sub.interval_count})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.status_description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {sub.is_active ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {sub.next_action_at}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => handleView(sub.subscription_id, e)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-150 ease-in-out text-sm font-medium shadow-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => handleEdit(sub.subscription_id, e)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-150 ease-in-out text-sm font-medium shadow-sm"
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