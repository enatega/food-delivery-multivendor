import { IImageComponentProps } from "@/lib/utils/interfaces/card.image.component";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const ImageComponent: React.FC<IImageComponentProps> = ({ src, alt, className }) => {
    return (
      <Image
        unoptimized
        width={40}
        height={40}
        src={src || "https://placehold.co/600x400"}
        alt={alt || "N/A"}
        className={twMerge(
          "w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110",
          className
        )}
      />
    );
  };
  
  export default ImageComponent;