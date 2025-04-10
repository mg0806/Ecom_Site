"use client";

import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "@/components/universal/Button";
import { SafeUser } from "@/types";

interface CheckoutClientProps {
  currentUser: SafeUser | null;
}
const CheckoutClient: React.FC<CheckoutClientProps> = ({ currentUser }) => {
  const {
    cartProducts,
    paymentIntent,
    handelSetPaymentIntent,
    grandTotalAmount,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const isFirstRender = useRef(true);
  const isMounted = useRef(true); // Prevents state updates on unmounted components
  useEffect(() => {
    if (paymentSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [paymentSuccess]);

  // Prevent memory leaks by tracking component mount status
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const hasFetchedPaymentIntent = useRef(false);
  useEffect(() => {
    if (!cartProducts || cartProducts.length === 0) {
      console.warn("🚨 Cart is empty at checkout!");
      return;
    }
    if (hasFetchedPaymentIntent.current) return;
    hasFetchedPaymentIntent.current = true;
    const fetchPaymentIntent = async () => {
      setLoading(true);
      setError(false);

      try {
        // console.log(currentUser);
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartProducts,
            payment_intent_id: paymentIntent,
            order_amount: grandTotalAmount,
          }),
        });

        if (res.status === 401) {
          router.push("/Login");
          return;
        }

        const data = await res.json();
        if (!data.orderId) throw new Error("Order ID missing");

        setRazorpayOrderId(data.orderId);
        if (!paymentIntent) {
          handelSetPaymentIntent(data.paymentIntentId);
        }
      } catch (error) {
        console.error("Payment API Error:", error);
        toast.error("Something went wrong");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Ensure cart is loaded before calling the API
    setTimeout(fetchPaymentIntent, 200);
  }, [cartProducts, paymentIntent, router]);

  const handelSetPaymentSuccess = useCallback((value: boolean) => {
    if (!value) return;
    setPaymentSuccess(true);
    // setIsRedirecting(true);
    // setTimeout(() => {
    //   router.push("/orders");
    // }, 1500);
  }, []);

  return (
    <div className="w-full">
      {razorpayOrderId && cartProducts && (
        <CheckoutForm
          razorpayOrderId={razorpayOrderId}
          handelSetPaymentSuccess={handelSetPaymentSuccess}
          currentUser={currentUser}
        />
      )}

      {loading && <div className="text-center">Loading Checkout...</div>}
      {error && (
        <div className="text-center text-rose-400">Something went wrong</div>
      )}
      {paymentSuccess && (
        <div className="pt-10 px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="text-teal-500 text-center text-lg font-semibold">
              Payment Success
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[400px]">
              {/* View Orders Button */}
              <Button
                lable={isRedirecting ? "Redirecting..." : "View your orders"}
                onClick={async () => {
                  setIsRedirecting(true);
                  setLoading(true);
                  router.push("/orders");
                  setLoading(false);
                  router.refresh();
                }}
                disabled={isRedirecting}
              />

              {/* Continue Shopping Button */}
              <Button
                lable="Continue Shopping"
                outline
                onClick={async () => {
                  setLoading(true);
                  router.push("/");
                  setLoading(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
