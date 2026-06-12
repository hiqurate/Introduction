const RETAIL_DATA = {
  id: 'retail',
  modules: [
    {
      id: 'access_control', name: 'Identity & Access Control', description: 'Authentication and access policies for retail environments.', icon: '',
      categories: [
        { id: 'auth', name: 'Authentication', description: 'MFA and account security.', questions: [
          { id: 'RET-1.1', text: 'Do you use multi-factor authentication (MFA) for all user and administrator accounts (including e-shop back-end)?', context: 'Screenshot of MFA setup', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.2', text: 'Are default credentials changed on all retail systems (POS terminals, routers, admin panels) before deployment?', context: 'Configuration checklist', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.3', text: 'Do you enforce strong password policies (minimum length, complexity, expiry) across all retail accounts?', context: 'Password policy document', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.4', text: 'Are service/system accounts (API keys, integration accounts) inventoried and rotated periodically?', context: 'Service account register', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Role-Based Access', description: 'Least-privilege and access governance.', questions: [
          { id: 'RET-1.5', text: 'Is role-based access control (RBAC) implemented so store staff only access functions relevant to their role?', context: 'Access matrix', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.6', text: 'Are user access rights reviewed and revoked promptly when employees leave or change roles?', context: 'Off-boarding procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.7', text: 'Do you restrict administrative access to POS systems to authorized IT personnel only?', context: 'Admin access logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-1.8', text: 'Is there a formal process to request and approve elevated access for store managers?', context: 'Access request workflow', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_security', name: 'Network & POS Security', description: 'Segmentation, firewalls, and network controls.', icon: '',
      categories: [
        { id: 'pos', name: 'POS Systems', description: 'Point-of-sale security.', questions: [
          { id: 'RET-2.1', text: 'Are your point-of-sale (POS) or payment systems segmented from other networks?', context: 'Network diagram, VLAN config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.2', text: 'Are POS terminals running the latest firmware and payment application versions?', context: 'Firmware version log', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.3', text: 'Do you use point-to-point encryption (P2PE) for card transactions at the POS terminal?', context: 'P2PE certification', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.4', text: 'Are POS devices physically inspected for tampering or skimming devices on a regular schedule?', context: 'Inspection checklist', weight: 4, options: [{label: 'No', value: 0}, {label: 'Monthly', value: 3}, {label: 'Weekly', value: 5}] }
        ]},
        { id: 'vuln', name: 'Vulnerability Management', description: 'Scans and pentests.', questions: [
          { id: 'RET-2.5', text: 'Do you perform regular vulnerability scans or penetration tests on your network/website?', context: 'Scan reports, pentest reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.6', text: 'Is your e-commerce web application protected by a Web Application Firewall (WAF)?', context: 'WAF configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.7', text: 'Do you perform quarterly ASV (Approved Scanning Vendor) scans as required by PCI-DSS?', context: 'ASV scan reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'network', name: 'Network Architecture', description: 'Firewalls and segmentation.', questions: [
          { id: 'RET-2.8', text: 'Are firewall rules reviewed at least every six months and unnecessary rules removed?', context: 'Firewall review records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-2.9', text: 'Is guest/customer Wi-Fi isolated from the corporate and POS networks?', context: 'VLAN diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_protection', name: 'Data Protection & Privacy', description: 'Encryption, PCI compliance, and customer data handling.', icon: '',
      categories: [
        { id: 'encryption', name: 'Encryption', description: 'Data at rest and in transit.', questions: [
          { id: 'RET-3.1', text: 'Is all payment and customer data encrypted at rest and in transit?', context: 'Encryption certificates, logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.2', text: 'Are encryption keys managed securely with defined rotation schedules?', context: 'Key management policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.3', text: 'Is TLS 1.2 or higher enforced on all customer-facing web properties and APIs?', context: 'TLS configuration', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'PCI Compliance', description: 'PCI-DSS readiness.', questions: [
          { id: 'RET-3.4', text: 'Do you comply with PCI-DSS (self-attested) for payment processing?', context: 'PCI attestation or policy docs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.5', text: 'Is cardholder data stored only where absolutely necessary, with clear retention and disposal policies?', context: 'Data retention policy', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.6', text: 'Are payment card numbers masked or truncated in all displays, receipts, and logs?', context: 'Sample receipts/logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'privacy', name: 'Customer Privacy', description: 'Consent and data handling.', questions: [
          { id: 'RET-3.7', text: 'Do you collect explicit consent before storing customer personal data (loyalty programs, email lists)?', context: 'Consent forms, privacy policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.8', text: 'Is there a documented process for customers to request deletion of their personal data?', context: 'Data subject request procedure', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-3.9', text: 'Do you classify customer data by sensitivity level (e.g., payment data vs. browsing history)?', context: 'Data classification matrix', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_security', name: 'Endpoint & Asset Security', description: 'Patching, AV, MDM, and asset management.', icon: '',
      categories: [
        { id: 'patching', name: 'Patch Management', description: 'Updates and patching.', questions: [
          { id: 'RET-4.1', text: 'Do you regularly update and patch e-commerce platforms and POS software?', context: 'Patch records, version history', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Occasionally', value: 2}, {label: 'Most', value: 4}, {label: 'Always', value: 5}] },
          { id: 'RET-4.2', text: 'Are critical security patches applied within 14 days of release?', context: 'Patch timeline records', weight: 5, options: [{label: 'No', value: 0}, {label: 'Sometimes', value: 2}, {label: 'Always', value: 5}] },
          { id: 'RET-4.3', text: 'Is there a formal change management process for applying updates to production retail systems?', context: 'Change management policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'devices', name: 'Device Management', description: 'MDM and endpoint security.', questions: [
          { id: 'RET-4.4', text: 'Are employee devices (laptops, phones) managed/secured (antivirus, MDM)?', context: 'Endpoint management dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.5', text: 'Do you maintain an inventory of all store and IT assets (servers, PCs, IoT devices)?', context: 'Asset inventory report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.6', text: 'Are USB ports and removable media disabled or restricted on POS and store workstations?', context: 'Group policy settings', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.7', text: 'Is full-disk encryption enabled on all laptops and mobile devices used by store managers?', context: 'BitLocker/FileVault status', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ecommerce', name: 'E-commerce Platform', description: 'Website and application security.', questions: [
          { id: 'RET-4.8', text: 'Is your e-commerce platform monitored for unauthorized code changes (e.g., Magecart-style attacks)?', context: 'File integrity monitoring logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.9', text: 'Do you use Content Security Policy (CSP) headers to prevent cross-site scripting on your online store?', context: 'CSP header configuration', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.10', text: 'Are third-party scripts (analytics, chat, ads) on your website vetted and monitored for changes?', context: 'Third-party script inventory', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'email_phishing', name: 'Email, Phishing & Staff Training', description: 'Phishing protection, awareness, and insider threat.', icon: '',
      categories: [
        { id: 'email', name: 'Email Security', description: 'Filtering and gateways.', questions: [
          { id: 'RET-5.1', text: 'Do you use email filtering or cloud email security to scan order/customer emails for phishing/malware?', context: 'Email gateway logs, policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-5.2', text: 'Are SPF, DKIM, and DMARC records configured for your business email domain?', context: 'DNS records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-5.3', text: 'Is there a process for employees to report suspicious emails (e.g., phishing report button)?', context: 'Reporting procedure', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'Security awareness.', questions: [
          { id: 'RET-5.4', text: 'Do you train staff on phishing and secure checkout procedures at onboarding?', context: 'Training attendance sheet', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-5.5', text: 'Are phishing simulation exercises conducted at least quarterly for retail staff?', context: 'Phishing simulation results', weight: 3, options: [{label: 'No', value: 0}, {label: 'Annually', value: 2}, {label: 'Quarterly+', value: 5}] },
          { id: 'RET-5.6', text: 'Do cashiers and customer-facing staff receive training on social engineering tactics?', context: 'Training materials', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-5.7', text: 'Is there a clear acceptable-use policy for store computers and Wi-Fi that all employees acknowledge?', context: 'Acceptable use policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'resilience', name: 'Resilience, Monitoring & Third-Party', description: 'Backups, IR, vendor management, and monitoring.', icon: '',
      categories: [
        { id: 'bcp', name: 'Backups & Incident Response', description: 'Disaster recovery and IR plan.', questions: [
          { id: 'RET-6.1', text: 'Are critical systems (server/backups) backed up offline or to an isolated cloud?', context: 'Backup logs, cloud backup config', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] },
          { id: 'RET-6.2', text: 'Do you have a formal incident response plan for security breaches?', context: 'Incident response plan document', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.3', text: 'Are backup restoration procedures tested at least annually to verify data integrity?', context: 'Restoration test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.4', text: 'Is there a documented business continuity plan (BCP) that covers loss of POS systems or e-commerce downtime?', context: 'BCP document', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vendor', name: 'Third-Party Risk', description: 'Vendor assessments.', questions: [
          { id: 'RET-6.5', text: 'Are third-party vendors (e.g. logistics, payment gateways) security assessed?', context: 'Vendor contracts, attestation', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.6', text: 'Do third-party integrations (plugins, extensions) on your e-commerce platform go through a security review?', context: 'Plugin review checklist', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.7', text: 'Are vendor SLAs reviewed to include breach notification timelines and liability clauses?', context: 'SLA documents', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'monitoring', name: 'Monitoring & Logging', description: 'Security event detection.', questions: [
          { id: 'RET-6.8', text: 'Do you have centralized logging (SIEM) for POS transactions, website access, and admin actions?', context: 'SIEM dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.9', text: 'Are alerts configured for anomalous activity (e.g., bulk data downloads, after-hours admin logins)?', context: 'Alert rules configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-6.10', text: 'Are security logs retained for at least 12 months as required by PCI-DSS?', context: 'Log retention policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RETAIL_DATA };
}
