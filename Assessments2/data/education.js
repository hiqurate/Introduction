const EDUCATION_DATA = {
  id: 'education',
  modules: [
    {
      id: 'access_control', name: 'Access Control (MFA)', description: 'MFA and account management.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'Protecting staff and student accounts.', questions: [
          { id: 'EDU-1.1', text: 'Are student/staff accounts protected with MFA (especially admin)?', context: 'MFA config screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'logs', name: 'Access Logging', description: 'Reviewing authentication logs.', questions: [
          { id: 'EDU-1.2', text: 'Do you log and review network access/authentication logs regularly?', context: 'SIEM reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_patch', name: 'Endpoint & Patch Management', description: 'EDR and LMS updates.', icon: '💻',
      categories: [
        { id: 'mdm', name: 'Device Management', description: 'Managing student/staff devices.', questions: [
          { id: 'EDU-2.1', text: 'Are laptops/tablets used by students managed by the school (EDR/antivirus)?', context: 'MDM/EDR logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'System Updates', description: 'Patching educational platforms.', questions: [
          { id: 'EDU-2.2', text: 'Do you regularly update/patch learning management systems and admin portals?', context: 'Update schedule, logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_data', name: 'Network & Data Protection', description: 'Segmentation and student privacy.', icon: '🌐',
      categories: [
        { id: 'segmentation', name: 'Network Segmentation', description: 'Guest vs. staff networks.', questions: [
          { id: 'EDU-3.1', text: 'Are school networks segmented (guest Wi-Fi vs staff vs servers)?', context: 'Network config diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'privacy', name: 'Student Data Privacy', description: 'Encrypting records.', questions: [
          { id: 'EDU-3.2', text: 'Is personal data of minors (health, guardian info) encrypted and access-controlled?', context: 'Data protection policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'dlp', name: 'File Sharing', description: 'Monitoring cloud and USB transfers.', questions: [
          { id: 'EDU-3.3', text: 'Do you restrict and monitor file sharing (e.g. Google Drive, USB) to prevent data leaks?', context: 'DLP policy, logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'backup_continuity', name: 'Backup & Continuity', description: 'Protecting educational records.', icon: '🔄',
      categories: [
        { id: 'backup', name: 'Data Backups', description: 'Offline backups of grades/records.', questions: [
          { id: 'EDU-4.1', text: 'Are backups of student records and admin data kept offsite/offline?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Communication', description: 'Notifying parents and authorities.', questions: [
          { id: 'EDU-4.2', text: 'Is there a plan for incident communication (to parents, authorities) if breach occurs?', context: 'Communication plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'awareness_policies', name: 'Awareness & Policies', description: 'Training and platform audits.', icon: '🧠',
      categories: [
        { id: 'training', name: 'Security Training', description: 'Educating staff and students.', questions: [
          { id: 'EDU-5.1', text: 'Do employees and students receive security awareness training (phishing/QR)?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'audit', name: 'Platform Audits', description: 'Assessing SIS and LMS.', questions: [
          { id: 'EDU-5.2', text: 'Are major educational platforms (SIS, LMS) audited for security?', context: 'Audit reports', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDUCATION_DATA };
}
