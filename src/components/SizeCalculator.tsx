"use client";
import React, { useState } from "react";

export default function SizeCalculator() {
  const [guests, setGuests] = useState<number | "">(12);
  const [result, setResult] = useState<string | null>(null);

  const calc = () => {
    const g = Number(guests);
    if (!g || g <= 0) return setResult("Enter a valid guest count");
    if (g <= 8) setResult("Recommended: 6\" (serves ~8)");
    else if (g <= 20) setResult("Recommended: 8\" (serves ~16)");
    else if (g <= 40) setResult("Recommended: 10\" (serves ~30)");
    else setResult("Recommended: Multi-tier cake (custom pricing)");
  };

  return (
    <div className="card p-6">
      <div className="flex gap-2 items-center">
        <input type="number" value={guests === "" ? "" : guests} onChange={(e) => setGuests(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Guest count" className="p-3 rounded-lg border w-36" />
        <button onClick={calc} className="btn-primary">Calculate</button>
      </div>
      {result && <p className="mt-3 text-sm" style={{ color: 'var(--color-chocolate)' }}>{result}</p>}
    </div>
  );
}
