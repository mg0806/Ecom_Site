import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatPrice } from "@/Utils/formatPrice";
import Button from "@/components/universal/Button";
import Heading from "@/components/universal/Heading";
import { useCart } from "@/hooks/useCart";
import { SafeUser } from "@/types";

interface CheckoutFormProps {
  razorpayOrderId: string;
  handelSetPaymentSuccess: (value: boolean) => void;
  currentUser: SafeUser | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  razorpayOrderId,
  handelSetPaymentSuccess,
  currentUser,
}) => {
  const {
    cartTotalAmount,
    cartProducts,
    handleClearCart,
    handelSetPaymentIntent,
    grandTotalAmount,
    totalWeight,
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const formattedPrice = formatPrice(grandTotalAmount);

  // 🏡 Store Address and Payment Details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded!");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!razorpayOrderId) return;
    handelSetPaymentSuccess(false);
  }, [handelSetPaymentSuccess, razorpayOrderId]);

  // 🎯 Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (paymentResponse: any) => {
    // console.log("Payment Response from Razorpay:", paymentResponse);

    setIsLoading(true);
    const verifyResponse = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        items: cartProducts,
        payment_intent_id: razorpayOrderId,
        order_amount: grandTotalAmount,
      }),
    });

    // console.log("Verify Response:", verifyResponse);

    const result = await verifyResponse.json();
    // console.log("Verification Result:", result);

    setIsLoading(false);

    if (result.success) {
      // ✅ Shiprocket order creation
      // console.log("Shiprocket order creation");
      // console.log(cartProducts);
      const shiprocketRes = await fetch("/api/shiprocket/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          order_id: paymentResponse.razorpay_order_id,
          amount: grandTotalAmount,
          currency: "INR",
          products: cartProducts,
          user: currentUser, // pass necessary user details
          shipping: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
            weight: totalWeight,
          },
        }),
      });

      const shiprocketData = await shiprocketRes.json();

      if (!shiprocketRes) {
        // for now changing logic to any response from backend ny changing !shiprocketRes.ok to !shiprocketRes.
        toast.error("Payment done but failed to schedule delivery.");
        console.error("Shiprocket Error:", shiprocketData);
        // You might want to still clear cart or retry
      } else {
        toast.success("✅ Order placed");
        // console.log("✅ Shiprocket Order Created:", shiprocketData);
      }
      toast.success("Checkout Successful!");
      handleClearCart();
      handelSetPaymentSuccess(true);
      handelSetPaymentIntent(null);
    } else {
      toast.error("Payment verification failed. Please contact support.");
      handelSetPaymentSuccess(false);
    }
  };

  const handlePaymentClick = () => {
    if (!window.Razorpay) {
      toast.error("Razorpay not loaded.");
      return;
    }

    // 🔥 Validate Form Before Payment
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.pincode
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // console.log(razorpayOrderId, process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use environment variable
      order_id: razorpayOrderId,
      amount: cartTotalAmount * 100, // Convert to paise (smallest unit)
      currency: "INR",
      // method: {
      //   netbanking: true,
      //   card: true,
      //   upi: true,
      //   wallet: true,
      // },
      handler: (response: any) => handlePayment(response),
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      },

      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>

      {/* 📍 Address Section */}
      <h2 className="font-semibold mb-2">Address Information</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Pincode
        </label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* 💰 Payment Section */}
      <h2 className="font-semibold mt-4 mb-2">Payment Information</h2>
      <div className="py-4 text-center text-slate-700 text-xl font-bold">
        Total: {formattedPrice}
      </div>
      <Button
        lable={isLoading ? "Processing..." : "Pay Now"}
        disabled={isLoading || !razorpayOrderId}
        onClick={handlePaymentClick}
      />
    </form>
  );
};

export default CheckoutForm;
