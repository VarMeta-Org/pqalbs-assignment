import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Spinner } from './spinner';
import { HStack } from './Utilities';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-[#EF4444] text-white hover:bg-[#EF4444]/90 focus-visible:ring-[#EF4444]/20 dark:focus-visible:ring-[#EF4444]/40 dark:bg-[#EF4444]/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        outlineDestructive:
          'border bg-background shadow-xs hover:bg-destructive/10 hover:text-accent-foreground border-[#EF444466] text-destructive',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-success text-background hover:bg-success/80 focus-visible:ring-success/20',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    innerWrapperClassname?: string;
    fullWidth?: boolean;
    icon?: React.ReactNode;
  };

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  loading = false,
  fullWidth,
  innerWrapperClassname,
  icon,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      disabled={props.disabled || loading}
      data-slot='button'
      data-variant={variant}
      data-size={size}
      className={cn(fullWidth && 'w-full', buttonVariants({ variant, size, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <HStack className={innerWrapperClassname} spacing={4}>
          {loading ? <Spinner /> : icon}

          {children}
        </HStack>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
