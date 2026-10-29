import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "MeterMend — Every rental funds its next repair",
    template: "%s · MeterMend",
  },
  description:
    "A workshop ledger for shared equipment. Every rental builds an item’s repair reserve; deposits and human-approved repairs follow clear rules on Portaldot.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
