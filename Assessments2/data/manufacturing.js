const MANUFACTURING_DATA = {
  id: 'manufacturing',
  modules: [
    {
      id: 'ot_network', name: 'Network & ICS Segmentation', description: 'IT/OT isolation and firewalls.', icon: '🌐',
      categories: [
        { id: 'segmentation', name: 'IT/OT Segregation', description: 'Separating networks.', questions: [
          { id: 'MFG-1.1', text: 'Do you segregate your OT/Industrial Control Systems (ICS) network from IT network?', context: 'Network diagram', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'firewall', name: 'IoT Access Control', description: 'Restricting communications.', questions: [
          { id: 'MFG-1.2', text: 'Do you have firewalls or NAC to restrict communications to/from IoT devices?', context: 'Firewall config, policies', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'asset_mgmt', name: 'Asset Management (IoT/OT)', description: 'Inventory and patching.', icon: '💻',
      categories: [
        { id: 'inventory', name: 'Device Inventory', description: 'Tracking SCADA/IoT devices.', questions: [
          { id: 'MFG-2.1', text: 'Are IoT/SCADA devices (sensors, controllers) inventoried and patched?', context: 'Asset inventory, patch logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patch Management', description: 'IT and OT updates.', questions: [
          { id: 'MFG-2.2', text: 'Is there a patch management process for both IT and OT systems?', context: 'PMO policy, patch schedule', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'bcp_ir', name: 'Business Continuity & IR', description: 'Disaster recovery and incident response.', icon: '🔄',
      categories: [
        { id: 'ir', name: 'Incident Response', description: 'Planning for disruptions.', questions: [
          { id: 'MFG-3.1', text: 'Is there an incident response plan specific to production disruptions or ransomware?', context: 'IR plan, BCP procedures', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Data Backups', description: 'Protecting operational data.', questions: [
          { id: 'MFG-3.2', text: 'Are backups of operational data (CAD files, specs) stored offline and tested?', context: 'Backup logs, test reports', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_supply', name: 'Supply Chain/Vendor Risk', description: 'Remote access and vendor assessments.', icon: '🔗',
      categories: [
        { id: 'mfa', name: 'Remote Access', description: 'Vendor maintenance access.', questions: [
          { id: 'MFG-4.1', text: 'Do you require MFA for remote maintenance or vendor access to equipment?', context: 'MFA logs, vendor access records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vendor_docs', name: 'Supplier Security', description: 'Contracts and assessments.', questions: [
          { id: 'MFG-4.2', text: 'Are supplier and vendor security requirements documented (supplies, software)?', context: 'Contracts, questionnaires', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.3', text: 'Do you perform annual risk assessments for supply chain and vendor cyber risk?', context: 'Risk assessment report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_physical', name: 'IP & Physical Security', description: 'Design encryption and site security.', icon: '🛡️',
      categories: [
        { id: 'ip_encrypt', name: 'IP Encryption', description: 'Securing sensitive designs.', questions: [
          { id: 'MFG-5.1', text: 'Do you encrypt sensitive design/IP data at rest?', context: 'Encryption policy, logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Security', description: 'Guards and CCTV.', questions: [
          { id: 'MFG-5.2', text: 'Are physical security measures in place (CCTV, guards) around manufacturing floor/servers?', context: 'Security audit logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANUFACTURING_DATA };
}
