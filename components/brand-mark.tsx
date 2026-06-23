import { cn } from '@/lib/utils';

type BrandMarkProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'h-8 w-8 rounded-[0.6rem]',
  md: 'h-12 w-12 rounded-2xl',
  lg: 'h-16 w-16 rounded-[1.25rem]',
};

export function BrandMark({ className, size = 'md' }: BrandMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative shrink-0 transition-transform duration-300 hover:scale-105',
        sizeClass[size],
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(500px) rotateX(15deg) rotateY(-15deg) rotateZ(5deg)',
      }}
    >
      <div 
        className="absolute inset-0 grid place-items-center ring-1 ring-white/30"
        style={{
          background: 'linear-gradient(135deg, #ff2d55 0%, #ff8a00 20%, #facc15 38%, #22c55e 55%, #06b6d4 70%, #6366f1 85%, #d946ef 100%)',
          borderRadius: 'inherit',
          boxShadow: `
            2px 2px 0 #0f172a,
            4px 4px 0 #312e81,
            7px 7px 0 #701a75,
            12px 12px 22px rgba(15,23,42,0.34),
            inset 0 2px 4px rgba(255,255,255,0.42)
          `,
          transform: 'translateZ(10px)',
        }}
      >
        <span 
          className={cn("font-black text-white", {
            'text-sm': size === 'sm',
            'text-3xl': size === 'md',
            'text-4xl': size === 'lg',
          })}
          style={{
            textShadow: '1px 1px 0px #0f172a, 2px 2px 0px rgba(15,23,42,0.65), 3px 3px 5px rgba(15,23,42,0.45)',
            transform: 'translateZ(20px)',
          }}
        >
          P
        </span>
      </div>
    </div>
  );
}
