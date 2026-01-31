import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        ' file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-14 w-full min-w-0 rounded-none border-2 bg-zinc-200 px-4 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'dark:focus-visible:border-white focus-visible:border-black focus-visible:ring-ring/0 focus-visible:ring-2',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[#241e2c] hover:-translate-x-[5px] hover:-translate-y-[5px] transition-all delay-100',
        className
      )}
      {...props}
    />
  );
}

export { Input };
