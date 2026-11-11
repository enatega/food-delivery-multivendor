import Image from 'next/image';

export function AppLogo() {
  return (
    <div className="relative flex items-center justify-center p-2">
      <Image
        src="/assets/images/jsml-logo.png"
        alt="JSML"
        width={321}
        height={300}
        priority
        className="h-16 w-auto object-contain"
      />
    </div>
  );
}
