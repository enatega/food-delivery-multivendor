import Image from "next/image";

type LogoProps = {
  fillColor?: string;
  darkmode?: string;
  light?: boolean;
};

const Logo = ({ light = false }: LogoProps) => (
  <Image
    src="/assets/images/jsml-logo.png"
    alt="JSML"
    width={321}
    height={300}
    priority
    className={`h-14 w-auto object-contain ${light ? "brightness-0 invert" : ""}`}
  />
);

export default Logo;
