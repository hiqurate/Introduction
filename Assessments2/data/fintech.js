const FINTECH_DATA = {
  id: 'fintech',
  modules: [
    {
      id: 'access_identity', name: 'Identity & Access Control', description: 'MFA, RBAC, and privileged access management.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'MFA for finance apps.', questions: [
          { id: 'FT-1.1', text: 'Do you enforce MFA on all banking/finance applications (online banking, trading)?', context: 'MFA config screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-1.2', text: 'Are adaptive authentication methods (risk-based, device fingerprinting) used for high-value transactions?', context: 'Auth system configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-1.3', text: 'Are session timeouts enforced on all financial applications (e.g., auto-logout after 15 minutes)?', context: 'Session policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Access Governance', description: 'Least privilege and segregation of duties.', questions: [
          { id: 'FT-1.4', text: 'Is role-based access control (RBAC) with least-privilege enforced across financial systems?', context: 'RBAC matrix', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-1.5', text: 'Is segregation of duties enforced for critical financial operations (e.g., payment approvals)?', context: 'SoD matrix', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-1.6', text: 'Are access rights reviewed quarterly and revoked for inactive/terminated users?', context: 'Access review reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'logs', name: 'Admin Actions', description: 'Logging of sensitive actions.', questions: [
          { id: 'FT-1.7', text: 'Do you log all administrative actions and review them regularly?', context: 'Audit log extracts', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-1.8', text: 'Are privileged access sessions recorded and auditable?', context: 'PAM session logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_security', name: 'Data Security & Tokenization', description: 'Encryption, tokenization, and data handling.', icon: '🛡️',
      categories: [
        { id: 'encryption', name: 'Data at Rest', description: 'Encryption of PII.', questions: [
          { id: 'FT-2.1', text: 'Is customer financial data (transaction logs, PII) encrypted in storage?', context: 'DB encryption settings', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-2.2', text: 'Are encryption keys stored in a hardware security module (HSM) or dedicated KMS?', context: 'KMS/HSM configuration', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-2.3', text: 'Is TLS 1.2+ enforced on all API endpoints and customer-facing interfaces?', context: 'TLS scan results', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'tokenization', name: 'Tokenization', description: 'Handling sensitive data.', questions: [
          { id: 'FT-2.4', text: 'Is sensitive data (credit cards, personal data) stored with tokenization or minimal retention?', context: 'Data classification policy', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-2.5', text: 'Are production data environments isolated from development/testing (no real customer data in dev)?', context: 'Environment separation policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-2.6', text: 'Is there a data masking policy for displaying account numbers in UIs and logs?', context: 'Masking rules', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'retention', name: 'Data Retention', description: 'Lifecycle management.', questions: [
          { id: 'FT-2.7', text: 'Are data retention and destruction policies documented and enforced for financial records?', context: 'Retention policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-2.8', text: 'Is data loss prevention (DLP) in place to prevent unauthorized exfiltration of financial data?', context: 'DLP configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_app', name: 'Network & Application Security', description: 'Segmentation, API security, and code review.', icon: '🌐',
      categories: [
        { id: 'segmentation', name: 'Network Architecture', description: 'DMZ and segmentation.', questions: [
          { id: 'FT-3.1', text: 'Is network segmentation in place between public internet systems and core financial systems?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.2', text: 'Are firewall rules reviewed quarterly and unnecessary access removed?', context: 'Firewall review logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.3', text: 'Is east-west traffic within the data center monitored and restricted by micro-segmentation?', context: 'Micro-segmentation policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'api', name: 'API Security', description: 'Protecting financial APIs.', questions: [
          { id: 'FT-3.4', text: 'Are all financial APIs authenticated with OAuth 2.0 or equivalent and rate-limited?', context: 'API gateway config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.5', text: 'Do you conduct API-specific security testing (e.g., OWASP API Top 10)?', context: 'API test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.6', text: 'Are webhook/callback endpoints validated and secured against injection attacks?', context: 'Webhook security config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'sdlc', name: 'Secure Development', description: 'Code review practices.', questions: [
          { id: 'FT-3.7', text: 'Do you use secure coding practices / code review for in-house apps?', context: 'Code review records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.8', text: 'Are SAST/DAST scans integrated into the CI/CD pipeline for every release?', context: 'CI/CD pipeline config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-3.9', text: 'Is software composition analysis (SCA) used to detect vulnerable open-source dependencies?', context: 'SCA scan results', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patch Management', description: 'Timely updates.', questions: [
          { id: 'FT-3.10', text: 'Are all systems patched within 30 days and are older versions decommissioned?', context: 'Patch logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'fraud_monitoring', name: 'Fraud Monitoring & Audits', description: 'Anomaly detection, pentesting, and compliance.', icon: '📊',
      categories: [
        { id: 'monitoring', name: 'Transaction Monitoring', description: 'Detecting anomalies.', questions: [
          { id: 'FT-4.1', text: 'Are transaction systems and databases regularly monitored for anomalies/fraud?', context: 'Monitoring dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-4.2', text: 'Are real-time alerts configured for suspicious transaction patterns (velocity, geolocation)?', context: 'Alert rules', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-4.3', text: 'Is there a centralized SIEM correlating logs from payment, auth, and network systems?', context: 'SIEM architecture', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'audit', name: 'Security Audits', description: 'Pentesting and reviews.', questions: [
          { id: 'FT-4.4', text: 'Do you conduct periodic fraud/security audits or penetration tests on your systems?', context: 'Audit reports, pentest logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-4.5', text: 'Are red-team exercises conducted annually to simulate advanced attacks on financial infrastructure?', context: 'Red team report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-4.6', text: 'Is there a formal process for tracking and remediating audit findings within defined SLAs?', context: 'Remediation tracker', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'Regulatory Compliance', description: 'PCI-DSS, RBI, SEBI requirements.', questions: [
          { id: 'FT-4.7', text: 'Are you compliant with relevant financial regulations (PCI-DSS, RBI, SOX, SEBI as applicable)?', context: 'Compliance certificates', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-4.8', text: 'Is there a dedicated compliance officer or team responsible for financial cybersecurity regulations?', context: 'Org chart', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_training_bcp', name: 'Resilience, Vendor & Training', description: 'Training, vendors, BCP, and IR.', icon: '🔄',
      categories: [
        { id: 'vendor', name: 'Third-Party Risk', description: 'SLA and assessments.', questions: [
          { id: 'FT-5.1', text: 'Are third-party vendors (payment gateways, cloud) security-assessed and SLA-bound?', context: 'Vendor assessments', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-5.2', text: 'Do you require vendors to provide SOC 2 or equivalent attestation reports?', context: 'SOC 2 reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-5.3', text: 'Is there a process for ongoing monitoring of vendor security posture (not just initial assessment)?', context: 'Vendor monitoring process', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'Financial fraud awareness.', questions: [
          { id: 'FT-5.4', text: 'Do employees receive anti-phishing training specific to financial fraud?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'FT-5.5', text: 'Are developers trained on secure coding practices specific to financial applications (OWASP)?', context: 'Developer training logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Backups & BCP', description: 'Database backups and continuity.', questions: [
          { id: 'FT-5.6', text: 'Do you have off-site backups of critical financial databases?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] },
          { id: 'FT-5.7', text: 'Is there a documented BCP with defined RTO/RPO for core financial services?', context: 'BCP document', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'FT-5.8', text: 'Are disaster recovery drills conducted at least annually with documented results?', context: 'DR drill reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FINTECH_DATA };
}
