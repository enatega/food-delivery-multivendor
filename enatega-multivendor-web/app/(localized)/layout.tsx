import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./global.css";

import ClientProviders from "./ClientProviders";

export default function LocalizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientProviders>{children}</ClientProviders>;
}
