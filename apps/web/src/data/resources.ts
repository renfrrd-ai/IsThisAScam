export interface Resource {
  id: string;
  name: string;
  url: string;
  country: string;
  type: "reporting" | "information" | "support";
  scamTypes: string[];
  description: string;
}

export const RESOURCES: Resource[] = [
  // United States
  {
    id: "us-ftc",
    name: "Federal Trade Commission (FTC)",
    url: "https://reportfraud.ftc.gov",
    country: "United States",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report scams, fraud, and bad business practices to the US government.",
  },
  {
    id: "us-ic3",
    name: "FBI Internet Crime Complaint Center (IC3)",
    url: "https://www.ic3.gov",
    country: "United States",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report internet crime and cyber scams to the FBI.",
  },
  {
    id: "us-ssa",
    name: "Social Security Administration",
    url: "https://oig.ssa.gov/report-fraud/",
    country: "United States",
    type: "reporting",
    scamTypes: ["government-tax", "fake-support"],
    description: "Report Social Security fraud and impersonation scams.",
  },
  {
    id: "us-irs",
    name: "IRS Identity Theft",
    url: "https://www.irs.gov/identity-theft-fraud-scams",
    country: "United States",
    type: "information",
    scamTypes: ["government-tax"],
    description: "Report tax scams and IRS impersonation.",
  },

  // Canada
  {
    id: "ca-antifraud",
    name: "Canadian Anti-Fraud Centre (CAFC)",
    url: "https://www.antifraudcentre-centreantifraude.ca",
    country: "Canada",
    type: "reporting",
    scamTypes: ["all"],
    description: "Canada's central repository for fraud reports.",
  },
  {
    id: "ca-competition",
    name: "Competition Bureau Canada",
    url: "https://antifraudcentre-centreantifraude.ca/en/report-fraud-other-canadian-agencies",
    country: "Canada",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report deceptive marketing and scams.",
  },

  // United Kingdom
  {
    id: "uk-action-fraud",
    name: "Action Fraud (UK)",
    url: "https://www.actionfraud.police.uk",
    country: "United Kingdom",
    type: "reporting",
    scamTypes: ["all"],
    description: "UK's national reporting centre for fraud and cybercrime.",
  },
  {
    id: "uk-ncsc",
    name: "National Cyber Security Centre (NCSC)",
    url: "https://www.ncsc.gov.uk/collection/phishing-scams",
    country: "United Kingdom",
    type: "information",
    scamTypes: ["phishing", "malware", "remote-access"],
    description: "Report phishing emails and cyber threats.",
  },

  // Australia
  {
    id: "au-accc",
    name: "Australian Competition & Consumer Commission (ACCC)",
    url: "https://www.scamwatch.gov.au",
    country: "Australia",
    type: "reporting",
    scamTypes: ["all"],
    description: "Australia's scam reporting and education site.",
  },
  {
    id: "au-cyber",
    name: "Australian Cyber Security Centre",
    url: "https://www.cyber.gov.au/report",
    country: "Australia",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report cyber incidents and security issues.",
  },

  // European Union
  {
    id: "eu-europol",
    name: "Europol Cybercrime Centre (EC3)",
    url: "https://www.europol.europa.eu/report-a-crime-to-europol",
    country: "European Union",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report serious cybercrime affecting EU citizens.",
  },
  {
    id: "eu-consumer",
    name: "European Consumer Centres (ECC)",
    url: "https://www.eccnet.eu",
    country: "European Union",
    type: "support",
    scamTypes: ["marketplace", "investment", "travel-ticket"],
    description: "Get help with cross-border consumer issues.",
  },

  // Global
  {
    id: "global-econsumer",
    name: "eConsumer.gov",
    url: "https://www.econsumer.gov",
    country: "Global",
    type: "reporting",
    scamTypes: ["all"],
    description: "Report international scams affecting consumers worldwide.",
  },
  {
    id: "global-interpol",
    name: "INTERPOL",
    url: "https://www.interpol.int/Crimes/Cybercrime",
    country: "Global",
    type: "information",
    scamTypes: ["all"],
    description: "Global police cooperation for cybercrime.",
  },

  // Support Resources
  {
    id: "support-credit",
    name: "Annual Credit Report (US)",
    url: "https://www.annualcreditreport.com",
    country: "United States",
    type: "support",
    scamTypes: ["all"],
    description: "Check your credit report for free (official site).",
  },
  {
    id: "support-idtheft",
    name: "IdentityTheft.gov (US)",
    url: "https://www.identitytheft.gov",
    country: "United States",
    type: "support",
    scamTypes: ["all"],
    description: "Official US government recovery plan for identity theft.",
  },
];

export function getResourcesByCountry(country?: string): Resource[] {
  if (!country || country === "All") return RESOURCES;
  return RESOURCES.filter((r) => r.country === country);
}

export function getResourcesByScamType(scamType: string): Resource[] {
  return RESOURCES.filter(
    (r) => r.scamTypes.includes(scamType) || r.scamTypes.includes("all"),
  );
}

export const COUNTRIES = [
  "All",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "European Union",
  "Global",
];
