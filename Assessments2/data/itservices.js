const ITSERVICES_DATA = {
  id: 'itservices',
  modules: [
    {
      id: 'sdlc', name: 'Secure SDLC & DevSecOps', description: 'Code reviews and secure development.', icon: '💻',
      categories: [
        { id: 'code_review', name: 'Code Scanning', description: 'SAST/DAST usage.', questions: [
          { id: 'ITS-1.1', text: 'Do you enforce code reviews and use SAST/DAST for all projects?', context: 'CI logs/reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'guidelines', name: 'Development Policies', description: 'Secure dev practices.', questions: [
          { id: 'ITS-1.2', text: 'Is there a secure development guideline in place for developers?', context: 'Policy doc', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'cloud_iam', name: 'Cloud Security & IAM', description: 'MFA and least privilege in the cloud.', icon: '☁️',
      categories: [
        { id: 'mfa', name: 'Cloud Authentication', description: 'MFA for cloud consoles.', questions: [
          { id: 'ITS-2.1', text: 'Is multi-factor authentication required for all cloud console logins?', context: 'IAM logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Access Control', description: 'Role-based access on cloud.', questions: [
          { id: 'ITS-2.2', text: 'Do you use role-based access on cloud resources (least privilege)?', context: 'Cloud IAM policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_shadowit', name: 'Endpoint & SaaS Management', description: 'Device encryption and shadow IT.', icon: '📱',
      categories: [
        { id: 'endpoint', name: 'Workstation Security', description: 'MDM and encryption.', questions: [
          { id: 'ITS-3.1', text: 'Are all employee devices (workstations) encrypted and managed?', context: 'MDM logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'shadow_it', name: 'Shadow IT', description: 'Controlling unsanctioned SaaS.', questions: [
          { id: 'ITS-3.2', text: 'Do you have an approved list of corporate apps (no unsanctioned SaaS)?', context: 'ITSM inventory', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_repo', name: 'Data Protection & Code Repos', description: 'Client DBs and repo backups.', icon: '🛡️',
      categories: [
        { id: 'client_data', name: 'Database Encryption', description: 'Securing client data.', questions: [
          { id: 'ITS-4.1', text: 'Are client databases (even dev/test) encrypted and access-logged?', context: 'DB config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'repo_backup', name: 'Repo Backups', description: 'Backing up source code.', questions: [
          { id: 'ITS-4.2', text: 'Are code repositories backed up and version-controlled offsite?', context: 'Repo logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'training_ir', name: 'Training & Incident Response', description: 'Security awareness and IR plans.', icon: '🧠',
      categories: [
        { id: 'training', name: 'Phishing Awareness', description: 'Email and DevOps security training.', questions: [
          { id: 'ITS-5.1', text: 'Do you train staff on email security (common IT threats, safe dev ops)?', context: 'Training records', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Planning for code/cloud breaches.', questions: [
          { id: 'ITS-5.2', text: 'Is there an incident plan for a code repo breach or cloud compromise?', context: 'IR plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITSERVICES_DATA };
}
