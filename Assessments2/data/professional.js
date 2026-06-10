const PROFESSIONAL_DATA = {
  id: 'professional',
  modules: [
    {
      id: 'access_email', name: 'Identity & Email Security', description: 'MFA, encrypted communications, and client data access.', icon: '📧',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'MFA for remote access.', questions: [
          { id: 'PRO-1.1', text: 'Is multi-factor auth enforced on all remote-access (VPN, email) and admin accounts?', context: 'Auth logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.2', text: 'Are strong password policies (length, complexity, rotation) enforced firm-wide?', context: 'Password policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.3', text: 'Is SSO (Single Sign-On) implemented for core business applications?', context: 'SSO config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'email', name: 'Email Security', description: 'Protecting client info.', questions: [
          { id: 'PRO-1.4', text: 'Do you use email encryption for transmitting client confidential info?', context: 'Encryption gateway logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.5', text: 'Are SPF, DKIM, and DMARC records configured for your business email domain?', context: 'DNS records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.6', text: 'Is there email filtering/gateway to block phishing, malware, and spam?', context: 'Email gateway config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.7', text: 'Is there a process for staff to report and quarantine suspicious emails?', context: 'Reporting procedure', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'client_access', name: 'Client Data Access', description: 'Controlling who sees client files.', questions: [
          { id: 'PRO-1.8', text: 'Is client data access restricted on a need-to-know basis (matter/engagement level)?', context: 'Access control matrix', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'PRO-1.9', text: 'Are ethical walls/information barriers enforced for conflicting client matters?', context: 'Ethical wall policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_cloud', name: 'Endpoint & Cloud Security', description: 'MDM, Drive settings, and remote work.', icon: '💻',
      categories: [
        { id: 'endpoint', name: 'Device Security', description: 'Encrypting laptops.', questions: [
          { id: 'PRO-2.1', text: 'Are employee laptops fully encrypted and managed (MDM)?', context: 'MDM console', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.2', text: 'Is EDR (Endpoint Detection & Response) deployed on all firm devices?', context: 'EDR deployment report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.3', text: 'Are personal devices (BYOD) restricted from accessing client data without security controls?', context: 'BYOD policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.4', text: 'Is remote wipe capability enabled for all firm-issued mobile devices?', context: 'MDM remote wipe config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'cloud', name: 'Cloud & Document Sharing', description: 'Restricting document access.', questions: [
          { id: 'PRO-2.5', text: 'Are cloud sharing settings (Docs/Drive) restricted by policy?', context: 'Share settings', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.6', text: 'Is DLP (Data Loss Prevention) enabled to prevent external sharing of confidential client documents?', context: 'DLP policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.7', text: 'Are document management systems (DMS) configured with role-based access per client/matter?', context: 'DMS access settings', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.8', text: 'Is there a policy against storing client data on personal cloud accounts (Dropbox, personal Gmail)?', context: 'Acceptable use policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patch Management', description: 'Keeping systems updated.', questions: [
          { id: 'PRO-2.9', text: 'Are all firm workstations and servers patched within 30 days of security updates?', context: 'Patch compliance report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-2.10', text: 'Is there an inventory of all software used across the firm (including browser extensions)?', context: 'Software inventory', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'access_audit', name: 'Access Reviews & Audits', description: 'Least privilege, monitoring, and compliance.', icon: '🔐',
      categories: [
        { id: 'access', name: 'Rights Management', description: 'Quarterly access reviews.', questions: [
          { id: 'PRO-3.1', text: 'Are access rights reviewed quarterly for each client/project?', context: 'Access matrix', weight: 3, options: [{label: 'Never', value: 0}, {label: 'Annually', value: 1}, {label: 'Quarterly', value: 5}] },
          { id: 'PRO-3.2', text: 'Are user accounts deactivated within 24 hours of employee departure?', context: 'Off-boarding procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-3.3', text: 'Is there a formal process for granting and revoking access to client files/matters?', context: 'Access request workflow', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'audit', name: 'Audit Logging', description: 'Reviewing file access.', questions: [
          { id: 'PRO-3.4', text: 'Are audit logs (file access, admin actions) collected and reviewed?', context: 'Audit log', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-3.5', text: 'Are alerts configured for unusual file access patterns (e.g., bulk downloads of client files)?', context: 'Alert configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-3.6', text: 'Is there centralized logging (SIEM) for email, file access, and authentication events?', context: 'SIEM config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'Regulatory Compliance', description: 'Industry-specific requirements.', questions: [
          { id: 'PRO-3.7', text: 'Do you comply with applicable data protection regulations (GDPR, attorney-client privilege, etc.)?', context: 'Compliance documentation', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-3.8', text: 'Is there a designated data protection officer or privacy lead for the firm?', context: 'Org chart', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'training_resilience', name: 'Training, IR & Resilience', description: 'Awareness, IR, backups, and business continuity.', icon: '🔄',
      categories: [
        { id: 'training', name: 'Security Training', description: 'Data handling and phishing.', questions: [
          { id: 'PRO-4.1', text: 'Do you conduct regular security awareness training on phishing and data handling?', context: 'Training certs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.2', text: 'Are phishing simulation exercises conducted at least quarterly?', context: 'Phishing sim results', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.3', text: 'Is there role-specific training for partners/senior staff on business email compromise (BEC)?', context: 'BEC training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.4', text: 'Do new hires receive cybersecurity onboarding covering firm-specific policies?', context: 'Onboarding checklist', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Data Backups', description: 'Offline legal records.', questions: [
          { id: 'PRO-4.5', text: 'Are backups of financial/legal records tested and offline?', context: 'Backup logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.6', text: 'Are backups encrypted and stored in a geographically separate location?', context: 'Backup architecture', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.7', text: 'Are backup restoration procedures tested at least annually?', context: 'Restoration test reports', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Breach notification plan.', questions: [
          { id: 'PRO-4.8', text: 'Is there a response plan for a major breach (incl. client notification)?', context: 'IR plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.9', text: 'Are tabletop IR exercises conducted at least annually?', context: 'Tabletop exercise report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.10', text: 'Is there cyber insurance coverage appropriate to the firm\'s risk profile?', context: 'Insurance policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.11', text: 'Is there a defined RTO/RPO for critical firm systems (billing, DMS, email)?', context: 'BCP documentation', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vendor', name: 'Vendor Management', description: 'Third-party risk.', questions: [
          { id: 'PRO-4.12', text: 'Are external vendors (IT support, cloud providers) assessed for security before engagement?', context: 'Vendor assessment', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'PRO-4.13', text: 'Do vendor contracts include data protection, breach notification, and liability clauses?', context: 'Contract review', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROFESSIONAL_DATA };
}
