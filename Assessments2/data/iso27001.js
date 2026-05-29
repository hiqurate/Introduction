// ============================================
// ISO 27001 Information Security Assessment
// Annex A Controls (A.5-A.18)
// ============================================

const ISO27001_DATA = {
  id: 'iso27001',
  modules: [
    {
      id: 'security_policies',
      name: 'Information Security Policies',
      description: 'Management direction and support for information security in accordance with business requirements and relevant laws and regulations.',
      icon: '📜',
      categories: [
        { id: 'a5', name: 'A.5 Information Security Policies', description: 'Management direction for information security.', questions: [
          { id: 'A.5.1.1', text: 'Information security policies are defined, approved by management, published and communicated', context: 'Is there a set of policies for information security, approved by management?', options: [{label: 'Not Started', value: 1, detail: 'No policies exist'}, {label: 'Planned', value: 2, detail: 'Policies being drafted'}, {label: 'Partially Implemented', value: 3, detail: 'Some policies published'}, {label: 'Largely Implemented', value: 4, detail: 'Most policies in place'}, {label: 'Fully Implemented', value: 5, detail: 'Complete policy framework published and communicated'}] },
          { id: 'A.5.1.2', text: 'Policies are reviewed at planned intervals or if significant changes occur', context: 'Are information security policies reviewed at regular intervals?', options: [{label: 'Not Started', value: 1, detail: 'No review process'}, {label: 'Planned', value: 2, detail: 'Review schedule planned'}, {label: 'Partially Implemented', value: 3, detail: 'Some policies reviewed'}, {label: 'Largely Implemented', value: 4, detail: 'Regular review for most'}, {label: 'Fully Implemented', value: 5, detail: 'Annual review with change-triggered updates'}] }
        ]}
      ]
    },
    {
      id: 'organization',
      name: 'Organization of Information Security',
      description: 'Internal organization and mobile devices/teleworking security.',
      icon: '🏛️',
      categories: [
        { id: 'a6', name: 'A.6 Organization of Information Security', description: 'Establish a management framework to initiate and control implementation.', questions: [
          { id: 'A.6.1.1', text: 'Information security roles and responsibilities are defined and allocated', context: 'Are security roles clearly defined with assigned accountability?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.6.1.2', text: 'Segregation of duties is maintained', context: 'Are conflicting duties and areas of responsibility separated?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.6.1.3', text: 'Contact with relevant authorities is maintained', context: 'Are relationships maintained with law enforcement and regulatory bodies?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.6.2.1', text: 'Mobile device policy is defined', context: 'Is there a policy and security measures for managing risks of mobile devices?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.6.2.2', text: 'Teleworking policy and security measures are implemented', context: 'Is there a policy for teleworking covering access, information protection?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'hr_security',
      name: 'Human Resource Security',
      description: 'Security aspects for employees before, during, and after employment.',
      icon: '👤',
      categories: [
        { id: 'a7', name: 'A.7 Human Resource Security', description: 'Ensuring employees understand their responsibilities.', questions: [
          { id: 'A.7.1.1', text: 'Background verification checks are carried out for all candidates', context: 'Are background checks conducted for new hires with access to sensitive information?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.7.2.1', text: 'Management requires employees and contractors to apply information security per policies', context: 'Does management enforce information security policies compliance?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.7.2.2', text: 'Information security awareness, education, and training is provided', context: 'Do all employees receive appropriate security awareness training?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.7.3.1', text: 'Information security responsibilities and duties that remain valid after termination are defined and communicated', context: 'Are post-employment security obligations communicated during offboarding?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'asset_mgmt',
      name: 'Asset Management',
      description: 'Identification and classification of information assets.',
      icon: '📦',
      categories: [
        { id: 'a8', name: 'A.8 Asset Management', description: 'Identify organizational assets and define protection responsibilities.', questions: [
          { id: 'A.8.1.1', text: 'Assets associated with information and information processing facilities are identified and an inventory maintained', context: 'Do you maintain a comprehensive asset inventory?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.8.1.2', text: 'Assets maintained in the inventory have owners assigned', context: 'Does every asset have a designated owner responsible for its security?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.8.2.1', text: 'Information is classified in terms of legal requirements, value, criticality and sensitivity', context: 'Is there a data classification scheme (public, internal, confidential, restricted)?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.8.3.1', text: 'Procedures for management of removable media are implemented', context: 'Are removable media managed and controlled per classification scheme?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'access_control',
      name: 'Access Control',
      description: 'Limiting access to information and information processing facilities.',
      icon: '🔑',
      categories: [
        { id: 'a9', name: 'A.9 Access Control', description: 'Business requirements of access control.', questions: [
          { id: 'A.9.1.1', text: 'An access control policy is established, documented and reviewed', context: 'Is there a formal access control policy based on business and security requirements?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.9.2.1', text: 'A formal user registration and de-registration process is implemented', context: 'Is there a formal process for user account provisioning and de-provisioning?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.9.2.3', text: 'Privileged access rights are managed through a formal process', context: 'Are privileged accounts managed with a formal authorization and review process?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.9.4.1', text: 'Access to information and application system functions is restricted per access control policy', context: 'Is access to systems and applications restricted based on the access control policy?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.9.4.2', text: 'Secure log-on procedures control access to systems', context: 'Are secure authentication methods enforced for system access?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'cryptography',
      name: 'Cryptography',
      description: 'Proper and effective use of cryptography to protect confidentiality, authenticity and integrity.',
      icon: '🔐',
      categories: [
        { id: 'a10', name: 'A.10 Cryptography', description: 'Cryptographic controls.', questions: [
          { id: 'A.10.1.1', text: 'A policy on the use of cryptographic controls is developed and implemented', context: 'Is there a policy defining the use of encryption, digital signatures, and key management?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.10.1.2', text: 'A policy on use, protection and lifetime of cryptographic keys is developed', context: 'Is there a key management policy covering generation, storage, and rotation?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'physical_env',
      name: 'Physical & Environmental Security',
      description: 'Prevention of unauthorized physical access, damage, and interference.',
      icon: '🏗️',
      categories: [
        { id: 'a11', name: 'A.11 Physical and Environmental Security', description: 'Secure areas and equipment.', questions: [
          { id: 'A.11.1.1', text: 'Security perimeters are defined and used to protect areas containing information', context: 'Are physical security perimeters defined around areas containing sensitive information?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.11.1.2', text: 'Secure areas are protected by appropriate entry controls', context: 'Are entry controls (badges, biometrics) used for secure areas?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.11.2.1', text: 'Equipment is sited and protected to reduce environmental risks', context: 'Is equipment protected against environmental threats and unauthorized access?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.11.2.7', text: 'Items of equipment containing storage media are verified to ensure sensitive data is removed', context: 'Is data properly sanitized from equipment before disposal or re-use?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'operations',
      name: 'Operations Security',
      description: 'Correct and secure operations of information processing facilities.',
      icon: '⚙️',
      categories: [
        { id: 'a12', name: 'A.12 Operations Security', description: 'Operational procedures and responsibilities.', questions: [
          { id: 'A.12.1.1', text: 'Operating procedures are documented and made available', context: 'Are operating procedures documented and available to all users who need them?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.12.1.2', text: 'Changes to systems and processes are controlled', context: 'Is there a formal change management process for production systems?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.12.2.1', text: 'Detection, prevention and recovery controls for malware are implemented', context: 'Are anti-malware controls deployed across the organization?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.12.3.1', text: 'Backup copies of information and software are taken and tested', context: 'Are regular backups performed and periodically tested?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.12.4.1', text: 'Event logs recording user activities and information security events are produced and retained', context: 'Are audit logs enabled, reviewed, and retained appropriately?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.12.6.1', text: 'Information about technical vulnerabilities is obtained and appropriate measures taken', context: 'Is there a vulnerability management process for identifying and remediating vulnerabilities?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'comms_security',
      name: 'Communications Security',
      description: 'Network security management and information transfer protection.',
      icon: '🌐',
      categories: [
        { id: 'a13', name: 'A.13 Communications Security', description: 'Network security management.', questions: [
          { id: 'A.13.1.1', text: 'Networks are managed and controlled to protect information in systems and applications', context: 'Are network security controls implemented and maintained?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.13.1.3', text: 'Groups of information services, users and systems are segregated on networks', context: 'Is network segmentation implemented to separate different security zones?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.13.2.1', text: 'Formal transfer policies and procedures protect information transfer', context: 'Are information transfer policies in place for all types of communication?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.13.2.3', text: 'Information involved in electronic messaging is appropriately protected', context: 'Is email and messaging content protected through encryption and filtering?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'supplier',
      name: 'Supplier Relationships',
      description: 'Protection of organizational assets accessible by suppliers.',
      icon: '🤝',
      categories: [
        { id: 'a15', name: 'A.15 Supplier Relationships', description: 'Information security in supplier relationships.', questions: [
          { id: 'A.15.1.1', text: 'Information security requirements for mitigating risks with suppliers are agreed and documented', context: 'Are security requirements included in supplier contracts?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.15.2.1', text: 'Organizations regularly monitor, review and audit supplier service delivery', context: 'Do you periodically assess supplier security performance?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'incident_mgmt',
      name: 'Incident Management',
      description: 'Consistent and effective approach to management of information security incidents.',
      icon: '🚨',
      categories: [
        { id: 'a16', name: 'A.16 Information Security Incident Management', description: 'Management of incidents and improvements.', questions: [
          { id: 'A.16.1.1', text: 'Management responsibilities and procedures are established to ensure quick, effective response', context: 'Are incident management roles and procedures clearly established?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.16.1.2', text: 'Information security events are reported through appropriate management channels', context: 'Can employees report security events through clear channels?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.16.1.5', text: 'Information security incidents are responded to in accordance with documented procedures', context: 'Are incidents responded to following documented procedures?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.16.1.6', text: 'Knowledge gained from analyzing security incidents is used to reduce likelihood of future incidents', context: 'Are lessons learned from incidents applied to prevent recurrence?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'bc_mgmt',
      name: 'Business Continuity',
      description: 'Information security continuity embedded in business continuity management.',
      icon: '🔄',
      categories: [
        { id: 'a17', name: 'A.17 Business Continuity Management', description: 'Information security continuity.', questions: [
          { id: 'A.17.1.1', text: 'Information security continuity requirements are determined', context: 'Have information security continuity requirements been identified?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.17.1.2', text: 'Information security continuity processes and controls are implemented and maintained', context: 'Are continuity controls in place to ensure security during disruptions?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.17.1.3', text: 'Information security continuity controls are verified at regular intervals', context: 'Are continuity controls tested and verified regularly?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.17.2.1', text: 'Information processing facilities are implemented with redundancy', context: 'Is redundancy built into critical systems for availability?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Avoidance of breaches of legal, statutory, regulatory or contractual obligations.',
      icon: '⚖️',
      categories: [
        { id: 'a18', name: 'A.18 Compliance', description: 'Compliance with legal and contractual requirements.', questions: [
          { id: 'A.18.1.1', text: 'All relevant legislative, regulatory, and contractual requirements are identified and documented', context: 'Are all applicable legal and regulatory requirements identified?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.18.1.3', text: 'Records are protected from loss, destruction, falsification per requirements', context: 'Are important records protected per legal and regulatory requirements?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.18.1.4', text: 'Privacy and protection of personally identifiable information is ensured', context: 'Are privacy requirements for PII implemented and maintained?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] },
          { id: 'A.18.2.1', text: 'Independent review of information security is carried out at planned intervals', context: 'Are independent security audits conducted regularly?', options: [{label: 'Not Started', value: 1}, {label: 'Planned', value: 2}, {label: 'Partially Implemented', value: 3}, {label: 'Largely Implemented', value: 4}, {label: 'Fully Implemented', value: 5}] }
        ]}
      ]
    }
  ]
};
