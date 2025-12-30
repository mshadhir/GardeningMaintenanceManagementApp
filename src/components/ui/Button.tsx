import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 disabled:cursor-not-allowed';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx(baseStyles, 'bg-brand-600 text-white hover:bg-brand-700', className)} {...props} />;
}

export function GhostButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={clsx(baseStyles, 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50', className)} {...props} />;
}
