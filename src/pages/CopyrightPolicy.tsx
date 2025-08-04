import { Link } from "react-router-dom";

export default function CopyrightPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Copyright Policy</h1>

      <p className="mb-4">
        This Copyright Policy outlines the ownership and protection of intellectual property presented on the CodeStudioX platform and governs how users may interact with our content. We take copyright infringement seriously and comply with all applicable laws, including the Copyright Ordinance of 1962 (Pakistan).
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Ownership of Content</h2>
      <p className="mb-4">
        All content, including but not limited to code, design elements, logos, graphics, digital products, videos, text, and UI/UX components displayed on this website are the intellectual property of CodeStudioX, unless otherwise stated.
      </p>
      <p className="mb-4">
        All rights are reserved. Unauthorized use, duplication, reproduction, or redistribution in any form without express written consent from CodeStudioX is strictly prohibited.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Third-Party Assets</h2>
      <p className="mb-4">
        We may use open-source libraries, licensed images, fonts, icons, or third-party APIs. In such cases, appropriate credits or licenses are maintained in accordance with their respective terms of use. We do not claim ownership over such third-party materials.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. User-Generated Content</h2>
      <p className="mb-4">
        If you submit content (e.g. testimonials, reviews, feedback, uploaded media) to our website, you affirm that you have full ownership or rights to do so. By submitting, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and publish such content.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Copyright Infringement Notice</h2>
      <p className="mb-4">
        If you believe that your copyrighted work has been used or displayed on our platform without proper authorization, you may notify us by submitting the following information:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Your full name and contact information</li>
        <li>A description of the copyrighted work being infringed</li>
        <li>Direct links or exact location of the content in question</li>
        <li>A statement affirming that you are the copyright owner or authorized to act on their behalf</li>
        <li>A signature (digital or physical)</li>
      </ul>
      <p className="mb-4">
        Please send this notice to:{" "}
        <a
          href="mailto:codestudioxbyblack@gmail.com"
          className="text-blue-600 hover:underline"
        >
          codestudioxbyblack@gmail.com
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Action Upon Notification</h2>
      <p className="mb-4">
        Upon receiving a valid copyright complaint, we may:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-700">
        <li>Remove or restrict access to the infringing content</li>
        <li>Contact the user who posted it</li>
        <li>Terminate repeat offender accounts</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Governing Law</h2>
      <p className="mb-4">
        This Copyright Policy is governed by the laws of Pakistan, specifically the provisions of the Copyright Ordinance, 1962, and any amendments thereto. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lahore, Pakistan.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact Information</h2>
      <p className="mb-4">
        If you have any further questions regarding this policy, feel free to contact us at:{" "}
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
