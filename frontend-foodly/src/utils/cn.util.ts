import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  classGroups: {
    shadow: [
      {
        shadow: ['elevation-1', 'elevation-2']
      }
    ]
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}