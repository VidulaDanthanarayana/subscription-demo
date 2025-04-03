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
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
      >
        Create New Subscription
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create New Subscription</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  reset();
                  setSubmitError(null);
                  setSubmitSuccess(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Success/Error messages */}
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-100">
                Subscription created successfully! Redirecting...
              </div>
            )}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subscription Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Enter subscription name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("currency", { required: "Currency is required" })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                  </select>
                  {errors.currency && <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>}
                </div>

                {/* Interval */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interval <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("interval", { required: "Interval is required" })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    <option value="DAY">Daily</option>
                    <option value="WEEK">Weekly</option>
                    <option value="MONTH">Monthly</option>
                    <option value="YEAR">Yearly</option>
                  </select>
                  {errors.interval && <p className="mt-1 text-sm text-red-600">{errors.interval.message}</p>}
                </div>

                {/* Interval Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interval Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register("interval_count", { 
                      required: "Interval count is required",
                      min: { value: 1, message: "Must be at least 1" }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="1"
                  />
                  {errors.interval_count && <p className="mt-1 text-sm text-red-600">{errors.interval_count.message}</p>}
                </div>

                {/* Days Until Due */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days Until Due <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("days_until_due", { 
                      required: "Days until due is required",
                      min: { value: 0, message: "Must be at least 1" }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="5"
                  />
                  {errors.days_until_due && <p className="mt-1 text-sm text-red-600">{errors.days_until_due.message}</p>}
                </div>

                {/* Trial Period Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trial Period Days
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("trial_period_days")}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("customer_details.first_name", { required: "First name is required" })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      placeholder="Enter first name"
                    />
                    {errors.customer_details?.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_details.first_name.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("customer_details.last_name", { required: "Last name is required" })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      placeholder="Enter last name"
                    />
                    {errors.customer_details?.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_details.last_name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("customer_details.email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      placeholder="Enter email"
                    />
                    {errors.customer_details?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_details.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("customer_details.phone_number", { required: "Phone number is required" })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      placeholder="Enter phone number"
                    />
                    {errors.customer_details?.phone_number && (
                      <p className="mt-1 text-sm text-red-600">{errors.customer_details.phone_number.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                    setSubmitError(null);
                    setSubmitSuccess(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Subscription"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}