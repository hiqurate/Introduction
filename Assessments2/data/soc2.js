// ============================================
// SOC 2 Trust Services Criteria Assessment
// 5 Trust Criteria
// ============================================

const SOC2_DATA = {
  id: 'soc2',
  modules: [
    {
      id: 'security', name: 'Security (Common Criteria)', description: 'Information and systems are protected against unauthorized access, unauthorized disclosure, and damage.', icon: '🔒',
      categories: [
        { id: 'cc1', name: 'CC1: Control Environment', description: 'COSO-based control environment criteria.', questions: [
          { id: 'SOC2-CC1.1', text: 'The entity demonstrates a commitment to integrity and ethical values', context: 'Does the organization have a code of conduct and enforce ethical standards?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC1.2', text: 'Board of directors demonstrates independence and exercises oversight', context: 'Does the board/oversight body provide independent security governance?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC1.3', text: 'Management establishes structures, reporting lines, and appropriate authorities', context: 'Are organizational structures defined for security management?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC1.4', text: 'The entity demonstrates commitment to attract and retain competent individuals', context: 'Is there a program for hiring and retaining qualified security staff?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]},
        { id: 'cc2', name: 'CC2: Communication & Information', description: 'Communication and information criteria.', questions: [
          { id: 'SOC2-CC2.1', text: 'The entity obtains or generates relevant, quality information to support internal controls', context: 'Is quality information generated to support security decision-making?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC2.2', text: 'The entity internally communicates security objectives and responsibilities', context: 'Are security policies and responsibilities communicated to all personnel?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC2.3', text: 'The entity communicates with external parties regarding security matters', context: 'Is there a process for communicating security information to customers and partners?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]},
        { id: 'cc6', name: 'CC6: Logical & Physical Access Controls', description: 'Logical and physical access controls.', questions: [
          { id: 'SOC2-CC6.1', text: 'Logical access security software, infrastructure, and architectures are implemented', context: 'Are logical access controls (IAM, RBAC, MFA) properly implemented?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC6.2', text: 'Prior to access, user identities are registered and authorized', context: 'Is there a formal user provisioning process with approval workflows?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC6.3', text: 'Role-based access controls are implemented per the principle of least privilege', context: 'Is access granted based on least privilege with regular access reviews?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC6.4', text: 'Physical access to facilities and protected areas is restricted', context: 'Are physical access controls in place for data centers and sensitive areas?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC6.5', text: 'Data at rest and in transit is protected', context: 'Is encryption applied to data at rest and during transmission?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]},
        { id: 'cc7', name: 'CC7: System Operations', description: 'System operations including monitoring and incident response.', questions: [
          { id: 'SOC2-CC7.1', text: 'The entity monitors system components for anomalies indicating malicious acts', context: 'Is continuous monitoring in place for detecting security incidents?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC7.2', text: 'The entity monitors for detection of anomalies and evaluates for incidents', context: 'Are detected anomalies evaluated to determine if they are security incidents?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC7.3', text: 'The entity evaluates security events to determine whether they could impact achieving objectives', context: 'Is there an incident assessment process that evaluates business impact?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-CC7.4', text: 'The entity responds to identified security incidents', context: 'Are incident response procedures activated for confirmed incidents?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]}
      ]
    },
    {
      id: 'availability', name: 'Availability', description: 'Information and systems are available for operation and use as committed or agreed.', icon: '⬆️',
      categories: [
        { id: 'a1', name: 'Availability Criteria', description: 'System availability and resilience.', questions: [
          { id: 'SOC2-A1.1', text: 'Current processing capacity and usage are maintained to meet availability commitments', context: 'Is capacity planning performed to meet availability SLAs?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-A1.2', text: 'Environmental protections, software, data backup and recovery infrastructure are designed and maintained', context: 'Are backup and recovery processes designed to support availability commitments?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-A1.3', text: 'Recovery plan procedures supporting system recovery are tested', context: 'Are disaster recovery plans tested at least annually?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]}
      ]
    },
    {
      id: 'processing_integrity', name: 'Processing Integrity', description: 'System processing is complete, valid, accurate, timely, and authorized.', icon: '✅',
      categories: [
        { id: 'pi1', name: 'Processing Integrity Criteria', description: 'Data processing accuracy and completeness.', questions: [
          { id: 'SOC2-PI1.1', text: 'The entity obtains or generates and uses relevant quality information regarding processing objectives', context: 'Are data quality controls in place for system inputs and outputs?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-PI1.2', text: 'System inputs are complete, accurate, and valid', context: 'Are input validation controls in place for data processing?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-PI1.3', text: 'Data processing is complete, valid, accurate, and timely', context: 'Are processing controls in place to ensure data integrity?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-PI1.4', text: 'System outputs are complete, valid, and accurate', context: 'Are output validation and reconciliation controls implemented?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]}
      ]
    },
    {
      id: 'confidentiality', name: 'Confidentiality', description: 'Information designated as confidential is protected as committed or agreed.', icon: '🤫',
      categories: [
        { id: 'c1', name: 'Confidentiality Criteria', description: 'Protection of confidential information.', questions: [
          { id: 'SOC2-C1.1', text: 'Confidential information is identified and protected', context: 'Is confidential information classified and protected through its lifecycle?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-C1.2', text: 'Confidential information is disposed of in accordance with commitments', context: 'Is confidential data securely disposed of when no longer needed?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]}
      ]
    },
    {
      id: 'privacy', name: 'Privacy', description: 'Personal information is collected, used, retained, disclosed, and disposed of in conformity with commitments.', icon: '👁️',
      categories: [
        { id: 'p1', name: 'Privacy Criteria', description: 'Personal information protection.', questions: [
          { id: 'SOC2-P1.1', text: 'Privacy notice is provided and consent is obtained for personal information collection', context: 'Do you provide privacy notices and obtain proper consent before collecting personal data?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-P1.2', text: 'Personal information is collected only for identified purposes', context: 'Is data collection limited to specified, legitimate purposes?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-P1.3', text: 'Personal information is retained only as long as necessary', context: 'Are retention policies defined and enforced for personal data?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-P1.4', text: 'Personal information is disclosed only to authorized parties', context: 'Are disclosure controls in place to prevent unauthorized sharing of personal data?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] },
          { id: 'SOC2-P1.5', text: 'Personal information is securely disposed of when no longer needed', context: 'Is personal data securely deleted when the retention period expires?', options: [{label: 'Not Implemented', value: 1}, {label: 'Ad-Hoc', value: 2}, {label: 'Repeatable', value: 3}, {label: 'Defined', value: 4}, {label: 'Optimized', value: 5}] }
        ]}
      ]
    }
  ]
};
