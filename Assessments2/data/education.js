const EDUCATION_DATA = {
  id: 'education',
  modules: [
    {
      id: 'access_control', name: 'Access Control (MFA)', description: 'MFA, account management, and identity governance.', icon: '🔐',
      categories: [
        { id: 'mfa', name: 'Authentication', description: 'Protecting staff and student accounts.', questions: [
          { id: 'EDU-1.1', text: 'Are student/staff accounts protected with MFA (especially admin)?', context: 'MFA config screenshot', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.2', text: 'Are shared/generic accounts eliminated or strictly controlled in educational systems?', context: 'Account audit report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.3', text: 'Is Single Sign-On (SSO) implemented for staff access to LMS, SIS, and email?', context: 'SSO configuration', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.4', text: 'Are strong password policies enforced for all staff and admin accounts?', context: 'Password policy document', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'logs', name: 'Access Logging', description: 'Reviewing authentication logs.', questions: [
          { id: 'EDU-1.5', text: 'Do you log and review network access/authentication logs regularly?', context: 'SIEM reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.6', text: 'Are failed login attempts monitored and accounts locked after repeated failures?', context: 'Lockout policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.7', text: 'Are user accounts deactivated promptly when students graduate or staff leave?', context: 'Off-boarding procedure', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Role-Based Access', description: 'Restricting access by role.', questions: [
          { id: 'EDU-1.8', text: 'Is access to student records (grades, health, financial aid) restricted by role?', context: 'RBAC matrix', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-1.9', text: 'Do administrators have separate accounts for daily use vs. privileged admin tasks?', context: 'Admin account policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_patch', name: 'Endpoint & Patch Management', description: 'EDR, LMS updates, and device management.', icon: '💻',
      categories: [
        { id: 'mdm', name: 'Device Management', description: 'Managing student/staff devices.', questions: [
          { id: 'EDU-2.1', text: 'Are laptops/tablets used by students managed by the school (EDR/antivirus)?', context: 'MDM/EDR logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-2.2', text: 'Is there an approved BYOD policy with minimum security requirements for personal devices?', context: 'BYOD policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-2.3', text: 'Are school-issued devices encrypted and configured with remote wipe capability?', context: 'MDM console', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-2.4', text: 'Are lab computers reset to a clean state between user sessions (e.g., Deep Freeze)?', context: 'Lab management policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'patching', name: 'System Updates', description: 'Patching educational platforms.', questions: [
          { id: 'EDU-2.5', text: 'Do you regularly update/patch learning management systems and admin portals?', context: 'Update schedule, logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'EDU-2.6', text: 'Are critical security patches applied within 30 days across all school IT systems?', context: 'Patch compliance report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-2.7', text: 'Is there an inventory of all software used across the institution (including free/open-source)?', context: 'Software inventory', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_data', name: 'Network & Data Protection', description: 'Segmentation, student privacy, and data controls.', icon: '🌐',
      categories: [
        { id: 'segmentation', name: 'Network Segmentation', description: 'Guest vs. staff networks.', questions: [
          { id: 'EDU-3.1', text: 'Are school networks segmented (guest Wi-Fi vs staff vs servers)?', context: 'Network config diagram', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.2', text: 'Is web content filtering applied on student networks to block malicious sites?', context: 'Content filter config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.3', text: 'Are firewall rules reviewed and updated at least annually?', context: 'Firewall review records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.4', text: 'Is DNS filtering or DNS security implemented to block known malicious domains?', context: 'DNS filter config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'privacy', name: 'Student Data Privacy', description: 'Encrypting records and compliance.', questions: [
          { id: 'EDU-3.5', text: 'Is personal data of minors (health, guardian info) encrypted and access-controlled?', context: 'Data protection policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.6', text: 'Are you compliant with student data privacy regulations (FERPA, COPPA, or local equivalents)?', context: 'Compliance documentation', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.7', text: 'Is there a data classification policy distinguishing public, internal, and confidential student data?', context: 'Data classification matrix', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.8', text: 'Are third-party edtech vendors assessed for data privacy before adoption?', context: 'Vendor privacy assessment', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'dlp', name: 'File Sharing', description: 'Monitoring cloud and USB transfers.', questions: [
          { id: 'EDU-3.9', text: 'Do you restrict and monitor file sharing (e.g. Google Drive, USB) to prevent data leaks?', context: 'DLP policy, logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-3.10', text: 'Are email and communication platforms configured to prevent external sharing of sensitive data?', context: 'Email DLP rules', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'backup_continuity', name: 'Backup & Continuity', description: 'Protecting educational records and disaster recovery.', icon: '🔄',
      categories: [
        { id: 'backup', name: 'Data Backups', description: 'Offline backups of grades/records.', questions: [
          { id: 'EDU-4.1', text: 'Are backups of student records and admin data kept offsite/offline?', context: 'Backup logs', weight: 5, options: [{label: 'Never', value: 0}, {label: 'Monthly', value: 2}, {label: 'Weekly', value: 4}, {label: 'Daily', value: 5}] },
          { id: 'EDU-4.2', text: 'Are backup restoration procedures tested at least annually?', context: 'Restoration test reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-4.3', text: 'Are exam papers and assessment results backed up separately from general data?', context: 'Exam backup policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Notifying parents and authorities.', questions: [
          { id: 'EDU-4.4', text: 'Is there a plan for incident communication (to parents, authorities) if breach occurs?', context: 'Communication plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-4.5', text: 'Is there a documented incident response plan specific to educational data breaches?', context: 'IR plan', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-4.6', text: 'Are roles and responsibilities clearly defined for the IR team (IT, admin, legal)?', context: 'IR team roster', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-4.7', text: 'Is there a defined RTO for restoring student information systems after an incident?', context: 'RTO documentation', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'awareness_policies', name: 'Awareness, Policies & Email', description: 'Training, platform audits, and email security.', icon: '🧠',
      categories: [
        { id: 'training', name: 'Security Training', description: 'Educating staff and students.', questions: [
          { id: 'EDU-5.1', text: 'Do employees and students receive security awareness training (phishing/QR)?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-5.2', text: 'Are phishing simulation exercises conducted at least annually for staff?', context: 'Phishing sim results', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-5.3', text: 'Is there age-appropriate cyber safety education included in the curriculum?', context: 'Curriculum outline', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] },
          { id: 'EDU-5.4', text: 'Are IT staff given specialized training on educational technology security?', context: 'IT training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'audit', name: 'Platform Audits', description: 'Assessing SIS and LMS.', questions: [
          { id: 'EDU-5.5', text: 'Are major educational platforms (SIS, LMS) audited for security?', context: 'Audit reports', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-5.6', text: 'Is there an acceptable use policy for school IT resources signed by staff and students?', context: 'AUP document', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'email', name: 'Email Security', description: 'Protecting school email.', questions: [
          { id: 'EDU-5.7', text: 'Are SPF, DKIM, and DMARC configured for the school email domain?', context: 'DNS records', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'EDU-5.8', text: 'Is there email filtering to block phishing and malware targeting staff and students?', context: 'Email filter config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDUCATION_DATA };
}
