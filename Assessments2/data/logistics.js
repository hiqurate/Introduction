const LOGISTICS_DATA = {
  id: 'logistics',
  modules: [
    {
      id: 'iot_assets', name: 'IoT & Asset Security', description: 'Tracking devices, inventory, and fleet security.', icon: '',
      categories: [
        { id: 'iot', name: 'GPS/IoT Tracking', description: 'Securing tracking devices.', questions: [
          { id: 'LOG-1.1', text: 'Are all tracking devices (GPS/IoT) on unique accounts (no default credentials)?', context: 'Device config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.2', text: 'Are IoT device firmware updates managed and applied in a timely manner?', context: 'Firmware update logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.3', text: 'Is communication between IoT devices and central systems encrypted (TLS/MQTT-TLS)?', context: 'Communication protocol config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.4', text: 'Are IoT/telematics devices on a separate network segment from corporate IT?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.5', text: 'Is there a process to detect and respond to unauthorized IoT devices on the network?', context: 'NAC policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'inventory', name: 'Asset Management', description: 'Mapping IT/IoT assets.', questions: [
          { id: 'LOG-1.6', text: 'Do you map and classify all IT/IoT assets (asset inventory)?', context: 'Asset inventory', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.7', text: 'Are end-of-life devices tracked and decommissioned securely (data wiped)?', context: 'Decommission policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-1.8', text: 'Is there an automated system for discovering new devices connected to the logistics network?', context: 'Discovery tool config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_data', name: 'Network & Data Protection', description: 'VPN access, encryption, and TMS security.', icon: '',
      categories: [
        { id: 'vpn', name: 'Remote Access', description: 'Warehouse and server access.', questions: [
          { id: 'LOG-2.1', text: 'Is remote warehouse/server access via VPN or zero-trust?', context: 'VPN logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-2.2', text: 'Is MFA enforced for all remote access to logistics systems?', context: 'MFA config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'LOG-2.3', text: 'Are mobile apps used by drivers secured with session management and data encryption?', context: 'App security review', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'encryption', name: 'Data Encryption', description: 'Protecting shipment data.', questions: [
          { id: 'LOG-2.4', text: 'Is shipment/customer data encrypted in transit (mobile apps) and at rest?', context: 'TLS config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-2.5', text: 'Are TMS (Transport Management System) databases encrypted with access logging?', context: 'TMS DB config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-2.6', text: 'Is customer PII (addresses, phone numbers) protected with data masking in operational views?', context: 'Data masking config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'network', name: 'Network Security', description: 'Firewalls and segmentation.', questions: [
          { id: 'LOG-2.7', text: 'Are warehouse networks segmented from corporate IT and IoT networks?', context: 'Network diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-2.8', text: 'Are firewall rules reviewed regularly and unnecessary rules removed?', context: 'Firewall review logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_staff', name: 'Third-Party & Staff Training', description: 'Carriers, dispatchers, and security awareness.', icon: '',
      categories: [
        { id: 'vendor', name: 'Partner Vetting', description: 'Cargo vendors and carriers.', questions: [
          { id: 'LOG-3.1', text: 'Do you vet partner carriers/cargo vendors for security (e.g. data sharing agreements)?', context: 'Vendor audits/SLA', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.2', text: 'Are data sharing agreements in place with all logistics partners specifying security requirements?', context: 'DSA documents', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.3', text: 'Is vendor access to logistics systems time-limited and monitored?', context: 'Vendor access logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.4', text: 'Do you assess the cybersecurity posture of warehousing and fulfillment partners?', context: 'Partner assessments', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Awareness', description: 'Driver and dispatcher training.', questions: [
          { id: 'LOG-3.5', text: 'Are drivers/dispatchers trained to report phishing and system anomalies?', context: 'Training log', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.6', text: 'Is there cybersecurity onboarding training for new warehouse and operations staff?', context: 'Onboarding checklist', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.7', text: 'Are staff trained on secure handling of customer delivery information?', context: 'Data handling training', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'access', name: 'Access Control', description: 'Managing logistics system access.', questions: [
          { id: 'LOG-3.8', text: 'Is role-based access control enforced on TMS and warehouse management systems?', context: 'RBAC matrix', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-3.9', text: 'Are shared accounts eliminated for warehouse management and dispatch systems?', context: 'Account audit', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'resilience_physical', name: 'Resilience & Physical Security', description: 'Backups, monitoring, gates, and disaster recovery.', icon: '',
      categories: [
        { id: 'backup', name: 'Data Backups', description: 'Logistics data backups.', questions: [
          { id: 'LOG-4.1', text: 'Is logistics data (routes, manifests) backed up to offsite/cloud?', context: 'Backup logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.2', text: 'Are backup restoration procedures tested at least annually?', context: 'Test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.3', text: 'Is there a defined RTO/RPO for critical logistics systems (TMS, WMS)?', context: 'RTO/RPO documentation', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Controls', description: 'Depots and server rooms.', questions: [
          { id: 'LOG-4.4', text: 'Are truck depot gates and server rooms physically secured (locks, cameras)?', context: 'Photos', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.5', text: 'Is there badge/biometric access control for warehouse and data center areas?', context: 'Access control system', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.6', text: 'Are cargo handling areas under CCTV surveillance?', context: 'CCTV coverage map', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'monitoring', name: 'Real-time Alerts', description: 'Route deviations.', questions: [
          { id: 'LOG-4.7', text: 'Do you have real-time alerts for route deviations or system failures?', context: 'Monitoring dashboard', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.8', text: 'Is centralized logging/SIEM in place for TMS, WMS, and network systems?', context: 'SIEM dashboard', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.9', text: 'Are alerts configured for unauthorized access attempts to warehouse management systems?', context: 'Alert rules', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Disruption response plans.', questions: [
          { id: 'LOG-4.10', text: 'Is there a response plan for major disruptions (e.g. cyber attack on TMS)?', context: 'IR plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.11', text: 'Can logistics operations switch to manual processes during a system outage?', context: 'Manual fallback plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'LOG-4.12', text: 'Is there a communication plan for notifying clients during delivery system disruptions?', context: 'Communication plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOGISTICS_DATA };
}
