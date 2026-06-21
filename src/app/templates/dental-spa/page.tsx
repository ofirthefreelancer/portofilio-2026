import type { Metadata } from "next";
import { SpaExperience } from "./_shared/SpaExperience";

export const metadata: Metadata = {
  title: "Almond Whitening Studio — Canggu, Bali",
  description: "Teeth whitening in Canggu, Bali. A single-page studio template.",
};

export default function DentalSpa() {
  return (
    <div className="spa-root spa-light min-h-screen">
      <SpaExperience />
    </div>
  );
}
