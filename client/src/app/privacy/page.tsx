export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        Your privacy is important to us. This privacy policy explains how
        InsightDash collects, uses, and protects your information.
      </p>
      <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Email and name during registration</li>
        <li>Uploaded datasets and generated insights</li>
        <li>Usage data for analytics</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6">
        How We Use Your Information
      </h2>
      <ul className="list-disc ml-6">
        <li>To provide and improve our services</li>
        <li>To communicate updates or respond to inquiries</li>
        <li>To ensure platform security</li>
      </ul>
      <p>
        We do not sell or share your data with third parties except as required
        by law.
      </p>
    </div>
  );
}
