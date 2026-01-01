'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSite } from '@/data/repositories/siteRepository';
import { SiteHealth } from '@/lib/types';

interface FormState {
  name: string;
  address: string;
  city: string;
  contactName: string;
  contactPhone: string;
  serviceFrequency: string;
  notes: string;
  nextVisit: string;
}

const defaultFormState: FormState = {
  name: '',
  address: '',
  city: '',
  contactName: '',
  contactPhone: '',
  serviceFrequency: '',
  notes: '',
  nextVisit: '',
};

const statusOptions: SiteHealth[] = ['on_track', 'at_risk', 'delayed'];

export default function NewSitePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [status, setStatus] = useState<SiteHealth>('on_track');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createSite({
        ...form,
        status,
        coordinates: { lat: 0, lng: 0 },
        activeTasks: 0,
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
        serviceFrequency: form.serviceFrequency.trim(),
        notes: form.notes.trim(),
      });
      router.push('/sites');
    } catch (err) {
      console.error('Failed to create site', err);
      setError(
        err instanceof Error ? err.message : 'Unable to save the site right now. Please check your Firestore settings.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <p className="text-sm font-medium text-brand-700">Add site</p>
        <h1 className="text-3xl font-semibold text-gray-900">New property</h1>
        <p className="text-sm text-gray-600">Capture contact details, service cadence, and notes for the new site.</p>
      </div>

      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-900">
              Site name
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Green Meadows Estate"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-semibold text-gray-900">
              City/Region
            </label>
            <input
              id="city"
              name="city"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Portland, OR"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="address" className="text-sm font-semibold text-gray-900">
              Address
            </label>
            <input
              id="address"
              name="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="123 Greenway Blvd"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contactName" className="text-sm font-semibold text-gray-900">
              Contact name
            </label>
            <input
              id="contactName"
              name="contactName"
              required
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="Alyssa Hart"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contactPhone" className="text-sm font-semibold text-gray-900">
              Contact phone
            </label>
            <input
              id="contactPhone"
              name="contactPhone"
              required
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="(555) 201-4433"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="serviceFrequency" className="text-sm font-semibold text-gray-900">
              Service frequency
            </label>
            <select
              id="serviceFrequency"
              name="serviceFrequency"
              required
              value={form.serviceFrequency}
              onChange={(e) => setForm({ ...form, serviceFrequency: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select cadence</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-semibold text-gray-900">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SiteHealth)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'on_track' ? 'On track' : option === 'at_risk' ? 'At risk' : 'Delayed'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="nextVisit" className="text-sm font-semibold text-gray-900">
            Next visit date
          </label>
          <input
            id="nextVisit"
            name="nextVisit"
            type="date"
            value={form.nextVisit}
            onChange={(e) => setForm({ ...form, nextVisit: e.target.value })}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-semibold text-gray-900">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            required
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Key priorities, hazards, or reminders for the crew."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Saving...' : 'Create site'}
          </button>
        </div>
      </form>
    </main>
  );
}
