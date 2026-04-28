// Interface
import { ITextComponentProps } from '@/lib/utils/interfaces';

export default function TextComponent({
  title,
  text,
  className,
}: ITextComponentProps) {
  return <div title={title} className={` dark:text-white custom-text md:mt-8 lg:mt-0 ${className}`}>{text}</div>;
}
