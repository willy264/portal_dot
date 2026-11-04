import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import "./globals.css";
const josefin = localFont({
  src: "./fonts/JosefinSans-Variable.ttf",
  variable: "--font-josefin",
  weight: "100 700",
  display: "swap",
});
export const metadata: Metadata = {
  title: {
    default: "MeterMend — Every rental funds its next repair",
    template: "%s · MeterMend",
  },
  description:
    "A workshop ledger for shared equipment. Every rental builds an item’s repair reserve; deposits and human-approved repairs follow clear rules on Portaldot.",
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/brand/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={josefin.variable} suppressHydrationWarning>
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
