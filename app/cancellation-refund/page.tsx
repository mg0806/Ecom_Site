"use client";

import Heading from "@/components/universal/Heading";

export default function CancellationRefundPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Heading title="Cancellation & Refund Policy" />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-6 text-gray-800">
        <p>
          <strong>MANOHAR GUPTA</strong> believes in helping its customers as
          far as possible and has therefore adopted a liberal cancellation
          policy. Under this policy:
        </p>

        <h2 className="text-xl font-semibold">1. Order Cancellations</h2>
        <p>
          Cancellations will be considered only if the request is made within{" "}
          <strong>2–3 days</strong> of placing the order. However, cancellation
          requests may not be entertained if the order has already been
          processed and shipped by the vendor/merchant.
        </p>

        <h2 className="text-xl font-semibold">2. Exceptions</h2>
        <p>
          Cancellation requests will not be accepted for{" "}
          <strong>perishable items</strong> such as flowers or food items.
          However, refunds or replacements may be issued if the customer can
          clearly demonstrate that the quality of the delivered product was not
          satisfactory.
        </p>

        <h2 className="text-xl font-semibold">3. Damaged or Defective Items</h2>
        <p>
          If you receive a damaged or defective item, please report it to our
          Customer Service team within <strong>2–3 days</strong> of receipt. The
          merchant will verify the issue at their end, and only then will the
          request be considered valid.
        </p>

        <h2 className="text-xl font-semibold">4. Product Not As Expected</h2>
        <p>
          If the product received is not as described or doesn’t meet your
          expectations, please notify our Customer Service within{" "}
          <strong>2–3 days</strong>. The team will assess your complaint and
          respond with an appropriate resolution.
        </p>

        <h2 className="text-xl font-semibold">
          5. Manufacturer Warranty Products
        </h2>
        <p>
          For products that come with a manufacturer warranty, any issues should
          be directed to the respective manufacturer for resolution.
        </p>

        <h2 className="text-xl font-semibold">6. Refund Processing</h2>
        <p>
          If a refund is approved by <strong>MANOHAR GUPTA</strong>, it will
          take <strong>3–4 business days</strong> to process the refund to the
          original payment method.
        </p>
      </div>
    </div>
  );
}
