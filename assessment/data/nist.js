// ============================================
// NIST Cybersecurity Framework (CSF) Assessment
// Based on NIST SP 800-53 / CSF Core
// 5 Functions, 22 Categories, 98 Subcategories
// ============================================

const NIST_DATA = {
  id: 'nist',
  modules: [
    {
      id: 'identify',
      name: 'IDENTIFY (ID)',
      description: 'Develop organizational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities.',
      icon: '🔎',
      categories: [
        {
          id: 'id_am',
          name: 'Asset Management (ID.AM)',
          description: 'The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed.',
          questions: [
            { id: 'ID.AM-1', text: 'Physical devices and systems within the organization are inventoried', context: 'Do you maintain a complete inventory of all physical devices (servers, workstations, mobile devices, IoT) in your organization?', options: [{label: 'Not Implemented', value: 1, detail: 'No asset inventory exists'}, {label: 'Partially Implemented', value: 2, detail: 'Some assets tracked informally'}, {label: 'Largely Implemented', value: 3, detail: 'Most assets inventoried with some gaps'}, {label: 'Fully Implemented', value: 4, detail: 'Complete, automated asset discovery and tracking'}] },
            { id: 'ID.AM-2', text: 'Software platforms and applications within the organization are inventoried', context: 'Is there a comprehensive inventory of all software, including versions and licenses?', options: [{label: 'Not Implemented', value: 1, detail: 'No software inventory'}, {label: 'Partially Implemented', value: 2, detail: 'Some software tracked'}, {label: 'Largely Implemented', value: 3, detail: 'Most software inventoried'}, {label: 'Fully Implemented', value: 4, detail: 'Complete software inventory with automated discovery'}] },
            { id: 'ID.AM-3', text: 'Organizational communication and data flows are mapped', context: 'Have you documented how data flows between systems, networks, and external parties?', options: [{label: 'Not Implemented', value: 1, detail: 'No data flow documentation'}, {label: 'Partially Implemented', value: 2, detail: 'Some data flows documented'}, {label: 'Largely Implemented', value: 3, detail: 'Most critical data flows mapped'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive data flow maps maintained'}] },
            { id: 'ID.AM-4', text: 'External information systems are catalogued', context: 'Are external systems (third-party services, cloud platforms, partner connections) documented?', options: [{label: 'Not Implemented', value: 1, detail: 'No catalogue of external systems'}, {label: 'Partially Implemented', value: 2, detail: 'Some external systems known'}, {label: 'Largely Implemented', value: 3, detail: 'Most external systems catalogued'}, {label: 'Fully Implemented', value: 4, detail: 'All external systems documented with risk assessments'}] },
            { id: 'ID.AM-5', text: 'Resources are prioritized based on their classification, criticality, and business value', context: 'Have you classified and prioritized hardware, devices, data, and software based on their criticality to business operations?', options: [{label: 'Not Implemented', value: 1, detail: 'No classification system'}, {label: 'Partially Implemented', value: 2, detail: 'Informal priority understanding'}, {label: 'Largely Implemented', value: 3, detail: 'Formal classification for most assets'}, {label: 'Fully Implemented', value: 4, detail: 'Complete classification with regular reviews'}] },
            { id: 'ID.AM-6', text: 'Cybersecurity roles and responsibilities for the entire workforce and third-party stakeholders are established', context: 'Are cybersecurity roles clearly defined for employees, contractors, and partners?', options: [{label: 'Not Implemented', value: 1, detail: 'No defined cybersecurity roles'}, {label: 'Partially Implemented', value: 2, detail: 'Some roles defined informally'}, {label: 'Largely Implemented', value: 3, detail: 'Most roles formally defined'}, {label: 'Fully Implemented', value: 4, detail: 'All roles documented, communicated, and regularly updated'}] }
          ]
        },
        {
          id: 'id_be',
          name: 'Business Environment (ID.BE)',
          description: 'The organization\'s mission, objectives, stakeholders, and activities are understood and prioritized.',
          questions: [
            { id: 'ID.BE-1', text: 'The organization\'s role in the supply chain is identified and communicated', context: 'Do you understand and document your position in the supply chain and communicate it to stakeholders?', options: [{label: 'Not Implemented', value: 1, detail: 'Supply chain role not identified'}, {label: 'Partially Implemented', value: 2, detail: 'Basic awareness of supply chain position'}, {label: 'Largely Implemented', value: 3, detail: 'Role documented and partially communicated'}, {label: 'Fully Implemented', value: 4, detail: 'Fully documented and communicated to all stakeholders'}] },
            { id: 'ID.BE-2', text: 'The organization\'s place in critical infrastructure and its industry sector is identified and communicated', context: 'Is your organization\'s criticality to its industry sector understood?', options: [{label: 'Not Implemented', value: 1, detail: 'Not identified'}, {label: 'Partially Implemented', value: 2, detail: 'Basic awareness'}, {label: 'Largely Implemented', value: 3, detail: 'Identified and documented'}, {label: 'Fully Implemented', value: 4, detail: 'Clearly identified with sector-specific requirements met'}] },
            { id: 'ID.BE-3', text: 'Priorities for organizational mission, objectives, and activities are established and communicated', context: 'Are organizational priorities documented and aligned with cybersecurity strategy?', options: [{label: 'Not Implemented', value: 1, detail: 'No documented priorities'}, {label: 'Partially Implemented', value: 2, detail: 'Some priorities understood informally'}, {label: 'Largely Implemented', value: 3, detail: 'Priorities documented but not fully communicated'}, {label: 'Fully Implemented', value: 4, detail: 'Priorities established, communicated, and reviewed regularly'}] },
            { id: 'ID.BE-4', text: 'Dependencies and critical functions for delivery of critical services are established', context: 'Have you identified dependencies and critical functions needed for essential service delivery?', options: [{label: 'Not Implemented', value: 1, detail: 'Dependencies not mapped'}, {label: 'Partially Implemented', value: 2, detail: 'Some dependencies known'}, {label: 'Largely Implemented', value: 3, detail: 'Most dependencies documented'}, {label: 'Fully Implemented', value: 4, detail: 'Complete dependency mapping with contingency plans'}] },
            { id: 'ID.BE-5', text: 'Resilience requirements to support delivery of critical services are established', context: 'Are resilience and recovery requirements defined for critical services?', options: [{label: 'Not Implemented', value: 1, detail: 'No resilience requirements'}, {label: 'Partially Implemented', value: 2, detail: 'Basic disaster recovery understanding'}, {label: 'Largely Implemented', value: 3, detail: 'Resilience requirements documented for most services'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive resilience framework with regular testing'}] }
          ]
        },
        {
          id: 'id_gv',
          name: 'Governance (ID.GV)',
          description: 'The policies, procedures, and processes to manage and monitor the organization\'s regulatory, legal, risk, environmental, and operational requirements.',
          questions: [
            { id: 'ID.GV-1', text: 'Organizational information security policy is established', context: 'Does your organization have a formal, approved information security policy?', options: [{label: 'Not Implemented', value: 1, detail: 'No security policy exists'}, {label: 'Partially Implemented', value: 2, detail: 'Informal or draft policy'}, {label: 'Largely Implemented', value: 3, detail: 'Policy exists but needs updates'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive policy, approved, published, and reviewed'}] },
            { id: 'ID.GV-2', text: 'Information security roles & responsibilities are coordinated and aligned with internal roles and external partners', context: 'Are security responsibilities aligned between internal teams and external partners?', options: [{label: 'Not Implemented', value: 1, detail: 'No coordination'}, {label: 'Partially Implemented', value: 2, detail: 'Some informal coordination'}, {label: 'Largely Implemented', value: 3, detail: 'Mostly coordinated'}, {label: 'Fully Implemented', value: 4, detail: 'Fully coordinated with regular alignment reviews'}] },
            { id: 'ID.GV-3', text: 'Legal and regulatory requirements regarding cybersecurity, including privacy and civil liberties obligations, are understood and managed', context: 'Are all applicable legal and regulatory cybersecurity requirements identified and addressed?', options: [{label: 'Not Implemented', value: 1, detail: 'Requirements not identified'}, {label: 'Partially Implemented', value: 2, detail: 'Some requirements known'}, {label: 'Largely Implemented', value: 3, detail: 'Most requirements documented and managed'}, {label: 'Fully Implemented', value: 4, detail: 'All requirements tracked with compliance monitoring'}] },
            { id: 'ID.GV-4', text: 'Governance and risk management processes address cybersecurity risks', context: 'Do governance and risk management processes specifically include cybersecurity risks?', options: [{label: 'Not Implemented', value: 1, detail: 'Cybersecurity not in governance'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc inclusion'}, {label: 'Largely Implemented', value: 3, detail: 'Mostly integrated into governance'}, {label: 'Fully Implemented', value: 4, detail: 'Cybersecurity fully integrated into enterprise risk management'}] }
          ]
        },
        {
          id: 'id_ra',
          name: 'Risk Assessment (ID.RA)',
          description: 'The organization understands the cybersecurity risk to organizational operations, organizational assets, and individuals.',
          questions: [
            { id: 'ID.RA-1', text: 'Asset vulnerabilities are identified and documented', context: 'Do you conduct regular vulnerability assessments and maintain documentation?', options: [{label: 'Not Implemented', value: 1, detail: 'No vulnerability assessments'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional scanning'}, {label: 'Largely Implemented', value: 3, detail: 'Regular assessments for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous vulnerability management program'}] },
            { id: 'ID.RA-2', text: 'Threat and vulnerability information is received from information sharing forums and sources', context: 'Do you subscribe to threat intelligence feeds and participate in information sharing?', options: [{label: 'Not Implemented', value: 1, detail: 'No threat intelligence'}, {label: 'Partially Implemented', value: 2, detail: 'Some news monitoring'}, {label: 'Largely Implemented', value: 3, detail: 'Subscribed to multiple threat feeds'}, {label: 'Fully Implemented', value: 4, detail: 'Active threat intel program with ISACs and industry partners'}] },
            { id: 'ID.RA-3', text: 'Threats, both internal and external, are identified and documented', context: 'Are threat actors and threat scenarios documented for your organization?', options: [{label: 'Not Implemented', value: 1, detail: 'Threats not identified'}, {label: 'Partially Implemented', value: 2, detail: 'Some threats informally known'}, {label: 'Largely Implemented', value: 3, detail: 'Most threats documented'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive threat modeling and documentation'}] },
            { id: 'ID.RA-4', text: 'Potential business impacts and likelihoods are identified', context: 'Have you performed business impact analysis for cybersecurity threats?', options: [{label: 'Not Implemented', value: 1, detail: 'No impact analysis'}, {label: 'Partially Implemented', value: 2, detail: 'Informal impact understanding'}, {label: 'Largely Implemented', value: 3, detail: 'BIA completed for critical systems'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive BIA with quantified risk metrics'}] },
            { id: 'ID.RA-5', text: 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk', context: 'Is risk determined using a formal methodology combining threats, vulnerabilities, and impacts?', options: [{label: 'Not Implemented', value: 1, detail: 'No formal risk determination'}, {label: 'Partially Implemented', value: 2, detail: 'Informal risk assessment'}, {label: 'Largely Implemented', value: 3, detail: 'Risk methodology applied to most areas'}, {label: 'Fully Implemented', value: 4, detail: 'Quantitative risk assessment across the organization'}] },
            { id: 'ID.RA-6', text: 'Risk responses are identified and prioritized', context: 'Are risk responses (accept, mitigate, transfer, avoid) identified and prioritized?', options: [{label: 'Not Implemented', value: 1, detail: 'No risk response planning'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc risk responses'}, {label: 'Largely Implemented', value: 3, detail: 'Most risks have documented responses'}, {label: 'Fully Implemented', value: 4, detail: 'All risks have prioritized treatment plans tracked to completion'}] }
          ]
        },
        {
          id: 'id_rm',
          name: 'Risk Management Strategy (ID.RM)',
          description: 'The organization\'s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.',
          questions: [
            { id: 'ID.RM-1', text: 'Risk management processes are established, managed, and agreed to by organizational stakeholders', context: 'Is there a formal risk management process that stakeholders have reviewed and agreed upon?', options: [{label: 'Not Implemented', value: 1, detail: 'No formal process'}, {label: 'Partially Implemented', value: 2, detail: 'Informal processes'}, {label: 'Largely Implemented', value: 3, detail: 'Formal process for most areas'}, {label: 'Fully Implemented', value: 4, detail: 'Enterprise-wide process with stakeholder buy-in'}] },
            { id: 'ID.RM-2', text: 'Organizational risk tolerance is determined and clearly expressed', context: 'Has your organization defined and documented its risk appetite and tolerance levels?', options: [{label: 'Not Implemented', value: 1, detail: 'Risk tolerance not defined'}, {label: 'Partially Implemented', value: 2, detail: 'Informal understanding'}, {label: 'Largely Implemented', value: 3, detail: 'Documented for key areas'}, {label: 'Fully Implemented', value: 4, detail: 'Clearly defined, documented, and communicated to all'}] },
            { id: 'ID.RM-3', text: 'The organization\'s determination of risk tolerance is informed by its role in critical infrastructure', context: 'Does your risk tolerance account for your role in critical infrastructure and sector dependencies?', options: [{label: 'Not Implemented', value: 1, detail: 'Not considered'}, {label: 'Partially Implemented', value: 2, detail: 'Some awareness'}, {label: 'Largely Implemented', value: 3, detail: 'Partially incorporated'}, {label: 'Fully Implemented', value: 4, detail: 'Fully integrated with sector-specific requirements'}] }
          ]
        }
      ]
    },
    {
      id: 'protect',
      name: 'PROTECT (PR)',
      description: 'Develop and implement appropriate safeguards to ensure delivery of critical services.',
      icon: '🔒',
      categories: [
        {
          id: 'pr_ac',
          name: 'Access Control (PR.AC)',
          description: 'Access to assets and associated facilities is limited to authorized users, processes, or devices.',
          questions: [
            { id: 'PR.AC-1', text: 'Identities and credentials are managed for authorized devices and users', context: 'Do you have centralized identity and access management (IAM) for all users and devices?', options: [{label: 'Not Implemented', value: 1, detail: 'No IAM system'}, {label: 'Partially Implemented', value: 2, detail: 'Basic user accounts only'}, {label: 'Largely Implemented', value: 3, detail: 'Centralized IAM for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive IAM with MFA, SSO, and lifecycle management'}] },
            { id: 'PR.AC-2', text: 'Physical access to assets is managed and protected', context: 'Are physical access controls (badges, biometrics, cameras) in place for sensitive areas?', options: [{label: 'Not Implemented', value: 1, detail: 'No physical access controls'}, {label: 'Partially Implemented', value: 2, detail: 'Basic locks and keys'}, {label: 'Largely Implemented', value: 3, detail: 'Badge access for most areas'}, {label: 'Fully Implemented', value: 4, detail: 'Multi-factor physical access with monitoring and logging'}] },
            { id: 'PR.AC-3', text: 'Remote access is managed', context: 'Are remote access methods (VPN, remote desktop) secured with proper authentication?', options: [{label: 'Not Implemented', value: 1, detail: 'Uncontrolled remote access'}, {label: 'Partially Implemented', value: 2, detail: 'Basic VPN without MFA'}, {label: 'Largely Implemented', value: 3, detail: 'Managed VPN with policies'}, {label: 'Fully Implemented', value: 4, detail: 'Zero-trust remote access with MFA and conditional policies'}] },
            { id: 'PR.AC-4', text: 'Access permissions are managed, incorporating least privilege and separation of duties', context: 'Are access rights based on least privilege principle with role-based access controls?', options: [{label: 'Not Implemented', value: 1, detail: 'No access control policies'}, {label: 'Partially Implemented', value: 2, detail: 'Some role-based access'}, {label: 'Largely Implemented', value: 3, detail: 'RBAC for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Full RBAC with regular access reviews and separation of duties'}] },
            { id: 'PR.AC-5', text: 'Network integrity is protected, incorporating network segregation where appropriate', context: 'Is your network segmented to protect critical assets and limit lateral movement?', options: [{label: 'Not Implemented', value: 1, detail: 'Flat network'}, {label: 'Partially Implemented', value: 2, detail: 'Basic VLAN separation'}, {label: 'Largely Implemented', value: 3, detail: 'Segmented with firewall rules'}, {label: 'Fully Implemented', value: 4, detail: 'Micro-segmentation with zero-trust network architecture'}] }
          ]
        },
        {
          id: 'pr_at',
          name: 'Awareness and Training (PR.AT)',
          description: 'The organization\'s personnel and partners are provided cybersecurity awareness education.',
          questions: [
            { id: 'PR.AT-1', text: 'All users are informed and trained', context: 'Do all employees receive regular cybersecurity awareness training?', options: [{label: 'Not Implemented', value: 1, detail: 'No training program'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional informal training'}, {label: 'Largely Implemented', value: 3, detail: 'Annual training for most staff'}, {label: 'Fully Implemented', value: 4, detail: 'Regular training with phishing simulations and assessments'}] },
            { id: 'PR.AT-2', text: 'Privileged users understand roles & responsibilities', context: 'Do administrators and privileged users receive specialized security training?', options: [{label: 'Not Implemented', value: 1, detail: 'No specialized training'}, {label: 'Partially Implemented', value: 2, detail: 'Some informal guidance'}, {label: 'Largely Implemented', value: 3, detail: 'Training for most privileged users'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive privileged user training with certification'}] },
            { id: 'PR.AT-3', text: 'Third-party stakeholders understand roles & responsibilities', context: 'Do third-party vendors and partners understand their cybersecurity responsibilities?', options: [{label: 'Not Implemented', value: 1, detail: 'No third-party awareness'}, {label: 'Partially Implemented', value: 2, detail: 'Basic contractual requirements'}, {label: 'Largely Implemented', value: 3, detail: 'Security requirements in most contracts'}, {label: 'Fully Implemented', value: 4, detail: 'Full vendor security program with assessments'}] },
            { id: 'PR.AT-4', text: 'Senior executives understand roles & responsibilities', context: 'Do senior leaders understand their cybersecurity governance responsibilities?', options: [{label: 'Not Implemented', value: 1, detail: 'No executive awareness'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional briefings'}, {label: 'Largely Implemented', value: 3, detail: 'Regular executive reporting'}, {label: 'Fully Implemented', value: 4, detail: 'Active executive engagement with security governance'}] },
            { id: 'PR.AT-5', text: 'Physical and information security personnel understand roles & responsibilities', context: 'Do security staff have clear roles and receive ongoing professional development?', options: [{label: 'Not Implemented', value: 1, detail: 'No defined security roles'}, {label: 'Partially Implemented', value: 2, detail: 'Basic job descriptions'}, {label: 'Largely Implemented', value: 3, detail: 'Defined roles with some training'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive role definitions with certifications and development plans'}] }
          ]
        },
        {
          id: 'pr_ds',
          name: 'Data Security (PR.DS)',
          description: 'Information and records (data) are managed consistent with the organization\'s risk strategy to protect the confidentiality, integrity, and availability of information.',
          questions: [
            { id: 'PR.DS-1', text: 'Data-at-rest is protected', context: 'Is encryption applied to sensitive data stored on servers, databases, and endpoints?', options: [{label: 'Not Implemented', value: 1, detail: 'No encryption at rest'}, {label: 'Partially Implemented', value: 2, detail: 'Some systems encrypted'}, {label: 'Largely Implemented', value: 3, detail: 'Most sensitive data encrypted'}, {label: 'Fully Implemented', value: 4, detail: 'Full disk and database encryption with key management'}] },
            { id: 'PR.DS-2', text: 'Data-in-transit is protected', context: 'Is data encrypted during transmission (TLS, VPN, encrypted protocols)?', options: [{label: 'Not Implemented', value: 1, detail: 'Unencrypted transmissions'}, {label: 'Partially Implemented', value: 2, detail: 'HTTPS for some services'}, {label: 'Largely Implemented', value: 3, detail: 'Most transmissions encrypted'}, {label: 'Fully Implemented', value: 4, detail: 'All transmissions encrypted with strong protocols'}] },
            { id: 'PR.DS-3', text: 'Assets are formally managed throughout removal, transfers, and disposition', context: 'Do you have processes for secure asset disposal, data wiping, and transfer tracking?', options: [{label: 'Not Implemented', value: 1, detail: 'No disposal process'}, {label: 'Partially Implemented', value: 2, detail: 'Informal disposal'}, {label: 'Largely Implemented', value: 3, detail: 'Documented process for most assets'}, {label: 'Fully Implemented', value: 4, detail: 'Certified destruction with chain of custody'}] },
            { id: 'PR.DS-4', text: 'Adequate capacity to ensure availability is maintained', context: 'Is capacity planning performed to ensure systems remain available under load?', options: [{label: 'Not Implemented', value: 1, detail: 'No capacity planning'}, {label: 'Partially Implemented', value: 2, detail: 'Reactive capacity management'}, {label: 'Largely Implemented', value: 3, detail: 'Proactive monitoring for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Automated capacity management with predictive analytics'}] },
            { id: 'PR.DS-5', text: 'Protections against data leaks are implemented', context: 'Do you have Data Loss Prevention (DLP) solutions and controls in place?', options: [{label: 'Not Implemented', value: 1, detail: 'No DLP controls'}, {label: 'Partially Implemented', value: 2, detail: 'Basic email DLP'}, {label: 'Largely Implemented', value: 3, detail: 'DLP for email and endpoints'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive DLP across all channels with monitoring'}] },
            { id: 'PR.DS-6', text: 'Integrity checking mechanisms are used to verify software, firmware, and information integrity', context: 'Do you use checksums, digital signatures, or file integrity monitoring?', options: [{label: 'Not Implemented', value: 1, detail: 'No integrity checking'}, {label: 'Partially Implemented', value: 2, detail: 'Manual checks occasionally'}, {label: 'Largely Implemented', value: 3, detail: 'FIM for critical systems'}, {label: 'Fully Implemented', value: 4, detail: 'Automated integrity monitoring across all systems'}] },
            { id: 'PR.DS-7', text: 'Development and testing environments are separate from production', context: 'Are dev/test/staging environments properly isolated from production?', options: [{label: 'Not Implemented', value: 1, detail: 'Shared environments'}, {label: 'Partially Implemented', value: 2, detail: 'Some separation'}, {label: 'Largely Implemented', value: 3, detail: 'Mostly separated with some exceptions'}, {label: 'Fully Implemented', value: 4, detail: 'Fully segregated with strict access controls'}] }
          ]
        },
        {
          id: 'pr_ip',
          name: 'Information Protection Processes (PR.IP)',
          description: 'Security policies, processes, and procedures are maintained and used to manage protection of information systems and assets.',
          questions: [
            { id: 'PR.IP-1', text: 'A baseline configuration of IT/ICS systems is created and maintained', context: 'Do you maintain hardened baseline configurations for all system types?', options: [{label: 'Not Implemented', value: 1, detail: 'No baselines'}, {label: 'Partially Implemented', value: 2, detail: 'Some default configs'}, {label: 'Largely Implemented', value: 3, detail: 'Baselines for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'CIS-benchmarked baselines with automated compliance checking'}] },
            { id: 'PR.IP-2', text: 'A System Development Life Cycle to manage systems is implemented', context: 'Do you follow a secure SDLC with security gates and code reviews?', options: [{label: 'Not Implemented', value: 1, detail: 'No SDLC'}, {label: 'Partially Implemented', value: 2, detail: 'Informal development process'}, {label: 'Largely Implemented', value: 3, detail: 'SDLC for most projects'}, {label: 'Fully Implemented', value: 4, detail: 'Secure SDLC with DevSecOps integration'}] },
            { id: 'PR.IP-3', text: 'Configuration change control processes are in place', context: 'Is there a formal change management process with approval workflows?', options: [{label: 'Not Implemented', value: 1, detail: 'No change control'}, {label: 'Partially Implemented', value: 2, detail: 'Informal change tracking'}, {label: 'Largely Implemented', value: 3, detail: 'CAB for most changes'}, {label: 'Fully Implemented', value: 4, detail: 'Automated change management with rollback capabilities'}] },
            { id: 'PR.IP-4', text: 'Backups of information are conducted, maintained, and tested periodically', context: 'Do you perform regular backups with periodic restore testing?', options: [{label: 'Not Implemented', value: 1, detail: 'No backup program'}, {label: 'Partially Implemented', value: 2, detail: 'Some backups, no testing'}, {label: 'Largely Implemented', value: 3, detail: 'Regular backups with occasional testing'}, {label: 'Fully Implemented', value: 4, detail: 'Automated backups with regular restore testing and offsite storage'}] },
            { id: 'PR.IP-9', text: 'Response plans and recovery plans are in place and managed', context: 'Do you maintain incident response and business continuity plans?', options: [{label: 'Not Implemented', value: 1, detail: 'No plans exist'}, {label: 'Partially Implemented', value: 2, detail: 'Draft plans'}, {label: 'Largely Implemented', value: 3, detail: 'Plans exist but need updates'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive plans regularly tested and updated'}] },
            { id: 'PR.IP-10', text: 'Response and recovery plans are tested', context: 'Do you conduct tabletop exercises and full DR tests?', options: [{label: 'Not Implemented', value: 1, detail: 'No testing'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional discussions'}, {label: 'Largely Implemented', value: 3, detail: 'Annual tabletop exercises'}, {label: 'Fully Implemented', value: 4, detail: 'Regular tabletop and full-scale exercises'}] },
            { id: 'PR.IP-11', text: 'Cybersecurity is included in human resources practices', context: 'Are security checks, awareness, and deprovisioning part of HR processes?', options: [{label: 'Not Implemented', value: 1, detail: 'No HR integration'}, {label: 'Partially Implemented', value: 2, detail: 'Basic background checks'}, {label: 'Largely Implemented', value: 3, detail: 'Security in onboarding and offboarding'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive HR security lifecycle management'}] },
            { id: 'PR.IP-12', text: 'A vulnerability management plan is developed and implemented', context: 'Do you have a formal vulnerability management program with SLAs for remediation?', options: [{label: 'Not Implemented', value: 1, detail: 'No vulnerability management'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional scanning'}, {label: 'Largely Implemented', value: 3, detail: 'Regular scanning with some remediation tracking'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous scanning with risk-based prioritization and SLAs'}] }
          ]
        },
        {
          id: 'pr_ma',
          name: 'Maintenance (PR.MA)',
          description: 'Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.',
          questions: [
            { id: 'PR.MA-1', text: 'Maintenance and repair of organizational assets is performed and logged in a timely manner', context: 'Are maintenance activities tracked, scheduled, and logged for all critical systems?', options: [{label: 'Not Implemented', value: 1, detail: 'No maintenance tracking'}, {label: 'Partially Implemented', value: 2, detail: 'Reactive maintenance only'}, {label: 'Largely Implemented', value: 3, detail: 'Scheduled maintenance for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Proactive maintenance program with full logging'}] },
            { id: 'PR.MA-2', text: 'Remote maintenance of organizational assets is approved, logged, and performed securely', context: 'Are remote maintenance sessions controlled, monitored, and logged?', options: [{label: 'Not Implemented', value: 1, detail: 'Uncontrolled remote maintenance'}, {label: 'Partially Implemented', value: 2, detail: 'Some logging'}, {label: 'Largely Implemented', value: 3, detail: 'Approved and logged for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Full session recording with approval workflows'}] }
          ]
        },
        {
          id: 'pr_pt',
          name: 'Protective Technology (PR.PT)',
          description: 'Technical security solutions are managed to ensure the security and resilience of systems and assets.',
          questions: [
            { id: 'PR.PT-1', text: 'Audit/log records are determined, documented, implemented, and reviewed', context: 'Is audit logging configured, centralized, and regularly reviewed across systems?', options: [{label: 'Not Implemented', value: 1, detail: 'No centralized logging'}, {label: 'Partially Implemented', value: 2, detail: 'Some system logs collected'}, {label: 'Largely Implemented', value: 3, detail: 'Most systems logging to SIEM'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive logging with automated review and alerting'}] },
            { id: 'PR.PT-2', text: 'Removable media is protected and its use restricted according to policy', context: 'Are USB drives and removable media controlled through policy and technical controls?', options: [{label: 'Not Implemented', value: 1, detail: 'No removable media controls'}, {label: 'Partially Implemented', value: 2, detail: 'Policy exists but not enforced'}, {label: 'Largely Implemented', value: 3, detail: 'Technical controls on most endpoints'}, {label: 'Fully Implemented', value: 4, detail: 'Full device control with encryption requirements'}] },
            { id: 'PR.PT-3', text: 'Access to systems and assets is controlled, incorporating least functionality', context: 'Are systems hardened to provide only necessary services and functions?', options: [{label: 'Not Implemented', value: 1, detail: 'Default configurations'}, {label: 'Partially Implemented', value: 2, detail: 'Some services disabled'}, {label: 'Largely Implemented', value: 3, detail: 'Most systems hardened'}, {label: 'Fully Implemented', value: 4, detail: 'CIS-benchmarked hardening across all systems'}] },
            { id: 'PR.PT-4', text: 'Communications and control networks are protected', context: 'Are network communications secured with encryption, segmentation, and monitoring?', options: [{label: 'Not Implemented', value: 1, detail: 'Open network'}, {label: 'Partially Implemented', value: 2, detail: 'Basic firewall'}, {label: 'Largely Implemented', value: 3, detail: 'Firewall, IDS, and segmentation'}, {label: 'Fully Implemented', value: 4, detail: 'Defense-in-depth with continuous monitoring'}] }
          ]
        }
      ]
    },
    {
      id: 'detect',
      name: 'DETECT (DE)',
      description: 'Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.',
      icon: '📡',
      categories: [
        {
          id: 'de_ae',
          name: 'Anomalies and Events (DE.AE)',
          description: 'Anomalous activity is detected in a timely manner and the potential impact of events is understood.',
          questions: [
            { id: 'DE.AE-1', text: 'A baseline of network operations and expected data flows for users and systems is established and managed', context: 'Do you maintain baselines for normal network behavior to detect anomalies?', options: [{label: 'Not Implemented', value: 1, detail: 'No baselines established'}, {label: 'Partially Implemented', value: 2, detail: 'Some traffic monitoring'}, {label: 'Largely Implemented', value: 3, detail: 'Baselines for critical systems'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive behavioral baselines with UEBA'}] },
            { id: 'DE.AE-2', text: 'Detected events are analyzed to understand attack targets and methods', context: 'Do you analyze security events to determine attack patterns and objectives?', options: [{label: 'Not Implemented', value: 1, detail: 'No event analysis'}, {label: 'Partially Implemented', value: 2, detail: 'Basic log review'}, {label: 'Largely Implemented', value: 3, detail: 'Regular event correlation'}, {label: 'Fully Implemented', value: 4, detail: 'Advanced analytics with threat hunting'}] },
            { id: 'DE.AE-3', text: 'Event data are aggregated and correlated from multiple sources and sensors', context: 'Are events from multiple security tools correlated in a SIEM?', options: [{label: 'Not Implemented', value: 1, detail: 'No event aggregation'}, {label: 'Partially Implemented', value: 2, detail: 'Some log collection'}, {label: 'Largely Implemented', value: 3, detail: 'SIEM with most sources'}, {label: 'Fully Implemented', value: 4, detail: 'SIEM with all sources, correlation rules, and SOAR'}] },
            { id: 'DE.AE-4', text: 'Impact of events is determined', context: 'Can you quickly assess the impact and scope of detected security events?', options: [{label: 'Not Implemented', value: 1, detail: 'No impact assessment'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc assessment'}, {label: 'Largely Implemented', value: 3, detail: 'Defined impact categories'}, {label: 'Fully Implemented', value: 4, detail: 'Automated impact assessment with business context'}] },
            { id: 'DE.AE-5', text: 'Incident alert thresholds are established', context: 'Are alert thresholds and escalation criteria defined to minimize false positives?', options: [{label: 'Not Implemented', value: 1, detail: 'No alert thresholds'}, {label: 'Partially Implemented', value: 2, detail: 'Default vendor thresholds'}, {label: 'Largely Implemented', value: 3, detail: 'Customized thresholds for most alerts'}, {label: 'Fully Implemented', value: 4, detail: 'Tuned thresholds with ML-based anomaly detection'}] }
          ]
        },
        {
          id: 'de_cm',
          name: 'Security Continuous Monitoring (DE.CM)',
          description: 'The information system and assets are monitored at discrete intervals to identify cybersecurity events and verify the effectiveness of protective measures.',
          questions: [
            { id: 'DE.CM-1', text: 'The network is monitored to detect potential cybersecurity events', context: 'Do you have network monitoring (IDS/IPS, NDR) to detect threats?', options: [{label: 'Not Implemented', value: 1, detail: 'No network monitoring'}, {label: 'Partially Implemented', value: 2, detail: 'Basic monitoring'}, {label: 'Largely Implemented', value: 3, detail: 'IDS/IPS at key points'}, {label: 'Fully Implemented', value: 4, detail: 'Full NDR with east-west monitoring'}] },
            { id: 'DE.CM-2', text: 'The physical environment is monitored to detect potential cybersecurity events', context: 'Are data centers and sensitive areas monitored (cameras, sensors, alarms)?', options: [{label: 'Not Implemented', value: 1, detail: 'No physical monitoring'}, {label: 'Partially Implemented', value: 2, detail: 'Basic cameras'}, {label: 'Largely Implemented', value: 3, detail: 'Cameras and sensors in key areas'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive monitoring with environmental sensors'}] },
            { id: 'DE.CM-3', text: 'Personnel activity is monitored to detect potential cybersecurity events', context: 'Is user activity monitoring in place for privileged and high-risk users?', options: [{label: 'Not Implemented', value: 1, detail: 'No user monitoring'}, {label: 'Partially Implemented', value: 2, detail: 'Basic login monitoring'}, {label: 'Largely Implemented', value: 3, detail: 'Privileged user monitoring'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive UEBA with insider threat detection'}] },
            { id: 'DE.CM-4', text: 'Malicious code is detected', context: 'Do you have anti-malware/EDR solutions deployed across all endpoints?', options: [{label: 'Not Implemented', value: 1, detail: 'No anti-malware'}, {label: 'Partially Implemented', value: 2, detail: 'Basic antivirus on some endpoints'}, {label: 'Largely Implemented', value: 3, detail: 'EDR on most endpoints'}, {label: 'Fully Implemented', value: 4, detail: 'Next-gen EDR/XDR with threat intelligence integration'}] },
            { id: 'DE.CM-5', text: 'Unauthorized mobile code is detected', context: 'Can you detect and block unauthorized scripts, macros, and mobile code?', options: [{label: 'Not Implemented', value: 1, detail: 'No detection'}, {label: 'Partially Implemented', value: 2, detail: 'Basic script blocking'}, {label: 'Largely Implemented', value: 3, detail: 'Application whitelisting for most systems'}, {label: 'Fully Implemented', value: 4, detail: 'Full application control with behavioral analysis'}] },
            { id: 'DE.CM-6', text: 'External service provider activity is monitored to detect potential cybersecurity events', context: 'Do you monitor third-party and cloud provider activities for security events?', options: [{label: 'Not Implemented', value: 1, detail: 'No provider monitoring'}, {label: 'Partially Implemented', value: 2, detail: 'Some cloud log review'}, {label: 'Largely Implemented', value: 3, detail: 'Most provider activities logged'}, {label: 'Fully Implemented', value: 4, detail: 'Full CASB and cloud monitoring integration'}] },
            { id: 'DE.CM-7', text: 'Monitoring for unauthorized personnel, connections, devices, and software is performed', context: 'Can you detect rogue devices, unauthorized software, and unauthorized connections?', options: [{label: 'Not Implemented', value: 1, detail: 'No unauthorized asset detection'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional scans'}, {label: 'Largely Implemented', value: 3, detail: 'NAC and software inventory'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous discovery with automated remediation'}] },
            { id: 'DE.CM-8', text: 'Vulnerability scans are performed', context: 'How frequently are vulnerability scans conducted across your environment?', options: [{label: 'Not Implemented', value: 1, detail: 'No vulnerability scanning'}, {label: 'Partially Implemented', value: 2, detail: 'Quarterly scans'}, {label: 'Largely Implemented', value: 3, detail: 'Monthly scans with remediation'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous scanning with risk-based prioritization'}] }
          ]
        },
        {
          id: 'de_dp',
          name: 'Detection Processes (DE.DP)',
          description: 'Detection processes and procedures are maintained and tested to ensure timely and adequate awareness of anomalous events.',
          questions: [
            { id: 'DE.DP-1', text: 'Roles and responsibilities for detection are well defined to ensure accountability', context: 'Are detection roles (SOC analysts, incident responders) clearly defined?', options: [{label: 'Not Implemented', value: 1, detail: 'No defined detection roles'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc responsibilities'}, {label: 'Largely Implemented', value: 3, detail: 'Most roles defined'}, {label: 'Fully Implemented', value: 4, detail: 'Full SOC staffing model with documented responsibilities'}] },
            { id: 'DE.DP-2', text: 'Detection activities comply with all applicable requirements', context: 'Do detection processes meet regulatory and contractual requirements?', options: [{label: 'Not Implemented', value: 1, detail: 'Not compliant'}, {label: 'Partially Implemented', value: 2, detail: 'Some requirements met'}, {label: 'Largely Implemented', value: 3, detail: 'Most requirements addressed'}, {label: 'Fully Implemented', value: 4, detail: 'Full compliance with audit evidence'}] },
            { id: 'DE.DP-3', text: 'Detection processes are tested', context: 'Do you conduct purple team exercises or detection testing to validate capabilities?', options: [{label: 'Not Implemented', value: 1, detail: 'No testing'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional testing'}, {label: 'Largely Implemented', value: 3, detail: 'Annual penetration tests'}, {label: 'Fully Implemented', value: 4, detail: 'Regular purple team with continuous detection validation'}] },
            { id: 'DE.DP-4', text: 'Event detection information is communicated to appropriate parties', context: 'Are detection alerts routed to the right teams with proper escalation paths?', options: [{label: 'Not Implemented', value: 1, detail: 'No communication process'}, {label: 'Partially Implemented', value: 2, detail: 'Email alerts to IT'}, {label: 'Largely Implemented', value: 3, detail: 'Tiered alerting for most events'}, {label: 'Fully Implemented', value: 4, detail: 'Automated routing with SLA-driven escalation'}] },
            { id: 'DE.DP-5', text: 'Detection processes are continuously improved', context: 'Do you regularly review and improve detection capabilities based on lessons learned?', options: [{label: 'Not Implemented', value: 1, detail: 'No improvement process'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc improvements'}, {label: 'Largely Implemented', value: 3, detail: 'Periodic reviews'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous improvement with MITRE ATT&CK coverage tracking'}] }
          ]
        }
      ]
    },
    {
      id: 'respond',
      name: 'RESPOND (RS)',
      description: 'Develop and implement appropriate activities to take action regarding a detected cybersecurity event.',
      icon: '⚡',
      categories: [
        {
          id: 'rs_rp',
          name: 'Response Planning (RS.RP)',
          description: 'Response processes and procedures are executed and maintained.',
          questions: [
            { id: 'RS.RP-1', text: 'Response plan is executed during or after an event', context: 'Do you have an incident response plan that is activated during security incidents?', options: [{label: 'Not Implemented', value: 1, detail: 'No response plan'}, {label: 'Partially Implemented', value: 2, detail: 'Informal response process'}, {label: 'Largely Implemented', value: 3, detail: 'Plan exists, used for major incidents'}, {label: 'Fully Implemented', value: 4, detail: 'Documented plan executed consistently for all incidents'}] }
          ]
        },
        {
          id: 'rs_co',
          name: 'Communications (RS.CO)',
          description: 'Response activities are coordinated with internal and external stakeholders.',
          questions: [
            { id: 'RS.CO-1', text: 'Personnel know their roles and order of operations when a response is needed', context: 'Does staff know who to contact and what to do during an incident?', options: [{label: 'Not Implemented', value: 1, detail: 'No defined roles'}, {label: 'Partially Implemented', value: 2, detail: 'Some people know'}, {label: 'Largely Implemented', value: 3, detail: 'Most staff informed'}, {label: 'Fully Implemented', value: 4, detail: 'All staff trained with clear escalation matrix'}] },
            { id: 'RS.CO-2', text: 'Events are reported consistent with established criteria', context: 'Are incident reporting criteria and channels clearly defined?', options: [{label: 'Not Implemented', value: 1, detail: 'No reporting criteria'}, {label: 'Partially Implemented', value: 2, detail: 'Informal reporting'}, {label: 'Largely Implemented', value: 3, detail: 'Defined criteria for most events'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive criteria with automated reporting'}] },
            { id: 'RS.CO-3', text: 'Information is shared consistent with response plans', context: 'Is information shared with appropriate parties during incident response?', options: [{label: 'Not Implemented', value: 1, detail: 'No information sharing'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc sharing'}, {label: 'Largely Implemented', value: 3, detail: 'Mostly consistent sharing'}, {label: 'Fully Implemented', value: 4, detail: 'Structured sharing with defined communication templates'}] },
            { id: 'RS.CO-4', text: 'Coordination with stakeholders occurs consistent with response plans', context: 'Do you coordinate response activities with internal teams and external partners?', options: [{label: 'Not Implemented', value: 1, detail: 'No stakeholder coordination'}, {label: 'Partially Implemented', value: 2, detail: 'IT team only'}, {label: 'Largely Implemented', value: 3, detail: 'Most stakeholders involved'}, {label: 'Fully Implemented', value: 4, detail: 'Full coordination including legal, PR, and regulators'}] },
            { id: 'RS.CO-5', text: 'Voluntary information sharing occurs with external stakeholders', context: 'Do you participate in threat information sharing with industry peers and ISACs?', options: [{label: 'Not Implemented', value: 1, detail: 'No external sharing'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional sharing'}, {label: 'Largely Implemented', value: 3, detail: 'Active ISAC participation'}, {label: 'Fully Implemented', value: 4, detail: 'Proactive sharing with automated threat intel exchange'}] }
          ]
        },
        {
          id: 'rs_an',
          name: 'Analysis (RS.AN)',
          description: 'Analysis is conducted to ensure adequate response and support recovery activities.',
          questions: [
            { id: 'RS.AN-1', text: 'Notifications from detection systems are investigated', context: 'Are all security alerts triaged and investigated in a timely manner?', options: [{label: 'Not Implemented', value: 1, detail: 'Alerts not investigated'}, {label: 'Partially Implemented', value: 2, detail: 'Some alerts reviewed'}, {label: 'Largely Implemented', value: 3, detail: 'Most alerts triaged'}, {label: 'Fully Implemented', value: 4, detail: 'All alerts triaged with defined SLAs and playbooks'}] },
            { id: 'RS.AN-2', text: 'The impact of the incident is understood', context: 'Can you determine the full scope and impact of security incidents?', options: [{label: 'Not Implemented', value: 1, detail: 'No impact assessment capability'}, {label: 'Partially Implemented', value: 2, detail: 'Basic scope assessment'}, {label: 'Largely Implemented', value: 3, detail: 'Good impact understanding for most incidents'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive impact analysis with business context'}] },
            { id: 'RS.AN-3', text: 'Forensics are performed', context: 'Do you have digital forensics capabilities for incident investigation?', options: [{label: 'Not Implemented', value: 1, detail: 'No forensics capability'}, {label: 'Partially Implemented', value: 2, detail: 'Basic log analysis'}, {label: 'Largely Implemented', value: 3, detail: 'Forensic tools and trained staff'}, {label: 'Fully Implemented', value: 4, detail: 'Full DFIR team with forensic lab and evidence handling'}] },
            { id: 'RS.AN-4', text: 'Incidents are categorized consistent with response plans', context: 'Are incidents classified by severity and type according to defined taxonomy?', options: [{label: 'Not Implemented', value: 1, detail: 'No incident categorization'}, {label: 'Partially Implemented', value: 2, detail: 'Informal categorization'}, {label: 'Largely Implemented', value: 3, detail: 'Defined categories for most incidents'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive taxonomy with automated classification'}] }
          ]
        },
        {
          id: 'rs_mi',
          name: 'Mitigation (RS.MI)',
          description: 'Activities are performed to prevent expansion of an event and mitigate its effects.',
          questions: [
            { id: 'RS.MI-1', text: 'Incidents are contained', context: 'Can you quickly contain incidents to prevent further damage or spread?', options: [{label: 'Not Implemented', value: 1, detail: 'No containment capability'}, {label: 'Partially Implemented', value: 2, detail: 'Manual containment only'}, {label: 'Largely Implemented', value: 3, detail: 'Containment playbooks for common incidents'}, {label: 'Fully Implemented', value: 4, detail: 'Automated containment with SOAR integration'}] },
            { id: 'RS.MI-2', text: 'Incidents are mitigated', context: 'Do you have procedures to eradicate threats and restore normal operations?', options: [{label: 'Not Implemented', value: 1, detail: 'No mitigation procedures'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc mitigation'}, {label: 'Largely Implemented', value: 3, detail: 'Defined procedures for most scenarios'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive eradication and recovery procedures'}] },
            { id: 'RS.MI-3', text: 'Newly identified vulnerabilities are mitigated or documented as accepted risks', context: 'Are vulnerabilities discovered during incidents promptly remediated?', options: [{label: 'Not Implemented', value: 1, detail: 'Vulnerabilities not tracked'}, {label: 'Partially Implemented', value: 2, detail: 'Some tracked'}, {label: 'Largely Implemented', value: 3, detail: 'Most tracked with remediation'}, {label: 'Fully Implemented', value: 4, detail: 'All tracked with risk acceptance or remediation timelines'}] }
          ]
        },
        {
          id: 'rs_im',
          name: 'Improvements (RS.IM)',
          description: 'Organizational response activities are improved by incorporating lessons learned.',
          questions: [
            { id: 'RS.IM-1', text: 'Response plans incorporate lessons learned', context: 'Do you update response plans based on post-incident reviews?', options: [{label: 'Not Implemented', value: 1, detail: 'No lessons learned process'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional reviews'}, {label: 'Largely Implemented', value: 3, detail: 'Lessons learned for major incidents'}, {label: 'Fully Implemented', value: 4, detail: 'Systematic post-incident review for all incidents'}] },
            { id: 'RS.IM-2', text: 'Response strategies are updated', context: 'Are response strategies regularly reviewed and improved?', options: [{label: 'Not Implemented', value: 1, detail: 'No updates'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional updates'}, {label: 'Largely Implemented', value: 3, detail: 'Annual review'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous improvement with metric-driven optimization'}] }
          ]
        }
      ]
    },
    {
      id: 'recover',
      name: 'RECOVER (RC)',
      description: 'Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services impaired due to a cybersecurity event.',
      icon: '🔄',
      categories: [
        {
          id: 'rc_rp',
          name: 'Recovery Planning (RC.RP)',
          description: 'Recovery processes and procedures are executed and maintained.',
          questions: [
            { id: 'RC.RP-1', text: 'Recovery plan is executed during or after an event', context: 'Is a documented recovery plan activated to restore services after an incident?', options: [{label: 'Not Implemented', value: 1, detail: 'No recovery plan'}, {label: 'Partially Implemented', value: 2, detail: 'Informal recovery process'}, {label: 'Largely Implemented', value: 3, detail: 'Plan exists for critical systems'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive recovery plan regularly tested and executed'}] }
          ]
        },
        {
          id: 'rc_im',
          name: 'Improvements (RC.IM)',
          description: 'Recovery planning and processes are improved.',
          questions: [
            { id: 'RC.IM-1', text: 'Recovery plans incorporate lessons learned', context: 'Are recovery plans updated based on exercises and actual recovery experiences?', options: [{label: 'Not Implemented', value: 1, detail: 'No updates'}, {label: 'Partially Implemented', value: 2, detail: 'Occasional updates'}, {label: 'Largely Implemented', value: 3, detail: 'Updated after major events'}, {label: 'Fully Implemented', value: 4, detail: 'Systematically updated after all tests and events'}] },
            { id: 'RC.IM-2', text: 'Recovery strategies are updated', context: 'Are recovery strategies reviewed and improved based on changes in the environment?', options: [{label: 'Not Implemented', value: 1, detail: 'No strategy reviews'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc reviews'}, {label: 'Largely Implemented', value: 3, detail: 'Annual review'}, {label: 'Fully Implemented', value: 4, detail: 'Continuous improvement aligned with business changes'}] }
          ]
        },
        {
          id: 'rc_co',
          name: 'Communications (RC.CO)',
          description: 'Restoration activities are coordinated with internal and external parties.',
          questions: [
            { id: 'RC.CO-1', text: 'Public relations are managed', context: 'Do you have a crisis communications plan for cybersecurity incidents?', options: [{label: 'Not Implemented', value: 1, detail: 'No crisis comms plan'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc PR response'}, {label: 'Largely Implemented', value: 3, detail: 'Plan exists with key contacts'}, {label: 'Fully Implemented', value: 4, detail: 'Comprehensive crisis comms with templates and trained spokespeople'}] },
            { id: 'RC.CO-2', text: 'Reputation after an event is repaired', context: 'Do you have strategies for reputation recovery after a security incident?', options: [{label: 'Not Implemented', value: 1, detail: 'No reputation strategy'}, {label: 'Partially Implemented', value: 2, detail: 'Reactive response'}, {label: 'Largely Implemented', value: 3, detail: 'Some reputation planning'}, {label: 'Fully Implemented', value: 4, detail: 'Proactive reputation management with monitoring'}] },
            { id: 'RC.CO-3', text: 'Recovery activities are communicated to internal stakeholders and executive and management teams', context: 'Are recovery progress and status communicated to all relevant stakeholders?', options: [{label: 'Not Implemented', value: 1, detail: 'No recovery communications'}, {label: 'Partially Implemented', value: 2, detail: 'Ad-hoc updates'}, {label: 'Largely Implemented', value: 3, detail: 'Regular updates during recovery'}, {label: 'Fully Implemented', value: 4, detail: 'Structured communications with dashboards and SLAs'}] }
          ]
        }
      ]
    }
  ]
};
