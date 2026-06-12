const MANUFACTURING_DATA = {
  id: 'manufacturing',
  modules: [
    {
      id: 'ot_network', name: 'Network & ICS Segmentation', description: 'IT/OT isolation, firewalls, and network controls.', icon: '',
      categories: [
        { id: 'segmentation', name: 'IT/OT Segregation', description: 'Separating networks.', questions: [
          { id: 'MFG-1.1', text: 'Do you segregate your OT/Industrial Control Systems (ICS) network from IT network?', context: 'Network diagram', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.2', text: 'Is a DMZ (demilitarized zone) used between IT and OT networks for data exchange?', context: 'DMZ architecture', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.3', text: 'Are network diagrams maintained and updated showing all IT/OT interconnections?', context: 'Network documentation', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.4', text: 'Is wireless access on the manufacturing floor restricted and monitored?', context: 'Wireless policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'firewall', name: 'IoT Access Control', description: 'Restricting communications.', questions: [
          { id: 'MFG-1.5', text: 'Do you have firewalls or NAC to restrict communications to/from IoT devices?', context: 'Firewall config, policies', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.6', text: 'Are industrial protocol communications (Modbus, OPC UA) filtered and monitored?', context: 'Protocol monitoring config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.7', text: 'Is outbound internet access blocked from OT/ICS devices unless explicitly required?', context: 'Firewall rules', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'monitoring', name: 'Network Monitoring', description: 'Detecting anomalies on OT network.', questions: [
          { id: 'MFG-1.8', text: 'Is there network traffic monitoring or anomaly detection on the OT network?', context: 'OT monitoring tool', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-1.9', text: 'Are IDS/IPS systems deployed specifically for industrial network traffic?', context: 'IDS/IPS config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'asset_mgmt', name: 'Asset Management (IoT/OT)', description: 'Inventory, patching, and lifecycle management.', icon: '',
      categories: [
        { id: 'inventory', name: 'Device Inventory', description: 'Tracking SCADA/IoT devices.', questions: [
          { id: 'MFG-2.1', text: 'Are IoT/SCADA devices (sensors, controllers) inventoried and patched?', context: 'Asset inventory, patch logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.2', text: 'Is there a complete asset register including firmware versions and end-of-life dates?', context: 'Asset register', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.3', text: 'Are unauthorized devices automatically detected when connected to the OT network?', context: 'NAC/device detection logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patch Management', description: 'IT and OT updates.', questions: [
          { id: 'MFG-2.4', text: 'Is there a patch management process for both IT and OT systems?', context: 'PMO policy, patch schedule', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.5', text: 'Are patches tested in a staging environment before deployment to production OT systems?', context: 'Patch testing procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.6', text: 'Are compensating controls applied for legacy OT systems that cannot be patched?', context: 'Compensating controls doc', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.7', text: 'Is vulnerability scanning performed on IT systems connected to the manufacturing network?', context: 'Vulnerability scan reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'access', name: 'Access Control', description: 'Authentication for OT systems.', questions: [
          { id: 'MFG-2.8', text: 'Are default passwords changed on all PLCs, HMIs, and SCADA systems?', context: 'Password change records', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.9', text: 'Is role-based access control enforced on HMI and SCADA interfaces?', context: 'RBAC configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-2.10', text: 'Are operator actions on critical control systems logged and auditable?', context: 'Audit logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'bcp_ir', name: 'Business Continuity & IR', description: 'Disaster recovery and incident response.', icon: '',
      categories: [
        { id: 'ir', name: 'Incident Response', description: 'Planning for disruptions.', questions: [
          { id: 'MFG-3.1', text: 'Is there an incident response plan specific to production disruptions or ransomware?', context: 'IR plan, BCP procedures', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.2', text: 'Are IR drills/tabletop exercises conducted at least annually including OT scenarios?', context: 'Drill reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.3', text: 'Is there a defined escalation procedure for OT-specific security incidents?', context: 'Escalation matrix', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.4', text: 'Can production line operations switch to manual/standalone mode during a cyber incident?', context: 'Manual operations procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'backup', name: 'Data Backups', description: 'Protecting operational data.', questions: [
          { id: 'MFG-3.5', text: 'Are backups of operational data (CAD files, specs) stored offline and tested?', context: 'Backup logs, test reports', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.6', text: 'Are PLC/HMI configurations backed up and version-controlled?', context: 'Config backup logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.7', text: 'Is there a defined RTO/RPO for critical production systems?', context: 'BCP metrics', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-3.8', text: 'Are backup restoration procedures tested at least semi-annually?', context: 'Restoration test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'vendor_supply', name: 'Supply Chain/Vendor Risk', description: 'Remote access, vendor assessments, and supply chain.', icon: '',
      categories: [
        { id: 'mfa', name: 'Remote Access', description: 'Vendor maintenance access.', questions: [
          { id: 'MFG-4.1', text: 'Do you require MFA for remote maintenance or vendor access to equipment?', context: 'MFA logs, vendor access records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.2', text: 'Is vendor remote access time-limited and monitored (no persistent VPN)?', context: 'Remote access policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.3', text: 'Are remote maintenance sessions logged and recorded for audit purposes?', context: 'Session recordings', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'vendor_docs', name: 'Supplier Security', description: 'Contracts and assessments.', questions: [
          { id: 'MFG-4.4', text: 'Are supplier and vendor security requirements documented (supplies, software)?', context: 'Contracts, questionnaires', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.5', text: 'Do you perform annual risk assessments for supply chain and vendor cyber risk?', context: 'Risk assessment report', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.6', text: 'Is there a process for verifying the integrity of firmware/software updates from equipment vendors?', context: 'Firmware verification process', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-4.7', text: 'Are supply chain dependencies mapped to identify single points of failure?', context: 'Dependency mapping', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_physical', name: 'IP, Physical Security & Training', description: 'Design encryption, site security, and staff awareness.', icon: '',
      categories: [
        { id: 'ip_encrypt', name: 'IP Encryption', description: 'Securing sensitive designs.', questions: [
          { id: 'MFG-5.1', text: 'Do you encrypt sensitive design/IP data at rest?', context: 'Encryption policy, logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.2', text: 'Is DLP (Data Loss Prevention) in place to prevent unauthorized transfer of design files?', context: 'DLP configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.3', text: 'Are USB ports and removable media restricted on systems with access to sensitive IP?', context: 'USB policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Security', description: 'Guards and CCTV.', questions: [
          { id: 'MFG-5.4', text: 'Are physical security measures in place (CCTV, guards) around manufacturing floor/servers?', context: 'Security audit logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.5', text: 'Is physical access to control rooms restricted to authorized personnel with badge/biometric?', context: 'Access control system', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.6', text: 'Are environmental controls (fire suppression, temperature, UPS) in place for server and control rooms?', context: 'Environmental monitoring', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Staff Training', description: 'OT and cyber awareness.', questions: [
          { id: 'MFG-5.7', text: 'Do plant floor operators receive cybersecurity awareness training?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.8', text: 'Are IT and OT teams cross-trained on each other\'s security requirements?', context: 'Cross-training curriculum', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'MFG-5.9', text: 'Is there a clear reporting procedure for operators who notice unusual system behavior?', context: 'Reporting procedure', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANUFACTURING_DATA };
}
