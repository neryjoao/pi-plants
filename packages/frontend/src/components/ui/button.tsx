import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50',
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'outline' && 'border border-border bg-transparent hover:bg-muted',
          variant === 'ghost' && 'hover:bg-muted',
          size === 'default' && 'h-9 px-4 py-2 text-sm',
          size === 'sm' && 'h-7 px-3 text-xs',
          size === 'icon' && 'h-8 w-8',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
