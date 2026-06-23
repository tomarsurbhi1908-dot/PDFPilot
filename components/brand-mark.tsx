import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'h-8 w-8 rounded-lg',
  md: 'h-10 w-10 rounded-lg',
  lg: 'h-12 w-12 rounded-xl',
};

export function BrandMark({ className, size = 'md' }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10',
        sizeClass[size],
        className
      )}
    >
      <svg viewBox="0 0 48 48" className="h-4/5 w-4/5" role="img">
        <path
          d="M14 7h16l8 8v26H14z"
          fill="white"
        />
        <path
          d="M30 7v8h8"
          fill="#c7d2fe"
        />
        <rect x="18" y="25" width="22" height="10" rx="3" fill="#e11d48" />
        <text
          x="29"
          y="32.5"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="7"
          fontWeight="900"
          fill="white"
        >
          PDF
        </text>
        <path d="M18 18h12M18 22h16" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}
