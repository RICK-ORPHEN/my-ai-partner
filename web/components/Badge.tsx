import { cn } from '@/lib/cn';
export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('tag inline-flex items-center text-vermilion', className)}>{children}</span>;
}
