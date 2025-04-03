"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface CustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface SubscriptionFormData {
  name: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  days_until_due: number;
  trial_period_days: number;
  customer_details: CustomerDetails;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    subscription_id: string;
    customer_id: string;
    interval: string;
    interval_count: number;
    trial_period_days: number;
    days_until_due: number;
    status: string;
    url: string;
  };
}

export default function CreateSubscription({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubscriptionFormData>({
    defaultValues: {
        name: "", 
        amount: 0, 
        currency: "LKR", 
        interval: "MONTH", 
        interval_count: 1, 
        days_until_due: 1, 
        trial_period_days: 0,
        customer_details: {
          first_name: "", 
          last_name: "", // Removed default value
          email: "", // Removed default value
          phone_number: "", // Removed default value
        },
      },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(
        "https://onepay-subscription-uat-bnf3bvbybtdaajay.centralindia-01.azurewebsites.net/v3/subscription/",
        {
          method: "POST",
          headers: {
            Authorization:
              "ca00d67bf74d77b01fa26dc6780d7ff9522d8f82d30ff813d4c605f2662cea9ad332054cc66aff68.EYAW1189D04CD635D8B20",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            app_id: "80NR1189D04CD635D8ACD",
            ...data,
          }),
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create subscription");
      }

      setSubmitSuccess(true);
      
      if (result.data?.url) {
        setTimeout(() => {
            window.open(result.data.url, '_blank');
        }, 2000);
      } else {
        setTimeout(() => {
          setIsOpen(false);
          reset();
          onSuccess?.();
        }, 2000);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
      >
        Create New Subscription
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create New Subscription</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  reset();
                  setSubmitError(null);
                  setSubmitSuccess(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {/* Success/Error messages */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 shadow-sm">
                Subscription created successfully! Redirecting...
              </div>
            )}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 shadow-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                    placeholder="Enter subscription name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("amount", { 
                      required: "Amount is required",
                      min: { value: 0.01, message: "Amount must be greater than 0" }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("currency", { required: "Currency is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                  </select>
                  {errors.currency && <p className="mt-2 text-sm text-red-600">{errors.currency.message}</p>}
                </div>

                {/* Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("interval", { required: "Interval is required" })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                  >
                    <option value="DAY">Daily</option>
                    <option value="WEEK">Weekly</option>
                    <option value="MONTH">Monthly</option>
                    <option value="YEAR">Yearly</option>
                  </select>
                  {errors.interval && <p className="mt-2 text-sm text-red-600">{errors.interval.message}</p>}
                </div>

                {/* Interval Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register("interval_count", { 
                      required: "Interval count is required",
                      min: { value: 1, message: "Must be at least 1" }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                    placeholder="1"
                  />
                  {errors.interval_count && <p className="mt-2 text-sm text-red-600">{errors.interval_count.message}</p>}
                </div>

                {/* Days Until Due */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Until Due <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("days_until_due", { 
                      required: "Days until due is required",
                      min: { value: 0, message: "Must be at least 0" }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-all duration-200"
                    placeholder="0"
                  />
                  {errors.days_until_due && <p className="mt-2 text-sm text-red-600">{errors.days_until_due.message}</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                    setSubmitError(null);
                    setSubmitSuccess(false);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Subscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}