const FINTECH_DATA = {
  id: 'fintech',
  modules: [
    {
      id: 'access_identity', name: 'Identity & Access Control', description: 'MFA and RBAC.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'MFA for finance apps.', questions: [
          { id: 'FT-1.1', text: 'Do you enforce MFA on all banking/finance applications (online banking, trading)?', context: 'MFA config screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'logs', name: 'Admin Actions', description: 'Logging of sensitive actions.', questions: [
          { id: 'FT-1.2', text: 'Do you log all administrative actions and review them regularly?', context: 'Audit log extracts', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_security', name: 'Data Security & Tokenization', description: 'Encryption and storage.', icon: '🛡️',
      categories: [
        { id: 'encryption', name: 'Data at Rest', description: 'Encryption of PII.', questions: [
          { id: 'FT-2.1', text: 'Is customer financial data (transaction logs, PII) encrypted in storage?', context: 'DB encryption settings', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'tokenization', name: 'Tokenization', description: 'Handling sensitive data.', questions: [
          { id: 'FT-2.2', text: 'Is sensitive data (credit cards, personal data) stored with tokenization or minimal retention?', context: 'Data classification policy', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_app', name: 'Network & Application Security', description: 'Segmentation and code review.', icon: '🌐',
      categories: [
        { id: 'segmentation', name: 'Network Architecture', description: 'DMZ and segmentation.', questions: [
          { id: 'FT-3.1', text: 'Is network segmentation in place between public internet systems and core financial systems?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'sdlc', name: 'Secure Development', description: 'Code review practices.', questions: [
          { id: 'FT-3.2', text: 'Do you use secure coding practices / code review for in-house apps?', context: 'Code review records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patch Management', description: 'Timely updates.', questions: [
          { id: 'FT-3.3', text: 'Are all systems patched within 30 days and are older versions decommissioned?', context: 'Patch logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'fraud_monitoring', name: 'Fraud Monitoring & Audits', description: 'Anomaly detection and pentesting.', icon: '📊',
      categories: [
        { id: 'monitoring', name: 'Transaction Monitoring', description: 'Detecting anomalies.', questions: [
          { id: 'FT-4.1', text: 'Are transaction systems and databases regularly monitored for anomalies/fraud?', context: 'Monitoring dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'audit', name: 'Security Audits', description: 'Pentesting and reviews.', questions: [
          { id: 'FT-4.2', text: 'Do you conduct periodic fraud/security audits or penetration tests on your systems?', context: 'Audit reports, pentest logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_training_bcp', name: 'Resilience, Vendor & Training', description: 'Training, vendors, and BCP.', icon: '🔄',
      categories: [
        { id: 'vendor', name: 'Third-Party Risk', description: 'SLA and assessments.', questions: [
          { id: 'FT-5.1', text: 'Are third-party vendors (payment gateways, cloud) security-assessed and SLA-bound?', context: 'Vendor assessments', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'Financial fraud awareness.', questions: [
          { id: 'FT-5.2', text: 'Do employees receive anti-phishing training specific to financial fraud?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Backups', description: 'Database backups.', questions: [
          { id: 'FT-5.3', text: 'Do you have off-site backups of critical financial databases?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FINTECH_DATA };
}
