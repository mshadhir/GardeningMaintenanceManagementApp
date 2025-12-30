'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSite } from '@/data/repositories/siteRepository';
import type { Site } from '@/lib/types';

type ServiceFrequency = NonNullable<Site['serviceFrequency']>;

interface FormState {
  name: string;
  address: string;
  serviceFrequency: ServiceFrequency;
  notes: string;
}

const defaultState: FormState = {
  name: '',
  address: '',
  serviceFrequency: 'weekly',
  notes: '',
};

export default function NewSitePage() {
  const [form, setForm] = useState<FormState>(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.address.trim()) {
      setError('Name and address are required.');
      return;
    }
    setSubmitting(true);
    try {
      await createSite({
        id: '',
        name: form.name.trim(),
        address: form.address.trim(),
        city: '',
        manager: '',
        phone: '',
        status: 'on_track',
        nextVisit: '',
        coordinates: { lat: 0, lng: 0 },
        activeTasks: 0,
        serviceFrequency: form.serviceFrequency,
        notes: form.notes.trim() || undefined,
      });
      router.push('/sites');
      router.refresh();
    } catch (submitError) {
      setError('Failed to create site. Please try again.');
      console.error(submitError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">Sites</p>
          <h1 className="text-3xl font-bold text-gray-900">Add a new site</h1>
          <p className="text-sm text-gray-600">Capture the basics to start scheduling visits.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800" htmlFor="name">
            Site name<span className="text-rose-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange('name')}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800" htmlFor="address">
            Address<span className="text-rose-600">*</span>
          </label>
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange('address')}
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800" htmlFor="serviceFrequency">
            Service frequency
          </label>
          <select
            id="serviceFrequency"
            name="serviceFrequency"
            value={form.serviceFrequency}
            onChange={handleChange('serviceFrequency')}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-800" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange('notes')}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Create site'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/sites')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
