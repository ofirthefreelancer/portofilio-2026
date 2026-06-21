import { Poppins } from "next/font/google";

// Brand typeface for the Dental Spa template. Poppins carries headings, body, UI.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function DentalSpaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={poppins.variable}>{children}</div>;
}
