// ============================================
// HawkSight Assessments — Master Framework Registry
// ============================================

const FRAMEWORKS = {
  nist: {
    id: 'nist',
    type: 'framework',
    name: 'NIST Cybersecurity Framework',
    shortName: 'NIST CSF',
    icon: '',
    color: '#3b82f6',
    colorGlow: 'rgba(59, 130, 246, 0.2)',
    description: 'The NIST Cybersecurity Framework (CSF) provides a policy framework of computer security guidance for how private sector organizations can assess and improve their ability to prevent, detect, and respond to cyber attacks.',
    longDescription: 'Based on NIST SP 800-53 and the Cybersecurity Framework, this assessment evaluates your organization across 5 core functions — Identify, Protect, Detect, Respond, and Recover — with 22 categories and 98 subcategories mapped to industry best practices. Each control is scored on a 1-4 maturity scale.',
    tags: ['Federal', 'Critical Infrastructure', 'Risk Management', 'Industry Standard'],
    estimatedTime: '45-60 min',
    totalQuestions: 98,
    scoringModel: '4-point maturity (Not Implemented → Fully Implemented)',
    dataFile: 'nist'
  },
  soc: {
    id: 'soc',
    type: 'framework',
    name: 'SOC Capability Maturity Assessment',
    shortName: 'SOC-CMM',
    icon: '',
    color: '#7c3aed',
    colorGlow: 'rgba(124, 58, 237, 0.2)',
    description: 'Evaluate your Security Operations Center maturity across business drivers, people, processes, technology, and coverage domains using the CoBIT maturity model.',
    longDescription: 'Based on the SOC Capability Maturity Model (SOC-CMM), this comprehensive assessment examines five critical domains of your SOC: Mission & Governance, People, Process, Technology, and Coverage. Each area is evaluated using the CoBIT 0-5 maturity scale from "Does not exist" to "Optimized".',
    tags: ['SOC Operations', 'Maturity Model', 'CoBIT', 'Operational Security'],
    estimatedTime: '40-55 min',
    totalQuestions: 85,
    scoringModel: 'CoBIT 0-5 Maturity (Does not exist → Optimized)',
    dataFile: 'soc'
  },
  retail: {
    id: 'retail',
    type: 'industry',
    name: 'Retail & E-commerce Security Module',
    shortName: 'Retail / E-comm',
    icon: '',
    color: '#f43f5e',
    colorGlow: 'rgba(244, 63, 94, 0.2)',
    description: 'Tailored for retail and e-commerce, focusing on payment systems (POS), customer PII, and supply chain threats.',
    longDescription: 'Retailers face growing online threats including account takeovers, POS breaches, and ransomware. This assessment prioritizes payment security (PCI essentials), web/app security, identity & access (MFA), and offline backups to protect critical customer and sales data.',
    tags: ['Retail', 'E-Commerce', 'Payment Security', 'POS', 'SMB'],
    estimatedTime: '35-50 min',
    totalQuestions: 53,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'retail'
  },
  healthcare: {
    id: 'healthcare',
    type: 'industry',
    name: 'Healthcare & Pharma Security Module',
    shortName: 'Healthcare',
    icon: '',
    color: '#10b981',
    colorGlow: 'rgba(16, 185, 129, 0.2)',
    description: 'Focused on protecting Protected Health Information (PHI), medical devices (IoT), and ransomware readiness.',
    longDescription: 'Healthcare is India\'s most-attacked sector. This assessment stresses medical device/IoT segmentation, strong authentication for EMRs, PHI encryption, and offsite backups to ensure rapid recovery from ransomware threats.',
    tags: ['Healthcare', 'Pharma', 'PHI', 'Medical IoT', 'SMB'],
    estimatedTime: '30-45 min',
    totalQuestions: 46,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'healthcare'
  },
  fintech: {
    id: 'fintech',
    type: 'industry',
    name: 'Financial Services & FinTech Module',
    shortName: 'FinTech',
    icon: '',
    color: '#f59e0b',
    colorGlow: 'rgba(245, 158, 11, 0.2)',
    description: 'For financial services, addressing transaction security, APIs, broken access controls, and compliance essentials.',
    longDescription: 'FinTech relies heavily on APIs and integrations. This module focuses on robust encryption (TLS 1.2+), tokenization of account numbers, real-time fraud monitoring, and secure development practices (SAST/DAST) for in-house applications.',
    tags: ['FinTech', 'Financial', 'Transactions', 'Fraud', 'SMB'],
    estimatedTime: '30-45 min',
    totalQuestions: 42,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'fintech'
  },
  manufacturing: {
    id: 'manufacturing',
    type: 'industry',
    name: 'Manufacturing & Industrial Module',
    shortName: 'Manufacturing',
    icon: '',
    color: '#8b5cf6',
    colorGlow: 'rgba(139, 92, 246, 0.2)',
    description: 'Targeted at IT/OT convergence, securing industrial control systems, and preventing intellectual property theft.',
    longDescription: 'Manufacturers face risks to production lines and supply chains. This module emphasizes IT/OT network segmentation, IoT/SCADA device inventory and patching, vendor risk assessment, and backups for critical operational data (CAD files).',
    tags: ['Manufacturing', 'Industrial', 'ICS', 'OT', 'SMB'],
    estimatedTime: '30-45 min',
    totalQuestions: 43,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'manufacturing'
  },
  education: {
    id: 'education',
    type: 'industry',
    name: 'Education Sector Security Module',
    shortName: 'Education',
    icon: '',
    color: '#3b82f6',
    colorGlow: 'rgba(59, 130, 246, 0.2)',
    description: 'Designed for schools and colleges, handling student data privacy, open networks, and BYOD challenges.',
    longDescription: 'Educational institutions see a surge in ransomware. Key domains include segmenting student Wi-Fi from administrative networks, protecting minor records, enforcing MFA for staff, and providing phishing training.',
    tags: ['Education', 'Schools', 'Colleges', 'Student Data', 'SMB'],
    estimatedTime: '30-45 min',
    totalQuestions: 41,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'education'
  },
  itservices: {
    id: 'itservices',
    type: 'industry',
    name: 'IT & Software Services Module',
    shortName: 'IT Services',
    icon: '',
    color: '#06b6d4',
    colorGlow: 'rgba(6, 182, 212, 0.2)',
    description: 'For IT firms and consultancies, emphasizing secure SDLC, cloud governance, and client data protection.',
    longDescription: 'IT firms manage sensitive client data and code repositories. This assessment covers secure DevOps, strict IAM for cloud access, MDM for remote workstations, and managing shadow IT risks.',
    tags: ['IT Services', 'Software', 'SDLC', 'Cloud', 'SMB'],
    estimatedTime: '25-40 min',
    totalQuestions: 38,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'itservices'
  },
  hospitality: {
    id: 'hospitality',
    type: 'industry',
    name: 'Hospitality (Hotels/Restaurants) Module',
    shortName: 'Hospitality',
    icon: '',
    color: '#eab308',
    colorGlow: 'rgba(234, 179, 8, 0.2)',
    description: 'Focused on payment terminals, guest Wi-Fi segregation, and securing booking platforms.',
    longDescription: 'Hotels and restaurants frequently face POS breaches and Wi-Fi misuse. Key checks include PCI-DSS basics, isolating guest Wi-Fi, managing staff login credentials amid high turnover, and encrypting guest PII.',
    tags: ['Hospitality', 'Hotels', 'Restaurants', 'POS', 'SMB'],
    estimatedTime: '25-40 min',
    totalQuestions: 39,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'hospitality'
  },
  logistics: {
    id: 'logistics',
    type: 'industry',
    name: 'Logistics & Transport Module',
    shortName: 'Logistics',
    icon: '',
    color: '#f97316',
    colorGlow: 'rgba(249, 115, 22, 0.2)',
    description: 'Targeted at protecting IoT tracking assets, route data, and ensuring continuous supply chain operations.',
    longDescription: 'Logistics relies on IoT, telematics, and cloud TMS. This module weights asset inventory, zero-default credentials for tracking devices, secure VPNs for remote depots, and backing up critical route manifests.',
    tags: ['Logistics', 'Transport', 'IoT', 'Supply Chain', 'SMB'],
    estimatedTime: '25-40 min',
    totalQuestions: 37,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'logistics'
  },
  professional: {
    id: 'professional',
    type: 'industry',
    name: 'Professional Services Module',
    shortName: 'Prof. Services',
    icon: '',
    color: '#6366f1',
    colorGlow: 'rgba(99, 102, 241, 0.2)',
    description: 'For law firms, consultancies, and accounting, stressing strict client data confidentiality and email security.',
    longDescription: 'Professional services hold highly sensitive client documents. The module focuses on mitigating human error, enforcing MFA on all remote access, robust email encryption, and careful access control reviews for client projects.',
    tags: ['Professional', 'Law Firms', 'Consultancy', 'Confidentiality', 'SMB'],
    estimatedTime: '30-45 min',
    totalQuestions: 40,
    scoringModel: 'Risk-weighted percentage (0-100%)',
    dataFile: 'professional'
  }
};

// Framework ordering for display
const FRAMEWORK_ORDER = [
  'retail', 'healthcare', 'fintech', 'manufacturing', 
  'education', 'itservices', 'hospitality', 'logistics', 'professional',
  'nist', 'soc'
];

// Bifurcated lists: Frameworks vs Industry Modules
const FRAMEWORK_LIST = ['nist', 'soc'];
const COMPLIANCE_LIST = [
  'retail', 'healthcare', 'fintech', 'manufacturing', 
  'education', 'itservices', 'hospitality', 'logistics', 'professional'
];

// Scoring helpers
const SCORING_LABELS = {
  nist: ['Not Implemented', 'Partially Implemented', 'Largely Implemented', 'Fully Implemented'],
  soc: ['Does Not Exist', 'Initial', 'Repeatable', 'Defined', 'Managed', 'Optimized'],
  // For the new industry modules, we use Yes/No/Partial responses mapped to 0-100% scores in the app,
  // but if we need labels for the options:
  retail: ['No', 'Partial', 'Yes'],
  healthcare: ['No', 'Partial', 'Yes'],
  fintech: ['No', 'Partial', 'Yes'],
  manufacturing: ['No', 'Partial', 'Yes'],
  education: ['No', 'Partial', 'Yes'],
  itservices: ['No', 'Partial', 'Yes'],
  hospitality: ['No', 'Partial', 'Yes'],
  logistics: ['No', 'Partial', 'Yes'],
  professional: ['No', 'Partial', 'Yes']
};

function getScoreClass(percentage) {
  if (percentage < 60) return 'critical';
  if (percentage < 80) return 'warning';
  return 'good';
}

function getScoreLabel(percentage) {
  if (percentage < 60) return 'High/Critical Risk';
  if (percentage < 80) return 'Moderate Risk';
  return 'Good Posture';
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FRAMEWORKS, FRAMEWORK_ORDER, FRAMEWORK_LIST, COMPLIANCE_LIST, SCORING_LABELS, getScoreClass, getScoreLabel };
}
