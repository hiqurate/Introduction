const HEALTHCARE_DATA = {
  id: 'healthcare',
  modules: [
    {
      id: 'data_privacy', name: 'Data & Privacy (PHI)', description: 'Encryption and compliance for patient data.', icon: '🛡️',
      categories: [
        { id: 'encryption', name: 'Encryption', description: 'Patient data protection.', questions: [
          { id: 'HC-1.1', text: 'Do you encrypt patient/PHI data at rest and in transit (DB, EMR, devices)?', context: 'Encryption certificates/logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'Compliance', description: 'HIPAA/PDPA programs.', questions: [
          { id: 'HC-1.2', text: 'Is there a formal HIPAA/PDPA compliance program or privacy officer designated?', context: 'Compliance policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_medical', name: 'Endpoint & Medical Device Security', description: 'EDR, patching, and medical IoT segmentation.', icon: '💻',
      categories: [
        { id: 'edr', name: 'Endpoint Protection', description: 'Antivirus and EDR.', questions: [
          { id: 'HC-2.1', text: 'Do you use an EDR (Endpoint Detection & Response) or behavior-based antivirus on all hospital/clinic endpoints?', context: 'EDR deployment report', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patching', description: 'System updates.', questions: [
          { id: 'HC-2.2', text: 'Are all systems (servers, medical devices, workstations) patched within 30 days?', context: 'Patch management logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'iot', name: 'Medical Devices', description: 'Segmentation of medical equipment.', questions: [
          { id: 'HC-2.3', text: 'Do you segregate medical devices (MRI, infusion pumps) on a separate VLAN/air-gapped network?', context: 'Network diagrams', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'access_training', name: 'Access Control & Training', description: 'MFA and phishing awareness.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'MFA', description: 'Multi-factor authentication.', questions: [
          { id: 'HC-3.1', text: 'Are staff required to use MFA for hospital systems (EMR, admin portals)?', context: 'MFA configuration screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Security Training', description: 'Staff awareness.', questions: [
          { id: 'HC-3.2', text: 'Do you conduct annual security awareness training (phishing simulations)?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'monitoring_physical', name: 'Monitoring & Physical Security', description: 'Logging and physical access.', icon: '👁️',
      categories: [
        { id: 'monitoring', name: 'Access Logging', description: 'Monitoring of patient records.', questions: [
          { id: 'HC-4.1', text: 'Do you log and monitor access to patient records and admin systems 24/7?', context: 'SIEM/monitoring screenshots', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Security', description: 'Server and pharmacy locks.', questions: [
          { id: 'HC-4.2', text: 'Are physical areas (server room, pharmacy) locked and access-logged?', context: 'Access log prints', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'backup_ir', name: 'Backup & Incident Response', description: 'Ransomware readiness.', icon: '🔄',
      categories: [
        { id: 'backup', name: 'Offline Backups', description: 'Data backups.', questions: [
          { id: 'HC-5.1', text: 'Are there offline (disconnected) backups of critical data (imaging, records)?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] }
        ]},
        { id: 'rto', name: 'Recovery Time', description: 'Restoration speed.', questions: [
          { id: 'HC-5.2', text: 'How quickly can you restore operations from backups after an outage?', context: 'RTO/RPO documentation', weight: 4, options: [{label: 'More than 3 days', value: 1}, {label: '1-3 days', value: 3}, {label: 'Under 24 hours', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'IR planning.', questions: [
          { id: 'HC-5.3', text: 'Is an incident response team/plan in place for cyber incidents?', context: 'IR plan document', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HEALTHCARE_DATA };
}
