"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !password) return setMessage('Email and password are required');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data?.error || 'Registration failed');
      // auto-login after register
      await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      router.push('/profile');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md p-8 glass rounded-2xl">
        <h1 className="text-2xl font-serif mb-4">Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded-lg" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-3 rounded-lg" />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 rounded-lg" />
          <button type="submit" className="w-full py-3 rounded-lg bg-gold text-chocolate" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          {message && <p className="text-sm mt-2 text-red-600">{message}</p>}
        </form>
      </div>
    </main>
  );
}
