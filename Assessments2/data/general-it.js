// ============================================
// General IT Environment Security Review
// Based on Cyber Resilience Review & Network Infrastructure Review
// From Module1-Cyber Resilience Review.docx
// ============================================

const GENERALIT_DATA = {
  id: 'generalit',
  modules: [
    {
      id: 'org_overview', name: 'Organization Overview', description: 'Understand the organization size, structure, critical data, and business impact of IT systems.', icon: '🏢',
      categories: [
        { id: 'org', name: 'Organizational Profile', description: 'Basic organizational context for the security assessment.', questions: [
          { id: 'GIT-1.1', text: 'Critical data and systems are identified and documented', context: 'What kind of data or systems are most critical to your daily business? (customer data, financial records, IP, operational systems)', options: [{label: 'Not in Place', value: 1, detail: 'No critical systems identified'}, {label: 'Basic', value: 2, detail: 'Some awareness of critical systems'}, {label: 'Developing', value: 3, detail: 'Most critical systems identified'}, {label: 'Established', value: 4, detail: 'Full classification of critical assets'}, {label: 'Advanced', value: 5, detail: 'Documented with BIA and regular review'}] },
          { id: 'GIT-1.2', text: 'Business impact of IT downtime is understood', context: 'What would be the biggest impact if your IT systems went down for a day? (Operations, finances, customer trust)', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-1.3', text: 'IT asset inventory is maintained', context: 'Do you maintain an inventory of all IT assets including servers, endpoints, and network devices?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-1.4', text: 'Device count and types are documented', context: 'Do you know the exact count and types of servers, workstations, laptops, and mobile devices on your network?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    },
    {
      id: 'security_awareness', name: 'Security Awareness & Culture', description: 'Evaluate security awareness programs, incident history, and organizational security culture.', icon: '🧠',
      categories: [
        { id: 'awareness', name: 'Security Awareness', description: 'Security concerns, incident history, and employee preparedness.', questions: [
          { id: 'GIT-2.1', text: 'Top security concerns are identified and prioritized', context: 'Have you identified your top security concerns? (ransomware, data leaks, insider risks, phishing, downtime)', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-2.2', text: 'Past security incidents are documented and lessons learned', context: 'Have you experienced past incidents (suspicious emails, malware, data loss) and are they documented?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-2.3', text: 'Employees know how to respond to security threats', context: 'Do employees know what to do when they encounter a suspicious email or potential security issue?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-2.4', text: 'Regular security awareness training is conducted', context: 'Do employees receive regular cybersecurity training with phishing simulations?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    },
    {
      id: 'technology_platforms', name: 'Technology & Platforms', description: 'Evaluate the technology stack including email, cloud services, and SaaS dependencies.', icon: '☁️',
      categories: [
        { id: 'tech', name: 'Technology Stack', description: 'Email, cloud, and SaaS platforms.', questions: [
          { id: 'GIT-3.1', text: 'Email platform security is configured properly', context: 'Is your email platform (Office 365, Google Workspace) configured with security best practices (SPF, DKIM, DMARC)?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-3.2', text: 'Cloud service security is properly managed', context: 'If using cloud services (AWS, Azure, GCP), are security configurations properly managed?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-3.3', text: 'SaaS application security is evaluated', context: 'Are the security practices of your SaaS tools evaluated before adoption?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-3.4', text: 'Shadow IT is identified and managed', context: 'Do you track and manage unauthorized SaaS and cloud services used by employees?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    },
    {
      id: 'current_security', name: 'Current IT & Security Setup', description: 'Evaluate existing security tools, services, and managed security service providers.', icon: '🛡️',
      categories: [
        { id: 'security_tools', name: 'Security Tools & Services', description: 'Current security infrastructure and services.', questions: [
          { id: 'GIT-4.1', text: 'Managed Security Service Provider (MSSP) or internal IT security team is in place', context: 'Do you work with an MSSP or have dedicated internal IT security staff?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-4.2', text: 'Endpoint protection (antivirus/EDR) is deployed across all endpoints', context: 'Is antivirus or EDR protection deployed on all servers and workstations?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-4.3', text: 'Email security solution is in place', context: 'Do you have email security (spam filtering, phishing protection, attachment scanning)?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-4.4', text: 'Firewall protection is properly configured', context: 'Is your network protected by a properly configured next-gen firewall?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-4.5', text: 'SIEM or centralized logging is implemented', context: 'Do you have a SIEM or logging solution for centralized security event monitoring?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-4.6', text: 'Backup and disaster recovery solutions are in place', context: 'Do you have reliable backup and disaster recovery solutions that are regularly tested?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    },
    {
      id: 'compliance_outlook', name: 'Compliance & Future Outlook', description: 'Current compliance posture and future security improvement plans.', icon: '📅',
      categories: [
        { id: 'compliance', name: 'Compliance & Roadmap', description: 'Log retention requirements, security roadmap, and improvement plans.', questions: [
          { id: 'GIT-5.1', text: 'Compliance-driven log retention requirements are met', context: 'Do you have policy requirements for log retention, and are they being met?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-5.2', text: 'Security improvement roadmap is planned', context: 'Are you planning to upgrade or add security tools in the next 12 months?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-5.3', text: 'Security budget is allocated and adequate', context: 'Is there dedicated budget for cybersecurity tools and services?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-5.4', text: 'Cybersecurity strategy is documented', context: 'Does your organization have a documented cybersecurity strategy?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    },
    {
      id: 'network_infra', name: 'Network & Infrastructure', description: 'Evaluate network architecture, segmentation, remote access, and monitoring capabilities.', icon: '🌐',
      categories: [
        { id: 'perimeter', name: 'Internet & Perimeter Security', description: 'Internet connectivity and perimeter defense.', questions: [
          { id: 'GIT-6.1', text: 'Internet egress points are identified and secured', context: 'How many internet egress points do you maintain and are they all secured?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.2', text: 'Intrusion detection/prevention systems are deployed at network boundaries', context: 'Are IDS/IPS or NDR solutions deployed at internet connection points?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]},
        { id: 'segmentation', name: 'Network Segmentation', description: 'Network architecture and segmentation.', questions: [
          { id: 'GIT-6.3', text: 'Network is properly segmented with VLANs and firewall rules', context: 'Is your network segmented to separate production, guest, admin, and critical systems?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.4', text: 'Wireless access points are secured and monitored', context: 'Are wireless access points using WPA3/WPA2-Enterprise with proper segmentation?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]},
        { id: 'remote_access', name: 'Remote Access & VPN', description: 'Secure remote access controls.', questions: [
          { id: 'GIT-6.5', text: 'VPN solution with MFA is used for remote access', context: 'Is remote access managed through a VPN with multi-factor authentication?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.6', text: 'Remote desktop services are properly secured', context: 'If using RDP or remote desktop, are they secured with MFA and restricted access?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]},
        { id: 'monitoring', name: 'Logging & Monitoring', description: 'Log collection and monitoring capabilities.', questions: [
          { id: 'GIT-6.7', text: 'Central syslog server or log management platform is maintained', context: 'Do you have centralized logging for network devices, servers, and security tools?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.8', text: 'Network traffic is monitored for anomalies', context: 'Is east-west and north-south network traffic monitored for suspicious activity?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.9', text: 'Network topology and architecture diagrams are maintained', context: 'Do you have up-to-date network topology and data flow diagrams?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] },
          { id: 'GIT-6.10', text: 'Zero Trust principles are enforced', context: 'Do you enforce Zero Trust principles like least privilege, network access control, or continuous authentication?', options: [{label: 'Not in Place', value: 1}, {label: 'Basic', value: 2}, {label: 'Developing', value: 3}, {label: 'Established', value: 4}, {label: 'Advanced', value: 5}] }
        ]}
      ]
    }
  ]
};
