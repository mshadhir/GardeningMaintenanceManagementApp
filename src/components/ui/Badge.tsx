import clsx from 'clsx';
import { PropsWithChildren } from 'react';

interface BadgeProps extends PropsWithChildren {
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return <span className={clsx('badge', color, className)}>{children}</span>;
}
