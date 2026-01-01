import { Button, GhostButton } from '@/components/ui/Button';
import type { ServiceFrequency } from '@/lib/types';

export interface SiteFormValues {
  name: string;
  address: string;
  serviceFrequency: ServiceFrequency;
  notes: string;
}

interface SiteFormProps {
  values: SiteFormValues;
  errors: Partial<Record<keyof SiteFormValues | 'form', string>>;
  submitting: boolean;
  onChange: <K extends keyof SiteFormValues>(key: K, value: SiteFormValues[K]) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export function SiteForm({ values, errors, submitting, onChange, onCancel, onSubmit }: SiteFormProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-800">
          Site name
          <input
            required
            value={values.name}
            onChange={(event) => onChange('name', event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Example: Green Meadows Estate"
          />
        </label>
        {errors.name ? <p className="mt-1 text-sm text-rose-600">{errors.name}</p> : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Address
          <input
            required
            value={values.address}
            onChange={(event) => onChange('address', event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="123 Main St, Springfield"
          />
        </label>
        {errors.address ? <p className="mt-1 text-sm text-rose-600">{errors.address}</p> : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Service frequency
          <select
            value={values.serviceFrequency}
            onChange={(event) => onChange('serviceFrequency', event.target.value as ServiceFrequency)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">
          Notes (optional)
          <textarea
            value={values.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            rows={3}
            placeholder="Site expectations, access instructions, or upcoming work."
          />
        </label>
      </div>

      {errors.form ? <p className="text-sm text-rose-600">{errors.form}</p> : null}

      <div className="flex justify-end gap-3">
        <GhostButton type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </GhostButton>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save site'}
        </Button>
      </div>
    </form>
  );
}
