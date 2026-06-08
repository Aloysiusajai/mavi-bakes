"use client";
import React, { useState } from "react";

export default function DeliveryChecker() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const check = () => {
    if (!pin) return setResult("Enter a PIN code");
    // Mock rule: PIN codes starting with 1 or 2 are available
    if (/^[12]/.test(pin)) setResult("Delivery available in your area!");
    else setResult("Sorry, delivery not available for this PIN yet.");
  };

  return (
    <div className="card p-6">
      <div className="flex gap-2">
        <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN code" className="flex-1 p-3 rounded-lg border" />
        <button onClick={check} className="btn-primary">Check</button>
      </div>
      {result && <p className="mt-3 text-sm" style={{ color: 'var(--color-chocolate)' }}>{result}</p>}
    </div>
  );
}
