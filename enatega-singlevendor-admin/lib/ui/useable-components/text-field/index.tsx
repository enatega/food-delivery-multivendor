// Interface
import { ITextComponentProps } from '@/lib/utils/interfaces';

export default function TextComponent({
  text,
  className,
}: ITextComponentProps) {
  return <div className={`custom-text ${className}`}>{text}</div>;
}
