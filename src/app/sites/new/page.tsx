'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '@/components/ui/Card';
import { SiteForm, type SiteFormValues } from '@/components/sites/SiteForm';
import { createSite } from '@/data/repositories/siteRepository';

export default function NewSitePage() {
  const router = useRouter();
  const [values, setValues] = useState<SiteFormValues>({
    name: '',
    address: '',
    serviceFrequency: 'weekly',
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SiteFormValues | 'form', string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!values.name.trim()) nextErrors.name = 'Site name is required.';
    if (!values.address.trim()) nextErrors.address = 'Address is required.';
    return nextErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setErrors({});
    try {
      await createSite({
        name: values.name.trim(),
        address: values.address.trim(),
        serviceFrequency: values.serviceFrequency,
        notes: values.notes.trim() || undefined,
        status: 'on_track',
        activeTasks: 0
      });
      router.push('/sites');
    } catch (err) {
      console.error('Failed to create site', err);
      setErrors({ form: 'Unable to save site. Please verify Firestore configuration and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Card className="p-6">
        <CardHeader title="Add site" subtitle="Create a new property to manage." />
        <div className="mt-4">
          <SiteForm
            values={values}
            errors={errors}
            submitting={submitting}
            onChange={(key, value) => setValues((prev) => ({ ...prev, [key]: value }))}
            onCancel={() => router.push('/sites')}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </main>
  );
}
