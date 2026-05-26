// ============================================
// CyberShield Assessments — Master Framework Registry
// ============================================

const FRAMEWORKS = {
  nist: {
    id: 'nist',
    name: 'NIST Cybersecurity Framework',
    shortName: 'NIST CSF',
    icon: '🛡️',
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
    name: 'SOC Capability Maturity Assessment',
    shortName: 'SOC-CMM',
    icon: '🔍',
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
  hipaa: {
    id: 'hipaa',
    name: 'HIPAA Security Assessment',
    shortName: 'HIPAA',
    icon: '🏥',
    color: '#10b981',
    colorGlow: 'rgba(16, 185, 129, 0.2)',
    description: 'Assess your compliance with the Health Insurance Portability and Accountability Act security requirements across administrative, physical, and technical safeguards.',
    longDescription: 'This HIPAA Security Rule assessment evaluates your organization\'s compliance across Administrative Safeguards, Physical Safeguards, Technical Safeguards, Organizational Requirements, and Policies & Procedures. Critical for healthcare organizations and their business associates handling Protected Health Information (PHI).',
    tags: ['Healthcare', 'PHI Protection', 'Compliance', 'Regulatory'],
    estimatedTime: '35-50 min',
    totalQuestions: 65,
    scoringModel: 'Compliance percentage (Not Compliant → Fully Compliant)',
    dataFile: 'hipaa'
  },
  iso27001: {
    id: 'iso27001',
    name: 'ISO 27001 Information Security Assessment',
    shortName: 'ISO 27001',
    icon: '📋',
    color: '#f59e0b',
    colorGlow: 'rgba(245, 158, 11, 0.2)',
    description: 'Comprehensive assessment based on ISO/IEC 27001:2022 Annex A controls covering 14 security domains from information security policies to compliance.',
    longDescription: 'This assessment evaluates your Information Security Management System (ISMS) against ISO/IEC 27001:2022 Annex A controls. Covering 14 control domains (A.5-A.18) with 114 controls, it assesses your implementation status across areas including access control, cryptography, operations security, communications security, and more.',
    tags: ['International Standard', 'ISMS', 'Certification Ready', 'Comprehensive'],
    estimatedTime: '55-70 min',
    totalQuestions: 114,
    scoringModel: 'Implementation Status (Not Started → Fully Implemented)',
    dataFile: 'iso27001'
  },
  pcidss: {
    id: 'pcidss',
    name: 'PCI-DSS Compliance Assessment',
    shortName: 'PCI-DSS',
    icon: '💳',
    color: '#ef4444',
    colorGlow: 'rgba(239, 68, 68, 0.2)',
    description: 'Evaluate your compliance with Payment Card Industry Data Security Standard requirements across all 12 core requirements for protecting cardholder data.',
    longDescription: 'The PCI-DSS v4.0 assessment covers all 12 requirements organized into 6 goals: Build and Maintain a Secure Network, Protect Cardholder Data, Maintain a Vulnerability Management Program, Implement Strong Access Control, Regularly Monitor and Test Networks, and Maintain an Information Security Policy.',
    tags: ['Payment Card', 'Financial', 'Compliance', 'Data Protection'],
    estimatedTime: '35-45 min',
    totalQuestions: 62,
    scoringModel: 'Compliance Status (Non-Compliant / Partial / Fully Compliant)',
    dataFile: 'pcidss'
  },
  soc2: {
    id: 'soc2',
    name: 'SOC 2 Trust Services Criteria Assessment',
    shortName: 'SOC 2',
    icon: '🔐',
    color: '#14b8a6',
    colorGlow: 'rgba(20, 184, 166, 0.2)',
    description: 'Assess your organization against the five Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy.',
    longDescription: 'This SOC 2 assessment evaluates your controls and processes against the AICPA Trust Services Criteria. It covers the Common Criteria (Security) and additional criteria for Availability, Processing Integrity, Confidentiality, and Privacy. Essential for service organizations providing cloud or technology services.',
    tags: ['Trust Services', 'AICPA', 'Service Organizations', 'Cloud Security'],
    estimatedTime: '30-40 min',
    totalQuestions: 55,
    scoringModel: 'Maturity Level (1-5)',
    dataFile: 'soc2'
  },
  gdpr: {
    id: 'gdpr',
    name: 'GDPR Data Protection Assessment',
    shortName: 'GDPR',
    icon: '🇪🇺',
    color: '#6366f1',
    colorGlow: 'rgba(99, 102, 241, 0.2)',
    description: 'Evaluate your organization\'s compliance with the General Data Protection Regulation across the seven key principles and data subject rights.',
    longDescription: 'This GDPR assessment covers the seven principles of data protection (Lawfulness, Purpose Limitation, Data Minimisation, Accuracy, Storage Limitation, Integrity & Confidentiality, Accountability), Data Subject Rights, International Transfers, Data Protection by Design, Breach Notification, and DPO Requirements.',
    tags: ['EU Regulation', 'Privacy', 'Data Protection', 'Rights-Based'],
    estimatedTime: '25-35 min',
    totalQuestions: 48,
    scoringModel: 'Compliance Readiness (Not Ready → Fully Compliant)',
    dataFile: 'gdpr'
  },
  generalit: {
    id: 'generalit',
    name: 'General IT Environment Security Review',
    shortName: 'IT Security',
    icon: '🖥️',
    color: '#ec4899',
    colorGlow: 'rgba(236, 72, 153, 0.2)',
    description: 'A comprehensive review of your organization\'s overall IT security posture covering cyber resilience, network infrastructure, devices, and SOC readiness.',
    longDescription: 'Based on the Cyber Resilience Review and Network & Infrastructure Resilience Review frameworks, this assessment evaluates your organization across 6 modules: Organization Overview, Security Awareness, Technology & Platforms, Current IT & Security Setup, Compliance & Future Outlook, and Network & Infrastructure. Ideal as a starting point for organizations beginning their security journey.',
    tags: ['General Assessment', 'Starter', 'IT Infrastructure', 'Cyber Resilience'],
    estimatedTime: '30-40 min',
    totalQuestions: 58,
    scoringModel: 'Readiness Score (1-5)',
    dataFile: 'generalit'
  }
};

// Framework ordering for display
const FRAMEWORK_ORDER = ['nist', 'soc', 'hipaa', 'iso27001', 'pcidss', 'soc2', 'gdpr', 'generalit'];

// Scoring helpers
const SCORING_LABELS = {
  nist: ['Not Implemented', 'Partially Implemented', 'Largely Implemented', 'Fully Implemented'],
  soc: ['Does Not Exist', 'Initial', 'Repeatable', 'Defined', 'Managed', 'Optimized'],
  hipaa: ['Not Compliant', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'],
  iso27001: ['Not Started', 'Planned', 'Partially Implemented', 'Largely Implemented', 'Fully Implemented'],
  pcidss: ['Non-Compliant', 'Partially Compliant', 'Fully Compliant'],
  soc2: ['Not Implemented', 'Ad-Hoc', 'Repeatable', 'Defined', 'Managed', 'Optimized'],
  gdpr: ['Not Ready', 'Basic Awareness', 'Partially Compliant', 'Substantially Compliant', 'Fully Compliant'],
  generalit: ['Not in Place', 'Basic', 'Developing', 'Established', 'Advanced', 'Optimized']
};

function getScoreClass(percentage) {
  if (percentage < 30) return 'critical';
  if (percentage < 60) return 'warning';
  if (percentage < 80) return 'good';
  return 'excellent';
}

function getScoreLabel(percentage) {
  if (percentage < 30) return 'Critical';
  if (percentage < 60) return 'Needs Improvement';
  if (percentage < 80) return 'Good';
  return 'Excellent';
}
