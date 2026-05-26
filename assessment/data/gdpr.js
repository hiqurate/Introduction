// ============================================
// GDPR Data Protection Assessment
// 7 Principles + Rights + Organizational Measures
// ============================================

const GDPR_DATA = {
  id: 'gdpr',
  modules: [
    {
      id: 'lawfulness', name: 'Lawfulness & Transparency', description: 'Data processing is lawful, fair, and transparent to the data subject.', icon: '⚖️',
      categories: [
        { id: 'lawful', name: 'Lawful Basis & Transparency', description: 'Articles 5(1)(a), 6, 13, 14 - Lawfulness, fairness, and transparency.', questions: [
          { id: 'GDPR-1.1', text: 'Legal basis for each processing activity is identified and documented', context: 'Have you identified the lawful basis (consent, contract, legal obligation, etc.) for each processing activity?', options: [{label: 'Not Ready', value: 1, detail: 'No legal basis identified'}, {label: 'Basic Awareness', value: 2, detail: 'Some processing has legal basis'}, {label: 'Partially Compliant', value: 3, detail: 'Most processing documented'}, {label: 'Substantially Compliant', value: 4, detail: 'All processing with legal basis'}, {label: 'Fully Compliant', value: 5, detail: 'Complete ROPA with legal basis review'}] },
          { id: 'GDPR-1.2', text: 'Privacy notices are provided to data subjects at the time of data collection', context: 'Do you provide clear, accessible privacy information when collecting personal data?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-1.3', text: 'Consent mechanisms meet GDPR requirements (freely given, specific, informed, unambiguous)', context: 'Where consent is the legal basis, is it properly obtained and managed?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-1.4', text: 'Records of processing activities (ROPA) are maintained', context: 'Do you maintain a comprehensive record of all personal data processing activities?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'purpose_data', name: 'Purpose & Data Minimisation', description: 'Data is collected for specified purposes and limited to what is necessary.', icon: '🎯',
      categories: [
        { id: 'purpose', name: 'Purpose Limitation & Minimisation', description: 'Articles 5(1)(b), 5(1)(c) - Purpose limitation and data minimisation.', questions: [
          { id: 'GDPR-2.1', text: 'Personal data is collected for specified, explicit, and legitimate purposes', context: 'Are the purposes for data collection clearly defined and documented?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-2.2', text: 'Data collection is limited to what is necessary for the stated purpose', context: 'Do you collect only the minimum personal data needed for each purpose?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-2.3', text: 'Personal data is accurate and kept up to date', context: 'Are procedures in place to ensure data accuracy and enable corrections?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'storage_security', name: 'Storage & Security', description: 'Data retention limits and integrity/confidentiality measures.', icon: '🔐',
      categories: [
        { id: 'storage', name: 'Storage Limitation & Security', description: 'Articles 5(1)(e), 5(1)(f) - Storage limitation and integrity/confidentiality.', questions: [
          { id: 'GDPR-3.1', text: 'Retention periods are defined for all categories of personal data', context: 'Have you defined how long each type of personal data should be retained?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-3.2', text: 'Personal data is securely deleted when no longer needed', context: 'Are processes in place to securely delete data when the retention period expires?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-3.3', text: 'Appropriate technical and organizational security measures are implemented', context: 'Are encryption, access controls, and security measures in place to protect personal data?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-3.4', text: 'Pseudonymization and encryption are applied where appropriate', context: 'Is personal data pseudonymized or encrypted where feasible?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'data_rights', name: 'Data Subject Rights', description: 'Mechanisms to fulfill data subject rights under GDPR.', icon: '✋',
      categories: [
        { id: 'rights', name: 'Data Subject Rights', description: 'Articles 15-22 - Rights of data subjects.', questions: [
          { id: 'GDPR-4.1', text: 'Right of access: Data subjects can obtain confirmation and copies of their personal data', context: 'Can you provide data subjects with copies of their personal data upon request?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-4.2', text: 'Right to rectification: Inaccurate personal data can be corrected', context: 'Can data subjects request correction of inaccurate personal data?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-4.3', text: 'Right to erasure: Personal data can be deleted when no longer necessary', context: 'Can data subjects request deletion of their personal data (right to be forgotten)?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-4.4', text: 'Right to data portability: Personal data can be provided in a structured, machine-readable format', context: 'Can you export personal data in a portable format (JSON, CSV)?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-4.5', text: 'Right to object: Data subjects can object to processing including direct marketing', context: 'Can data subjects object to processing, especially for direct marketing?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-4.6', text: 'Processes exist to handle data subject requests within 30 days', context: 'Do you have a process to respond to DSARs within the required timeframe?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'accountability', name: 'Accountability & Governance', description: 'Demonstrating compliance through documentation, DPO, and DPIA.', icon: '📋',
      categories: [
        { id: 'accountability', name: 'Accountability Measures', description: 'Articles 5(2), 24, 25, 35, 37 - Accountability principle.', questions: [
          { id: 'GDPR-5.1', text: 'A Data Protection Officer (DPO) is appointed where required', context: 'If required, has a DPO been designated with appropriate authority and resources?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-5.2', text: 'Data Protection Impact Assessments (DPIAs) are conducted for high-risk processing', context: 'Are DPIAs performed before implementing high-risk data processing activities?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-5.3', text: 'Data protection by design and by default is implemented', context: 'Are privacy considerations built into system design and default settings?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-5.4', text: 'Staff receive data protection training', context: 'Do all employees who handle personal data receive GDPR awareness training?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'breach_transfer', name: 'Breach Notification & Transfers', description: 'Data breach handling and international transfer safeguards.', icon: '🚨',
      categories: [
        { id: 'breach', name: 'Breach Notification', description: 'Articles 33, 34 - Personal data breach notification.', questions: [
          { id: 'GDPR-6.1', text: 'A breach detection and response procedure is in place', context: 'Can you detect, investigate, and respond to personal data breaches?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-6.2', text: 'Breaches are reported to the supervisory authority within 72 hours', context: 'Do you have processes to report qualifying breaches within 72 hours?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-6.3', text: 'Affected data subjects are notified when there is high risk', context: 'Is there a process for notifying individuals when a breach poses high risk to them?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-6.4', text: 'A breach register is maintained', context: 'Do you document all breaches including facts, effects, and remedial actions?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]},
        { id: 'transfers', name: 'International Transfers', description: 'Articles 44-49 - Transfers of personal data to third countries.', questions: [
          { id: 'GDPR-6.5', text: 'International data transfers are identified and have appropriate safeguards', context: 'Are all cross-border data transfers identified with appropriate legal mechanisms (SCCs, adequacy)?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-6.6', text: 'Transfer Impact Assessments are conducted', context: 'Have you assessed the data protection laws in recipient countries?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    },
    {
      id: 'processors', name: 'Processors & Third Parties', description: 'Managing data processors and third-party data sharing.', icon: '🤝',
      categories: [
        { id: 'processors', name: 'Data Processor Management', description: 'Article 28 - Processor requirements.', questions: [
          { id: 'GDPR-7.1', text: 'Data processing agreements are in place with all processors', context: 'Do you have Article 28-compliant agreements with all data processors?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-7.2', text: 'Processor compliance is verified and monitored', context: 'Do you audit or assess your data processors\' GDPR compliance?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] },
          { id: 'GDPR-7.3', text: 'Sub-processor authorization is managed', context: 'Are sub-processors approved and their use controlled through agreements?', options: [{label: 'Not Ready', value: 1}, {label: 'Basic Awareness', value: 2}, {label: 'Partially Compliant', value: 3}, {label: 'Substantially Compliant', value: 4}, {label: 'Fully Compliant', value: 5}] }
        ]}
      ]
    }
  ]
};
