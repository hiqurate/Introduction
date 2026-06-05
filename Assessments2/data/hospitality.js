const HOSPITALITY_DATA = {
  id: 'hospitality',
  modules: [
    {
      id: 'payment_wifi', name: 'Payment & Wi-Fi Security', description: 'POS and guest networks.', icon: '💳',
      categories: [
        { id: 'pos', name: 'POS Terminals', description: 'PCI-DSS basics.', questions: [
          { id: 'HOS-1.1', text: 'Are POS terminals updated and encrypted according to PCI-DSS?', context: 'POS config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.2', text: 'Do staff use 2FA for all payment system logins?', context: 'Auth logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'wifi', name: 'Guest Wi-Fi', description: 'Network isolation.', questions: [
          { id: 'HOS-1.3', text: 'Is guest Wi-Fi on a separate VLAN with bandwidth limits?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.4', text: 'Are passwords on guest networks changed regularly?', context: 'Policy', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_staff', name: 'Data & Staff Security', description: 'Guest PII and shift changes.', icon: '👥',
      categories: [
        { id: 'pii', name: 'Guest PII', description: 'Data encryption.', questions: [
          { id: 'HOS-2.1', text: 'Is guest PII (passport, credit info) encrypted in databases?', context: 'DB config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'staff', name: 'Staff Access', description: 'Managing high turnover credentials.', questions: [
          { id: 'HOS-2.2', text: 'Do staff change login credentials on shift changes (hotel)?', context: 'HR logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'booking_endpoint', name: 'Third-Party & Endpoints', description: 'OTAs and MDM.', icon: '📱',
      categories: [
        { id: 'ota', name: 'Booking Platforms', description: 'OTA integrations.', questions: [
          { id: 'HOS-3.1', text: 'Are online booking platforms/security updated (e.g. OTA integrations)?', context: 'Vendor SLA', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'endpoint', name: 'Staff Devices', description: 'Tablets and phones.', questions: [
          { id: 'HOS-3.2', text: 'Are tablets/cell phones used by staff MDM-managed and encrypted?', context: 'MDM console', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'monitoring_ir', name: 'Monitoring & Incident Response', description: 'Logs and breach notification.', icon: '👁️',
      categories: [
        { id: 'monitoring', name: 'Anomaly Detection', description: 'Flagging unusual activity.', questions: [
          { id: 'HOS-4.1', text: 'Are unusual logins (e.g. admin at midnight) flagged?', context: 'SIEM logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Data breach plans.', questions: [
          { id: 'HOS-4.2', text: 'Do you have an incident plan for data breaches (incl. guest notifications)?', context: 'IR plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOSPITALITY_DATA };
}
