import { IGlobalSVGProps } from '../../interfaces/svg.interface';

export function CircleSVG({
  width = '35',
  height = '48',
  strokeColor = 'white',
  ...props
}: IGlobalSVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 47 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="23.4998" cy="24.0003" r="22.8333" stroke={strokeColor} />
    </svg>
  );
}
