"use client";

import Heading from "@/components/universal/Heading";

export default function FAQsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Heading title="Frequently Asked Questions" />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6 text-gray-800">
        <div>
          <h3 className="font-semibold text-lg mb-2">
            1. How long will my order take to arrive?
          </h3>
          <p>
            Orders are shipped within 0–7 business days and delivered as per
            courier/postal timelines. You&apos;ll receive a confirmation email
            with tracking details.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            2. Can I cancel or change my order?
          </h3>
          <p>
            Cancellations are accepted within 2–3 days of placing the order
            unless the item has already been shipped. Contact customer support
            for assistance.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            3. What if I receive a damaged product?
          </h3>
          <p>
            Please report damaged or defective products within 2–3 days of
            delivery. We’ll investigate and offer a replacement or refund if
            eligible.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            4. Do you ship internationally?
          </h3>
          <p>
            Yes, we ship internationally through registered courier services and
            international speed post.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            5. What payment methods do you accept?
          </h3>
          <p>
            We accept major credit/debit cards, UPI, net banking, and secure
            wallet payments.
          </p>
        </div>
      </div>
    </div>
  );
}
