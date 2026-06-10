const HEALTHCARE_DATA = {
  id: 'healthcare',
  modules: [
    {
      id: 'data_privacy', name: 'Data & Privacy (PHI)', description: 'Encryption and compliance for patient data.', icon: '🛡️',
      categories: [
        { id: 'encryption', name: 'Encryption', description: 'Patient data protection.', questions: [
          { id: 'HC-1.1', text: 'Do you encrypt patient/PHI data at rest and in transit (DB, EMR, devices)?', context: 'Encryption certificates/logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.2', text: 'Are encryption keys managed through a dedicated key management system with defined rotation?', context: 'KMS configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.3', text: 'Is TLS 1.2 or higher enforced on all patient-facing portals and health apps?', context: 'TLS scan results', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.4', text: 'Are portable devices (USB drives, external HDDs) containing PHI encrypted?', context: 'Device encryption policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'Compliance', description: 'HIPAA/PDPA programs.', questions: [
          { id: 'HC-1.5', text: 'Is there a formal HIPAA/PDPA compliance program or privacy officer designated?', context: 'Compliance policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.6', text: 'Do you conduct annual HIPAA risk assessments to identify gaps in PHI protection?', context: 'Risk assessment report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.7', text: 'Are Business Associate Agreements (BAAs) signed with all vendors handling PHI?', context: 'BAA documents', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.8', text: 'Is there a documented data breach notification procedure meeting regulatory timelines (e.g., 72 hours)?', context: 'Breach notification SOP', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'data_handling', name: 'Data Handling', description: 'Classification and retention.', questions: [
          { id: 'HC-1.9', text: 'Is patient data classified by sensitivity level (e.g., demographic vs. diagnosis vs. billing)?', context: 'Data classification policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-1.10', text: 'Are data retention and disposal schedules defined and enforced for patient records?', context: 'Retention schedule', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_medical', name: 'Endpoint & Medical Device Security', description: 'EDR, patching, and medical IoT segmentation.', icon: '💻',
      categories: [
        { id: 'edr', name: 'Endpoint Protection', description: 'Antivirus and EDR.', questions: [
          { id: 'HC-2.1', text: 'Do you use an EDR (Endpoint Detection & Response) or behavior-based antivirus on all hospital/clinic endpoints?', context: 'EDR deployment report', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.2', text: 'Are all workstations configured with host-based firewalls and automatic screen locks?', context: 'Group policy settings', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.3', text: 'Is full-disk encryption enabled on all clinical workstations and laptops?', context: 'Encryption status report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'Patching', description: 'System updates.', questions: [
          { id: 'HC-2.4', text: 'Are all systems (servers, medical devices, workstations) patched within 30 days?', context: 'Patch management logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.5', text: 'Do you have a process for patching legacy/end-of-life systems that cannot be updated (compensating controls)?', context: 'Legacy system policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.6', text: 'Is there a vulnerability management program that prioritizes patches by CVSS severity?', context: 'Vulnerability scan reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'iot', name: 'Medical Devices', description: 'Segmentation of medical equipment.', questions: [
          { id: 'HC-2.7', text: 'Do you segregate medical devices (MRI, infusion pumps) on a separate VLAN/air-gapped network?', context: 'Network diagrams', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.8', text: 'Is there a complete inventory of all connected medical devices including make, model, and firmware version?', context: 'Medical device inventory', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.9', text: 'Are default passwords changed on all medical IoT devices before deployment?', context: 'Device commissioning checklist', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-2.10', text: 'Do you assess cybersecurity risk of new medical devices during the procurement process?', context: 'Procurement checklist', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'access_training', name: 'Access Control & Training', description: 'MFA, RBAC, and phishing awareness.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'MFA', description: 'Multi-factor authentication.', questions: [
          { id: 'HC-3.1', text: 'Are staff required to use MFA for hospital systems (EMR, admin portals)?', context: 'MFA configuration screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-3.2', text: 'Is MFA enforced for remote/VPN access to clinical systems?', context: 'VPN MFA config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Role-Based Access', description: 'Least-privilege for clinical staff.', questions: [
          { id: 'HC-3.3', text: 'Is access to patient records restricted based on clinical role (e.g., nurse vs. billing vs. physician)?', context: 'RBAC matrix', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-3.4', text: 'Are privileged accounts (system admin, DBA) limited and monitored with elevated logging?', context: 'Privileged access management', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-3.5', text: 'Are user accounts deactivated within 24 hours of employment termination?', context: 'Off-boarding procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'training', name: 'Security Training', description: 'Staff awareness.', questions: [
          { id: 'HC-3.6', text: 'Do you conduct annual security awareness training (phishing simulations)?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-3.7', text: 'Are clinical staff trained on secure handling of PHI (verbal, printed, and digital)?', context: 'Training materials', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-3.8', text: 'Is there role-specific security training for IT administrators handling health systems?', context: 'Advanced training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'monitoring_physical', name: 'Monitoring & Physical Security', description: 'Logging, SIEM, and physical access controls.', icon: '👁️',
      categories: [
        { id: 'monitoring', name: 'Access Logging', description: 'Monitoring of patient records.', questions: [
          { id: 'HC-4.1', text: 'Do you log and monitor access to patient records and admin systems 24/7?', context: 'SIEM/monitoring screenshots', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.2', text: 'Are automated alerts configured for unusual EMR access patterns (e.g., bulk record views)?', context: 'Alert configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.3', text: 'Are audit logs tamper-proof and retained for at least 6 years (HIPAA requirement)?', context: 'Log retention policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.4', text: 'Is there a process for periodic review of access logs to detect insider threats?', context: 'Log review schedule', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'physical', name: 'Physical Security', description: 'Server and pharmacy locks.', questions: [
          { id: 'HC-4.5', text: 'Are physical areas (server room, pharmacy) locked and access-logged?', context: 'Access log prints', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.6', text: 'Are workstations in public areas (reception, nurse stations) positioned to prevent screen visibility by patients?', context: 'Workstation placement policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.7', text: 'Is CCTV monitoring active in areas with sensitive equipment (data centers, lab)?', context: 'CCTV coverage map', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-4.8', text: 'Are visitor access procedures enforced for restricted clinical and IT areas?', context: 'Visitor log', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'backup_ir', name: 'Backup, IR & Network Security', description: 'Ransomware readiness, network, and disaster recovery.', icon: '🔄',
      categories: [
        { id: 'backup', name: 'Offline Backups', description: 'Data backups.', questions: [
          { id: 'HC-5.1', text: 'Are there offline (disconnected) backups of critical data (imaging, records)?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] },
          { id: 'HC-5.2', text: 'Are backup restoration procedures tested at least quarterly?', context: 'Restoration test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Annually', value: 2}, {label: 'Quarterly+', value: 5}] },
          { id: 'HC-5.3', text: 'Are backups encrypted and stored in a geographically separate location?', context: 'Backup architecture diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rto', name: 'Recovery Time', description: 'Restoration speed.', questions: [
          { id: 'HC-5.4', text: 'How quickly can you restore operations from backups after an outage?', context: 'RTO/RPO documentation', weight: 4, options: [{label: 'More than 3 days', value: 1}, {label: '1-3 days', value: 3}, {label: 'Under 24 hours', value: 5}] },
          { id: 'HC-5.5', text: 'Is there a defined RPO (Recovery Point Objective) for critical patient systems?', context: 'RPO documentation', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'IR planning.', questions: [
          { id: 'HC-5.6', text: 'Is an incident response team/plan in place for cyber incidents?', context: 'IR plan document', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'HC-5.7', text: 'Are tabletop exercises or IR drills conducted at least annually?', context: 'Drill reports', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-5.8', text: 'Is there a designated communication plan for notifying patients and regulators after a breach?', context: 'Communication plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'network', name: 'Network Security', description: 'Segmentation and monitoring.', questions: [
          { id: 'HC-5.9', text: 'Is the clinical network segmented from administrative and guest Wi-Fi networks?', context: 'Network architecture diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'HC-5.10', text: 'Are intrusion detection/prevention systems (IDS/IPS) deployed on the hospital network?', context: 'IDS/IPS configuration', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HEALTHCARE_DATA };
}
