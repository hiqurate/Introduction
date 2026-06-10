const HOSPITALITY_DATA = {
  id: 'hospitality',
  modules: [
    {
      id: 'payment_wifi', name: 'Payment & Wi-Fi Security', description: 'POS terminals, PCI compliance, and guest networks.', icon: '💳',
      categories: [
        { id: 'pos', name: 'POS Terminals', description: 'PCI-DSS basics.', questions: [
          { id: 'HOS-1.1', text: 'Are POS terminals updated and encrypted according to PCI-DSS?', context: 'POS config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.2', text: 'Do staff use 2FA for all payment system logins?', context: 'Auth logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.3', text: 'Are POS devices physically inspected for tampering or skimming on a regular schedule?', context: 'Inspection logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Monthly', value: 3}, {label: 'Weekly', value: 5}] },
          { id: 'HOS-1.4', text: 'Is point-to-point encryption (P2PE) used for card transactions?', context: 'P2PE certification', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.5', text: 'Are payment processing systems isolated on a separate network segment from other hotel systems?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'wifi', name: 'Guest Wi-Fi', description: 'Network isolation.', questions: [
          { id: 'HOS-1.6', text: 'Is guest Wi-Fi on a separate VLAN with bandwidth limits?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.7', text: 'Are passwords on guest networks changed regularly?', context: 'Policy', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.8', text: 'Is guest Wi-Fi protected by a captive portal with terms of service acceptance?', context: 'Captive portal config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-1.9', text: 'Can guests on the Wi-Fi network access internal hotel systems (property management, POS)?', context: 'Firewall rules', weight: 5, options: [{label: 'Yes (insecure)', value: 0}, {label: 'Partial isolation', value: 2}, {label: 'Fully isolated', value: 5}] },
          { id: 'HOS-1.10', text: 'Is the hotel\'s internal Wi-Fi (staff network) encrypted with WPA3 or WPA2-Enterprise?', context: 'Wi-Fi config', weight: 4, options: [{label: 'No', value: 0}, {label: 'WPA2-Personal', value: 2}, {label: 'WPA2-Enterprise/WPA3', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_staff', name: 'Data & Staff Security', description: 'Guest PII, shift credential management, and access control.', icon: '👥',
      categories: [
        { id: 'pii', name: 'Guest PII', description: 'Data encryption.', questions: [
          { id: 'HOS-2.1', text: 'Is guest PII (passport, credit info) encrypted in databases?', context: 'DB config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.2', text: 'Are guest credit card numbers masked/truncated in all displays and receipts?', context: 'Sample receipts', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.3', text: 'Is there a data retention policy for guest information (auto-deletion after checkout period)?', context: 'Retention policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.4', text: 'Are loyalty program databases encrypted and access-restricted?', context: 'Loyalty DB config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'staff', name: 'Staff Access', description: 'Managing high turnover credentials.', questions: [
          { id: 'HOS-2.5', text: 'Do staff change login credentials on shift changes (hotel)?', context: 'HR logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.6', text: 'Are shared accounts eliminated and each staff member given individual credentials?', context: 'Account audit', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.7', text: 'Are accounts deactivated immediately when temporary/seasonal staff leave?', context: 'Off-boarding procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-2.8', text: 'Is role-based access control applied so front desk staff cannot access financial systems?', context: 'RBAC matrix', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'booking_endpoint', name: 'Third-Party & Endpoints', description: 'OTA integrations, MDM, and IoT security.', icon: '📱',
      categories: [
        { id: 'ota', name: 'Booking Platforms', description: 'OTA integrations.', questions: [
          { id: 'HOS-3.1', text: 'Are online booking platforms/security updated (e.g. OTA integrations)?', context: 'Vendor SLA', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.2', text: 'Are API connections to OTAs and channel managers secured with encryption and auth tokens?', context: 'API security config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.3', text: 'Do you conduct security assessments of third-party property management system (PMS) vendors?', context: 'Vendor assessment', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.4', text: 'Are vendor SLAs reviewed to include breach notification and security compliance clauses?', context: 'SLA documents', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'endpoint', name: 'Staff Devices', description: 'Tablets and phones.', questions: [
          { id: 'HOS-3.5', text: 'Are tablets/cell phones used by staff MDM-managed and encrypted?', context: 'MDM console', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.6', text: 'Are USB ports disabled on front desk and back-office workstations?', context: 'Device policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'iot', name: 'Smart Room IoT', description: 'Smart locks, thermostats, and in-room devices.', questions: [
          { id: 'HOS-3.7', text: 'Are smart room devices (locks, thermostats, TVs) on a separate network segment?', context: 'IoT network config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.8', text: 'Are default passwords changed on all IoT/smart room devices?', context: 'Device config checklist', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-3.9', text: 'Are electronic key card systems updated and protected against cloning attacks?', context: 'Key card system audit', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'monitoring_ir', name: 'Monitoring, IR & Training', description: 'Logs, breach notification, and staff awareness.', icon: '👁️',
      categories: [
        { id: 'monitoring', name: 'Anomaly Detection', description: 'Flagging unusual activity.', questions: [
          { id: 'HOS-4.1', text: 'Are unusual logins (e.g. admin at midnight) flagged?', context: 'SIEM logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.2', text: 'Is centralized logging in place for PMS, POS, and network systems?', context: 'SIEM architecture', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.3', text: 'Are security logs retained for at least 12 months (PCI-DSS requirement)?', context: 'Log retention policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Data breach plans.', questions: [
          { id: 'HOS-4.4', text: 'Do you have an incident plan for data breaches (incl. guest notifications)?', context: 'IR plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.5', text: 'Are backup restoration procedures tested at least annually?', context: 'Restoration test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.6', text: 'Are critical hotel systems (PMS, booking engine) backed up daily to offsite/cloud?', context: 'Backup logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'Security awareness for hotel staff.', questions: [
          { id: 'HOS-4.7', text: 'Do front desk and reservation staff receive training on social engineering tactics?', context: 'Training materials', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.8', text: 'Is there a procedure for staff to verify guest identity before disclosing reservation details?', context: 'Guest verification SOP', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.9', text: 'Are phishing simulation exercises conducted for hotel staff?', context: 'Phishing sim results', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.10', text: 'Is there clear signage/policy about not sharing passwords or system access with other staff?', context: 'Policy documents', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Security', description: 'Property access controls.', questions: [
          { id: 'HOS-4.11', text: 'Are server rooms and network closets physically secured with restricted access?', context: 'Access control logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HOS-4.12', text: 'Is CCTV monitoring active in areas with payment terminals and server rooms?', context: 'CCTV coverage map', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOSPITALITY_DATA };
}
