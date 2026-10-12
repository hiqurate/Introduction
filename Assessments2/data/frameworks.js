// ============================================
// HawkSight — Assessment Template Registry
// Version metadata is shown on every report so customers know exactly
// which template and reference framework version was assessed.
// Question counts are computed from the template data at runtime.
// ============================================

const FRAMEWORKS = {
  nist: {
    id: 'nist',
    type: 'framework',
    name: 'NIST Cybersecurity Framework 2.0 Assessment',
    shortName: 'NIST CSF 2.0',
    templateVersion: '3.0',
    basis: 'NIST Cybersecurity Framework 2.0 Core (Govern, Identify, Protect, Detect, Respond, Recover)',
    basisVersion: '2.0',
    basisReleased: '2024-02-26',
    referenceFrameworks: ['nist_csf_2', 'iso27001', 'cis_v8', 'soc2'],
    color: '#1F4E8C',
    description: 'Programme-level assessment of all 106 NIST CSF 2.0 outcomes, including the new Govern function and supply chain risk.',
    longDescription: 'Rates every NIST CSF 2.0 subcategory on a four-level implementation scale. Each outcome maps to a HawkSight control, so results also show which attack paths are open and are expressed against ISO/IEC 27001:2022, CIS Controls v8.1 and SOC 2.',
    audience: 'Organisations establishing or benchmarking an enterprise security programme',
    estimatedTime: '90-120 minutes',
    scale: 'Not Implemented, Partially Implemented, Largely Implemented, Fully Implemented'
  },
  soc: {
    id: 'soc',
    type: 'framework',
    name: 'Security Operations Capability Assessment',
    shortName: 'SOC Capability',
    templateVersion: '2.0',
    basis: 'Based on the SOC Capability Maturity Model (SOC-CMM) domains, using a COBIT-style 0-5 maturity scale',
    basisVersion: 'SOC-CMM domains',
    basisReleased: '',
    referenceFrameworks: ['nist_csf_2', 'iso27001', 'cis_v8'],
    color: '#3B3F8F',
    description: 'Maturity assessment of a security operations function across governance, people, process, technology and coverage.',
    longDescription: 'Designed for organisations that run an internal SOC or rely on a managed detection provider. Each capability is rated from "Does not exist" to "Optimized".',
    audience: 'Organisations operating or procuring security monitoring',
    estimatedTime: '40-60 minutes',
    scale: 'Does Not Exist, Initial, Repeatable, Defined, Managed, Optimized'
  },
  retail: {
    id: 'retail', type: 'industry', name: 'Retail & E-commerce Threat Readiness Assessment', shortName: 'Retail & E-commerce',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['pci_dss', 'cis_v8', 'iso27001', 'dpdp'],
    color: '#8C2F39',
    description: 'Helpdesk social engineering, checkout skimming, customer account takeover, store and payment terminal compromise.',
    longDescription: 'Tests how well a retailer would hold up against the attacks retailers actually suffer: helpdesk impersonation, card skimming on the website, credential stuffing against customer accounts, attacks through store vendors, refund and gift-card abuse, and trading through weeks of central system outage.',
    audience: 'Retailers and e-commerce businesses', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  healthcare: {
    id: 'healthcare', type: 'industry', name: 'Healthcare & Pharma Threat Readiness Assessment', shortName: 'Healthcare & Pharma',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['hipaa', 'cis_v8', 'iso27001', 'dpdp'],
    color: '#1F6F5C',
    description: 'Clinical remote access, medical devices, patient-record misuse, clinical vendors and safe downtime operations.',
    longDescription: 'Tests how well a hospital, clinic, laboratory or pharmaceutical organisation would hold up against healthcare attacks: remote-access compromise of clinical systems, ransomware reaching medical devices, patient-record misuse, breaches at clinical vendors, and running care safely while systems are down.',
    audience: 'Hospitals, clinics, diagnostics and pharmaceutical companies', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  fintech: {
    id: 'fintech', type: 'industry', name: 'BFSI & FinTech Threat Readiness Assessment', shortName: 'BFSI & FinTech',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['pci_dss', 'cis_v8', 'iso27001', 'soc2', 'dpdp'],
    color: '#7A5B12',
    description: 'Customer account takeover, API abuse, payment-system compromise, payment file tampering and mule-driven fraud.',
    longDescription: 'Tests how well a bank, NBFC, insurer or FinTech would hold up against financial-sector attacks: SIM-swap and remote-access scams on customers, API data exposure, partner and outsourcer access, attacks on payment systems, tampered payment files and fraudulent transfers in progress.',
    audience: 'Banks, NBFCs, insurers, payment and FinTech companies', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  manufacturing: {
    id: 'manufacturing', type: 'industry', name: 'Manufacturing & OT Threat Readiness Assessment', shortName: 'Manufacturing & OT',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['cis_v8', 'iso27001', 'nist_csf_2'],
    color: '#4A4F59',
    description: 'Vendor access to equipment, IT-to-OT ransomware, engineering workstations, safety systems and manual production.',
    longDescription: 'Tests how well a manufacturer or industrial operator would hold up against attacks that stop production: vendor remote access to equipment, ransomware crossing from IT to OT, dependence of the plant on corporate IT, engineering workstation compromise, theft of design IP and producing manually through an outage. Informed by ISA/IEC 62443 concepts.',
    audience: 'Manufacturers and industrial operators', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  education: {
    id: 'education', type: 'industry', name: 'Education Threat Readiness Assessment', shortName: 'Education',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['cis_v8', 'iso27001', 'dpdp'],
    color: '#2F5E8C',
    description: 'Edtech vendor breaches, open campus networks, fee-payment fraud, grade and exam tampering.',
    longDescription: 'Tests how well a school, college or university would hold up against attacks on education: breaches at edtech vendors holding student data, open campus networks, dormant student accounts, fee-payment fraud against parents, tampering with grades and exam material, and running exams and admissions through an outage.',
    audience: 'Schools, colleges and universities', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  itservices: {
    id: 'itservices', type: 'industry', name: 'IT Services & SaaS Threat Readiness Assessment', shortName: 'IT Services & SaaS',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['iso27001', 'soc2', 'cis_v8'],
    color: '#1D6A7A',
    description: 'Leaked secrets, stolen developer sessions, poisoned dependencies, client access and cloud takeover.',
    longDescription: 'Tests how well an IT services firm, managed service provider or SaaS company would hold up against attacks on itself and, through it, its clients: leaked secrets, developer session theft, malicious dependencies, pipeline takeover, access into client environments and rebuilding after a cloud account is destroyed.',
    audience: 'IT services firms, managed service providers and SaaS companies', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  hospitality: {
    id: 'hospitality', type: 'industry', name: 'Hospitality Threat Readiness Assessment', shortName: 'Hospitality',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['pci_dss', 'cis_v8', 'dpdp'],
    color: '#6B4E2E',
    description: 'Booking-platform phishing, front-desk social engineering, guest and smart-room networks, payment terminals.',
    longDescription: 'Tests how well a hotel, resort or restaurant group would hold up against hospitality attacks: phishing through booking platforms, social engineering of the front desk, guest and smart-room networks, vendor access, payment terminal compromise, guest identity documents and running the property without the PMS.',
    audience: 'Hotels, resorts and restaurant groups', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  logistics: {
    id: 'logistics', type: 'industry', name: 'Logistics & Transport Threat Readiness Assessment', shortName: 'Logistics',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['cis_v8', 'iso27001'],
    color: '#5A6B2E',
    description: 'Invoice fraud, partner connections, telematics, cyber-enabled cargo theft and manual operations.',
    longDescription: 'Tests how well a logistics, freight or transport operator would hold up against attacks on logistics: invoice and payment fraud, partner and carrier connections, telematics and IoT devices, warehouse automation, cyber-enabled cargo theft and moving goods while core systems are down.',
    audience: 'Logistics, freight and transport operators', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  },
  professional: {
    id: 'professional', type: 'industry', name: 'Professional Services Threat Readiness Assessment', shortName: 'Professional Services',
    templateVersion: '2.0', basis: 'HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry', basisVersion: '2.0', basisReleased: '',
    referenceFrameworks: ['iso27001', 'cis_v8', 'gdpr', 'dpdp'],
    color: '#44345E',
    description: 'Client payment diversion, partner mailbox takeover, file-transfer tools, matter segregation and AI use.',
    longDescription: 'Tests how well a law, accounting or consulting firm would hold up against attacks on advisory firms: client payment diversion, takeover of partners\' mailboxes, breaches of file-transfer and data-room tools, firm-wide access to client matters, client documents in AI tools and meeting deadlines through an outage.',
    audience: 'Law, accounting and consulting firms', estimatedTime: '45-60 minutes', scale: 'Four levels, each described for the question'
  }
};

const FRAMEWORK_LIST = ['nist', 'soc'];
const COMPLIANCE_LIST = ['retail', 'healthcare', 'fintech', 'manufacturing', 'education', 'itservices', 'hospitality', 'logistics', 'professional'];
const FRAMEWORK_ORDER = [...FRAMEWORK_LIST, ...COMPLIANCE_LIST];

function getFrameworkData(id) {
  const lookup = {
    nist: typeof NIST_DATA !== 'undefined' ? NIST_DATA : null,
    soc: typeof SOC_DATA !== 'undefined' ? SOC_DATA : null,
    retail: typeof RETAIL_DATA !== 'undefined' ? RETAIL_DATA : null,
    healthcare: typeof HEALTHCARE_DATA !== 'undefined' ? HEALTHCARE_DATA : null,
    fintech: typeof FINTECH_DATA !== 'undefined' ? FINTECH_DATA : null,
    manufacturing: typeof MANUFACTURING_DATA !== 'undefined' ? MANUFACTURING_DATA : null,
    education: typeof EDUCATION_DATA !== 'undefined' ? EDUCATION_DATA : null,
    itservices: typeof ITSERVICES_DATA !== 'undefined' ? ITSERVICES_DATA : null,
    hospitality: typeof HOSPITALITY_DATA !== 'undefined' ? HOSPITALITY_DATA : null,
    logistics: typeof LOGISTICS_DATA !== 'undefined' ? LOGISTICS_DATA : null,
    professional: typeof PROFESSIONAL_DATA !== 'undefined' ? PROFESSIONAL_DATA : null
  };
  return lookup[id] || null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FRAMEWORKS, FRAMEWORK_LIST, COMPLIANCE_LIST, FRAMEWORK_ORDER };
}
