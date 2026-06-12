const ITSERVICES_DATA = {
  id: 'itservices',
  modules: [
    {
      id: 'sdlc', name: 'Secure SDLC & DevSecOps', description: 'Code reviews, secure development, and CI/CD security.', icon: '',
      categories: [
        { id: 'code_review', name: 'Code Scanning', description: 'SAST/DAST usage.', questions: [
          { id: 'ITS-1.1', text: 'Do you enforce code reviews and use SAST/DAST for all projects?', context: 'CI logs/reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.2', text: 'Is Software Composition Analysis (SCA) used to detect vulnerable open-source dependencies?', context: 'SCA scan results', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.3', text: 'Are container images scanned for vulnerabilities before deployment to production?', context: 'Container scan reports', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.4', text: 'Is secrets scanning (API keys, passwords) integrated into the CI/CD pipeline?', context: 'Secrets scan config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'guidelines', name: 'Development Policies', description: 'Secure dev practices.', questions: [
          { id: 'ITS-1.5', text: 'Is there a secure development guideline in place for developers?', context: 'Policy doc', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.6', text: 'Are developers trained on OWASP Top 10 and secure coding practices annually?', context: 'Training records', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.7', text: 'Is there a defined process for security sign-off before each production release?', context: 'Release checklist', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'cicd', name: 'CI/CD Security', description: 'Protecting build pipelines.', questions: [
          { id: 'ITS-1.8', text: 'Are CI/CD pipelines hardened with least-privilege access and audit logging?', context: 'Pipeline config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-1.9', text: 'Are build artifacts signed to ensure integrity before deployment?', context: 'Artifact signing config', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'cloud_iam', name: 'Cloud Security & IAM', description: 'MFA, least privilege, and cloud governance.', icon: '',
      categories: [
        { id: 'mfa', name: 'Cloud Authentication', description: 'MFA for cloud consoles.', questions: [
          { id: 'ITS-2.1', text: 'Is multi-factor authentication required for all cloud console logins?', context: 'IAM logs', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'ITS-2.2', text: 'Are cloud root/owner accounts secured with hardware MFA tokens?', context: 'Root account config', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'rbac', name: 'Access Control', description: 'Role-based access on cloud.', questions: [
          { id: 'ITS-2.3', text: 'Do you use role-based access on cloud resources (least privilege)?', context: 'Cloud IAM policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-2.4', text: 'Are service account permissions scoped narrowly and keys rotated regularly?', context: 'Service account audit', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-2.5', text: 'Is there a process for quarterly access reviews of cloud IAM permissions?', context: 'Access review logs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'cloud_config', name: 'Cloud Configuration', description: 'Hardening and compliance.', questions: [
          { id: 'ITS-2.6', text: 'Is Cloud Security Posture Management (CSPM) or equivalent used to detect misconfigurations?', context: 'CSPM dashboard', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-2.7', text: 'Are cloud storage buckets/blobs configured to prevent public access by default?', context: 'Storage access policies', weight: 5, options: [{label: 'No', value: 0}, {label: 'Partial', value: 3}, {label: 'Yes', value: 5}] },
          { id: 'ITS-2.8', text: 'Is infrastructure provisioned as code (IaC) with security scanning (e.g., Terraform, CloudFormation)?', context: 'IaC templates', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'endpoint_shadowit', name: 'Endpoint & SaaS Management', description: 'Device encryption, shadow IT, and remote work security.', icon: '',
      categories: [
        { id: 'endpoint', name: 'Workstation Security', description: 'MDM and encryption.', questions: [
          { id: 'ITS-3.1', text: 'Are all employee devices (workstations) encrypted and managed?', context: 'MDM logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-3.2', text: 'Is EDR (Endpoint Detection & Response) deployed on all developer workstations?', context: 'EDR deployment report', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-3.3', text: 'Are local admin privileges restricted on developer machines?', context: 'Local admin policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'shadow_it', name: 'Shadow IT', description: 'Controlling unsanctioned SaaS.', questions: [
          { id: 'ITS-3.4', text: 'Do you have an approved list of corporate apps (no unsanctioned SaaS)?', context: 'ITSM inventory', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-3.5', text: 'Is there a process for employees to request and get approval for new SaaS tools?', context: 'SaaS request workflow', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-3.6', text: 'Do you monitor for unauthorized SaaS usage via CASB or network analysis?', context: 'CASB reports', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'remote', name: 'Remote Work', description: 'Securing distributed teams.', questions: [
          { id: 'ITS-3.7', text: 'Is VPN or zero-trust network access required for remote employees accessing internal systems?', context: 'VPN policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-3.8', text: 'Are screen lock and auto-logout policies enforced on remote devices?', context: 'Device policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_repo', name: 'Data Protection & Code Repos', description: 'Client DBs, repo security, and data handling.', icon: '',
      categories: [
        { id: 'client_data', name: 'Database Encryption', description: 'Securing client data.', questions: [
          { id: 'ITS-4.1', text: 'Are client databases (even dev/test) encrypted and access-logged?', context: 'DB config', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-4.2', text: 'Is production data anonymized/masked before use in development or testing environments?', context: 'Data masking policy', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-4.3', text: 'Are data retention and deletion policies documented for each client engagement?', context: 'Retention policy', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'repo_backup', name: 'Repo Security', description: 'Source code protection.', questions: [
          { id: 'ITS-4.4', text: 'Are code repositories backed up and version-controlled offsite?', context: 'Repo logs', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-4.5', text: 'Are repository access controls configured with branch protection and required reviews?', context: 'Repo settings', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-4.6', text: 'Is there monitoring for leaked credentials or source code on public platforms (GitHub, Pastebin)?', context: 'Leak monitoring service', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    },
    {
      id: 'training_ir', name: 'Training, IR & Compliance', description: 'Security awareness, IR plans, and client compliance.', icon: '',
      categories: [
        { id: 'training', name: 'Phishing Awareness', description: 'Email and DevOps security training.', questions: [
          { id: 'ITS-5.1', text: 'Do you train staff on email security (common IT threats, safe dev ops)?', context: 'Training records', weight: 2, options: [{label: 'No', value: 0}, {label: 'Partial', value: 1}, {label: 'Yes', value: 5}] },
          { id: 'ITS-5.2', text: 'Are phishing simulations conducted at least quarterly?', context: 'Simulation results', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'ir', name: 'Incident Response', description: 'Planning for code/cloud breaches.', questions: [
          { id: 'ITS-5.3', text: 'Is there an incident plan for a code repo breach or cloud compromise?', context: 'IR plan', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-5.4', text: 'Is there a defined process for notifying clients in the event of a data breach?', context: 'Client notification SOP', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-5.5', text: 'Are post-incident reviews (blameless postmortems) conducted and lessons tracked?', context: 'Postmortem docs', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]},
        { id: 'compliance', name: 'Client Compliance', description: 'Meeting client security requirements.', questions: [
          { id: 'ITS-5.6', text: 'Do you maintain SOC 2, ISO 27001, or equivalent certification for client assurance?', context: 'Certification documents', weight: 4, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] },
          { id: 'ITS-5.7', text: 'Is there a process for responding to client security questionnaires and audits?', context: 'Questionnaire responses', weight: 3, options: [{label: 'No', value: 0}, {label: 'Partial', value: 2}, {label: 'Yes', value: 5}] }
        ]}
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITSERVICES_DATA };
}
