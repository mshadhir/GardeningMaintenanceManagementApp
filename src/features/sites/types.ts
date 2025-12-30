import type { Site } from '@/lib/types';

export interface SiteCardProps {
  site: Site;
  href: string;
}

export interface SiteListProps {
  sites: Site[];
}
