import Image from "next/image";

type LogoProps = {
  fillColor?: string;
  darkmode?: string;
};

const Logo = (_props: LogoProps) => (
  <Image
    src="/assets/images/jsml-logo.png"
    alt="JSML"
    width={321}
    height={300}
    priority
    className="h-14 w-auto object-contain"
  />
);

export default Logo;
