import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const SETTINGS_DOC_ID = "store";

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    paymentMethods: "",
    shippingInfo: "",
    contactInfo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const docRef = doc(db, "settings", SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const docRef = doc(db, "settings", SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
    setSaving(false);
    alert("Settings saved!");
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-4 p-4 bg-white rounded shadow max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Store Settings</h1>
      <div>
        <label className="block font-semibold mb-1">Payment Methods</label>
        <input
          type="text"
          name="paymentMethods"
          value={settings.paymentMethods}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g. Cash on Delivery, Credit Card, JazzCash, etc."
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Shipping Info</label>
        <textarea
          name="shippingInfo"
          value={settings.shippingInfo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Shipping policies, rates, etc."
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Contact Info</label>
        <input
          type="text"
          name="contactInfo"
          value={settings.contactInfo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Phone, email, address, etc."
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-black text-white rounded hover:bg-gray-800 transition"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
};

export default SettingsPanel;
