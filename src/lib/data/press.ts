export interface PressAppearance {
  media: string;
  /** Category key, resolved to a localized label via dict.presse.pressTypes. */
  type: string;
  /** Optional: only set when the source page actually states a date (24Heures has none). */
  date?: string;
  language: string;
  url?: string;
  linkStatus?: "ok" | "broken" | "unverified";
}

export const pressAppearances: PressAppearance[] = [
  {
    media: "RTS 19h30",
    type: "tvNational",
    date: "23.06.2024",
    language: "FR",
    url: "https://www.rts.ch/play/tv/19h30/video/des-jeunes-ingenieurs-parcourent-la-suisse-avec-un-vieux-minibus-converti-a-lenergie-solaire?urn=urn:rts:video:15005664",
    linkStatus: "ok",
  },
  {
    media: "SRF Schweiz Aktuell",
    type: "tvNational",
    date: "29.08.2024",
    language: "DE",
    url: "https://www.srf.ch/play/tv/schweiz-aktuell/video/westschweizer-ingenieur-team-testet-solar-camper?urn=urn:srf:video:03a28bd6-8f49-432a-88c6-a40c7b8d75b7",
    linkStatus: "ok",
  },
  {
    media: "RSI Telegiornale",
    type: "tvNational",
    date: "13.07.2024",
    language: "IT",
    url: "https://www.rsi.ch/info/ticino-grigioni-e-insubria/Soleva-il-viaggio-%E2%80%9Cinfinito%E2%80%9D-di-passaggio-in-Ticino--2202193.html",
    linkStatus: "ok",
  },
  {
    media: "24Heures",
    type: "pressWritten",
    // Pas de date sur la page source /en/news (article non daté) → on n'en invente pas.
    language: "FR",
    url: "https://www.24heures.ch/un-van-romand-100-electrique-et-solaire-442970221563",
    linkStatus: "ok",
  },
  {
    media: "Télé Vaud-Fribourg",
    type: "tvRegional",
    date: "06.04.2022",
    language: "FR",
    url: "https://latele.ch/emissions/radar-vaudois/radar-vaudois-s-2022-e-68",
    linkStatus: "ok",
  },
  {
    media: "RTS Radio Matinale",
    type: "radioNational",
    date: "24.06.2022",
    language: "FR",
    url: "https://www.rts.ch/info/sciences-tech/13196779-avec-des-panneaux-solaires-sur-un-van-des-ingenieurs-veulent-voyager-durable.html",
    linkStatus: "ok",
  },
  {
    media: "Rouge FM",
    type: "radio",
    date: "30.06.2022",
    language: "FR",
    url: "https://www.rouge.com/podcasts/le-coup-de-projecteur-203/1",
    linkStatus: "broken",
  },
  {
    media: "LFM",
    type: "radio",
    date: "06.03.2022",
    language: "FR",
    url: "https://www.lfm.ch/podcasts/le-6-9-lfm-linvitee-qui-fait-lactu-09032022-0709-072706/",
    linkStatus: "unverified",
  },
  {
    media: "La Côte",
    type: "pressWritten",
    date: "01.03.2022",
    language: "FR",
    url: "https://www.lacote.ch/vaud/la-cote/morges-district/morges-ville/morges-ils-transforment-leur-vieux-van-en-vehicule-solaire-1158291",
    linkStatus: "ok",
  },
];
