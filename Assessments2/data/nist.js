// ============================================
// HawkSight — NIST Cybersecurity Framework 2.0 Assessment
// Every CSF 2.0 Core subcategory (NIST CSWP 29, February 2024):
// 6 functions, 22 categories, 106 subcategories.
// Each outcome is rated on a four-level implementation scale and mapped
// explicitly to a HawkSight control, so results also feed the attack path
// analysis and the other framework crosswalks.
// ============================================

const SCALE = [
  { label: 'Not implemented', value: 1, detail: 'The outcome is not achieved.' },
  { label: 'Partially implemented', value: 2, detail: 'Achieved informally or only in some areas; not documented.' },
  { label: 'Largely implemented', value: 3, detail: 'Documented and achieved across most of the organisation, with known gaps.' },
  { label: 'Fully implemented', value: 4, detail: 'Documented, achieved across the organisation, and reviewed and improved regularly.' }
];

// s(subcategory, control, outcome, practical question)
function s(id, control, text, context) {
  return { id, control, text, context, options: SCALE };
}

function cat(id, name, description, questions) {
  return { id, name, description, questions };
}

const NIST_DATA = {
  id: 'nist',
  modules: [
    {
      id: 'govern', name: 'GOVERN (GV)', icon: '',
      description: 'The organisation\'s cybersecurity risk management strategy, expectations and policy are established, communicated and monitored.',
      categories: [
        cat('gv_oc', 'Organizational Context (GV.OC)', 'The circumstances surrounding the organisation\'s cybersecurity risk management decisions are understood.', [
          s('GV.OC-01', 'HS-GOV-06', 'The organizational mission is understood and informs cybersecurity risk management', 'Do security priorities follow from what the organisation exists to do, and can leadership explain the link?'),
          s('GV.OC-02', 'HS-GOV-06', 'Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered', 'Do you know what customers, regulators, investors and staff expect from your security, and is it taken into account?'),
          s('GV.OC-03', 'HS-GOV-04', 'Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed', 'Is there a maintained list of security and privacy obligations (for example DPDP, CERT-In, sector regulators, contracts) with owners?'),
          s('GV.OC-04', 'HS-GOV-06', 'Critical objectives, capabilities, and services that external stakeholders depend on or expect from the organization are understood and communicated', 'Are the services others depend on from you identified, with their tolerance for disruption?'),
          s('GV.OC-05', 'HS-TPR-01', 'Outcomes, capabilities, and services that the organization depends on are understood and communicated', 'Are the suppliers, platforms and services you depend on identified, including which are critical?')
        ]),
        cat('gv_rm', 'Risk Management Strategy (GV.RM)', 'Priorities, constraints, risk tolerance and appetite statements, and assumptions are established, communicated and used to support operational risk decisions.', [
          s('GV.RM-01', 'HS-GOV-03', 'Risk management objectives are established and agreed to by organizational stakeholders', 'Has leadership agreed what cyber risk management is meant to achieve?'),
          s('GV.RM-02', 'HS-GOV-03', 'Risk appetite and risk tolerance statements are established, communicated, and maintained', 'Is there a stated level of cyber risk the organisation will and will not accept?'),
          s('GV.RM-03', 'HS-GOV-03', 'Cybersecurity risk management activities and outcomes are included in enterprise risk management processes', 'Do cyber risks appear in the enterprise risk register alongside financial and operational risks?'),
          s('GV.RM-04', 'HS-GOV-03', 'Strategic direction that describes appropriate risk response options is established and communicated', 'Is it clear when risks should be accepted, reduced, transferred (for example insured) or avoided?'),
          s('GV.RM-05', 'HS-GOV-03', 'Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties', 'Do people know how to raise a cyber risk, including one coming from a supplier?'),
          s('GV.RM-06', 'HS-GOV-03', 'A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated', 'Is there one consistent method for rating and prioritising cyber risks?'),
          s('GV.RM-07', 'HS-GOV-03', 'Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions', 'Are opportunities, such as security as a selling point or a new technology, considered alongside threats?')
        ]),
        cat('gv_rr', 'Roles, Responsibilities, and Authorities (GV.RR)', 'Cybersecurity roles, responsibilities and authorities to foster accountability, performance assessment and continuous improvement are established and communicated.', [
          s('GV.RR-01', 'HS-GOV-02', 'Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving', 'Is a named member of leadership accountable for cyber risk, and do they actively support security?'),
          s('GV.RR-02', 'HS-GOV-02', 'Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced', 'Is there a documented RACI for security activities that people actually follow?'),
          s('GV.RR-03', 'HS-GOV-02', 'Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies', 'Do security budgets and staffing match the risks leadership has accepted?'),
          s('GV.RR-04', 'HS-GOV-02', 'Cybersecurity is included in human resources practices', 'Are screening, onboarding, role changes and exits handled with security in mind?')
        ]),
        cat('gv_po', 'Policy (GV.PO)', 'Organisational cybersecurity policy is established, communicated and enforced.', [
          s('GV.PO-01', 'HS-GOV-01', 'Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced', 'Is there an approved security policy that staff acknowledge and that is enforced?'),
          s('GV.PO-02', 'HS-GOV-01', 'Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission', 'Is the policy reviewed at least yearly and after significant change?')
        ]),
        cat('gv_ov', 'Oversight (GV.OV)', 'Results of risk management activities are used to inform, improve and adjust the risk management strategy.', [
          s('GV.OV-01', 'HS-GOV-06', 'Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction', 'Does leadership review whether the security strategy is working and change course when it is not?'),
          s('GV.OV-02', 'HS-GOV-06', 'The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks', 'Is the strategy checked against new requirements and risks at least yearly?'),
          s('GV.OV-03', 'HS-GOV-06', 'Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed', 'Are security metrics reported to leadership and used to decide changes?')
        ]),
        cat('gv_sc', 'Cybersecurity Supply Chain Risk Management (GV.SC)', 'Cyber supply chain risk management processes are identified, established, managed, monitored and improved.', [
          s('GV.SC-01', 'HS-TPR-01', 'A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders', 'Is there an agreed approach to managing security risk from suppliers?'),
          s('GV.SC-02', 'HS-TPR-01', 'Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally', 'Are security responsibilities between you and your suppliers clearly defined?'),
          s('GV.SC-03', 'HS-TPR-01', 'Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes', 'Do supplier risks feed into the main risk register and improvement plans?'),
          s('GV.SC-04', 'HS-TPR-01', 'Suppliers are known and prioritized by criticality', 'Is there a supplier register ranked by how critical each supplier is?'),
          s('GV.SC-05', 'HS-TPR-01', 'Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties', 'Do supplier contracts include security requirements and breach notification?'),
          s('GV.SC-06', 'HS-TPR-01', 'Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships', 'Are suppliers assessed before they are onboarded?'),
          s('GV.SC-07', 'HS-TPR-01', 'The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship', 'Are critical suppliers reassessed and monitored during the relationship?'),
          s('GV.SC-08', 'HS-TPR-01', 'Relevant suppliers and other third parties are included in incident planning, response, and recovery activities', 'Are critical suppliers part of your incident plans and exercises?'),
          s('GV.SC-09', 'HS-TPR-01', 'Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle', 'Is supplier security performance tracked over the life of products and services?'),
          s('GV.SC-10', 'HS-TPR-01', 'Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement', 'When a supplier relationship ends, are access removed and data returned or destroyed?')
        ])
      ]
    },
    {
      id: 'identify', name: 'IDENTIFY (ID)', icon: '',
      description: 'The organisation\'s current cybersecurity risks are understood.',
      categories: [
        cat('id_am', 'Asset Management (ID.AM)', 'Assets that enable the organisation to achieve business purposes are identified and managed consistent with their importance.', [
          s('ID.AM-01', 'HS-AST-01', 'Inventories of hardware managed by the organization are maintained', 'Is there a complete, current inventory of devices, ideally maintained by automated discovery?'),
          s('ID.AM-02', 'HS-AST-02', 'Inventories of software, services, and systems managed by the organization are maintained', 'Is there an inventory of software, SaaS and internet-facing services?'),
          s('ID.AM-03', 'HS-AST-03', 'Representations of the organization\'s authorized network communication and internal and external network data flows are maintained', 'Are network diagrams and data flows current?'),
          s('ID.AM-04', 'HS-TPR-01', 'Inventories of services provided by suppliers are maintained', 'Is there a list of services each supplier provides to you?'),
          s('ID.AM-05', 'HS-AST-03', 'Assets are prioritized based on classification, criticality, resources, and impact on the mission', 'Are assets ranked by how critical they are to the business?'),
          s('ID.AM-07', 'HS-AST-03', 'Inventories of data and corresponding metadata for designated data types are maintained', 'Is there an inventory of sensitive data and where it is stored?'),
          s('ID.AM-08', 'HS-VUL-02', 'Systems, hardware, software, services, and data are managed throughout their life cycles', 'Are systems tracked from purchase to secure disposal, including end-of-support dates?')
        ]),
        cat('id_ra', 'Risk Assessment (ID.RA)', 'The cybersecurity risk to the organisation, assets and individuals is understood.', [
          s('ID.RA-01', 'HS-VUL-01', 'Vulnerabilities in assets are identified, validated, and recorded', 'Are systems scanned for vulnerabilities and the results recorded and validated?'),
          s('ID.RA-02', 'HS-MON-02', 'Cyber threat intelligence is received from information sharing forums and sources', 'Do you receive threat intelligence, for example from CERT-In, sector bodies or vendors?'),
          s('ID.RA-03', 'HS-GOV-03', 'Internal and external threats to the organization are identified and recorded', 'Are the threats most relevant to you identified and documented?'),
          s('ID.RA-04', 'HS-GOV-03', 'Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded', 'Are impact and likelihood assessed for the main threats?'),
          s('ID.RA-05', 'HS-GOV-03', 'Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization', 'Are risks prioritised using threats, vulnerabilities, likelihood and impact?'),
          s('ID.RA-06', 'HS-GOV-03', 'Risk responses are chosen, prioritized, planned, tracked, and communicated', 'Does each significant risk have a chosen response, owner and tracked plan?'),
          s('ID.RA-07', 'HS-VUL-02', 'Changes and exceptions are managed, assessed for risk impact, recorded, and tracked', 'Are changes and security exceptions risk-assessed and recorded?'),
          s('ID.RA-08', 'HS-VUL-01', 'Processes for receiving, analyzing, and responding to vulnerability disclosures are established', 'Can outsiders report vulnerabilities to you, and are reports handled?'),
          s('ID.RA-09', 'HS-TPR-01', 'The authenticity and integrity of hardware and software are assessed prior to acquisition and use', 'Are software and hardware checked for authenticity and integrity before use?'),
          s('ID.RA-10', 'HS-TPR-01', 'Critical suppliers are assessed prior to acquisition', 'Are critical suppliers security-assessed before contracts are signed?')
        ]),
        cat('id_im', 'Improvement (ID.IM)', 'Improvements to organisational cybersecurity risk management processes, procedures and activities are identified across all functions.', [
          s('ID.IM-01', 'HS-GOV-05', 'Improvements are identified from evaluations', 'Do audits and assessments lead to tracked improvements?'),
          s('ID.IM-02', 'HS-IR-02', 'Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties', 'Do penetration tests and exercises lead to tracked improvements?'),
          s('ID.IM-03', 'HS-IR-02', 'Improvements are identified from execution of operational processes, procedures, and activities', 'Are lessons from day-to-day operations and incidents captured and acted on?'),
          s('ID.IM-04', 'HS-IR-01', 'Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved', 'Are incident response and related plans documented, current and improved after use?')
        ])
      ]
    },
    {
      id: 'protect', name: 'PROTECT (PR)', icon: '',
      description: 'Safeguards to manage the organisation\'s cybersecurity risks are used.',
      categories: [
        cat('pr_aa', 'Identity Management, Authentication, and Access Control (PR.AA)', 'Access to physical and logical assets is limited to authorised users, services and hardware and managed commensurate with the assessed risk.', [
          s('PR.AA-01', 'HS-IAM-03', 'Identities and credentials for authorized users, services, and hardware are managed by the organization', 'Are accounts created, changed and removed through a controlled process, including leavers?'),
          s('PR.AA-02', 'HS-IAM-06', 'Identities are proofed and bound to credentials based on the context of interactions', 'Is identity verified before issuing or resetting credentials, including at the helpdesk?'),
          s('PR.AA-03', 'HS-IAM-01', 'Users, services, and hardware are authenticated', 'Is MFA enforced for email, remote access, cloud and administrator accounts?'),
          s('PR.AA-04', 'HS-IAM-07', 'Identity assertions are protected, conveyed, and verified', 'Are single sign-on tokens, federation and directory services protected against forgery and theft?'),
          s('PR.AA-05', 'HS-IAM-02', 'Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties', 'Is access granted by role, reviewed regularly, and limited to what each job needs?'),
          s('PR.AA-06', 'HS-PHY-01', 'Physical access to assets is managed, monitored, and enforced commensurate with risk', 'Are server rooms and sensitive areas access-controlled and logged?')
        ]),
        cat('pr_at', 'Awareness and Training (PR.AT)', 'Personnel are provided with cybersecurity awareness and training.', [
          s('PR.AT-01', 'HS-PPL-01', 'Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind', 'Do all staff receive security awareness training at joining and every year?'),
          s('PR.AT-02', 'HS-PPL-01', 'Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind', 'Do administrators, developers, finance and executives receive role-specific training?')
        ]),
        cat('pr_ds', 'Data Security (PR.DS)', 'Data is managed consistent with the organisation\'s risk strategy to protect its confidentiality, integrity and availability.', [
          s('PR.DS-01', 'HS-DAT-01', 'The confidentiality, integrity, and availability of data-at-rest are protected', 'Are sensitive data stores, laptops and removable media encrypted?'),
          s('PR.DS-02', 'HS-DAT-02', 'The confidentiality, integrity, and availability of data-in-transit are protected', 'Is TLS 1.2 or higher enforced on external services and sensitive internal traffic?'),
          s('PR.DS-10', 'HS-DAT-03', 'The confidentiality, integrity, and availability of data-in-use are protected', 'Is sensitive data protected while being processed, for example with masking and data loss prevention?'),
          s('PR.DS-11', 'HS-RES-01', 'Backups of data are created, protected, maintained, and tested', 'Are backups protected from attackers (offline or immutable) and tested?')
        ]),
        cat('pr_ps', 'Platform Security (PR.PS)', 'The hardware, software and services of physical and virtual platforms are managed consistent with the organisation\'s risk strategy.', [
          s('PR.PS-01', 'HS-END-02', 'Configuration management practices are established and applied', 'Are systems built and maintained to a secure baseline?'),
          s('PR.PS-02', 'HS-VUL-02', 'Software is maintained, replaced, and removed commensurate with risk', 'Are security updates applied on time and unsupported software retired?'),
          s('PR.PS-03', 'HS-VUL-02', 'Hardware is maintained, replaced, and removed commensurate with risk', 'Is hardware kept on supported firmware and replaced before end of support?'),
          s('PR.PS-04', 'HS-MON-01', 'Log records are generated and made available for continuous monitoring', 'Are security logs generated and collected centrally?'),
          s('PR.PS-05', 'HS-END-02', 'Installation and execution of unauthorized software are prevented', 'Is unapproved software blocked from installing or running?'),
          s('PR.PS-06', 'HS-APP-01', 'Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle', 'Are secure development practices, code review and security testing part of the development process?')
        ]),
        cat('pr_ir', 'Technology Infrastructure Resilience (PR.IR)', 'Security architectures are managed with the organisation\'s risk strategy to protect asset confidentiality, integrity and availability, and organisational resilience.', [
          s('PR.IR-01', 'HS-NET-01', 'Networks and environments are protected from unauthorized logical access and usage', 'Are networks segmented so critical systems are separated from general users?'),
          s('PR.IR-02', 'HS-PHY-01', 'The organization\'s technology assets are protected from environmental threats', 'Are server and network rooms protected against fire, flood, power and temperature problems?'),
          s('PR.IR-03', 'HS-RES-03', 'Mechanisms are implemented to achieve resilience requirements in normal and adverse situations', 'Can critical services continue during outages, including manual workarounds?'),
          s('PR.IR-04', 'HS-RES-02', 'Adequate resource capacity to ensure availability is maintained', 'Is capacity planned so critical services stay available under load?')
        ])
      ]
    },
    {
      id: 'detect', name: 'DETECT (DE)', icon: '',
      description: 'Possible cybersecurity attacks and compromises are found and analysed.',
      categories: [
        cat('de_cm', 'Continuous Monitoring (DE.CM)', 'Assets are monitored to find anomalies, indicators of compromise and other potentially adverse events.', [
          s('DE.CM-01', 'HS-MON-02', 'Networks and network services are monitored to find potentially adverse events', 'Is network traffic monitored for signs of attack?'),
          s('DE.CM-02', 'HS-PHY-01', 'The physical environment is monitored to find potentially adverse events', 'Are physical access events and CCTV monitored?'),
          s('DE.CM-03', 'HS-MON-02', 'Personnel activity and technology usage are monitored to find potentially adverse events', 'Is user activity monitored for signs of account compromise or misuse?'),
          s('DE.CM-06', 'HS-MON-02', 'External service provider activities and services are monitored to find potentially adverse events', 'Is supplier and service provider activity in your environment monitored?'),
          s('DE.CM-09', 'HS-END-01', 'Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events', 'Are endpoints and servers monitored by EDR or equivalent?')
        ]),
        cat('de_ae', 'Adverse Event Analysis (DE.AE)', 'Anomalies, indicators of compromise and other potentially adverse events are analysed to characterise the events and detect cybersecurity incidents.', [
          s('DE.AE-02', 'HS-MON-02', 'Potentially adverse events are analyzed to better understand associated activities', 'Are alerts investigated by someone with the skills to understand them?'),
          s('DE.AE-03', 'HS-MON-01', 'Information is correlated from multiple sources', 'Are events from identity, endpoint, network and cloud correlated, for example in a SIEM?'),
          s('DE.AE-04', 'HS-IR-01', 'The estimated impact and scope of adverse events are understood', 'When something is detected, is its impact and scope assessed?'),
          s('DE.AE-06', 'HS-MON-02', 'Information on adverse events is provided to authorized staff and tools', 'Do alerts reach the right people and tools promptly, including out of hours?'),
          s('DE.AE-07', 'HS-MON-02', 'Cyber threat intelligence and other contextual information are integrated into the analysis', 'Is threat intelligence used when analysing alerts?'),
          s('DE.AE-08', 'HS-IR-01', 'Incidents are declared when adverse events meet the defined incident criteria', 'Are there clear criteria for declaring an incident?')
        ])
      ]
    },
    {
      id: 'respond', name: 'RESPOND (RS)', icon: '',
      description: 'Actions regarding a detected cybersecurity incident are taken.',
      categories: [
        cat('rs_ma', 'Incident Management (RS.MA)', 'Responses to detected cybersecurity incidents are managed.', [
          s('RS.MA-01', 'HS-IR-01', 'The incident response plan is executed in coordination with relevant third parties once an incident is declared', 'Is the response plan followed, including with forensics, legal, insurer and suppliers?'),
          s('RS.MA-02', 'HS-IR-01', 'Incident reports are triaged and validated', 'Are reported incidents triaged and confirmed promptly?'),
          s('RS.MA-03', 'HS-IR-01', 'Incidents are categorized and prioritized', 'Are incidents categorised and prioritised using agreed criteria?'),
          s('RS.MA-04', 'HS-IR-01', 'Incidents are escalated or elevated as needed', 'Is there a defined escalation path to leadership?'),
          s('RS.MA-05', 'HS-IR-01', 'The criteria for initiating incident recovery are applied', 'Is it clear when to move from response to recovery?')
        ]),
        cat('rs_an', 'Incident Analysis (RS.AN)', 'Investigations are conducted to ensure effective response and support forensics and recovery activities.', [
          s('RS.AN-03', 'HS-IR-01', 'Analysis is performed to establish what has taken place during an incident and the root cause of the incident', 'Is root cause established after significant incidents?'),
          s('RS.AN-06', 'HS-IR-01', 'Actions performed during an investigation are recorded, and the records\' integrity and provenance are preserved', 'Are investigation actions recorded in a way that would stand up to scrutiny?'),
          s('RS.AN-07', 'HS-IR-01', 'Incident data and metadata are collected, and their integrity and provenance are preserved', 'Is evidence collected and preserved properly?'),
          s('RS.AN-08', 'HS-IR-01', 'An incident\'s magnitude is estimated and validated', 'Is the scale of an incident (systems, data, people affected) estimated and confirmed?')
        ]),
        cat('rs_co', 'Incident Response Reporting and Communication (RS.CO)', 'Response activities are coordinated with internal and external stakeholders as required by laws, regulations or policies.', [
          s('RS.CO-02', 'HS-IR-03', 'Internal and external stakeholders are notified of incidents', 'Can you notify CERT-In within 6 hours, and regulators, customers and affected people on time?'),
          s('RS.CO-03', 'HS-IR-03', 'Information is shared with designated internal and external stakeholders', 'Is incident information shared with the right people through approved channels?')
        ]),
        cat('rs_mi', 'Incident Mitigation (RS.MI)', 'Activities are performed to prevent expansion of an event and mitigate its effects.', [
          s('RS.MI-01', 'HS-IR-01', 'Incidents are contained', 'Can affected systems and accounts be isolated quickly?'),
          s('RS.MI-02', 'HS-IR-01', 'Incidents are eradicated', 'Is the attacker\'s access fully removed before recovery?')
        ])
      ]
    },
    {
      id: 'recover', name: 'RECOVER (RC)', icon: '',
      description: 'Assets and operations affected by a cybersecurity incident are restored.',
      categories: [
        cat('rc_rp', 'Incident Recovery Plan Execution (RC.RP)', 'Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents.', [
          s('RC.RP-01', 'HS-RES-02', 'The recovery portion of the incident response plan is executed once initiated from the incident response process', 'Is there a recovery plan that is triggered from incident response?'),
          s('RC.RP-02', 'HS-RES-02', 'Recovery actions are selected, scoped, prioritized, and performed', 'Is the restore order set by business priority?'),
          s('RC.RP-03', 'HS-RES-01', 'The integrity of backups and other restoration assets is verified before using them for restoration', 'Are backups checked to be clean before restoring from them?'),
          s('RC.RP-04', 'HS-RES-03', 'Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms', 'Is it decided how the business will operate while recovery is under way?'),
          s('RC.RP-05', 'HS-RES-02', 'The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed', 'Are restored systems checked before returning to normal operation?'),
          s('RC.RP-06', 'HS-RES-02', 'The end of incident recovery is declared based on criteria, and incident-related documentation is completed', 'Is there a defined point at which recovery is complete and documented?')
        ]),
        cat('rc_co', 'Incident Recovery Communication (RC.CO)', 'Restoration activities are coordinated with internal and external parties.', [
          s('RC.CO-03', 'HS-IR-03', 'Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders', 'Are customers, staff and partners kept informed during recovery?'),
          s('RC.CO-04', 'HS-IR-03', 'Public updates on incident recovery are shared using approved methods and messaging', 'Are public statements prepared and approved before release?')
        ])
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NIST_DATA };
}
