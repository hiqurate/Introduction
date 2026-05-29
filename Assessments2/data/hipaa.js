// ============================================
// HIPAA Security Assessment
// Administrative, Physical, Technical Safeguards
// ============================================

const HIPAA_DATA = {
  id: 'hipaa',
  modules: [
    {
      id: 'administrative',
      name: 'Administrative Safeguards',
      description: 'Administrative actions, policies, and procedures to manage the selection, development, implementation, and maintenance of security measures.',
      icon: '📝',
      categories: [
        {
          id: 'security_mgmt',
          name: 'Security Management Process',
          description: '§164.308(a)(1) - Risk analysis, risk management, sanction policy, and information system activity review.',
          questions: [
            { id: 'HIPAA-A1', text: 'Risk analysis is conducted regularly', context: 'Do you conduct an accurate and thorough assessment of potential risks and vulnerabilities to ePHI?', recommendation: 'Conduct a comprehensive, documented risk analysis at least annually and after significant environmental changes per §164.308(a)(1)(ii)(A).', action: 'Security Team to complete enterprise risk analysis, document findings in a risk register, and present results to leadership within 90 days.', options: [{ label: 'Not Compliant', value: 1, detail: 'No risk analysis performed' }, { label: 'Partially Compliant', value: 2, detail: 'Informal or incomplete risk analysis' }, { label: 'Substantially Compliant', value: 3, detail: 'Regular risk analysis with minor gaps' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive, documented risk analysis performed annually' }] },
            { id: 'HIPAA-A2', text: 'Risk management program is implemented', context: 'Have you implemented security measures sufficient to reduce risks and vulnerabilities to a reasonable level?', recommendation: 'Implement a formal risk management program with tracked remediation plans for all identified risks to ePHI.', action: 'Security Team to establish risk treatment plans for open findings and report progress monthly.', options: [{ label: 'Not Compliant', value: 1, detail: 'No risk management' }, { label: 'Partially Compliant', value: 2, detail: 'Some measures in place' }, { label: 'Substantially Compliant', value: 3, detail: 'Most risks addressed' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive risk management with ongoing monitoring' }] },
            { id: 'HIPAA-A3', text: 'Sanction policy exists for workforce members who fail to comply', context: 'Is there a formal sanction policy for employees who violate security policies?', recommendation: 'Document and enforce a sanction policy for workforce members who fail to comply with HIPAA security policies.', action: 'HR and Security to publish sanction policy, integrate into workforce agreements, and train all staff within 60 days.', options: [{ label: 'Not Compliant', value: 1, detail: 'No sanction policy' }, { label: 'Partially Compliant', value: 2, detail: 'Informal consequences' }, { label: 'Substantially Compliant', value: 3, detail: 'Policy exists but inconsistently applied' }, { label: 'Fully Compliant', value: 4, detail: 'Documented policy consistently enforced' }] },
            { id: 'HIPAA-A4', text: 'Information system activity review is conducted', context: 'Do you regularly review records of information system activity (audit logs, access reports)?', recommendation: 'Establish regular review of audit logs, access reports, and security incident records with documented evidence.', action: 'Security Operations to implement weekly log review procedures and retain review records for six years.', options: [{ label: 'Not Compliant', value: 1, detail: 'No activity review' }, { label: 'Partially Compliant', value: 2, detail: 'Occasional log review' }, { label: 'Substantially Compliant', value: 3, detail: 'Regular reviews with some gaps' }, { label: 'Fully Compliant', value: 4, detail: 'Automated monitoring with regular review' }] }
          ]
        },
        {
          id: 'assigned_security',
          name: 'Assigned Security Responsibility',
          description: '§164.308(a)(2) - Security officer designation.',
          questions: [
            { id: 'HIPAA-A5', text: 'A security officer is designated', context: 'Has a specific individual been designated as the HIPAA Security Officer?', recommendation: 'Formally designate a HIPAA Security Officer with documented responsibilities and authority per §164.308(a)(2).', action: 'Executive leadership to appoint Security Officer, publish designation letter, and define responsibilities within 30 days.', options: [{ label: 'Not Compliant', value: 1, detail: 'No security officer' }, { label: 'Partially Compliant', value: 2, detail: 'Informal designation' }, { label: 'Substantially Compliant', value: 3, detail: 'Officer designated but limited authority' }, { label: 'Fully Compliant', value: 4, detail: 'Formally designated with documented responsibilities' }] }
          ]
        },
        {
          id: 'workforce_security',
          name: 'Workforce Security',
          description: '§164.308(a)(3) - Authorization and supervision, workforce clearance, and termination procedures.',
          questions: [
            { id: 'HIPAA-A6', text: 'Authorization and supervision procedures are implemented', context: 'Are procedures in place to authorize and supervise workforce access to ePHI?', options: [{ label: 'Not Compliant', value: 1, detail: 'No authorization procedures' }, { label: 'Partially Compliant', value: 2, detail: 'Basic authorization' }, { label: 'Substantially Compliant', value: 3, detail: 'Formal authorization for most roles' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive authorization with regular review' }] },
            { id: 'HIPAA-A7', text: 'Workforce clearance procedure exists', context: 'Do you verify that workforce members have appropriate access levels based on their role?', options: [{ label: 'Not Compliant', value: 1, detail: 'No clearance procedure' }, { label: 'Partially Compliant', value: 2, detail: 'Basic background checks' }, { label: 'Substantially Compliant', value: 3, detail: 'Clearance for most positions' }, { label: 'Fully Compliant', value: 4, detail: 'Full clearance process with ongoing verification' }] },
            { id: 'HIPAA-A8', text: 'Termination procedures include timely access revocation', context: 'Are access rights revoked immediately upon workforce member termination?', options: [{ label: 'Not Compliant', value: 1, detail: 'No termination procedure' }, { label: 'Partially Compliant', value: 2, detail: 'Delayed revocation' }, { label: 'Substantially Compliant', value: 3, detail: 'Same-day revocation for most systems' }, { label: 'Fully Compliant', value: 4, detail: 'Immediate automated revocation across all systems' }] }
          ]
        },
        {
          id: 'info_access',
          name: 'Information Access Management',
          description: '§164.308(a)(4) - Access authorization, establishment, and modification.',
          questions: [
            { id: 'HIPAA-A9', text: 'Access to ePHI is role-based and restricted', context: 'Is access to ePHI limited to authorized individuals based on their job function?', options: [{ label: 'Not Compliant', value: 1, detail: 'No access restrictions' }, { label: 'Partially Compliant', value: 2, detail: 'Some access controls' }, { label: 'Substantially Compliant', value: 3, detail: 'Role-based access for most systems' }, { label: 'Fully Compliant', value: 4, detail: 'Full RBAC with minimum necessary standard' }] },
            { id: 'HIPAA-A10', text: 'Access authorization policies are implemented', context: 'Are there policies for granting access to ePHI and are they consistently followed?', options: [{ label: 'Not Compliant', value: 1, detail: 'No access policies' }, { label: 'Partially Compliant', value: 2, detail: 'Informal policies' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented policies for most areas' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive policies with automated enforcement' }] }
          ]
        },
        {
          id: 'security_awareness',
          name: 'Security Awareness & Training',
          description: '§164.308(a)(5) - Security reminders, malicious software protection, log-in monitoring, password management.',
          questions: [
            { id: 'HIPAA-A11', text: 'Security awareness training is provided to all workforce members', context: 'Do all employees receive HIPAA security awareness training upon hire and annually?', options: [{ label: 'Not Compliant', value: 1, detail: 'No training program' }, { label: 'Partially Compliant', value: 2, detail: 'Occasional training' }, { label: 'Substantially Compliant', value: 3, detail: 'Annual training for most staff' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive training with testing and documentation' }] },
            { id: 'HIPAA-A12', text: 'Procedures for guarding against malicious software are in place', context: 'Are anti-malware solutions deployed and procedures established for handling malware?', options: [{ label: 'Not Compliant', value: 1, detail: 'No anti-malware' }, { label: 'Partially Compliant', value: 2, detail: 'Basic antivirus' }, { label: 'Substantially Compliant', value: 3, detail: 'Enterprise anti-malware' }, { label: 'Fully Compliant', value: 4, detail: 'Advanced endpoint protection with incident procedures' }] },
            { id: 'HIPAA-A13', text: 'Log-in monitoring procedures are implemented', context: 'Do you monitor login attempts and report discrepancies?', options: [{ label: 'Not Compliant', value: 1, detail: 'No login monitoring' }, { label: 'Partially Compliant', value: 2, detail: 'Basic failure logging' }, { label: 'Substantially Compliant', value: 3, detail: 'Automated alerting for failures' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive monitoring with anomaly detection' }] },
            { id: 'HIPAA-A14', text: 'Password management policies are established', context: 'Are password complexity, rotation, and management policies enforced?', options: [{ label: 'Not Compliant', value: 1, detail: 'No password policy' }, { label: 'Partially Compliant', value: 2, detail: 'Basic password rules' }, { label: 'Substantially Compliant', value: 3, detail: 'Strong password policy enforced' }, { label: 'Fully Compliant', value: 4, detail: 'MFA with password manager and privileged access management' }] }
          ]
        },
        {
          id: 'contingency',
          name: 'Contingency Plan',
          description: '§164.308(a)(7) - Data backup, disaster recovery, and emergency mode operation plans.',
          questions: [
            { id: 'HIPAA-A15', text: 'Data backup plan is established and implemented', context: 'Are exact copies of ePHI created and maintained?', options: [{ label: 'Not Compliant', value: 1, detail: 'No backup plan' }, { label: 'Partially Compliant', value: 2, detail: 'Some backups exist' }, { label: 'Substantially Compliant', value: 3, detail: 'Regular backups with some testing' }, { label: 'Fully Compliant', value: 4, detail: 'Automated backups with regular testing and offsite storage' }] },
            { id: 'HIPAA-A16', text: 'Disaster recovery plan is documented and tested', context: 'Is there a plan to restore lost data and systems in the event of a disaster?', options: [{ label: 'Not Compliant', value: 1, detail: 'No DR plan' }, { label: 'Partially Compliant', value: 2, detail: 'Draft DR plan' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented plan with annual testing' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive DR plan with regular testing and updates' }] },
            { id: 'HIPAA-A17', text: 'Emergency mode operations plan exists', context: 'Can you operate in emergency mode while protecting ePHI during a crisis?', options: [{ label: 'Not Compliant', value: 1, detail: 'No emergency plan' }, { label: 'Partially Compliant', value: 2, detail: 'Informal emergency procedures' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented emergency procedures' }, { label: 'Fully Compliant', value: 4, detail: 'Tested emergency plan with documented procedures' }] }
          ]
        }
      ]
    },
    {
      id: 'physical',
      name: 'Physical Safeguards',
      description: 'Physical measures, policies, and procedures to protect electronic information systems and related buildings and equipment.',
      icon: '🏢',
      categories: [
        {
          id: 'facility_access',
          name: 'Facility Access Controls',
          description: '§164.310(a) - Procedures to limit physical access while ensuring authorized access.',
          questions: [
            { id: 'HIPAA-P1', text: 'Facility access controls limit physical access to systems containing ePHI', context: 'Are physical access controls (locks, badges, cameras) in place for areas containing ePHI?', options: [{ label: 'Not Compliant', value: 1, detail: 'No physical access controls' }, { label: 'Partially Compliant', value: 2, detail: 'Basic locks only' }, { label: 'Substantially Compliant', value: 3, detail: 'Badge access with some monitoring' }, { label: 'Fully Compliant', value: 4, detail: 'Multi-factor physical access with surveillance and logging' }] },
            { id: 'HIPAA-P2', text: 'Facility security plan is documented', context: 'Is there a documented plan for safeguarding the facility and equipment?', options: [{ label: 'Not Compliant', value: 1, detail: 'No facility security plan' }, { label: 'Partially Compliant', value: 2, detail: 'Informal security measures' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented plan for main facility' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive plan for all locations with regular review' }] },
            { id: 'HIPAA-P3', text: 'Visitor access is controlled and logged', context: 'Are visitors escorted, logged, and their access restricted in areas with ePHI?', options: [{ label: 'Not Compliant', value: 1, detail: 'No visitor controls' }, { label: 'Partially Compliant', value: 2, detail: 'Sign-in sheet only' }, { label: 'Substantially Compliant', value: 3, detail: 'Visitor badges and escort policy' }, { label: 'Fully Compliant', value: 4, detail: 'Full visitor management system with restricted area controls' }] },
            { id: 'HIPAA-P4', text: 'Maintenance records are documented', context: 'Are repairs and modifications to the physical components of a facility documented?', options: [{ label: 'Not Compliant', value: 1, detail: 'No maintenance records' }, { label: 'Partially Compliant', value: 2, detail: 'Some records kept' }, { label: 'Substantially Compliant', value: 3, detail: 'Systematic record keeping' }, { label: 'Fully Compliant', value: 4, detail: 'Complete maintenance logs with security impact assessment' }] }
          ]
        },
        {
          id: 'workstation',
          name: 'Workstation & Device Security',
          description: '§164.310(b-d) - Workstation use, security, and device and media controls.',
          questions: [
            { id: 'HIPAA-P5', text: 'Workstation use policies specify proper use of workstations accessing ePHI', context: 'Are there policies for how workstations accessing ePHI should be used and secured?', options: [{ label: 'Not Compliant', value: 1, detail: 'No workstation policies' }, { label: 'Partially Compliant', value: 2, detail: 'Basic acceptable use policy' }, { label: 'Substantially Compliant', value: 3, detail: 'Detailed workstation security policy' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive policy with technical enforcement' }] },
            { id: 'HIPAA-P6', text: 'Physical safeguards protect workstations accessing ePHI', context: 'Are workstations in secure areas with screen locks and privacy screens?', options: [{ label: 'Not Compliant', value: 1, detail: 'No workstation safeguards' }, { label: 'Partially Compliant', value: 2, detail: 'Screen locks only' }, { label: 'Substantially Compliant', value: 3, detail: 'Multiple safeguards in place' }, { label: 'Fully Compliant', value: 4, detail: 'Full physical security including clean desk policy' }] },
            { id: 'HIPAA-P7', text: 'Device and media disposal procedures ensure ePHI is properly destroyed', context: 'Are there procedures for sanitizing devices before disposal or re-use?', options: [{ label: 'Not Compliant', value: 1, detail: 'No disposal procedures' }, { label: 'Partially Compliant', value: 2, detail: 'Basic deletion' }, { label: 'Substantially Compliant', value: 3, detail: 'Certified wiping for most devices' }, { label: 'Fully Compliant', value: 4, detail: 'NIST 800-88 compliant media destruction with certificates' }] },
            { id: 'HIPAA-P8', text: 'Media re-use procedures ensure ePHI is removed', context: 'Before re-using electronic media, is ePHI properly removed?', options: [{ label: 'Not Compliant', value: 1, detail: 'No re-use procedures' }, { label: 'Partially Compliant', value: 2, detail: 'Basic formatting' }, { label: 'Substantially Compliant', value: 3, detail: 'Secure wiping procedures' }, { label: 'Fully Compliant', value: 4, detail: 'Verified sanitization with documentation' }] }
          ]
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Safeguards',
      description: 'Technology and related policies and procedures to protect ePHI and control access to it.',
      icon: '🔧',
      categories: [
        {
          id: 'access_control_tech',
          name: 'Access Control',
          description: '§164.312(a) - Technical policies and procedures for electronic information systems.',
          questions: [
            { id: 'HIPAA-T1', text: 'Unique user identification is assigned to each user', context: 'Does every user have a unique ID for tracking their access to ePHI systems?', options: [{ label: 'Not Compliant', value: 1, detail: 'Shared accounts used' }, { label: 'Partially Compliant', value: 2, detail: 'Unique IDs for most users' }, { label: 'Substantially Compliant', value: 3, detail: 'Unique IDs for all with some shared service accounts' }, { label: 'Fully Compliant', value: 4, detail: 'All accounts unique with service account management' }] },
            { id: 'HIPAA-T2', text: 'Emergency access procedures are established', context: 'Are procedures in place for obtaining necessary ePHI during emergencies?', options: [{ label: 'Not Compliant', value: 1, detail: 'No emergency access procedures' }, { label: 'Partially Compliant', value: 2, detail: 'Informal break-glass process' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented emergency access' }, { label: 'Fully Compliant', value: 4, detail: 'Tested break-glass procedures with audit logging' }] },
            { id: 'HIPAA-T3', text: 'Automatic logoff is implemented', context: 'Do electronic sessions automatically terminate after inactivity?', options: [{ label: 'Not Compliant', value: 1, detail: 'No automatic logoff' }, { label: 'Partially Compliant', value: 2, detail: 'Some systems have timeout' }, { label: 'Substantially Compliant', value: 3, detail: 'Most systems have timeout' }, { label: 'Fully Compliant', value: 4, detail: 'All systems with appropriate timeout settings' }] },
            { id: 'HIPAA-T4', text: 'Encryption and decryption mechanisms protect ePHI', context: 'Is ePHI encrypted when stored electronically?', options: [{ label: 'Not Compliant', value: 1, detail: 'No encryption' }, { label: 'Partially Compliant', value: 2, detail: 'Some systems encrypted' }, { label: 'Substantially Compliant', value: 3, detail: 'Most ePHI encrypted' }, { label: 'Fully Compliant', value: 4, detail: 'All ePHI encrypted with key management' }] }
          ]
        },
        {
          id: 'audit_controls',
          name: 'Audit Controls',
          description: '§164.312(b) - Hardware, software, and procedural mechanisms for recording and examining access.',
          questions: [
            { id: 'HIPAA-T5', text: 'Audit controls record and examine activity in systems containing ePHI', context: 'Are audit logs enabled and reviewed for all systems containing ePHI?', options: [{ label: 'Not Compliant', value: 1, detail: 'No audit logging' }, { label: 'Partially Compliant', value: 2, detail: 'Basic logging on some systems' }, { label: 'Substantially Compliant', value: 3, detail: 'Comprehensive logging with periodic review' }, { label: 'Fully Compliant', value: 4, detail: 'Centralized logging with real-time monitoring and alerting' }] },
            { id: 'HIPAA-T6', text: 'Audit logs are protected from unauthorized modification', context: 'Are audit logs stored securely and protected from tampering?', options: [{ label: 'Not Compliant', value: 1, detail: 'Logs not protected' }, { label: 'Partially Compliant', value: 2, detail: 'Basic access restrictions' }, { label: 'Substantially Compliant', value: 3, detail: 'Logs in secured storage' }, { label: 'Fully Compliant', value: 4, detail: 'Immutable log storage with integrity verification' }] }
          ]
        },
        {
          id: 'integrity',
          name: 'Integrity Controls',
          description: '§164.312(c-d) - Protect ePHI from improper alteration or destruction.',
          questions: [
            { id: 'HIPAA-T7', text: 'Mechanisms are in place to authenticate ePHI', context: 'Can you verify that ePHI has not been improperly altered or destroyed?', options: [{ label: 'Not Compliant', value: 1, detail: 'No integrity controls' }, { label: 'Partially Compliant', value: 2, detail: 'Basic access controls' }, { label: 'Substantially Compliant', value: 3, detail: 'Checksums for critical data' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive integrity verification with automated alerts' }] },
            { id: 'HIPAA-T8', text: 'Transmission security protects ePHI during electronic transmission', context: 'Is ePHI encrypted during electronic transmission (email, file transfers)?', options: [{ label: 'Not Compliant', value: 1, detail: 'No transmission security' }, { label: 'Partially Compliant', value: 2, detail: 'TLS for some transmissions' }, { label: 'Substantially Compliant', value: 3, detail: 'Encryption for most transmissions' }, { label: 'Fully Compliant', value: 4, detail: 'All transmissions encrypted with strong protocols' }] }
          ]
        }
      ]
    },
    {
      id: 'organizational',
      name: 'Organizational Requirements',
      description: 'Business associate agreements, organizational policies, and documentation requirements.',
      icon: '🤝',
      categories: [
        {
          id: 'ba_agreements',
          name: 'Business Associate Agreements',
          description: 'Contracts and agreements with business associates who handle ePHI.',
          questions: [
            { id: 'HIPAA-O1', text: 'Business Associate Agreements (BAAs) are in place with all BAs', context: 'Do you have signed BAAs with all organizations that create, receive, maintain, or transmit ePHI on your behalf?', options: [{ label: 'Not Compliant', value: 1, detail: 'No BAAs in place' }, { label: 'Partially Compliant', value: 2, detail: 'BAAs with some BAs' }, { label: 'Substantially Compliant', value: 3, detail: 'BAAs with most BAs' }, { label: 'Fully Compliant', value: 4, detail: 'BAAs with all BAs, regularly reviewed' }] },
            { id: 'HIPAA-O2', text: 'Business associates are assessed for security compliance', context: 'Do you verify that your business associates comply with HIPAA security requirements?', options: [{ label: 'Not Compliant', value: 1, detail: 'No BA assessment' }, { label: 'Partially Compliant', value: 2, detail: 'Self-assessment questionnaire' }, { label: 'Substantially Compliant', value: 3, detail: 'Regular assessments for major BAs' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive third-party risk management program' }] }
          ]
        },
        {
          id: 'policies_procedures',
          name: 'Policies & Documentation',
          description: 'Documentation requirements and policy maintenance.',
          questions: [
            { id: 'HIPAA-O3', text: 'Security policies and procedures are documented and maintained', context: 'Are all required security policies documented, approved, and regularly reviewed?', options: [{ label: 'Not Compliant', value: 1, detail: 'No documented policies' }, { label: 'Partially Compliant', value: 2, detail: 'Some policies documented' }, { label: 'Substantially Compliant', value: 3, detail: 'Most policies documented' }, { label: 'Fully Compliant', value: 4, detail: 'All policies documented with regular review cycle' }] },
            { id: 'HIPAA-O4', text: 'Documentation is retained for six years', context: 'Are security policies and related documentation retained for the required six-year period?', options: [{ label: 'Not Compliant', value: 1, detail: 'No retention policy' }, { label: 'Partially Compliant', value: 2, detail: 'Some documentation retained' }, { label: 'Substantially Compliant', value: 3, detail: 'Most documentation retained' }, { label: 'Fully Compliant', value: 4, detail: 'All documentation retained with version control' }] },
            { id: 'HIPAA-O5', text: 'Breach notification procedures are established', context: 'Do you have procedures for investigating and reporting breaches of unsecured ePHI?', options: [{ label: 'Not Compliant', value: 1, detail: 'No breach notification procedures' }, { label: 'Partially Compliant', value: 2, detail: 'Informal procedures' }, { label: 'Substantially Compliant', value: 3, detail: 'Documented procedures' }, { label: 'Fully Compliant', value: 4, detail: 'Comprehensive breach program with regulatory notification templates' }] }
          ]
        }
      ]
    }
  ]
};
