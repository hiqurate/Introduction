const RETAIL_DATA = {
  id: 'retail',
  modules: [
    {
      id: 'access_control', name: 'Identity & Access Control', description: 'Authentication and access policies.', icon: '🔐',
      categories: [
        { id: 'auth', name: 'Authentication', description: 'MFA and account security.', questions: [
          { id: 'RET-1.1', text: 'Do you use multi-factor authentication (MFA) for all user and administrator accounts (including e-shop back-end)?', context: 'Screenshot of MFA setup', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_security', name: 'Network & POS Security', description: 'Segmentation and network controls.', icon: '🌐',
      categories: [
        { id: 'pos', name: 'POS Systems', description: 'Point-of-sale security.', questions: [
          { id: 'RET-2.1', text: 'Are your point-of-sale (POS) or payment systems segmented from other networks?', context: 'Network diagram, VLAN config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vuln', name: 'Vulnerability Management', description: 'Scans and pentests.', questions: [
          { id: 'RET-2.2', text: 'Do you perform regular vulnerability scans or penetration tests on your network/website?', context: 'Scan reports, pentest reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_protection', name: 'Data Protection & Privacy', description: 'Encryption and PCI compliance.', icon: '🛡️',
      categories: [
        { id: 'encryption', name: 'Encryption', description: 'Data at rest and in transit.', questions: [
          { id: 'RET-3.1', text: 'Is all payment and customer data encrypted at rest and in transit?', context: 'Encryption certificates, logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'PCI Compliance', description: 'PCI-DSS readiness.', questions: [
          { id: 'RET-3.2', text: 'Do you comply with PCI-DSS (self-attested) for payment processing?', context: 'PCI attestation or policy docs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_security', name: 'Endpoint & Asset Security', description: 'Patching, AV, and MDM.', icon: '💻',
      categories: [
        { id: 'patching', name: 'Patch Management', description: 'Updates and patching.', questions: [
          { id: 'RET-4.1', text: 'Do you regularly update and patch e-commerce platforms and POS software?', context: 'Patch records, version history', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Occasionally', value: 2}, {label: 'Most', value: 4}, {label: 'Always', value: 5}] }
        ]},
        { id: 'devices', name: 'Device Management', description: 'MDM and endpoint security.', questions: [
          { id: 'RET-4.2', text: 'Are employee devices (laptops, phones) managed/secured (antivirus, MDM)?', context: 'Endpoint management dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'RET-4.3', text: 'Do you maintain an inventory of all store and IT assets (servers, PCs, IoT devices)?', context: 'Asset inventory report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'email_phishing', name: 'Email & Staff Training', description: 'Phishing protection and awareness.', icon: '📧',
      categories: [
        { id: 'email', name: 'Email Security', description: 'Filtering and gateways.', questions: [
          { id: 'RET-5.1', text: 'Do you use email filtering or cloud email security to scan order/customer emails for phishing/malware?', context: 'Email gateway logs, policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'Security awareness.', questions: [
          { id: 'RET-5.2', text: 'Do you train staff on phishing and secure checkout procedures at onboarding?', context: 'Training attendance sheet', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'resilience', name: 'Resilience & Third-Party', description: 'Backups, IR, and vendors.', icon: '🔄',
      categories: [
        { id: 'bcp', name: 'Backups & Incident Response', description: 'Disaster recovery and IR plan.', questions: [
          { id: 'RET-6.1', text: 'Are critical systems (server/backups) backed up offline or to an isolated cloud?', context: 'Backup logs, cloud backup config', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] },
          { id: 'RET-6.2', text: 'Do you have a formal incident response plan for security breaches?', context: 'Incident response plan document', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vendor', name: 'Third-Party Risk', description: 'Vendor assessments.', questions: [
          { id: 'RET-6.3', text: 'Are third-party vendors (e.g. logistics, payment gateways) security assessed?', context: 'Vendor contracts, attestation', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RETAIL_DATA };
}
