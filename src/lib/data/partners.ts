export interface Partner {
  name: string
  logo?: string
}

export interface PartnerCategory {
  key: string
  partners: Partner[]
}

export const partnerCategories: PartnerCategory[] = [
  {
    key: "technical",
    partners: [
      { name: "CSEM" },
      { name: "EPFL PV-Lab" },
      { name: "Studer Innotec" },
      { name: "BRUSA HyPower" },
    ],
  },
  {
    key: "institutional",
    partners: [
      { name: "Canton de Vaud" },
      { name: "Services industriels de Lausanne (SiL)" },
    ],
  },
  {
    key: "awards",
    partners: [
      { name: "Energy Lab Winner 2022" },
    ],
  },
]
