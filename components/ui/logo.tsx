import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export const AeroNyxLogo = ({ className }: LogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={cn("text-primary fill-current", className)}
    >
      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
        <path d="M1277 3833 l-1277 -1278 0 -1275 0 -1275 1280 1280 1280 1280 -2 1273 -3 1272 -1278 -1277z" />
        <path d="M3838 3833 l-1278 -1278 0 -1275 0 -1275 1280 1280 1280 1280 -2 1273 -3 1272 -1277 -1277z" />
      </g>
    </svg>
  );
};
