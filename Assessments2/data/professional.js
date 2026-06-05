const PROFESSIONAL_DATA = {
  id: 'professional',
  modules: [
    {
      id: 'access_email', name: 'Identity & Email Security', description: 'MFA and encrypted communications.', icon: '📧',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'MFA for remote access.', questions: [
          { id: 'PRO-1.1', text: 'Is multi-factor auth enforced on all remote-access (VPN, email) and admin accounts?', context: 'Auth logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'email', name: 'Email Encryption', description: 'Protecting client info.', questions: [
          { id: 'PRO-1.2', text: 'Do you use email encryption for transmitting client confidential info?', context: 'Encryption gateway logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_cloud', name: 'Endpoint & Cloud Security', description: 'MDM and Drive settings.', icon: '💻',
      categories: [
        { id: 'endpoint', name: 'Device Security', description: 'Encrypting laptops.', questions: [
          { id: 'PRO-2.1', text: 'Are employee laptops fully encrypted and managed (MDM)?', context: 'MDM console', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'cloud', name: 'Cloud Sharing', description: 'Restricting document access.', questions: [
          { id: 'PRO-2.2', text: 'Are cloud sharing settings (Docs/Drive) restricted by policy?', context: 'Share settings', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'access_audit', name: 'Access Reviews & Audits', description: 'Least privilege and monitoring.', icon: '🔐',
      categories: [
        { id: 'access', name: 'Rights Management', description: 'Quarterly access reviews.', questions: [
          { id: 'PRO-3.1', text: 'Are access rights reviewed quarterly for each client/project?', context: 'Access matrix', weight: 3, options: [{label: 'Never', value: 0}, {label: 'Annually', value: 1}, {label: 'Quarterly', value: 5}] }
        ]},
        { id: 'audit', name: 'Audit Logging', description: 'Reviewing file access.', questions: [
          { id: 'PRO-3.2', text: 'Are audit logs (file access, admin actions) collected and reviewed?', context: 'Audit log', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'training_resilience', name: 'Training & Resilience', description: 'Awareness, IR, and backups.', icon: '🔄',
      categories: [
        { id: 'training', name: 'Security Training', description: 'Data handling and phishing.', questions: [
          { id: 'PRO-4.1', text: 'Do you conduct regular security awareness training on phishing and data handling?', context: 'Training certs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Data Backups', description: 'Offline legal records.', questions: [
          { id: 'PRO-4.2', text: 'Are backups of financial/legal records tested and offline?', context: 'Backup logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Breach notification plan.', questions: [
          { id: 'PRO-4.3', text: 'Is there a response plan for a major breach (incl. client notification)?', context: 'IR plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROFESSIONAL_DATA };
}
