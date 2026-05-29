// ============================================
// PCI-DSS v4.0 Compliance Assessment
// 12 Requirements, 6 Goals
// ============================================

const PCIDSS_DATA = {
  id: 'pcidss',
  modules: [
    {
      id: 'network_security', name: 'Build & Maintain Secure Network', description: 'Install and maintain network security controls and apply secure configurations to all system components.', icon: '🌐',
      categories: [
        { id: 'req1', name: 'Req 1: Network Security Controls', description: 'Install and maintain network security controls.', questions: [
          { id: 'PCI-1.1', text: 'Firewalls are installed between all wireless networks and the cardholder data environment', context: 'Are firewalls deployed at all network boundaries and between wireless/CDE networks?', options: [{label: 'Non-Compliant', value: 1, detail: 'No firewall controls'}, {label: 'Partially Compliant', value: 2, detail: 'Some firewalls deployed'}, {label: 'Fully Compliant', value: 3, detail: 'All boundaries protected with documented rules'}] },
          { id: 'PCI-1.2', text: 'Network connections between trusted and untrusted networks are controlled', context: 'Are DMZ architectures and access control lists properly configured?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-1.3', text: 'Inbound and outbound traffic is restricted to that which is necessary', context: 'Are firewall rules configured to deny all traffic except what is explicitly required?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-1.4', text: 'Network security controls are reviewed at least every six months', context: 'Are firewall and router rule sets reviewed semi-annually?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req2', name: 'Req 2: Secure Configurations', description: 'Apply secure configurations to all system components.', questions: [
          { id: 'PCI-2.1', text: 'Vendor-supplied defaults are changed before installing on the network', context: 'Are default passwords and settings changed for all system components?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-2.2', text: 'System components are configured and managed securely', context: 'Are configuration standards based on industry-accepted hardening standards?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-2.3', text: 'Wireless environments are configured and managed securely', context: 'Are wireless networks properly encrypted and secured?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    },
    {
      id: 'protect_data', name: 'Protect Cardholder Data', description: 'Protect stored account data and protect cardholder data with strong cryptography during transmission.', icon: '💳',
      categories: [
        { id: 'req3', name: 'Req 3: Protect Stored Account Data', description: 'Protect stored account data.', questions: [
          { id: 'PCI-3.1', text: 'Processes and mechanisms for protecting stored account data are defined', context: 'Are data retention and disposal policies defined for cardholder data?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-3.2', text: 'Sensitive authentication data is not stored after authorization', context: 'Is sensitive authentication data (CVV, PIN, full track) never stored post-authorization?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-3.3', text: 'Primary Account Numbers are masked when displayed', context: 'Is the PAN masked when displayed (only first 6 / last 4 digits shown)?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-3.4', text: 'PAN is rendered unreadable anywhere it is stored', context: 'Is PAN encrypted, hashed, or tokenized in all storage locations?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-3.5', text: 'Cryptographic keys used to protect stored account data are secured', context: 'Are encryption keys managed with proper controls (rotation, access, storage)?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req4', name: 'Req 4: Encrypt Transmission', description: 'Protect cardholder data with strong cryptography during transmission over open, public networks.', questions: [
          { id: 'PCI-4.1', text: 'Strong cryptography protects cardholder data during transmission over open networks', context: 'Is TLS 1.2+ used for all transmission of cardholder data?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-4.2', text: 'PAN is not sent via unprotected messaging technologies', context: 'Are there controls preventing PAN from being sent via email, IM, or SMS without encryption?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    },
    {
      id: 'vuln_mgmt', name: 'Vulnerability Management', description: 'Protect systems against malware and maintain secure systems and software.', icon: '🛡️',
      categories: [
        { id: 'req5', name: 'Req 5: Anti-Malware', description: 'Protect all systems and networks from malicious software.', questions: [
          { id: 'PCI-5.1', text: 'Anti-malware solutions are deployed on all systems commonly affected by malware', context: 'Is anti-malware deployed on all applicable systems with active monitoring?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-5.2', text: 'Anti-malware mechanisms and definitions are kept current', context: 'Are anti-malware signatures and engines automatically updated?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-5.3', text: 'Anti-malware mechanisms are actively running and cannot be disabled by users', context: 'Are anti-malware solutions tamper-protected and centrally managed?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req6', name: 'Req 6: Secure Development', description: 'Develop and maintain secure systems and software.', questions: [
          { id: 'PCI-6.1', text: 'Security vulnerabilities are identified and risk-ranked', context: 'Is there a process for identifying and ranking security vulnerabilities?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-6.2', text: 'Bespoke and custom software are developed securely', context: 'Does software development follow secure coding practices (OWASP)?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-6.3', text: 'Security patches are installed within one month of release', context: 'Are critical security patches applied within the required timeframe?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-6.4', text: 'Public-facing web applications are protected against attacks', context: 'Are WAFs or equivalent controls protecting web applications?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    },
    {
      id: 'access_controls', name: 'Strong Access Controls', description: 'Restrict and authenticate access to system components and cardholder data.', icon: '🔒',
      categories: [
        { id: 'req7', name: 'Req 7: Restrict Access by Need to Know', description: 'Restrict access to system components and cardholder data by business need to know.', questions: [
          { id: 'PCI-7.1', text: 'Access to system components and cardholder data is limited to individuals with a business need', context: 'Is access to CDE restricted to only those with a legitimate business need?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-7.2', text: 'Access is controlled with role-based access control (RBAC)', context: 'Is RBAC implemented for access to the cardholder data environment?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req8', name: 'Req 8: Identify & Authenticate Users', description: 'Identify users and authenticate access to system components.', questions: [
          { id: 'PCI-8.1', text: 'All users are assigned a unique ID before allowing them to access system components', context: 'Does every user have a unique identifier for CDE access?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-8.2', text: 'Multi-factor authentication (MFA) is implemented for access into the CDE', context: 'Is MFA required for all access to the cardholder data environment?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-8.3', text: 'Strong authentication policies are enforced', context: 'Are password complexity, lockout, and session timeout policies in place?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req9', name: 'Req 9: Restrict Physical Access', description: 'Restrict physical access to cardholder data.', questions: [
          { id: 'PCI-9.1', text: 'Processes and mechanisms for restricting physical access are defined', context: 'Are physical access controls in place for areas housing CDE systems?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-9.2', text: 'Media containing cardholder data is physically secured', context: 'Are physical media (tapes, drives) containing cardholder data secured?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-9.3', text: 'Media is destroyed when no longer needed for business', context: 'Is media containing cardholder data destroyed using approved methods?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    },
    {
      id: 'monitoring', name: 'Monitor & Test Networks', description: 'Log and monitor all access to system components and cardholder data. Regularly test security systems.', icon: '📊',
      categories: [
        { id: 'req10', name: 'Req 10: Log & Monitor Access', description: 'Log and monitor all access to system components and cardholder data.', questions: [
          { id: 'PCI-10.1', text: 'Audit trails are established linking access to individual users', context: 'Are all access events to CDE logged and attributable to individual users?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-10.2', text: 'Automated audit trails record security-relevant events', context: 'Are events like login attempts, privilege changes, and data access automatically logged?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-10.3', text: 'Audit logs are reviewed daily and anomalies investigated', context: 'Are logs reviewed daily with a process for investigating anomalies?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-10.4', text: 'Audit logs are retained for at least one year', context: 'Are logs retained for at least one year with three months immediately available?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]},
        { id: 'req11', name: 'Req 11: Test Security Regularly', description: 'Test security of systems and networks regularly.', questions: [
          { id: 'PCI-11.1', text: 'Wireless access points are regularly tested for and identified', context: 'Are rogue wireless access points detected through regular scanning?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-11.2', text: 'Vulnerability scans are run quarterly and after significant changes', context: 'Are internal and external vulnerability scans performed quarterly?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-11.3', text: 'Penetration testing is performed annually and after changes', context: 'Are penetration tests conducted at least annually on the CDE?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-11.4', text: 'Intrusion-detection/prevention techniques detect and alert on intrusions', context: 'Are IDS/IPS deployed to monitor CDE network traffic?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-11.5', text: 'Change-detection mechanisms detect unauthorized modification of critical files', context: 'Is file integrity monitoring (FIM) deployed on critical systems?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    },
    {
      id: 'security_policy', name: 'Information Security Policy', description: 'Maintain a policy that addresses information security for all personnel.', icon: '📋',
      categories: [
        { id: 'req12', name: 'Req 12: Information Security Policy', description: 'Support information security with organizational policies and programs.', questions: [
          { id: 'PCI-12.1', text: 'A comprehensive information security policy is established and maintained', context: 'Is there a formal security policy published and reviewed annually?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-12.2', text: 'Acceptable use policies for end-user technologies are defined', context: 'Are acceptable use policies defined for all endpoint technologies?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-12.3', text: 'Risk assessment is performed annually and after significant changes', context: 'Is a formal risk assessment conducted annually for the CDE?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-12.4', text: 'Security awareness training is provided upon hire and annually', context: 'Do all personnel receive security awareness training annually?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] },
          { id: 'PCI-12.5', text: 'An incident response plan is established and tested', context: 'Is there a documented incident response plan that is tested annually?', options: [{label: 'Non-Compliant', value: 1}, {label: 'Partially Compliant', value: 2}, {label: 'Fully Compliant', value: 3}] }
        ]}
      ]
    }
  ]
};
