import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        CodeStudioX ("we", "our", or "us") respects the privacy of our users and is committed to protecting the information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or use our services, in accordance with the data protection laws of Pakistan.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-4">We may collect the following types of data:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li><strong>Personal Information:</strong> Name, email address, phone number, address, billing details.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, device information, access times, pages viewed.</li>
        <li><strong>Cookies:</strong> Session data, preferences, and analytics tracking.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
      <p className="mb-4">We use the collected information to:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Provide and manage our services and products</li>
        <li>Process transactions and orders</li>
        <li>Send updates, newsletters, or promotional offers</li>
        <li>Improve user experience and website performance</li>
        <li>Comply with applicable laws and legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell, trade, or rent your personal data. However, we may share information with:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Service providers for hosting, analytics, and payment processing</li>
        <li>Government authorities if required under Pakistani law</li>
        <li>Third parties with your explicit consent</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your browsing experience, analyze usage, and personalize content. You may control or disable cookies through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to request access to your personal data, request corrections, or ask for deletion. You may also opt out of receiving promotional communications at any time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Third-Party Links</h2>
      <p className="mb-4">
        Our website may contain links to external sites. We are not responsible for the content or privacy practices of those third-party websites.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Children's Privacy</h2>
      <p className="mb-4">
        Our services are not intended for children under the age of 13. We do not knowingly collect personal data from minors without parental consent.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Changes to This Policy</h2>
      <p className="mb-4">
        We reserve the right to modify this Privacy Policy at any time. Updates will be posted on this page with the revised date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Contact Us</h2>
      <p className="mb-4">
        If you have questions or concerns about this Privacy Policy, please contact us at:{" "}
        <a
          href="mailto:codestudioxbyblack@gmail.com"
          className="text-blue-600 hover:underline"
        >
          codestudioxbyblack@gmail.com
        </a>
      </p>

      <p className="mt-8 text-sm text-gray-500">Last updated: August 2, 2025</p>
    </div>
  );
}
