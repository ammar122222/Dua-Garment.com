// ReturnsAndExchanges.tsx

import React from "react";

const ReturnsAndExchanges = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Returns & Exchanges Policy</h1>

      <p className="mb-4 text-muted-foreground">
        This Returns & Exchanges Policy outlines the terms and conditions under which customers of Dua Garments may return or exchange products. By making a purchase, you agree to the conditions listed herein, in accordance with the laws applicable in Pakistan.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Eligibility for Returns</h2>
      <ul className="list-disc ml-6 text-muted-foreground">
        <li>Items must be returned within 14 days of delivery.</li>
        <li>Products must be unused, unwashed, and in original packaging with tags attached.</li>
        <li>Returns will only be accepted if accompanied by the original receipt or proof of purchase.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Non-Returnable Items</h2>
      <ul className="list-disc ml-6 text-muted-foreground">
        <li>Undergarments, socks, and accessories are non-returnable due to hygiene reasons.</li>
        <li>Items purchased during a clearance sale or at discounted rates are final and cannot be returned.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Exchanges</h2>
      <p className="text-muted-foreground">
        Exchanges are only permitted for size-related issues and subject to stock availability. If the required size is unavailable, you may opt for a different product of equal value.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Process for Returns/Exchanges</h2>
      <ol className="list-decimal ml-6 text-muted-foreground">
        <li>Contact our support team via email at <strong>duagarments@gmail.com</strong> within the return period.</li>
        <li>Provide your order number, reason for return, and pictures if applicable.</li>
        <li>Once approved, ship the item to the provided address via a trusted courier.</li>
        <li>Customers are responsible for return shipping costs unless the item was defective or incorrect.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Refunds</h2>
      <p className="text-muted-foreground">
        Refunds, where applicable, will be processed to the original method of payment within 10 working days of receiving the returned item. Shipping and handling charges are non-refundable.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Legal Jurisdiction</h2>
      <p className="text-muted-foreground">
        This policy is governed under the applicable consumer protection laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of courts in Rawalpindi.
      </p>
    </div>
  );
};

export default ReturnsAndExchanges;
