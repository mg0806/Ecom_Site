"use client";

import Heading from "@/components/universal/Heading";

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Heading title="Shipping Policy" />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6 text-gray-800">
        <p>
          For <strong>international buyers</strong>, orders are shipped and
          delivered via registered international courier companies and/or
          international speed post only.
        </p>

        <p>
          For <strong>domestic buyers</strong>, orders are shipped using
          registered domestic courier companies and/or speed post services.
        </p>

        <h2 className="text-xl font-semibold">Shipping Timeframe</h2>
        <p>
          Orders are typically shipped within <strong>0–7 days</strong> or as
          per the delivery date confirmed at the time of order placement.
          Shipping and delivery times are subject to the courier company or
          postal service timelines and may vary based on location and other
          conditions.
        </p>

        <h2 className="text-xl font-semibold">Liability & Delivery</h2>
        <p>
          <strong>MANOHAR GUPTA</strong> is not responsible for any delay caused
          by courier companies or postal authorities. We guarantee only to hand
          over the consignment to the shipping carrier within{" "}
          <strong>0–7 business days</strong> from the date of order and payment
          or as per the mutually agreed delivery date.
        </p>

        <p>
          All orders will be delivered to the shipping address provided by the
          customer at checkout. A confirmation of your shipment and services
          will be sent to the email address specified during registration.
        </p>

        <h2 className="text-xl font-semibold">Need Help?</h2>
        <p>
          For assistance with our shipping process or services, you may reach
          out to our support team:
        </p>
        <ul className="list-disc ml-5">
          <li>
            📞 <strong>Phone:</strong> 7069672167
          </li>
          <li>
            📧 <strong>Email:</strong> manohargupta0806@gmail.com
          </li>
        </ul>
      </div>
    </div>
  );
}
