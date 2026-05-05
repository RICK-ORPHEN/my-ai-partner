import { cn } from '@/lib/cn';
export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full bg-brand/10 text-brand text-xs font-semibold px-3 py-1', className)}>{children}</span>;
}
