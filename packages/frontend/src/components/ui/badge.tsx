import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'muted';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => (
  <div
    className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variant === 'default' && 'bg-primary/10 text-primary',
      variant === 'success' && 'bg-green-100 text-green-700',
      variant === 'warning' && 'bg-amber-100 text-amber-700',
      variant === 'muted' && 'bg-muted text-muted-foreground',
      className,
    )}
    {...props}
  />
);
