const LOGISTICS_DATA = {
  id: 'logistics',
  modules: [
    {
      id: 'iot_assets', name: 'IoT & Asset Security', description: 'Tracking devices and inventory.', icon: '🛰️',
      categories: [
        { id: 'iot', name: 'GPS/IoT Tracking', description: 'Securing tracking devices.', questions: [
          { id: 'LOG-1.1', text: 'Are all tracking devices (GPS/IoT) on unique accounts (no default credentials)?', context: 'Device config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'inventory', name: 'Asset Management', description: 'Mapping IT/IoT assets.', questions: [
          { id: 'LOG-1.2', text: 'Do you map and classify all IT/IoT assets (asset inventory)?', context: 'Asset inventory', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_data', name: 'Network & Data Protection', description: 'VPN access and encryption.', icon: '🌐',
      categories: [
        { id: 'vpn', name: 'Remote Access', description: 'Warehouse and server access.', questions: [
          { id: 'LOG-2.1', text: 'Is remote warehouse/server access via VPN or zero-trust?', context: 'VPN logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'encryption', name: 'Data Encryption', description: 'Protecting shipment data.', questions: [
          { id: 'LOG-2.2', text: 'Is shipment/customer data encrypted in transit (mobile apps) and at rest?', context: 'TLS config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_staff', name: 'Third-Party & Staff Training', description: 'Carriers and dispatchers.', icon: '👥',
      categories: [
        { id: 'vendor', name: 'Partner Vetting', description: 'Cargo vendors and carriers.', questions: [
          { id: 'LOG-3.1', text: 'Do you vet partner carriers/cargo vendors for security (e.g. data sharing agreements)?', context: 'Vendor audits/SLA', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Awareness', description: 'Driver and dispatcher training.', questions: [
          { id: 'LOG-3.2', text: 'Are drivers/dispatchers trained to report phishing and system anomalies?', context: 'Training log', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'resilience_physical', name: 'Resilience & Physical Security', description: 'Backups, monitoring, and gates.', icon: '🏢',
      categories: [
        { id: 'backup', name: 'Data Backups', description: 'Logistics data backups.', questions: [
          { id: 'LOG-4.1', text: 'Is logistics data (routes, manifests) backed up to offsite/cloud?', context: 'Backup logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Controls', description: 'Depots and server rooms.', questions: [
          { id: 'LOG-4.2', text: 'Are truck depot gates and server rooms physically secured (locks, cameras)?', context: 'Photos', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'monitoring', name: 'Real-time Alerts', description: 'Route deviations.', questions: [
          { id: 'LOG-4.3', text: 'Do you have real-time alerts for route deviations or system failures?', context: 'Monitoring dashboard', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Disruption response plans.', questions: [
          { id: 'LOG-4.4', text: 'Is there a response plan for major disruptions (e.g. cyber attack on TMS)?', context: 'IR plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOGISTICS_DATA };
}
