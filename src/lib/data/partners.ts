// Partner data. URLs preferred from the source export
// (content-export/soleva.org/en/home.json links.external) where the export
// provides one; otherwise values come from the brief. `linkStatus` records
// whether the URL was verified ("ok"), is known-broken ("broken"), or was not
// individually checked ("unverified").

import { PARTNER_LOGOS } from "@/lib/constants";

export interface Partner {
  name: string;
  logo?: string;
  url?: string;
  linkStatus?: "ok" | "broken" | "unverified";
}

export interface PartnerCategory {
  key: string;
  partners: Partner[];
}

export const partnerCategories: PartnerCategory[] = [
  {
    key: "technical",
    partners: [
      { name: "CSEM", logo: PARTNER_LOGOS.csem, url: "https://www.csem.ch", linkStatus: "ok" },
      // Renamed from "EPFL PV-Lab" to "EPFL" (source uses https://epfl.ch).
      { name: "EPFL", logo: PARTNER_LOGOS.epfl, url: "https://epfl.ch", linkStatus: "ok" },
      {
        name: "Studer Innotec",
        logo: PARTNER_LOGOS.studer,
        url: "https://studer-innotec.com/",
        linkStatus: "unverified",
      },
      {
        name: "BRUSA HyPower",
        logo: PARTNER_LOGOS.brusa,
        url: "https://www.brusahypower.com",
        linkStatus: "ok",
      },
    ],
  },
  {
    key: "institutional",
    partners: [
      {
        name: "Canton de Vaud",
        logo: PARTNER_LOGOS.cantonVaud,
        url: "https://www.vd.ch",
        linkStatus: "unverified",
      },
      {
        name: "Services industriels de Lausanne (SiL)",
        logo: PARTNER_LOGOS.sil,
        url: "https://www.lausanne.ch/vie-pratique/energies-et-eau/services-industriels.html",
        linkStatus: "unverified",
      },
    ],
  },
  {
    key: "awards",
    partners: [
      {
        name: "Energy Lab Winner 2022",
        logo: PARTNER_LOGOS.energyLab,
        url: "https://www.linkedin.com/showcase/swiss-energy-lab/",
        linkStatus: "ok",
      },
    ],
  },
];
