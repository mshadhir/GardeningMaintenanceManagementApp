import { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={clsx('card p-4', className)}>{children}</div>;
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-500">{subtitle}</p>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
  );
}

export function CardFooter({ children }: PropsWithChildren) {
  return <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>;
}
