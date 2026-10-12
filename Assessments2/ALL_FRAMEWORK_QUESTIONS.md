# HawkSight Question Library — Review Reference

Generated from the template data files (`data/*.js`). Do not edit by hand; regenerate after changing questions.

Industry templates share a threat-led core (`data/core.js`, questions `CORE-*`) and add industry-specific attack questions. Modules follow the order of an attack: how attackers get in, how they spread, what they are after, whether they would be noticed, and how the business recovers.

## Contents

1. NIST Cybersecurity Framework 2.0 Assessment (106 questions)
2. Security Operations Capability Assessment (47 questions)
3. Retail & E-commerce Threat Readiness Assessment (51 questions)
4. Healthcare & Pharma Threat Readiness Assessment (51 questions)
5. BFSI & FinTech Threat Readiness Assessment (49 questions)
6. Manufacturing & OT Threat Readiness Assessment (52 questions)
7. Education Threat Readiness Assessment (48 questions)
8. IT Services & SaaS Threat Readiness Assessment (50 questions)
9. Hospitality Threat Readiness Assessment (50 questions)
10. Logistics & Transport Threat Readiness Assessment (48 questions)
11. Professional Services Threat Readiness Assessment (47 questions)

12. Threat scenario library

---

## 1) NIST Cybersecurity Framework 2.0 Assessment

Template 3.0 · NIST Cybersecurity Framework 2.0 Core (Govern, Identify, Protect, Detect, Respond, Recover)

Rates every NIST CSF 2.0 subcategory on a four-level implementation scale. Each outcome maps to a HawkSight control, so results also show which attack paths are open and are expressed against ISO/IEC 27001:2022, CIS Controls v8.1 and SOC 2.

### GOVERN (GV)

The organisation's cybersecurity risk management strategy, expectations and policy are established, communicated and monitored.

#### Organizational Context (GV.OC)

The circumstances surrounding the organisation's cybersecurity risk management decisions are understood.

**GV.OC-01** — The organizational mission is understood and informs cybersecurity risk management

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Do security priorities follow from what the organisation exists to do, and can leadership explain the link?
- Answer levels:
  1. **Not implemented** — The outcome is not achieved.
  2. **Partially implemented** — Achieved informally or only in some areas; not documented.
  3. **Largely implemented** — Documented and achieved across most of the organisation, with known gaps.
  4. **Fully implemented** — Documented, achieved across the organisation, and reviewed and improved regularly.

**GV.OC-02** — Internal and external stakeholders are understood, and their needs and expectations regarding cybersecurity risk management are understood and considered

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Do you know what customers, regulators, investors and staff expect from your security, and is it taken into account?

**GV.OC-03** — Legal, regulatory, and contractual requirements regarding cybersecurity — including privacy and civil liberties obligations — are understood and managed

- Control: HS-GOV-04 Regulatory and contractual compliance (medium)
- In practice: Is there a maintained list of security and privacy obligations (for example DPDP, CERT-In, sector regulators, contracts) with owners?

**GV.OC-04** — Critical objectives, capabilities, and services that external stakeholders depend on or expect from the organization are understood and communicated

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Are the services others depend on from you identified, with their tolerance for disruption?

**GV.OC-05** — Outcomes, capabilities, and services that the organization depends on are understood and communicated

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are the suppliers, platforms and services you depend on identified, including which are critical?

#### Risk Management Strategy (GV.RM)

Priorities, constraints, risk tolerance and appetite statements, and assumptions are established, communicated and used to support operational risk decisions.

**GV.RM-01** — Risk management objectives are established and agreed to by organizational stakeholders

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Has leadership agreed what cyber risk management is meant to achieve?

**GV.RM-02** — Risk appetite and risk tolerance statements are established, communicated, and maintained

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Is there a stated level of cyber risk the organisation will and will not accept?

**GV.RM-03** — Cybersecurity risk management activities and outcomes are included in enterprise risk management processes

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Do cyber risks appear in the enterprise risk register alongside financial and operational risks?

**GV.RM-04** — Strategic direction that describes appropriate risk response options is established and communicated

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Is it clear when risks should be accepted, reduced, transferred (for example insured) or avoided?

**GV.RM-05** — Lines of communication across the organization are established for cybersecurity risks, including risks from suppliers and other third parties

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Do people know how to raise a cyber risk, including one coming from a supplier?

**GV.RM-06** — A standardized method for calculating, documenting, categorizing, and prioritizing cybersecurity risks is established and communicated

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Is there one consistent method for rating and prioritising cyber risks?

**GV.RM-07** — Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Are opportunities, such as security as a selling point or a new technology, considered alongside threats?

#### Roles, Responsibilities, and Authorities (GV.RR)

Cybersecurity roles, responsibilities and authorities to foster accountability, performance assessment and continuous improvement are established and communicated.

**GV.RR-01** — Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Is a named member of leadership accountable for cyber risk, and do they actively support security?

**GV.RR-02** — Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Is there a documented RACI for security activities that people actually follow?

**GV.RR-03** — Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Do security budgets and staffing match the risks leadership has accepted?

**GV.RR-04** — Cybersecurity is included in human resources practices

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Are screening, onboarding, role changes and exits handled with security in mind?

#### Policy (GV.PO)

Organisational cybersecurity policy is established, communicated and enforced.

**GV.PO-01** — Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced

- Control: HS-GOV-01 Information security policy (foundational)
- In practice: Is there an approved security policy that staff acknowledge and that is enforced?

**GV.PO-02** — Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission

- Control: HS-GOV-01 Information security policy (foundational)
- In practice: Is the policy reviewed at least yearly and after significant change?

#### Oversight (GV.OV)

Results of risk management activities are used to inform, improve and adjust the risk management strategy.

**GV.OV-01** — Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Does leadership review whether the security strategy is working and change course when it is not?

**GV.OV-02** — The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Is the strategy checked against new requirements and risks at least yearly?

**GV.OV-03** — Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Are security metrics reported to leadership and used to decide changes?

#### Cybersecurity Supply Chain Risk Management (GV.SC)

Cyber supply chain risk management processes are identified, established, managed, monitored and improved.

**GV.SC-01** — A cybersecurity supply chain risk management program, strategy, objectives, policies, and processes are established and agreed to by organizational stakeholders

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Is there an agreed approach to managing security risk from suppliers?

**GV.SC-02** — Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated internally and externally

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are security responsibilities between you and your suppliers clearly defined?

**GV.SC-03** — Cybersecurity supply chain risk management is integrated into cybersecurity and enterprise risk management, risk assessment, and improvement processes

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Do supplier risks feed into the main risk register and improvement plans?

**GV.SC-04** — Suppliers are known and prioritized by criticality

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Is there a supplier register ranked by how critical each supplier is?

**GV.SC-05** — Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Do supplier contracts include security requirements and breach notification?

**GV.SC-06** — Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are suppliers assessed before they are onboarded?

**GV.SC-07** — The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are critical suppliers reassessed and monitored during the relationship?

**GV.SC-08** — Relevant suppliers and other third parties are included in incident planning, response, and recovery activities

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are critical suppliers part of your incident plans and exercises?

**GV.SC-09** — Supply chain security practices are integrated into cybersecurity and enterprise risk management programs, and their performance is monitored throughout the technology product and service life cycle

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Is supplier security performance tracked over the life of products and services?

**GV.SC-10** — Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: When a supplier relationship ends, are access removed and data returned or destroyed?

### IDENTIFY (ID)

The organisation's current cybersecurity risks are understood.

#### Asset Management (ID.AM)

Assets that enable the organisation to achieve business purposes are identified and managed consistent with their importance.

**ID.AM-01** — Inventories of hardware managed by the organization are maintained

- Control: HS-AST-01 Hardware and device inventory (high)
- In practice: Is there a complete, current inventory of devices, ideally maintained by automated discovery?

**ID.AM-02** — Inventories of software, services, and systems managed by the organization are maintained

- Control: HS-AST-02 Software and SaaS inventory (medium)
- In practice: Is there an inventory of software, SaaS and internet-facing services?

**ID.AM-03** — Representations of the organization's authorized network communication and internal and external network data flows are maintained

- Control: HS-AST-03 Data inventory and classification (high)
- In practice: Are network diagrams and data flows current?

**ID.AM-04** — Inventories of services provided by suppliers are maintained

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Is there a list of services each supplier provides to you?

**ID.AM-05** — Assets are prioritized based on classification, criticality, resources, and impact on the mission

- Control: HS-AST-03 Data inventory and classification (high)
- In practice: Are assets ranked by how critical they are to the business?

**ID.AM-07** — Inventories of data and corresponding metadata for designated data types are maintained

- Control: HS-AST-03 Data inventory and classification (high)
- In practice: Is there an inventory of sensitive data and where it is stored?

**ID.AM-08** — Systems, hardware, software, services, and data are managed throughout their life cycles

- Control: HS-VUL-02 Patch and change management (high)
- In practice: Are systems tracked from purchase to secure disposal, including end-of-support dates?

#### Risk Assessment (ID.RA)

The cybersecurity risk to the organisation, assets and individuals is understood.

**ID.RA-01** — Vulnerabilities in assets are identified, validated, and recorded

- Control: HS-VUL-01 Vulnerability scanning and testing (critical)
- In practice: Are systems scanned for vulnerabilities and the results recorded and validated?

**ID.RA-02** — Cyber threat intelligence is received from information sharing forums and sources

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Do you receive threat intelligence, for example from CERT-In, sector bodies or vendors?

**ID.RA-03** — Internal and external threats to the organization are identified and recorded

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Are the threats most relevant to you identified and documented?

**ID.RA-04** — Potential impacts and likelihoods of threats exploiting vulnerabilities are identified and recorded

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Are impact and likelihood assessed for the main threats?

**ID.RA-05** — Threats, vulnerabilities, likelihoods, and impacts are used to understand inherent risk and inform risk response prioritization

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Are risks prioritised using threats, vulnerabilities, likelihood and impact?

**ID.RA-06** — Risk responses are chosen, prioritized, planned, tracked, and communicated

- Control: HS-GOV-03 Cyber risk assessment (high)
- In practice: Does each significant risk have a chosen response, owner and tracked plan?

**ID.RA-07** — Changes and exceptions are managed, assessed for risk impact, recorded, and tracked

- Control: HS-VUL-02 Patch and change management (high)
- In practice: Are changes and security exceptions risk-assessed and recorded?

**ID.RA-08** — Processes for receiving, analyzing, and responding to vulnerability disclosures are established

- Control: HS-VUL-01 Vulnerability scanning and testing (critical)
- In practice: Can outsiders report vulnerabilities to you, and are reports handled?

**ID.RA-09** — The authenticity and integrity of hardware and software are assessed prior to acquisition and use

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are software and hardware checked for authenticity and integrity before use?

**ID.RA-10** — Critical suppliers are assessed prior to acquisition

- Control: HS-TPR-01 Third-party security risk management (high)
- In practice: Are critical suppliers security-assessed before contracts are signed?

#### Improvement (ID.IM)

Improvements to organisational cybersecurity risk management processes, procedures and activities are identified across all functions.

**ID.IM-01** — Improvements are identified from evaluations

- Control: HS-GOV-05 Independent security assurance (medium)
- In practice: Do audits and assessments lead to tracked improvements?

**ID.IM-02** — Improvements are identified from security tests and exercises, including those done in coordination with suppliers and relevant third parties

- Control: HS-IR-02 Incident exercises (medium)
- In practice: Do penetration tests and exercises lead to tracked improvements?

**ID.IM-03** — Improvements are identified from execution of operational processes, procedures, and activities

- Control: HS-IR-02 Incident exercises (medium)
- In practice: Are lessons from day-to-day operations and incidents captured and acted on?

**ID.IM-04** — Incident response plans and other cybersecurity plans that affect operations are established, communicated, maintained, and improved

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are incident response and related plans documented, current and improved after use?

### PROTECT (PR)

Safeguards to manage the organisation's cybersecurity risks are used.

#### Identity Management, Authentication, and Access Control (PR.AA)

Access to physical and logical assets is limited to authorised users, services and hardware and managed commensurate with the assessed risk.

**PR.AA-01** — Identities and credentials for authorized users, services, and hardware are managed by the organization

- Control: HS-IAM-03 Joiner, mover and leaver process (high)
- In practice: Are accounts created, changed and removed through a controlled process, including leavers?

**PR.AA-02** — Identities are proofed and bound to credentials based on the context of interactions

- Control: HS-IAM-06 Account recovery and helpdesk verification (high)
- In practice: Is identity verified before issuing or resetting credentials, including at the helpdesk?

**PR.AA-03** — Users, services, and hardware are authenticated

- Control: HS-IAM-01 Multi-factor authentication (critical)
- In practice: Is MFA enforced for email, remote access, cloud and administrator accounts?

**PR.AA-04** — Identity assertions are protected, conveyed, and verified

- Control: HS-IAM-07 Directory and identity infrastructure protection (high)
- In practice: Are single sign-on tokens, federation and directory services protected against forgery and theft?

**PR.AA-05** — Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties

- Control: HS-IAM-02 Least privilege and role-based access (high)
- In practice: Is access granted by role, reviewed regularly, and limited to what each job needs?

**PR.AA-06** — Physical access to assets is managed, monitored, and enforced commensurate with risk

- Control: HS-PHY-01 Physical access control (medium)
- In practice: Are server rooms and sensitive areas access-controlled and logged?

#### Awareness and Training (PR.AT)

Personnel are provided with cybersecurity awareness and training.

**PR.AT-01** — Personnel are provided with awareness and training so that they possess the knowledge and skills to perform general tasks with cybersecurity risks in mind

- Control: HS-PPL-01 Security awareness training (high)
- In practice: Do all staff receive security awareness training at joining and every year?

**PR.AT-02** — Individuals in specialized roles are provided with awareness and training so that they possess the knowledge and skills to perform relevant tasks with cybersecurity risks in mind

- Control: HS-PPL-01 Security awareness training (high)
- In practice: Do administrators, developers, finance and executives receive role-specific training?

#### Data Security (PR.DS)

Data is managed consistent with the organisation's risk strategy to protect its confidentiality, integrity and availability.

**PR.DS-01** — The confidentiality, integrity, and availability of data-at-rest are protected

- Control: HS-DAT-01 Encryption of data at rest (high)
- In practice: Are sensitive data stores, laptops and removable media encrypted?

**PR.DS-02** — The confidentiality, integrity, and availability of data-in-transit are protected

- Control: HS-DAT-02 Encryption of data in transit (high)
- In practice: Is TLS 1.2 or higher enforced on external services and sensitive internal traffic?

**PR.DS-10** — The confidentiality, integrity, and availability of data-in-use are protected

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- In practice: Is sensitive data protected while being processed, for example with masking and data loss prevention?

**PR.DS-11** — Backups of data are created, protected, maintained, and tested

- Control: HS-RES-01 Protected and immutable backups (critical)
- In practice: Are backups protected from attackers (offline or immutable) and tested?

#### Platform Security (PR.PS)

The hardware, software and services of physical and virtual platforms are managed consistent with the organisation's risk strategy.

**PR.PS-01** — Configuration management practices are established and applied

- Control: HS-END-02 Device management and hardening (medium)
- In practice: Are systems built and maintained to a secure baseline?

**PR.PS-02** — Software is maintained, replaced, and removed commensurate with risk

- Control: HS-VUL-02 Patch and change management (high)
- In practice: Are security updates applied on time and unsupported software retired?

**PR.PS-03** — Hardware is maintained, replaced, and removed commensurate with risk

- Control: HS-VUL-02 Patch and change management (high)
- In practice: Is hardware kept on supported firmware and replaced before end of support?

**PR.PS-04** — Log records are generated and made available for continuous monitoring

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: Are security logs generated and collected centrally?

**PR.PS-05** — Installation and execution of unauthorized software are prevented

- Control: HS-END-02 Device management and hardening (medium)
- In practice: Is unapproved software blocked from installing or running?

**PR.PS-06** — Secure software development practices are integrated, and their performance is monitored throughout the software development life cycle

- Control: HS-APP-01 Secure development lifecycle (high)
- In practice: Are secure development practices, code review and security testing part of the development process?

#### Technology Infrastructure Resilience (PR.IR)

Security architectures are managed with the organisation's risk strategy to protect asset confidentiality, integrity and availability, and organisational resilience.

**PR.IR-01** — Networks and environments are protected from unauthorized logical access and usage

- Control: HS-NET-01 Network segmentation (critical)
- In practice: Are networks segmented so critical systems are separated from general users?

**PR.IR-02** — The organization's technology assets are protected from environmental threats

- Control: HS-PHY-01 Physical access control (medium)
- In practice: Are server and network rooms protected against fire, flood, power and temperature problems?

**PR.IR-03** — Mechanisms are implemented to achieve resilience requirements in normal and adverse situations

- Control: HS-RES-03 Operating through an IT outage (high)
- In practice: Can critical services continue during outages, including manual workarounds?

**PR.IR-04** — Adequate resource capacity to ensure availability is maintained

- Control: HS-RES-02 Recovery testing and continuity (high)
- In practice: Is capacity planned so critical services stay available under load?

### DETECT (DE)

Possible cybersecurity attacks and compromises are found and analysed.

#### Continuous Monitoring (DE.CM)

Assets are monitored to find anomalies, indicators of compromise and other potentially adverse events.

**DE.CM-01** — Networks and network services are monitored to find potentially adverse events

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Is network traffic monitored for signs of attack?

**DE.CM-02** — The physical environment is monitored to find potentially adverse events

- Control: HS-PHY-01 Physical access control (medium)
- In practice: Are physical access events and CCTV monitored?

**DE.CM-03** — Personnel activity and technology usage are monitored to find potentially adverse events

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Is user activity monitored for signs of account compromise or misuse?

**DE.CM-06** — External service provider activities and services are monitored to find potentially adverse events

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Is supplier and service provider activity in your environment monitored?

**DE.CM-09** — Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events

- Control: HS-END-01 Endpoint detection and response (critical)
- In practice: Are endpoints and servers monitored by EDR or equivalent?

#### Adverse Event Analysis (DE.AE)

Anomalies, indicators of compromise and other potentially adverse events are analysed to characterise the events and detect cybersecurity incidents.

**DE.AE-02** — Potentially adverse events are analyzed to better understand associated activities

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Are alerts investigated by someone with the skills to understand them?

**DE.AE-03** — Information is correlated from multiple sources

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: Are events from identity, endpoint, network and cloud correlated, for example in a SIEM?

**DE.AE-04** — The estimated impact and scope of adverse events are understood

- Control: HS-IR-01 Incident response plan (critical)
- In practice: When something is detected, is its impact and scope assessed?

**DE.AE-06** — Information on adverse events is provided to authorized staff and tools

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Do alerts reach the right people and tools promptly, including out of hours?

**DE.AE-07** — Cyber threat intelligence and other contextual information are integrated into the analysis

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Is threat intelligence used when analysing alerts?

**DE.AE-08** — Incidents are declared when adverse events meet the defined incident criteria

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are there clear criteria for declaring an incident?

### RESPOND (RS)

Actions regarding a detected cybersecurity incident are taken.

#### Incident Management (RS.MA)

Responses to detected cybersecurity incidents are managed.

**RS.MA-01** — The incident response plan is executed in coordination with relevant third parties once an incident is declared

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is the response plan followed, including with forensics, legal, insurer and suppliers?

**RS.MA-02** — Incident reports are triaged and validated

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are reported incidents triaged and confirmed promptly?

**RS.MA-03** — Incidents are categorized and prioritized

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are incidents categorised and prioritised using agreed criteria?

**RS.MA-04** — Incidents are escalated or elevated as needed

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is there a defined escalation path to leadership?

**RS.MA-05** — The criteria for initiating incident recovery are applied

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is it clear when to move from response to recovery?

#### Incident Analysis (RS.AN)

Investigations are conducted to ensure effective response and support forensics and recovery activities.

**RS.AN-03** — Analysis is performed to establish what has taken place during an incident and the root cause of the incident

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is root cause established after significant incidents?

**RS.AN-06** — Actions performed during an investigation are recorded, and the records' integrity and provenance are preserved

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are investigation actions recorded in a way that would stand up to scrutiny?

**RS.AN-07** — Incident data and metadata are collected, and their integrity and provenance are preserved

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is evidence collected and preserved properly?

**RS.AN-08** — An incident's magnitude is estimated and validated

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is the scale of an incident (systems, data, people affected) estimated and confirmed?

#### Incident Response Reporting and Communication (RS.CO)

Response activities are coordinated with internal and external stakeholders as required by laws, regulations or policies.

**RS.CO-02** — Internal and external stakeholders are notified of incidents

- Control: HS-IR-03 Breach notification and communication (high)
- In practice: Can you notify CERT-In within 6 hours, and regulators, customers and affected people on time?

**RS.CO-03** — Information is shared with designated internal and external stakeholders

- Control: HS-IR-03 Breach notification and communication (high)
- In practice: Is incident information shared with the right people through approved channels?

#### Incident Mitigation (RS.MI)

Activities are performed to prevent expansion of an event and mitigate its effects.

**RS.MI-01** — Incidents are contained

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Can affected systems and accounts be isolated quickly?

**RS.MI-02** — Incidents are eradicated

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is the attacker's access fully removed before recovery?

### RECOVER (RC)

Assets and operations affected by a cybersecurity incident are restored.

#### Incident Recovery Plan Execution (RC.RP)

Restoration activities are performed to ensure operational availability of systems and services affected by cybersecurity incidents.

**RC.RP-01** — The recovery portion of the incident response plan is executed once initiated from the incident response process

- Control: HS-RES-02 Recovery testing and continuity (high)
- In practice: Is there a recovery plan that is triggered from incident response?

**RC.RP-02** — Recovery actions are selected, scoped, prioritized, and performed

- Control: HS-RES-02 Recovery testing and continuity (high)
- In practice: Is the restore order set by business priority?

**RC.RP-03** — The integrity of backups and other restoration assets is verified before using them for restoration

- Control: HS-RES-01 Protected and immutable backups (critical)
- In practice: Are backups checked to be clean before restoring from them?

**RC.RP-04** — Critical mission functions and cybersecurity risk management are considered to establish post-incident operational norms

- Control: HS-RES-03 Operating through an IT outage (high)
- In practice: Is it decided how the business will operate while recovery is under way?

**RC.RP-05** — The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed

- Control: HS-RES-02 Recovery testing and continuity (high)
- In practice: Are restored systems checked before returning to normal operation?

**RC.RP-06** — The end of incident recovery is declared based on criteria, and incident-related documentation is completed

- Control: HS-RES-02 Recovery testing and continuity (high)
- In practice: Is there a defined point at which recovery is complete and documented?

#### Incident Recovery Communication (RC.CO)

Restoration activities are coordinated with internal and external parties.

**RC.CO-03** — Recovery activities and progress in restoring operational capabilities are communicated to designated internal and external stakeholders

- Control: HS-IR-03 Breach notification and communication (high)
- In practice: Are customers, staff and partners kept informed during recovery?

**RC.CO-04** — Public updates on incident recovery are shared using approved methods and messaging

- Control: HS-IR-03 Breach notification and communication (high)
- In practice: Are public statements prepared and approved before release?

All NIST questions use the same four-level implementation scale shown on the first question.

---

## 2) Security Operations Capability Assessment

Template 2.0 · Based on the SOC Capability Maturity Model (SOC-CMM) domains, using a COBIT-style 0-5 maturity scale

Designed for organisations that run an internal SOC or rely on a managed detection provider. Each capability is rated from "Does not exist" to "Optimized".

### Mission & Governance

Evaluate SOC mission alignment, charter documentation, governance structures, and stakeholder engagement.

#### Business Drivers

Understanding and alignment of SOC with business objectives.

**B1.1** — Business drivers are known and understood within the SOC

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: How well does the SOC team understand the core business drivers and objectives?
- Answer levels:
  0. **Does Not Exist** — No awareness of business drivers
  1. **Initial** — Business drivers are unknown
  2. **Repeatable** — Basic awareness of business drivers
  3. **Defined** — Some business drivers identified
  4. **Managed** — Most business drivers identified
  5. **Optimized** — All business drivers are well known within the SOC

**B1.2** — Business drivers are documented and maintained

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Is there formal documentation of how SOC activities relate to business objectives?
- Answer levels:
  0. **Does Not Exist** — No documentation
  1. **Initial** — No documentation in place
  2. **Repeatable** — Some ad-hoc information across documents
  3. **Defined** — Basic documentation of business drivers
  4. **Managed** — Single document, full description
  5. **Optimized** — Document completed, approved and formally published

**B1.3** — Business drivers are used in SOC decision making

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Are business drivers actively used when making SOC operational decisions?
- Answer levels:
  0. **Does Not Exist** — Not part of decision making
  1. **Initial** — Business drivers not part of decisions
  2. **Repeatable** — Referred to on an ad-hoc basis
  3. **Defined** — Occasionally used in decisions
  4. **Managed** — Used in most decisions
  5. **Optimized** — Used in all relevant decisions

**B1.4** — SOC service catalogue is aligned with business drivers

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Does the SOC service catalogue reflect and align with business priorities?
- Answer levels:
  0. **Does Not Exist** — No alignment check
  1. **Initial** — Not checked for alignment
  2. **Repeatable** — Ad-hoc alignment
  3. **Defined** — Alignment performed but not maintained
  4. **Managed** — Alignment performed and maintained regularly
  5. **Optimized** — Every change checked against drivers

**B1.5** — Business drivers have been validated with stakeholders

- Control: HS-GOV-06 Security metrics and management oversight (foundational)
- In practice: Have SOC business drivers been validated and agreed upon by key stakeholders?
- Answer levels:
  0. **Does Not Exist** — No validation
  1. **Initial** — Not validated
  2. **Repeatable** — Basic awareness among stakeholders
  3. **Defined** — Partially validated
  4. **Managed** — Validated with most stakeholders
  5. **Optimized** — Fully validated and signed off

#### SOC Charter & Mission

SOC mission statement, charter documentation, and authorization.

**MG1.1** — SOC has a formal mission statement

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Does the SOC have a clearly defined and documented mission statement?
- Answer levels:
  0. **Does Not Exist** — No mission statement
  1. **Initial** — No formal mission
  2. **Repeatable** — Informal understanding
  3. **Defined** — Draft mission statement
  4. **Managed** — Approved mission statement
  5. **Optimized** — Published and regularly reviewed

**MG1.2** — SOC charter is established and maintained

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Is there a formal SOC charter defining scope, authority, and responsibilities?
- Answer levels:
  0. **Does Not Exist** — No charter
  1. **Initial** — No charter document
  2. **Repeatable** — Informal scope understanding
  3. **Defined** — Draft charter exists
  4. **Managed** — Approved charter with regular updates
  5. **Optimized** — Comprehensive charter aligned with business strategy

**MG1.3** — SOC authority levels are clearly defined

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Are SOC authority levels for containment, isolation, and escalation clearly established?
- Answer levels:
  0. **Does Not Exist** — No authority definition
  1. **Initial** — No defined authority
  2. **Repeatable** — Some informal authority
  3. **Defined** — Basic authority documented
  4. **Managed** — Clear authority with escalation paths
  5. **Optimized** — Full authority matrix with automated escalation

**MG1.4** — SOC governance structure is established

- Control: HS-GOV-02 Security roles and accountability (medium)
- In practice: Is there a formal governance structure with steering committees and reporting lines?
- Answer levels:
  0. **Does Not Exist** — No governance structure
  1. **Initial** — Ad-hoc governance
  2. **Repeatable** — Basic reporting lines
  3. **Defined** — Governance structure documented
  4. **Managed** — Active steering committee
  5. **Optimized** — Mature governance with KPIs and continuous improvement

#### Compliance & Reporting

Compliance frameworks, regulatory requirements, and reporting capabilities.

**MG2.1** — Compliance requirements are identified and tracked

- Control: HS-GOV-04 Regulatory and contractual compliance (medium)
- In practice: Have all applicable compliance frameworks (PCI, SOC2, HIPAA, etc.) been identified?
- Answer levels:
  0. **Does Not Exist** — No compliance tracking
  1. **Initial** — Not identified
  2. **Repeatable** — Some requirements known
  3. **Defined** — Most requirements identified
  4. **Managed** — All requirements tracked
  5. **Optimized** — Automated compliance monitoring and reporting

**MG2.2** — SOC provides compliance-driven reporting

- Control: HS-GOV-04 Regulatory and contractual compliance (medium)
- In practice: Can the SOC generate compliance reports aligned with regulatory requirements?
- Answer levels:
  0. **Does Not Exist** — No compliance reporting
  1. **Initial** — No reporting capability
  2. **Repeatable** — Manual ad-hoc reports
  3. **Defined** — Standard report templates
  4. **Managed** — Automated regular reports
  5. **Optimized** — Real-time compliance dashboards

**MG2.3** — SOC metrics and KPIs are defined and measured

- Control: HS-GOV-04 Regulatory and contractual compliance (medium)
- In practice: Are operational metrics (MTTD, MTTR, false positive rate) tracked and reported?
- Answer levels:
  0. **Does Not Exist** — No metrics defined
  1. **Initial** — No KPIs
  2. **Repeatable** — Basic metrics tracked
  3. **Defined** — Key metrics defined
  4. **Managed** — Comprehensive KPI tracking
  5. **Optimized** — Data-driven optimization with trend analysis

### People

Assess SOC staffing, skills, training, and organizational structure.

#### Organizational Structure

SOC team structure, roles, and reporting lines.

**P1.1** — SOC organizational structure is defined

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Is there a clear SOC org chart with defined roles (L1, L2, L3, manager)?
- Answer levels:
  0. **Does Not Exist** — No org structure
  1. **Initial** — Ad-hoc roles
  2. **Repeatable** — Basic roles defined
  3. **Defined** — Full org structure documented
  4. **Managed** — Tiered structure with career paths
  5. **Optimized** — Optimized structure with continuous review

**P1.2** — SOC staffing levels are adequate for 24/7 operations

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Does the SOC have sufficient staff for required coverage hours?
- Answer levels:
  0. **Does Not Exist** — No dedicated SOC staff
  1. **Initial** — Minimal staffing, business hours only
  2. **Repeatable** — Extended hours coverage
  3. **Defined** — 24/5 coverage
  4. **Managed** — 24/7 with some gaps
  5. **Optimized** — Full 24/7/365 with adequate backup

**P1.3** — Roles and responsibilities (RACI) are documented

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Is there a RACI matrix defining who is Responsible, Accountable, Consulted, and Informed?
- Answer levels:
  0. **Does Not Exist** — No RACI
  1. **Initial** — No documentation
  2. **Repeatable** — 25% of RACI defined
  3. **Defined** — 50% of RACI defined
  4. **Managed** — 75% of RACI defined
  5. **Optimized** — 100% RACI documented and maintained

**P1.4** — SOC leadership is established

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Is there dedicated SOC management (SOC Manager, CISO reporting line)?
- Answer levels:
  0. **Does Not Exist** — No SOC leadership
  1. **Initial** — Part-time responsibility
  2. **Repeatable** — Dedicated team lead
  3. **Defined** — SOC Manager appointed
  4. **Managed** — Manager with clear CISO reporting
  5. **Optimized** — Mature leadership with strategic influence

#### Skills & Training

Staff competencies, certifications, and professional development.

**P2.1** — Required skill sets for each role are defined

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Are competency frameworks established for each SOC role?
- Answer levels:
  0. **Does Not Exist** — No skill definitions
  1. **Initial** — Informal expectations
  2. **Repeatable** — Basic job descriptions
  3. **Defined** — Competency framework for some roles
  4. **Managed** — Full competency framework
  5. **Optimized** — Competency framework with regular assessment

**P2.2** — Training programs are established for SOC staff

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Is there a structured training and development program for analysts?
- Answer levels:
  0. **Does Not Exist** — No training program
  1. **Initial** — No formal training
  2. **Repeatable** — Some vendor training
  3. **Defined** — Annual training plan
  4. **Managed** — Comprehensive training with labs
  5. **Optimized** — Continuous learning with certifications and CTF exercises

**P2.3** — Staff certifications are tracked and maintained

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Are industry certifications (CISSP, CEH, GCIA, etc.) tracked and encouraged?
- Answer levels:
  0. **Does Not Exist** — No certification tracking
  1. **Initial** — No focus on certifications
  2. **Repeatable** — Some staff certified
  3. **Defined** — Certification goals defined
  4. **Managed** — Active certification program
  5. **Optimized** — Full cert program with budget and time allocation

**P2.4** — Knowledge transfer and documentation practices are in place

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Are runbooks, wikis, and knowledge bases maintained for SOC operations?
- Answer levels:
  0. **Does Not Exist** — No knowledge base
  1. **Initial** — Tribal knowledge only
  2. **Repeatable** — Some documentation
  3. **Defined** — Knowledge base started
  4. **Managed** — Comprehensive KB maintained
  5. **Optimized** — Living KB with automated playbook integration

**P2.5** — Staff retention and career development program exists

- Control: HS-SOC-01 SOC people and skills (medium)
- In practice: Are there career development paths and retention strategies for SOC analysts?
- Answer levels:
  0. **Does Not Exist** — No career program
  1. **Initial** — No career paths
  2. **Repeatable** — Informal career guidance
  3. **Defined** — Career ladders defined
  4. **Managed** — Active career development program
  5. **Optimized** — Comprehensive program with mentoring and rotation

### Process

Evaluate SOC operational processes, incident management, threat intelligence, and continuous improvement.

#### Incident Management

Incident detection, triage, response, and closure processes.

**PR1.1** — Incident management process is formally defined

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Is there a documented incident management lifecycle (detect, triage, respond, close)?
- Answer levels:
  0. **Does Not Exist** — No process
  1. **Initial** — Ad-hoc response
  2. **Repeatable** — Basic process exists
  3. **Defined** — Formally documented process
  4. **Managed** — Process with metrics and SLAs
  5. **Optimized** — Continuously improved process with automation

**PR1.2** — Incident classification and prioritization scheme is defined

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are incidents categorized by type and prioritized by severity and impact?
- Answer levels:
  0. **Does Not Exist** — No classification
  1. **Initial** — No scheme
  2. **Repeatable** — Basic high/medium/low
  3. **Defined** — Detailed classification
  4. **Managed** — Classification with business impact
  5. **Optimized** — Dynamic classification with automated prioritization

**PR1.3** — Escalation procedures are defined and followed

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are escalation paths clear for different incident severities?
- Answer levels:
  0. **Does Not Exist** — No escalation process
  1. **Initial** — Informal escalation
  2. **Repeatable** — Basic escalation chart
  3. **Defined** — Documented escalation matrix
  4. **Managed** — Automated escalation with SLAs
  5. **Optimized** — Dynamic escalation with feedback loops

**PR1.4** — Post-incident review process is established

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Are post-incident reviews (PIR/root cause analysis) conducted after incidents?
- Answer levels:
  0. **Does Not Exist** — No PIR process
  1. **Initial** — No reviews
  2. **Repeatable** — Reviews for major incidents
  3. **Defined** — Standard PIR template
  4. **Managed** — PIR for all significant incidents
  5. **Optimized** — Systematic PIR with action tracking and trend analysis

#### Threat Intelligence

Threat intelligence collection, analysis, and operationalization.

**PR2.1** — Threat intelligence sources are identified and consumed

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Does the SOC subscribe to and consume threat intelligence feeds?
- Answer levels:
  0. **Does Not Exist** — No threat intel
  1. **Initial** — No feeds
  2. **Repeatable** — Open source feeds
  3. **Defined** — Multiple feeds consumed
  4. **Managed** — Commercial and open feeds integrated
  5. **Optimized** — Full TIP with automated enrichment

**PR2.2** — Threat intelligence is operationalized in detection rules

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Are IOCs and threat intel integrated into SIEM rules and detection capabilities?
- Answer levels:
  0. **Does Not Exist** — Not operationalized
  1. **Initial** — Manual lookups only
  2. **Repeatable** — Some IOCs in SIEM
  3. **Defined** — Regular IOC updates
  4. **Managed** — Automated IOC ingestion
  5. **Optimized** — Full TIP-SIEM-SOAR integration

**PR2.3** — Threat hunting program is established

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Does the SOC conduct proactive threat hunting beyond reactive alerting?
- Answer levels:
  0. **Does Not Exist** — No threat hunting
  1. **Initial** — No hunting capability
  2. **Repeatable** — Ad-hoc hunting
  3. **Defined** — Hunting hypotheses documented
  4. **Managed** — Regular hunting program
  5. **Optimized** — Mature hunting with MITRE ATT&CK mapping

#### SOPs & Playbooks

Standard Operating Procedures and response playbooks.

**PR3.1** — Standard Operating Procedures (SOPs) are documented

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Are day-to-day SOC operations covered by documented SOPs?
- Answer levels:
  0. **Does Not Exist** — No SOPs
  1. **Initial** — No documentation
  2. **Repeatable** — Some informal procedures
  3. **Defined** — SOPs for common tasks
  4. **Managed** — Comprehensive SOP library
  5. **Optimized** — SOPs integrated with automation and regularly reviewed

**PR3.2** — Response playbooks exist for common incident types

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Are there detailed playbooks for malware, phishing, ransomware, DDoS, etc.?
- Answer levels:
  0. **Does Not Exist** — No playbooks
  1. **Initial** — No playbooks
  2. **Repeatable** — Few basic playbooks
  3. **Defined** — Playbooks for top incident types
  4. **Managed** — Comprehensive playbook library
  5. **Optimized** — Automated playbooks with SOAR integration

**PR3.3** — Use case management process is in place

- Control: HS-SOC-02 SOC processes and services (high)
- In practice: Is there a formal process for creating, testing, and tuning detection use cases?
- Answer levels:
  0. **Does Not Exist** — No use case management
  1. **Initial** — Default vendor rules only
  2. **Repeatable** — Some custom rules
  3. **Defined** — Use case framework started
  4. **Managed** — Mature use case lifecycle
  5. **Optimized** — Use cases mapped to MITRE with automated testing

### Technology

Assess SOC technology stack including SIEM, EDR, SOAR, and supporting tools.

#### SIEM & Log Management

Security Information and Event Management capabilities.

**T1.1** — SIEM solution is deployed and operational

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: Is a SIEM platform deployed and actively processing security events?
- Answer levels:
  0. **Does Not Exist** — No SIEM
  1. **Initial** — Basic log collection only
  2. **Repeatable** — SIEM deployed, basic rules
  3. **Defined** — SIEM with custom correlation
  4. **Managed** — Optimized SIEM with advanced analytics
  5. **Optimized** — Next-gen SIEM with ML, UEBA, and full coverage

**T1.2** — Log sources are comprehensive and cover critical assets

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: What percentage of critical log sources are integrated into the SIEM?
- Answer levels:
  0. **Does Not Exist** — No log sources
  1. **Initial** — Less than 25% coverage
  2. **Repeatable** — 25-50% coverage
  3. **Defined** — 50-75% coverage
  4. **Managed** — 75-90% coverage
  5. **Optimized** — 90-100% coverage with validation

**T1.3** — Log retention meets compliance requirements

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: Are log retention periods aligned with regulatory and business requirements?
- Answer levels:
  0. **Does Not Exist** — No retention policy
  1. **Initial** — Default retention
  2. **Repeatable** — Some retention policies
  3. **Defined** — Retention aligned with some requirements
  4. **Managed** — Full compliance alignment
  5. **Optimized** — Tiered retention with cost optimization

**T1.4** — Correlation rules are tuned and effective

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- In practice: Are SIEM correlation rules regularly tuned to reduce false positives?
- Answer levels:
  0. **Does Not Exist** — No correlation rules
  1. **Initial** — Default rules only
  2. **Repeatable** — Some tuning done
  3. **Defined** — Regular tuning schedule
  4. **Managed** — Well-tuned with low false positives
  5. **Optimized** — ML-assisted tuning with continuous optimization

#### Detection & Response Tools

EDR, NDR, SOAR, and other security tools.

**T2.1** — Endpoint Detection and Response (EDR) is deployed

- Control: HS-END-01 Endpoint detection and response (critical)
- In practice: Is EDR/XDR deployed across endpoints with active monitoring?
- Answer levels:
  0. **Does Not Exist** — No EDR
  1. **Initial** — Basic antivirus only
  2. **Repeatable** — EDR on some endpoints
  3. **Defined** — EDR on most endpoints
  4. **Managed** — Full EDR with active response
  5. **Optimized** — XDR with full visibility and automated response

**T2.2** — Network Detection and Response (NDR) capabilities exist

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Are network traffic analysis and IDS/IPS capabilities deployed?
- Answer levels:
  0. **Does Not Exist** — No NDR
  1. **Initial** — Basic firewall logs
  2. **Repeatable** — IDS/IPS deployed
  3. **Defined** — NDR with traffic analysis
  4. **Managed** — Full NDR with encrypted traffic inspection
  5. **Optimized** — AI-driven NDR with automated threat detection

**T2.3** — Security Orchestration (SOAR) is implemented

- Control: HS-SOC-03 SOC technology and tooling (high)
- In practice: Is a SOAR platform used to automate and orchestrate response actions?
- Answer levels:
  0. **Does Not Exist** — No SOAR
  1. **Initial** — Manual processes only
  2. **Repeatable** — Some scripted automation
  3. **Defined** — SOAR deployed with basic playbooks
  4. **Managed** — SOAR with comprehensive playbooks
  5. **Optimized** — Fully automated response with human oversight

**T2.4** — Vulnerability management tools are integrated

- Control: HS-SOC-03 SOC technology and tooling (high)
- In practice: Are vulnerability scanners integrated with the SOC workflow?
- Answer levels:
  0. **Does Not Exist** — No vulnerability tools
  1. **Initial** — Standalone scanners
  2. **Repeatable** — Scan results reviewed
  3. **Defined** — Integrated with ticketing
  4. **Managed** — Full integration with risk-based prioritization
  5. **Optimized** — Continuous scanning with automated remediation workflows

### Coverage

Assess the breadth and depth of SOC monitoring coverage across the environment.

#### Monitoring Scope

Breadth of monitoring coverage across infrastructure.

**C1.1** — Critical assets are identified and monitored

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Are all business-critical assets identified, classified, and under SOC monitoring?
- Answer levels:
  0. **Does Not Exist** — No asset identification
  1. **Initial** — Few critical assets known
  2. **Repeatable** — Some critical assets monitored
  3. **Defined** — Most critical assets monitored
  4. **Managed** — All critical assets monitored
  5. **Optimized** — Full asset visibility with dynamic classification

**C1.2** — Cloud environments are covered by SOC monitoring

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Are cloud workloads (AWS, Azure, GCP) integrated into SOC monitoring?
- Answer levels:
  0. **Does Not Exist** — No cloud monitoring
  1. **Initial** — Cloud not in scope
  2. **Repeatable** — Basic cloud log collection
  3. **Defined** — Cloud security tools deployed
  4. **Managed** — Comprehensive cloud monitoring
  5. **Optimized** — Cloud-native security with CSPM and CWPP

**C1.3** — Remote/mobile workforce is covered

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Does SOC monitoring extend to remote workers and mobile devices?
- Answer levels:
  0. **Does Not Exist** — No remote coverage
  1. **Initial** — VPN logs only
  2. **Repeatable** — Some remote monitoring
  3. **Defined** — EDR on remote devices
  4. **Managed** — Comprehensive remote monitoring
  5. **Optimized** — Zero-trust with full remote visibility

**C1.4** — OT/IoT environments are covered

- Control: HS-OT-01 OT and connected-device security (critical)
- In practice: Are operational technology and IoT devices monitored by the SOC?
- Answer levels:
  0. **Does Not Exist** — No OT/IoT coverage
  1. **Initial** — OT/IoT not in scope
  2. **Repeatable** — Basic OT visibility
  3. **Defined** — OT monitoring tools deployed
  4. **Managed** — Integrated IT/OT monitoring
  5. **Optimized** — Full convergence with specialized OT detection

#### Operating Hours & Response

SOC operational coverage hours and response capabilities.

**C2.1** — SOC operating hours match business risk profile

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: Does the SOC operate during hours aligned with the organization's risk exposure?
- Answer levels:
  0. **Does Not Exist** — No defined hours
  1. **Initial** — Business hours only
  2. **Repeatable** — Extended hours
  3. **Defined** — 16/5 coverage
  4. **Managed** — 24/5 coverage
  5. **Optimized** — 24/7/365 with follow-the-sun

**C2.2** — After-hours incident response capability exists

- Control: HS-IR-01 Incident response plan (critical)
- In practice: Can the SOC respond to critical incidents outside normal operating hours?
- Answer levels:
  0. **Does Not Exist** — No after-hours capability
  1. **Initial** — Call tree only
  2. **Repeatable** — On-call rotation
  3. **Defined** — Formal on-call program
  4. **Managed** — Automated alerting with on-call
  5. **Optimized** — Full 24/7 response with automated initial triage

**C2.3** — Mean Time to Detect (MTTD) is tracked and within acceptable thresholds

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: How quickly are security threats detected from initial compromise?
- Answer levels:
  0. **Does Not Exist** — MTTD not tracked
  1. **Initial** — Days to weeks
  2. **Repeatable** — Hours to days
  3. **Defined** — Hours
  4. **Managed** — Minutes to hours
  5. **Optimized** — Minutes with continuous improvement

**C2.4** — Mean Time to Respond (MTTR) is tracked and within acceptable thresholds

- Control: HS-MON-02 Threat detection and alert response (critical)
- In practice: How quickly does the SOC respond to and contain security incidents?
- Answer levels:
  0. **Does Not Exist** — MTTR not tracked
  1. **Initial** — Days
  2. **Repeatable** — Hours to days
  3. **Defined** — Hours
  4. **Managed** — Under 1 hour for critical
  5. **Optimized** — Minutes with automated containment

---

## 3) Retail & E-commerce Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a retailer would hold up against the attacks retailers actually suffer: helpdesk impersonation, card skimming on the website, credential stuffing against customer accounts, attacks through store vendors, refund and gift-card abuse, and trading through weeks of central system outage.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Whether a stolen password, or a convincing phone call, is enough to become one of your users.

**CORE-IN-01** — Which of your sign-ins can still be used with a stolen password alone, without a second factor?

- Control: HS-IAM-01 Multi-factor authentication (critical)
- Attacker's view: Passwords are stolen every day by phishing and infostealer malware and sold in bulk. Without a second factor, a stolen password is a working key.
- What to consider: Consider email, VPN and remote desktop gateways, cloud consoles, finance and HR systems, and administrator accounts, including those of contractors.
- How to verify: Export the identity provider's MFA or conditional-access policy and list every account and application excluded from it.
- Answer levels:
  0. **Most of them** — MFA is not enforced for email, remote access or administrator accounts.
  1. **Several** — MFA is on for some services (for example email) but not for remote access, cloud consoles or administrators.
  2. **A few exceptions** — MFA is enforced for email, remote access, cloud consoles and administrators; some legacy applications or accounts are exempt.
  3. **None** — Every interactive sign-in requires MFA. Exceptions are documented, reviewed and compensated.

**CORE-IN-02** — What type of second factor protects administrator and remote-access accounts?

- Control: HS-IAM-01 Multi-factor authentication (critical)
- Attacker's view: Attackers relay one-time codes through fake login pages, flood users with push prompts until one is approved, and hijack SMS codes through SIM swaps.
- What to consider: Answer for the weakest method still allowed for these accounts, not the preferred one.
- How to verify: Identity provider report of registered authentication methods for administrator and remote-access users.
- Answer levels:
  0. **None** — Administrator or remote-access accounts have no second factor.
  1. **SMS or voice codes** — One-time codes sent by SMS or phone call.
  2. **Authenticator app** — App-based codes or push approvals with number matching.
  3. **Phishing-resistant** — FIDO2 security keys, passkeys or certificate-based authentication that cannot be relayed through a fake login page.

**CORE-IN-03** — When someone contacts the IT helpdesk to reset a password or register a new MFA device, how is their identity confirmed?

- Control: HS-IAM-06 Account recovery and helpdesk verification (high)
- Attacker's view: Groups such as Scattered Spider phone helpdesks pretending to be employees, using details found on LinkedIn or in earlier breaches, and ask for MFA to be reset.
- What to consider: If the helpdesk is outsourced, answer for the provider's actual practice, not your policy.
- How to verify: Read the reset procedure, then review the last five reset tickets to see how identity was actually checked.
- Answer levels:
  0. **Details they provide** — Name, employee ID, date of birth or manager's name, all of which can be found online.
  1. **Call-back** — The helpdesk calls back on the number held in HR or directory records.
  2. **Call-back and approval** — Call-back plus approval from the person's manager; the user is notified of every reset.
  3. **Strong verification and alerting** — Video or in-person identity check for privileged accounts, and every reset or MFA change raises an alert reviewed by security.

**CORE-IN-04** — When someone leaves, how quickly is all their access removed, including cloud apps, VPN and shared accounts?

- Control: HS-IAM-03 Joiner, mover and leaver process (high)
- Attacker's view: Accounts of people who have left are rarely watched. Former staff, or attackers who buy their old passwords, can use them unnoticed.
- What to consider: Include contractors, interns and temporary staff.
- How to verify: Compare the list of leavers from the last quarter with active accounts in the directory and two major SaaS applications.
- Answer levels:
  0. **No defined process** — Accounts are removed when someone remembers.
  1. **Within a week** — Core accounts are disabled within a week; cloud apps and shared passwords are often missed.
  2. **Same day** — Core systems and SaaS applications are covered by a leaver checklist completed on the last day.
  3. **Automatic** — Access is removed automatically from the HR exit, and quarterly access reviews find no leftover accounts.

#### Email and phishing

How hard it is to impersonate you by email, and how many malicious emails reach and fool your people.

**CORE-IN-05** — How well is your email domain protected against being spoofed?

- Control: HS-END-03 Email and web threat protection (high)
- Attacker's view: Without DMARC enforcement, anyone can send email that appears to come from your domain to your customers, suppliers and staff.
- What to consider: Include every domain you send email from, including marketing and parked domains.
- How to verify: Look up the DMARC record (TXT record at _dmarc.yourdomain) for each domain.
- Answer levels:
  0. **Not protected** — No DMARC record, or SPF and DKIM are missing.
  1. **Monitoring only** — SPF and DKIM are published and DMARC is set to p=none.
  2. **Quarantine** — DMARC is set to p=quarantine for all sending domains.
  3. **Reject and monitored** — DMARC is set to p=reject, reports are reviewed, and lookalike domains are monitored.

**CORE-IN-06** — What happens to a malicious link or attachment before it reaches someone's inbox?

- Control: HS-END-03 Email and web threat protection (high)
- Attacker's view: Phishing is still one of the most common ways in. Modern lures use QR codes, links to trusted file-sharing sites and fake MFA prompts to get past basic filters.
- How to verify: Email security configuration, and the record of the last reported phishing email being removed from all mailboxes.
- Answer levels:
  0. **Basic spam filtering** — Only the email provider's default spam filter.
  1. **Attachment scanning** — An email security product scans attachments for known malware.
  2. **Sandboxing and link checks** — Attachments are detonated in a sandbox and links are checked again when clicked.
  3. **Plus fast reporting** — Staff have a one-click report button, and reported emails are triaged and removed from every mailbox.

**CORE-IN-07** — When staff receive a realistic phishing test, what happens?

- Control: HS-PPL-02 Phishing simulation (medium)
- Attacker's view: Someone will always click eventually. What decides the outcome is whether someone else reports the email quickly enough for it to be stopped.
- How to verify: Results of the last two simulation campaigns, showing click and report rates.
- Answer levels:
  0. **Never tested** — No phishing simulations have been run.
  1. **Occasional** — Tested rarely; results are not tracked over time.
  2. **Regular and tracked** — Tested at least twice a year; click and report rates are tracked and repeat clickers get follow-up training.
  3. **More report than click** — Tested at least quarterly with varied lures (QR codes, fake MFA prompts, voice); more people report the test than click it.

#### What you expose to the internet

Systems anyone on the internet can reach, which attackers scan for constantly.

**CORE-IN-08** — Do you have a complete, current list of everything you expose to the internet: domains, IP addresses, VPNs, firewalls, remote-access portals and web applications?

- Control: HS-VUL-03 External attack surface and edge devices (critical)
- Attacker's view: Attackers scan the entire internet within hours of a new flaw being announced. The forgotten test server or old VPN is usually the one they find.
- How to verify: Compare the inventory with an external scan of your domains and IP ranges.
- Answer levels:
  0. **No list** — Nobody holds a list of internet-facing systems.
  1. **Partial** — A manually maintained list exists but is not checked against what is actually exposed.
  2. **Complete and verified** — The list is complete and verified at least quarterly with an external scan.
  3. **Continuously discovered** — Attack surface monitoring continuously finds new exposure, including systems set up by suppliers or teams outside IT.

**CORE-IN-09** — When a critical flaw in a VPN, firewall or other internet-facing device is announced as being actively exploited, how fast is it fixed?

- Control: HS-VUL-03 External attack surface and edge devices (critical)
- Attacker's view: Flaws in edge devices such as Citrix, Ivanti, Fortinet and Palo Alto have been exploited at scale within days of disclosure. These devices are now among the most common entry points for ransomware.
- What to consider: Consider VPN and remote-access gateways, firewalls, file-transfer servers, email servers and any device that manages others.
- How to verify: For the last two critical advisories affecting your edge devices, show the dates they were published and the dates they were fixed.
- Answer levels:
  0. **Normal patch cycle** — No special process; handled with routine updates.
  1. **Within a month** — Fixed within 30 days.
  2. **Within 7 days** — Fixed within a week; vendor advisories, CISA KEV and CERT-In advisories are tracked.
  3. **Within 48 hours** — Fixed or mitigated within 48 hours (isolated the same day if no fix exists) and checked for signs of compromise.

**CORE-IN-10** — Can anyone on the internet directly reach a remote desktop (RDP), SSH, database or device administration login of yours?

- Control: HS-VUL-03 External attack surface and edge devices (critical)
- Attacker's view: Exposed remote desktop is one of the most common ransomware entry points. It is attacked with guessed passwords or logged into with credentials bought from criminal marketplaces.
- How to verify: External port scan of your IP ranges, or results from an internet search engine such as Shodan.
- Answer levels:
  0. **Yes, several** — Several such services are reachable from the internet.
  1. **One or two** — One or two are exposed, protected only by passwords.
  2. **None directly** — None are exposed; administration is only possible through VPN or zero-trust access with MFA.
  3. **None, and checked** — None are exposed, confirmed by regular external scans that alert if one appears.

**CORE-IN-11** — How often are your systems scanned for vulnerabilities and tested by someone acting like an attacker?

- Control: HS-VUL-01 Vulnerability scanning and testing (critical)
- Attacker's view: Attackers use the same scanning tools you can. If you have not looked, they will see your weaknesses first.
- How to verify: Latest scan reports and penetration test report, with the status of their findings.
- Answer levels:
  0. **Never** — No vulnerability scanning or penetration testing.
  1. **Occasionally** — Ad hoc scans or a test some years ago.
  2. **Regularly** — Monthly internal and quarterly external scans, and a penetration test of critical systems every year.
  3. **Regularly, with closure** — As regular, with findings fixed within agreed timeframes and tests that include social engineering or an assumed-breach scenario.

#### Supplier and remote access

The trusted connections suppliers and IT providers have into your systems.

**CORE-IN-12** — How do suppliers and IT support providers connect remotely into your systems?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: Supplier remote access is a trusted path straight past your defences. Attackers breach the supplier, or simply use its always-on connection.
- How to verify: List of supplier accounts and remote tools, with last login dates and how each is enabled.
- Answer levels:
  0. **Always on** — Remote tools (for example TeamViewer or AnyDesk) or VPN accounts are left running permanently, sometimes shared.
  1. **Named but always on** — Each supplier has named accounts, but access is permanently enabled.
  2. **On request with MFA** — Named accounts with MFA, enabled only when needed and time-limited.
  3. **Brokered and recorded** — Access is brokered through a controlled gateway, sessions are recorded and reviewed, and access ends with the contract.

**CORE-IN-13** — Do you know which suppliers could seriously hurt you if they were breached or went offline, and have you checked their security?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: Many major breaches start at a supplier: an IT provider, a software vendor or a contractor. Their breach becomes yours, and their outage stops your business.
- What to consider: Critical suppliers include those holding your data, with access to your systems, or whose outage would stop your operations.
- How to verify: Supplier register with criticality ratings and the most recent assessment for the top three.
- Answer levels:
  0. **No** — No list of critical suppliers.
  1. **List only** — Key suppliers are known, but their security has not been assessed.
  2. **Assessed** — Critical suppliers are assessed before onboarding and contracts require prompt breach notification.
  3. **Assessed and rehearsed** — Reassessed every year, and the loss of a critical supplier is part of incident and continuity planning.

#### Retail entry points

The ways in that attackers have used against retailers.

**RET-IN-01** — If your IT helpdesk is outsourced, does the provider follow your identity checks before resetting passwords or MFA, and do you check that it does?

- Control: HS-IAM-06 Account recovery and helpdesk verification (high)
- Attacker's view: In 2025 attackers breached major UK retailers through social engineering involving third parties. Marks & Spencer suspended online orders for about seven weeks, with an estimated £300 million impact on profit.
- What to consider: Choose Not applicable if the helpdesk is run entirely in-house; the core helpdesk question covers it.
- How to verify: Service desk contract clauses on identity verification and the last monthly sample of reset tickets.
- Answer levels:
  0. **Unknown** — The helpdesk is outsourced and you do not know how it verifies callers.
  1. **Policy, not checked** — Your rules are in the contract but compliance is never checked.
  2. **Required and sampled** — Required contractually, and a sample of resets is checked every month.
  3. **Privileged resets approved in-house** — As above, resets of privileged accounts need approval from your own team, and every reset alerts your security monitoring.

**RET-IN-02** — Are the scripts that run on your checkout and payment pages (analytics, chat, tag managers, plugins) inventoried, authorised and monitored for changes?

- Control: HS-APP-01 Secure development lifecycle (high)
- Attacker's view: Card-skimming groups inject a few lines of code into checkout pages, often through a third-party script. British Airways lost the card details of about 429,000 customers this way and was fined £20 million.
- What to consider: PCI DSS 4.0.1 requirements 6.4.3 and 11.6.1 require payment page scripts to be authorised and changes to be detected.
- How to verify: Payment page script inventory, Content Security Policy header and change-detection alerts.
- Answer levels:
  0. **No** — Nobody knows which scripts load on the payment page.
  1. **Inventoried once** — A list exists but changes are not tracked.
  2. **Authorised and restricted** — Every script is authorised, and a Content Security Policy restricts what can load.
  3. **Tamper detection** — As above, with automated detection that alerts when payment page scripts or headers change.

**RET-IN-03** — How do you stop attackers using passwords leaked from other websites to take over customer accounts and steal saved cards, gift-card balances or loyalty points?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Credential stuffing is cheap and automated: attackers try millions of leaked username and password pairs until some work, then drain stored value quickly.
- How to verify: Bot management configuration and the last month's account-takeover statistics.
- Answer levels:
  0. **Nothing specific** — No specific protection against automated login attempts.
  1. **Rate limiting** — Login attempts are rate limited.
  2. **Bot and breached-password protection** — Bot protection, checks against known breached passwords and step-up verification for risky logins.
  3. **Measured** — As above, with account-takeover and fraud rates monitored and alerted.

**RET-IN-04** — Do e-commerce platform plugins, extensions and marketplace integrations go through security review and get updated promptly?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: Vulnerable plugins on platforms such as Magento and WooCommerce are a common route for skimming code onto online stores.
- How to verify: Plugin list with versions and last update dates.
- Answer levels:
  0. **Installed freely** — Anyone with admin access can install plugins.
  1. **Reviewed at install** — Reviewed when installed but rarely updated.
  2. **Approved and maintained** — Only approved plugins, updated at least monthly.
  3. **Monitored** — As above, monitored for new vulnerabilities and removed when no longer used.

**RET-IN-05** — How do POS, store system and building maintenance vendors (for example refrigeration or HVAC) connect to your stores remotely?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: In the 2013 Target breach, attackers used credentials stolen from a heating and ventilation contractor to reach point-of-sale systems and stole about 40 million cards.
- How to verify: Vendor access list for store networks, with how each connection is enabled and what it can reach.
- Answer levels:
  0. **Always on** — Permanent connections or remote tools, sometimes with shared credentials.
  1. **Named, always on** — Named accounts that are permanently enabled.
  2. **On request with MFA** — Enabled on request, time-limited and protected with MFA.
  3. **Restricted to their systems** — As above, and each vendor can only reach the systems they maintain.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

The accounts that, once taken, let an attacker switch off defences and encrypt everything at once.

**CORE-SP-01** — How are administrator rights over your domain, cloud tenant and core systems granted and used?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: Ransomware operators aim for domain or cloud administrator. With it they can disable security tools and encrypt every server simultaneously.
- How to verify: Export of privileged group membership (for example Domain Admins, Global Administrators) and the last review record.
- Answer levels:
  0. **Widely held** — Many people have administrator rights, often on their everyday accounts.
  1. **Limited but everyday** — A small group, but they use administrator rights from accounts they also use for email and browsing.
  2. **Separate and reviewed** — Separate administrator accounts with MFA, membership reviewed at least quarterly.
  3. **Just-in-time and monitored** — Separate accounts used only from dedicated devices, granted just in time, with every use logged and alerted.

**CORE-SP-02** — Have you checked your Active Directory or Entra ID for the weaknesses attackers use to escalate, such as stale admin accounts, weak service account passwords and legacy authentication?

- Control: HS-IAM-07 Directory and identity infrastructure protection (high)
- Attacker's view: Most ransomware intrusions go from one infected laptop to full control of the network through weaknesses in Active Directory, often within a day.
- What to consider: Answer N/A only if you have no directory service at all.
- How to verify: The most recent directory assessment report and the status of its findings.
- Answer levels:
  0. **Never** — The directory has never been assessed for security weaknesses.
  1. **Some time ago** — An informal review more than a year ago.
  2. **Assessed and fixed** — Assessed with a tool such as PingCastle, Purple Knight or BloodHound in the last 12 months, and high-risk issues fixed.
  3. **Assessed regularly** — Assessed at least quarterly, legacy authentication disabled and administration tiered.

**CORE-SP-03** — Do staff have local administrator rights on their own laptops and desktops?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: Local admin rights let malware switch off protection and pull passwords from memory. A shared local admin password lets an attacker hop to every machine.
- How to verify: Endpoint management report of local administrator group membership.
- Answer levels:
  0. **Most do** — Most users are local administrators.
  1. **Some teams** — Some teams (for example developers or IT) routinely have local admin rights.
  2. **By exception** — No standing local admin rights; exceptions are approved and time-limited.
  3. **None, unique passwords** — No standing rights, unique local admin passwords per device (for example LAPS) and every elevation logged.

#### Devices and patching

Whether malicious activity on a laptop or server is stopped, and how long known flaws stay open.

**CORE-SP-04** — What share of laptops, desktops and servers run endpoint detection and response (EDR) that someone actually monitors?

- Control: HS-END-01 Endpoint detection and response (critical)
- Attacker's view: Attackers routinely switch off or evade basic antivirus. In many investigations the EDR alerts were there, but nobody was watching.
- How to verify: EDR console coverage report compared with the asset inventory, and the record of the last alert handled out of hours.
- Answer levels:
  0. **Antivirus only** — Traditional antivirus, or no central view of protection.
  1. **Some devices** — EDR on some devices, or alerts rarely reviewed.
  2. **Nearly all, business hours** — EDR on 95% or more of devices, alerts reviewed during business hours.
  3. **All, around the clock** — EDR on all devices including servers, with tamper protection and 24x7 monitoring (in-house or managed) that can isolate a device.

**CORE-SP-05** — How quickly are critical security updates applied to laptops, servers and business applications?

- Control: HS-VUL-02 Patch and change management (high)
- Attacker's view: Once a patch is published, attackers study it to build exploits. Every week a known flaw stays open is time they can use.
- How to verify: Patch compliance report for servers and endpoints for the last month.
- Answer levels:
  0. **No regular process** — Updates are applied irregularly.
  1. **Within 90 days** — Most critical updates are applied within three months.
  2. **Within 30 days** — Within 30 days, with compliance reported monthly.
  3. **Within 14 days** — Within 14 days, sooner for flaws being actively exploited, with compliance above 95%.

**CORE-SP-06** — Do you still run systems that no longer receive security updates, such as old Windows versions or unsupported databases?

- Control: HS-VUL-02 Patch and change management (high)
- Attacker's view: Unsupported systems are permanent open doors: when a new flaw is found, no patch will ever come.
- How to verify: Inventory filtered by operating system and software end-of-support dates.
- Answer levels:
  0. **Yes, on the main network** — Unsupported systems are connected to the general network.
  1. **Yes, some protection** — A few remain, with some extra protection.
  2. **Yes, isolated** — A few remain, each isolated, monitored and formally risk-accepted with a replacement date.
  3. **None** — All unsupported systems have been retired or replaced.

#### Network separation

How far an attacker can travel from the first device they compromise.

**CORE-SP-07** — If one office laptop were infected, what could it reach on the network?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: On a flat network, ransomware spreads from one laptop to every server within minutes.
- How to verify: Network diagram, firewall rules between user networks and server networks, and the last segmentation test.
- Answer levels:
  0. **Practically everything** — One flat network; any device can reach any server.
  1. **Most things** — Guest Wi-Fi is separate, but staff devices can reach servers and critical systems freely.
  2. **Critical systems separated** — Servers, backups, payment, clinical or operational systems are in separate zones with firewall rules.
  3. **Deny by default, tested** — Zones only allow required traffic, rules are reviewed, and separation is tested (for example in a penetration test).

#### Stores and payment terminals

How far an attacker can move inside a store and how exposed the payment estate is.

**RET-SP-01** — Can a device on a store network, such as a back-office PC, a smart device or guest Wi-Fi, reach the payment systems or head-office servers?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: Once inside one store, attackers move to the payment network, and from there across the whole estate.
- How to verify: Store network design and the last segmentation test results.
- Answer levels:
  0. **Yes** — Store networks are flat.
  1. **Partly segmented** — Guest Wi-Fi is separate, but other store devices can reach payment systems.
  2. **Payment isolated** — Payment systems are isolated in every store and store-to-head-office traffic is restricted.
  3. **Isolated and tested** — As above, with segmentation tested at least yearly.

**RET-SP-02** — Are POS terminals and payment applications on supported, current versions?

- Control: HS-VUL-02 Patch and change management (high)
- Attacker's view: Outdated POS software is the usual target for card-stealing malware, which can run unnoticed across many stores.
- How to verify: Estate report of terminal and POS application versions.
- Answer levels:
  0. **Unknown** — Versions across the estate are not known.
  1. **Some outdated** — Some terminals or POS applications are out of support.
  2. **Supported and current** — All supported and updated within 30 days of a security release.
  3. **Centrally monitored** — As above, with versions and tamper status monitored centrally.

**RET-SP-03** — Are payment terminals checked for tampering and skimming devices?

- Control: HS-PHY-01 Physical access control (medium)
- Attacker's view: Skimming overlays can be fitted in seconds and are designed to be hard to spot without a checklist.
- How to verify: Inspection records for two stores.
- Answer levels:
  0. **Never** — No inspections.
  1. **Occasionally** — Checked occasionally, with no record.
  2. **Scheduled** — Scheduled inspections against a checklist, recorded.
  3. **Trained and tracked** — As above, staff trained to spot tampering and terminals tracked by serial number.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

How easily money can be diverted by a fake bank-detail change or an impersonated executive.

**CORE-PR-01** — If a supplier emails to change their bank account details, what has to happen before the next payment goes out?

- Control: HS-PAY-02 Payment instruction verification (high)
- Attacker's view: In payment diversion fraud the attacker is often inside a real supplier's mailbox, so the request arrives in a genuine email thread and looks completely normal.
- How to verify: Take two recent bank-detail changes and show the call-back record and the approver.
- Answer levels:
  0. **Updated from the email** — Finance updates the details based on the email or letter.
  1. **Usually a phone check** — Someone usually phones, but there is no written rule or record.
  2. **Mandatory call-back and second approver** — A call-back to a number already on file (never one in the request) is required and recorded, and a second person approves the change.
  3. **Plus a payment hold** — As above, plus changed details trigger a hold or small test payment, and staff are tested on the procedure.

**CORE-PR-02** — How are urgent or unusual payment requests that appear to come from senior leaders verified?

- Control: HS-PAY-02 Payment instruction verification (high)
- Attacker's view: Criminals now clone executives' voices and faces. In 2024 an employee paid out about US$25 million after a video call in which every other participant was a deepfake.
- How to verify: Payment approval matrix and the record of the last urgent payment request.
- Answer levels:
  0. **Paid if it looks right** — Requests from the CEO or CFO are actioned on trust.
  1. **Informal check** — Staff may check, but there is no rule.
  2. **Two approvers and out-of-band check** — Payments over a set threshold need two approvers and confirmation through a separate channel.
  3. **Deepfake-aware** — As above, plus staff are briefed on voice and video deepfakes and a call-back or code word is required for urgent requests.

#### Sensitive data

Where your valuable data is, and how easily it could be copied out or leaked.

**CORE-PR-03** — Do you know where your most sensitive data is, including copies in email, file shares, laptops and cloud apps?

- Control: HS-AST-03 Data inventory and classification (high)
- Attacker's view: Extortion groups increasingly steal data instead of, or as well as, encrypting it. You cannot protect, or notify people about, data you do not know you hold.
- What to consider: Sensitive data includes personal data, customer and patient records, financial data and intellectual property.
- How to verify: Data inventory, and a spot check of one file share or SaaS application for sensitive data not listed.
- Answer levels:
  0. **No** — No view of where sensitive data is stored.
  1. **Main systems only** — The main databases are known; copies elsewhere are not tracked.
  2. **Inventory maintained** — An inventory covers regulated and sensitive data, including major cloud apps, updated in the last year.
  3. **Automatically discovered** — Automated discovery finds sensitive data in unexpected places and it is cleaned up.

**CORE-PR-04** — Could someone copy a large volume of sensitive data to personal email, USB drives or personal cloud storage without being blocked or flagged?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Attackers, and departing staff, copy data out through ordinary channels. Without controls the theft looks like normal work.
- How to verify: Data loss prevention policy configuration and a recent alert record.
- Answer levels:
  0. **Yes, easily** — Nothing prevents or records it.
  1. **Partly blocked** — Some channels are blocked (for example USB), others are open.
  2. **Main channels controlled** — Email, cloud storage and USB are controlled for sensitive data.
  3. **Controlled and alerted** — Main channels are controlled and bulk downloads or uploads raise alerts that are reviewed.

**CORE-PR-05** — What share of laptops and mobile devices that hold work data have encryption enforced centrally?

- Control: HS-DAT-01 Encryption of data at rest (high)
- Attacker's view: A lost or stolen unencrypted laptop is a reportable data breach. With encryption, it is only a lost laptop.
- How to verify: Device management encryption compliance report.
- Answer levels:
  0. **None or unknown** — Encryption is not enforced.
  1. **Some** — Some devices are encrypted, set up manually.
  2. **Most** — Most devices are encrypted through device management policy.
  3. **All, with reporting** — All devices are encrypted, compliance is reported and recovery keys are held centrally.

**CORE-PR-06** — What rules govern staff use of AI tools such as ChatGPT, Copilot or Gemini with company, client or customer data?

- Control: HS-DAT-05 AI and unapproved application data exposure (medium)
- Attacker's view: Data pasted into free AI tools leaves your control and, depending on the service, may be retained or used for training. AI browser extensions can read everything on screen.
- How to verify: AI use policy, approved tool contracts, and a web filter report of AI service usage.
- Answer levels:
  0. **No rules** — Staff use whatever tools they like.
  1. **Informal guidance** — Guidance has been circulated, but nothing is enforced.
  2. **Approved tools and policy** — Approved tools only, under enterprise terms that exclude training on your data, and a written rule on what may be shared.
  3. **Enforced** — As above, plus unapproved AI services and AI browser extensions are detected or blocked, and usage is reviewed.

#### Cloud and collaboration platforms

Settings in Microsoft 365, Google Workspace and cloud platforms that attackers abuse.

**CORE-PR-07** — How are your Microsoft 365 or Google Workspace and cloud accounts checked for risky settings such as public file sharing, third-party app consents and storage open to the internet?

- Control: HS-CLD-01 Cloud security posture (high)
- Attacker's view: Attackers trick users into granting a malicious app access to their mailbox or files. That access survives password resets and MFA.
- How to verify: Secure Score or posture report, external sharing settings and the list of third-party apps with consent.
- Answer levels:
  0. **Default settings** — Settings have never been reviewed.
  1. **Reviewed at setup** — Reviewed once when the service was set up.
  2. **Reviewed against a baseline** — Reviewed at least twice a year against a baseline such as CIS Benchmarks or Microsoft Secure Score.
  3. **Continuously monitored** — Monitored continuously (CSPM or SSPM), with alerts for public exposure and new high-privilege app consents.

#### Card data and stored value

Card data, refunds and gift cards that attackers and insiders can turn into money.

**RET-PR-01** — Is full card data ever stored after authorisation, for example in databases, logs, spreadsheets, emails or call recordings?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Stored card data is what attackers come for. Data that is not kept cannot be stolen.
- How to verify: Card data discovery scan results and payment flow diagram.
- Answer levels:
  0. **Yes or unknown** — Card data is stored, or nobody has checked.
  1. **Some legacy stores** — Known legacy locations still hold card data.
  2. **No, confirmed** — No, payments are tokenised or use P2PE, confirmed by a data discovery scan.
  3. **No, scope minimised** — As above, with hosted payment pages or P2PE keeping your systems out of scope, rechecked every year.

**RET-PR-02** — Are refunds, gift-card issuance and price overrides controlled so that a compromised account or an insider cannot abuse them?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Gift cards and refunds are untraceable cash. Attackers who reach a back-office account, and dishonest staff, abuse them first.
- How to verify: Refund and gift-card control settings and the last exception report.
- Answer levels:
  0. **No limits** — Any till user can issue refunds or gift cards.
  1. **Manager override** — A manager override is required, without limits or review.
  2. **Limits and reconciliation** — Limits, dual approval above a threshold and daily reconciliation.
  3. **Anomaly alerts** — As above, with alerts on unusual refund and gift-card patterns.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Whether the signs of an attack in progress are recorded, and whether anyone is looking.

**CORE-DE-01** — If you had to investigate a suspicious sign-in from three months ago, would the logs still exist?

- Control: HS-MON-01 Centralised logging and SIEM (critical)
- Attacker's view: Attackers are often inside for weeks before they are found. Without logs you cannot tell what they touched, so you must assume the worst.
- What to consider: CERT-In directions require logs of ICT systems to be kept securely for a rolling 180 days within India.
- How to verify: List of log sources in the central platform and the configured retention.
- Answer levels:
  0. **No central logs** — Logs are not collected centrally.
  1. **Some, short retention** — Some systems keep logs locally for a few weeks.
  2. **Centralised, 180 days** — Identity, email, firewall and VPN, endpoint and critical application logs are centralised and kept at least 180 days.
  3. **Protected, 12 months** — As above, kept 12 months or longer, protected from tampering, and searches have been tested.

**CORE-DE-02** — If an attacker signed in as an administrator at 2 a.m. on a Saturday, who would know, and how quickly?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Ransomware is usually launched at night, at weekends or on holidays, when nobody is watching. The days attackers spend inside beforehand are the window to catch them.
- How to verify: Monitoring service contract or rota, and the timeline of the most recent out-of-hours alert.
- Answer levels:
  0. **Nobody** — Nobody, until damage is visible.
  1. **Next working day, maybe** — Alerts exist but are only seen during working hours, if at all.
  2. **Same business day** — Alerts for defined high-risk events go to a named team and are reviewed the same business day.
  3. **Within the hour, 24x7** — 24x7 monitoring, in-house or through a managed SOC or MDR, with a target to respond within an hour.

**CORE-DE-03** — Which of these warning signs raise an alert today: new MFA device registered, mailbox forwarding rule created, admin group membership changed, security tool disabled, mass file changes?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: These are the fingerprints of almost every intrusion. Without alerts on them, the first sign of the attack is the ransom note.
- How to verify: Alert rules in the SIEM, EDR or identity platform for each warning sign.
- Answer levels:
  0. **None of them** — None raise an alert.
  1. **One or two** — One or two raise an alert.
  2. **Most** — Most raise an alert that someone reviews.
  3. **All, with a playbook** — All raise an alert, each with a documented response.

#### Ready to respond

Whether the organisation knows what to do, who decides and who must be told.

**CORE-DE-04** — If ransomware hit tomorrow, would everyone know who decides, who to call and what to switch off?

- Control: HS-IR-01 Incident response plan (critical)
- Attacker's view: In the first hours of an attack, confusion costs more than anything. If the plan is on the encrypted file server, there is no plan.
- How to verify: Incident response plan and playbooks, and where the offline copy is kept.
- Answer levels:
  0. **No plan** — There is no incident response plan.
  1. **General plan** — A general plan exists but is untested and not specific to ransomware.
  2. **Playbooks and contacts** — Written playbooks for ransomware, account takeover and data theft, with contacts for forensics, legal, insurer and regulators.
  3. **Ready offline** — As above, available offline, and decision authority (for example to shut systems down) agreed in advance.

**CORE-DE-05** — Could you report a cyber incident to CERT-In within 6 hours and notify regulators, customers and affected people on time?

- Control: HS-IR-03 Breach notification and communication (high)
- Attacker's view: Missing a notification deadline turns an incident into a regulatory breach as well, and attackers increasingly contact customers directly to add pressure.
- What to consider: CERT-In requires reportable incidents to be reported within 6 hours of noticing them. The DPDP Act requires personal data breaches to be reported to the Data Protection Board and to affected individuals. Sector regulators and contracts add their own deadlines. Outside India, answer for your applicable regulators.
- How to verify: Notification procedure, regulator contact list and template notifications.
- Answer levels:
  0. **Not aware** — Notification deadlines are not known.
  1. **Aware, no procedure** — Deadlines are known but there is no procedure.
  2. **Procedure ready** — A documented procedure with owners, templates and contacts for CERT-In, sector regulators, the Data Protection Board and customers.
  3. **Rehearsed** — As above, rehearsed in an exercise in the last 12 months.

**CORE-DE-06** — When did your leadership team last rehearse a cyber incident in a tabletop exercise?

- Control: HS-IR-02 Incident exercises (medium)
- Attacker's view: Decisions such as whether to shut down operations, pay, or tell customers are far harder to make for the first time during a live attack.
- How to verify: Exercise report and lessons-learned action log.
- Answer levels:
  0. **Never** — No exercise has been held.
  1. **Over two years ago** — The last exercise was more than two years ago.
  2. **Within a year** — Within the last 12 months, with lessons recorded.
  3. **Yearly, realistic** — At least yearly, using a scenario realistic for your industry and key suppliers, with actions closed.

**CORE-DE-07** — Does leadership know the cyber attack scenarios that could seriously hurt the business, and is someone accountable for each?

- Control: HS-GOV-03 Cyber risk assessment (high)
- Attacker's view: Attackers target whatever the business cannot do without. If leadership has not named those things, they are rarely the best protected.
- How to verify: Risk register entries for cyber scenarios and the last leadership review.
- Answer levels:
  0. **No** — Cyber risk is seen as an IT matter.
  1. **IT view only** — IT has a view of the main risks, not shared with leadership.
  2. **Owned and reviewed** — The main scenarios are documented with owners and reviewed by leadership at least yearly.
  3. **Driving decisions** — Reviewed at least quarterly and used to set budget and priorities.

#### Online store monitoring

Spotting an attack on the online store while it is happening.

**RET-DE-01** — Would you notice unusual activity in the e-commerce admin panel, such as a new admin user, changed payment settings or code changes?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Skimming attacks often start with a new admin account or a small change to the checkout template. These are visible if anyone is looking.
- How to verify: Alert rules for the e-commerce platform and an example alert.
- Answer levels:
  0. **No** — Admin activity is not monitored.
  1. **Logged only** — Logged but not reviewed.
  2. **Alerted** — New admins, payment configuration and code changes raise alerts.
  3. **Alerted and watched 24x7** — As above, reviewed by 24x7 monitoring.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Whether you could restore after attackers with administrator rights have tried to stop you.

**CORE-RE-01** — If an attacker gained full administrator control of your network, could they delete or encrypt your backups?

- Control: HS-RES-01 Protected and immutable backups (critical)
- Attacker's view: Attackers look for backups first. Ransomware groups delete or encrypt backups before launching encryption so that victims cannot simply restore.
- How to verify: Backup architecture, immutability or offline settings, and who can sign in to the backup console.
- Answer levels:
  0. **Yes** — Backups are on the same network and domain, using the same administrator accounts.
  1. **Probably** — Backups are separate but reachable with domain credentials.
  2. **No** — At least one copy is offline or immutable and uses separate credentials with MFA.
  3. **No, and verified** — As above, immutability is verified regularly and any access to the backup console raises an alert.

**CORE-RE-02** — When did you last restore a complete critical system, not just a file, from backup, and how long did it take?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: Backups that have never been restored often fail when they are needed, or take far longer than anyone expected.
- How to verify: Restore test records showing the system, date, time taken and target.
- Answer levels:
  0. **Never** — No restore of a complete system has been tested.
  1. **Files only** — Only individual files or folders have been restored.
  2. **Within a year, timed** — A complete critical system restored in the last 12 months, with the time recorded against the target.
  3. **Regularly, from clean** — Full restores of critical systems tested at least twice a year, including rebuilding identity services from a clean state, within target.

#### Running the business through an outage

Whether customers can still be served while systems are down.

**CORE-RE-03** — Have business owners agreed how long each critical service can be down (RTO) and how much data can be lost (RPO)?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: Without agreed priorities, recovery after an attack is decided under pressure, and the systems the business most needs may come back last.
- How to verify: RTO and RPO register signed off by business owners.
- Answer levels:
  0. **No** — Not defined.
  1. **IT estimates** — IT has estimates that the business has not agreed.
  2. **Agreed** — Agreed with business owners for critical services, and backup design matches them.
  3. **Agreed and proven** — As above, tested and reported to leadership.

**CORE-RE-04** — If all IT systems were unavailable for two weeks, how would the business keep serving customers?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: Recovering from serious ransomware usually takes weeks, not days. Organisations that can operate manually lose far less, and are under far less pressure to pay.
- How to verify: Downtime procedures and the record of the last downtime drill.
- Answer levels:
  0. **It could not** — No plan for operating without IT.
  1. **Ideas, not written** — Some teams have ideas, but nothing is written down.
  2. **Downtime procedures** — Written procedures for critical processes (manual workflows, contact lists, printed key information).
  3. **Rehearsed** — As above, rehearsed in the last year, with forms and offline copies kept ready.

#### Trading through an outage

Keeping stores and online sales running while central systems are down.

**RET-RE-01** — If central systems (ERP, warehouse, online store) were down for several weeks, could stores keep trading and orders be fulfilled?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: Recovery from the 2025 UK retail attacks took months; online ordering was suspended for weeks and shelves went empty. A retailer's ability to trade manually decides how much revenue is lost.
- How to verify: Offline trading procedures and the last rehearsal record.
- Answer levels:
  0. **No** — No plan for trading without central systems.
  1. **Stores only, briefly** — Stores can trade offline for a short time.
  2. **Planned** — Documented procedures for store trading, stock replenishment and order handling without central systems.
  3. **Rehearsed** — As above, rehearsed with stores and distribution in the last year.

**RET-RE-02** — Do you have customer communications prepared for a breach, including how to warn customers about follow-up scam calls and emails?

- Control: HS-IR-03 Breach notification and communication (high)
- Attacker's view: After a retail breach, criminals use the stolen data to phone and email customers pretending to be the retailer, adding a second wave of harm.
- How to verify: Prepared communications and approval record.
- Answer levels:
  0. **No** — Nothing prepared.
  1. **General template** — A general breach notice template.
  2. **Prepared and approved** — Prepared notices for card data, account and personal data breaches, approved by legal.
  3. **Rehearsed** — As above, with channels and owners tested in an exercise.

---

## 4) Healthcare & Pharma Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a hospital, clinic, laboratory or pharmaceutical organisation would hold up against healthcare attacks: remote-access compromise of clinical systems, ransomware reaching medical devices, patient-record misuse, breaches at clinical vendors, and running care safely while systems are down.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Clinical remote access and exposure

The ways into clinical systems that attackers target in healthcare.

**HC-IN-01** — Do all remote-access routes into clinical systems require MFA, including those used by visiting doctors, radiologists reporting from home, billing staff and vendors?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: In the 2024 Change Healthcare attack, criminals used stolen credentials on a remote-access portal that had no MFA. Claims and pharmacy payments across the US were disrupted for weeks.
- What to consider: Include Citrix or remote desktop gateways, VPNs, teleradiology and PACS viewers, web access to the EMR or HIS, and vendor support connections.
- How to verify: List of clinical remote-access routes with the authentication policy applied to each.
- Answer levels:
  0. **None or few** — Most clinical remote-access routes rely on a password alone.
  1. **Staff only** — Employed staff use MFA; visiting clinicians, vendors or legacy portals do not.
  2. **All but legacy** — All routes require MFA except documented legacy systems with compensating controls.
  3. **All, monitored** — Every route requires MFA and remote sessions are logged and reviewed.

**HC-IN-02** — Are any imaging (PACS or DICOM), laboratory or EMR servers reachable directly from the internet?

- Control: HS-VUL-03 External attack surface and edge devices (critical)
- Attacker's view: Security researchers repeatedly find thousands of imaging servers worldwide exposing patient scans and personal details to anyone on the internet.
- How to verify: External scan of your IP ranges for DICOM (ports 104 and 11112), PACS web viewers and database ports.
- Answer levels:
  0. **Yes** — One or more are directly reachable from the internet.
  1. **Protected by password** — Some are reachable but require a login.
  2. **None, except portals** — None are directly exposed; patient-facing portals sit behind a web application firewall.
  3. **None, verified** — As above, confirmed by regular external scans.

**HC-IN-03** — Are shared logins used on clinical workstations, such as a ward or nursing-station account?

- Control: HS-IAM-05 Credential and password hygiene (medium)
- Attacker's view: Shared clinical logins are rarely changed when staff leave, make it impossible to tell who viewed a record, and give attackers a password that works across a whole department.
- How to verify: Directory list of generic or shared accounts and where each is used.
- Answer levels:
  0. **Widely** — Shared accounts and passwords are common on wards and in departments.
  1. **Some areas** — Some departments still share logins.
  2. **Individual with fast switching** — Individual logins everywhere, with tap-badge or fast user switching.
  3. **Individual, shared accounts removed** — Individual logins everywhere and shared accounts are removed or locked to a single kiosk function.

**HC-IN-04** — Are clinical, front-desk and billing staff trained on the scams aimed at healthcare, such as fake IT support calls, fake requests for patient records and QR-code phishing?

- Control: HS-PPL-01 Security awareness training (high)
- Attacker's view: Busy clinical and front-desk staff are targeted because they are helpful under time pressure. A convincing call from "IT" or a "doctor" is often all an attacker needs.
- How to verify: Training content and completion records for clinical and front-desk roles.
- Answer levels:
  0. **No** — No security training for these groups.
  1. **Generic only** — Generic annual training not tailored to healthcare.
  2. **Role-specific** — Role-specific training at induction and every year.
  3. **Reinforced** — Role-specific training reinforced with simulations and a quick way to report suspicious contact.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Medical devices and clinical systems

Connected devices that often run outdated software and cannot be patched quickly.

**HC-SP-01** — Can connected medical devices such as infusion pumps, imaging modalities, monitors and lab analysers be reached from the general hospital network?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Many medical devices run old versions of Windows that cannot be updated. On a shared network, ransomware reaches them and can stop treatment and diagnostics.
- How to verify: Network diagram and firewall rules for medical device segments.
- Answer levels:
  0. **Yes** — Medical devices share the general network.
  1. **Partly separated** — Some devices are on separate VLANs; others are not.
  2. **Separated** — All connected devices are in dedicated segments that allow only the traffic they need.
  3. **Separated and monitored** — As above, with monitoring that understands medical device traffic.

**HC-SP-02** — Do you have an inventory of connected medical devices showing operating system, software version, network location and who maintains each?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: When a flaw in a device model is announced, hospitals without an inventory cannot tell whether they are affected, or where the devices are.
- How to verify: Inventory extract for one clinical department compared with what is on the network.
- Answer levels:
  0. **No** — No inventory of connected devices.
  1. **Biomedical asset list** — A maintenance list without software or network details.
  2. **Complete** — Complete, including operating system, firmware and vendor support status.
  3. **Automated** — Automatically discovered and linked to vulnerability advisories.

**HC-SP-03** — Before buying a connected medical device, do you require security information from the manufacturer, such as an MDS2 form, a software bill of materials and the patch support period?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Devices bought without security commitments stay in service for ten years or more, long after their software stops being supported.
- How to verify: Procurement checklist and the security documents for the last connected device purchased.
- Answer levels:
  0. **No** — Security is not part of procurement.
  1. **Sometimes** — Asked for informally on some purchases.
  2. **Always required** — Required for every connected device before purchase.
  3. **Contractual** — Required, with contract terms for patch timelines and vulnerability disclosure.

**HC-SP-04** — Is access to patient records limited by role and by relationship to the patient, with emergency ("break-glass") access logged and reviewed?

- Control: HS-IAM-02 Least privilege and role-based access (high)
- Attacker's view: Broad access lets a single compromised account, or a curious employee, read thousands of patient records without any barrier.
- How to verify: EMR role configuration and the last break-glass review.
- Answer levels:
  0. **Broad access** — Most users can open most patient records.
  1. **Role-based only** — Access is role-based, without break-glass controls.
  2. **Role-based with break-glass** — Role-based access with break-glass use logged.
  3. **Break-glass reviewed** — As above, with every break-glass use reviewed within days.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Clinical vendors and patient data

Organisations that hold or process patient data on your behalf.

**HC-PR-01** — Do vendors that host or process patient data (labs, billing, telemedicine, transcription, cloud EMR) have security and breach-notification obligations, and have you checked their security?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: Healthcare breaches increasingly start at a vendor holding patient data. Their breach becomes your notification, and their outage stops your services.
- How to verify: Vendor register for patient-data processors with contract terms and assessment dates.
- Answer levels:
  0. **No** — Contracts are silent on security and breach notification.
  1. **Contract terms only** — Contracts include security terms, but vendors are not assessed.
  2. **Assessed** — Critical vendors are assessed and contracts require prompt breach notification.
  3. **Assessed and rehearsed** — Reassessed yearly and included in incident exercises.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Patient-record misuse and clinical response

Spotting misuse of patient data and responding safely.

**HC-DE-01** — Would you notice if an account viewed or exported an unusual number of patient records, or records of a public figure or a colleague?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Attackers and insiders who reach the EMR export records in bulk. Without monitoring, the first sign is the data appearing for sale.
- How to verify: Access monitoring rules and the last investigation they triggered.
- Answer levels:
  0. **No** — Record access is not reviewed.
  1. **Logged only** — Access is logged but nobody reviews it.
  2. **Periodic audit** — Record access is audited proactively at regular intervals.
  3. **Automated alerts** — Unusual access patterns raise alerts that are investigated.

**HC-DE-02** — Does your incident plan cover clinical safety decisions during a cyber incident, such as diverting patients or ambulances, with clinical leaders involved?

- Control: HS-IR-01 Incident response plan (critical)
- Attacker's view: Ransomware in hospitals forces clinical decisions within hours. Without a plan, those decisions are made in confusion.
- How to verify: Incident plan sections covering clinical escalation and diversion.
- Answer levels:
  0. **No** — The incident plan, if any, is IT-only.
  1. **IT-focused** — Clinical impact is mentioned but not planned for.
  2. **Clinically owned** — Clinical decision makers and diversion criteria are part of the plan.
  3. **Exercised** — As above, exercised with clinical teams in the last 12 months.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Clinical downtime

Keeping care safe while clinical systems are unavailable.

**HC-RE-01** — If the EMR or HIS, laboratory and imaging systems were down for two weeks, could wards, outpatient clinics, pharmacy and the laboratory keep operating safely?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: When AIIMS New Delhi was hit by ransomware in 2022, hospital services ran manually for about two weeks. Downtime procedures decide whether that is safe.
- How to verify: Downtime procedures and kit for one ward and the laboratory, and the last drill record.
- Answer levels:
  0. **No** — No downtime procedures.
  1. **Some departments** — Some departments have paper forms.
  2. **All critical departments** — Documented downtime procedures for all critical departments, with printed forms and current patient lists ready.
  3. **Drilled** — As above, with a downtime drill in the last 12 months.

**HC-RE-02** — Have you tested restoring the EMR or HIS and the imaging archive from backup, and measured how long it takes?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: Imaging archives are huge. Restoring them can take far longer than the business expects, which matters most when attackers have destroyed the live copy.
- How to verify: Restore test reports for the EMR or HIS and the PACS archive.
- Answer levels:
  0. **Never** — Never tested.
  1. **Partly** — Parts of the data have been restored.
  2. **Full, timed** — A full restore tested in the last 12 months with the time recorded.
  3. **Twice yearly, within target** — Tested at least twice a year and completed within the agreed recovery time.

---

## 5) BFSI & FinTech Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a bank, NBFC, insurer or FinTech would hold up against financial-sector attacks: SIM-swap and remote-access scams on customers, API data exposure, partner and outsourcer access, attacks on payment systems, tampered payment files and fraudulent transfers in progress.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Customer channels, APIs and partners

The routes attackers use to reach customer money and data.

**FT-IN-01** — How are customers protected against account takeover through SIM swap, phished one-time passwords and screen-sharing or remote-access app scams?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Fraudsters call customers posing as the bank, persuade them to install a screen-sharing app or read out an OTP, and empty the account in minutes. SIM swaps let them receive the OTP themselves.
- How to verify: Customer authentication design and fraud loss figures for account takeover.
- Answer levels:
  0. **SMS OTP only** — One-time passwords by SMS are the only protection.
  1. **OTP with limits** — SMS OTP plus basic transaction limits.
  2. **Device binding and step-up** — Device binding, step-up checks for new devices and payees, and a cooling-off period for new beneficiaries.
  3. **Real-time risk** — As above, with real-time behavioural risk scoring that detects remote-access and screen-sharing apps.

**FT-IN-02** — Are customer-facing and partner APIs inventoried, authenticated and tested for broken object-level authorisation, where one customer can read another's data by changing an ID?

- Control: HS-APP-01 Secure development lifecycle (high)
- Attacker's view: Broken object-level authorisation is the most common serious API flaw. It lets an attacker download every customer's data by simply counting through account numbers.
- How to verify: API inventory and the most recent API security test report.
- Answer levels:
  0. **No inventory** — APIs are not inventoried.
  1. **Inventoried, not tested** — APIs are known but not security tested.
  2. **Tested yearly** — All APIs are authenticated and tested against the OWASP API Security Top 10 at least yearly.
  3. **Gateway and pre-release testing** — As above, an API gateway enforces authentication and rate limits, and new APIs are tested before release.

**FT-IN-03** — Are partners with access to your systems or customer data (FinTech partners, payment aggregators, business correspondents, collection agencies, IT outsourcers) risk-tiered, assessed and monitored?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: Partners and outsourcers often hold broad access to customer data or payment flows with far weaker security than the regulated entity.
- What to consider: RBI's Master Direction on Outsourcing of IT Services (2023) requires regulated entities to manage risks from IT service providers.
- How to verify: Partner register with risk tiers and the last assessments for the top three partners.
- Answer levels:
  0. **No** — Partners are not assessed for security.
  1. **At onboarding** — Assessed once at onboarding.
  2. **Risk-tiered, yearly** — Risk-tiered, reassessed yearly, with audit rights in contracts.
  3. **Monitored** — As above, monitored continuously and included in incident drills.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Payment systems and privileged access

Systems that move money, and the people who can control them.

**FT-SP-01** — Are payment systems such as SWIFT, UPI or IMPS switches, card switches and treasury platforms isolated from the general corporate network?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: In the 2016 Bangladesh Bank heist and the 2018 Cosmos Bank attack in Pune, attackers moved from the corporate network to payment systems and sent fraudulent transfers worth tens of millions of dollars.
- How to verify: Network diagram for payment zones and jump host access policy.
- Answer levels:
  0. **No** — They are reachable from the corporate network.
  1. **Partly** — Partly separated with broad rules.
  2. **Dedicated zone** — Dedicated zone reachable only through a jump host with MFA.
  3. **Dedicated and tested** — As above, aligned to SWIFT CSP-style controls and tested regularly.

**FT-SP-02** — Can any single person both create a beneficiary or payee and approve a payment to it, in treasury, operations or customer systems?

- Control: HS-IAM-02 Least privilege and role-based access (high)
- Attacker's view: Attackers who take over one employee account, and dishonest insiders, look for exactly this gap to move money without a second pair of eyes.
- How to verify: Role configuration in the payment system and the last SoD conflict review.
- Answer levels:
  0. **Yes** — One person can do both.
  1. **On paper only** — Separation is in policy but not enforced by the system.
  2. **System-enforced** — Maker-checker is enforced by the system.
  3. **Enforced and reviewed** — As above, with segregation-of-duties conflicts and overrides reviewed periodically.

**FT-SP-03** — How is privileged access to core banking, payment switches and production databases controlled?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: Privileged access to payment systems turns an intrusion into direct theft: attackers alter limits, create accounts or insert transactions.
- How to verify: PAM coverage report for core systems and a sample of reviewed session recordings.
- Answer levels:
  0. **Shared admin accounts** — Shared administrator credentials are in use.
  1. **Named, uncontrolled** — Named admin accounts without session control.
  2. **Vaulted and recorded** — Privileged access through a vault with MFA and session recording.
  3. **Just-in-time, dual control** — As above, granted just in time, dual control for production changes, recordings reviewed.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Transactions and customer data

Protecting payment flows and customer data from tampering and misuse.

**FT-PR-01** — Are payment files and messages protected against tampering between systems, for example files placed in a folder before upload to a payment system?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Attackers who reach a file share can change beneficiary details in a payment batch minutes before it is uploaded.
- How to verify: Payment file flow with integrity controls and the last reconciliation exception.
- Answer levels:
  0. **Plain files on shares** — Files sit unprotected on shared folders.
  1. **Restricted folder** — Folder access is restricted.
  2. **Integrity checked** — Files are signed or integrity-checked, with reconciliation.
  3. **End-to-end reconciled** — Automated end-to-end reconciliation with alerts on mismatches.

**FT-PR-02** — Is real customer data used in development and testing, or shared with vendors for analytics?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Test environments and vendor copies are rarely protected like production, so they are an easy place to steal the same data.
- How to verify: Data masking procedure and a check of one test database.
- Answer levels:
  0. **Yes, freely** — Production data is copied to test and vendors as needed.
  1. **With ad hoc approval** — Sometimes, with informal approval.
  2. **Masked or tokenised** — Only masked or tokenised data leaves production.
  3. **Enforced and audited** — As above, enforced technically and audited.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Fraud detection and response

Stopping fraudulent payments while there is still time.

**FT-DE-01** — Are transactions monitored in real time for fraud patterns such as velocity, new device, new payee and mule-account indicators, with the ability to stop a payment?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Stolen funds move through chains of mule accounts within minutes. Only real-time monitoring can stop the money before it is gone.
- How to verify: Fraud rules in production and the hold rate for the last month.
- Answer levels:
  0. **No** — No transaction monitoring.
  1. **After the event** — Reviewed after transactions are completed.
  2. **Real-time rules** — Real-time rules can hold suspicious payments.
  3. **Tuned and mule-aware** — As above, tuned with fraud feedback and detecting mule accounts.

**FT-DE-02** — Is there a playbook for fraudulent transfers in progress, including contacting correspondent banks, NPCI or card networks to recall funds within hours?

- Control: HS-IR-01 Incident response plan (critical)
- Attacker's view: The chance of recalling fraudulent funds falls sharply after the first few hours.
- How to verify: Fraud response playbook and contact list.
- Answer levels:
  0. **No** — No playbook.
  1. **Informal contacts** — Staff know whom to call, informally.
  2. **Documented playbook** — Documented with contacts, authority and timelines.
  3. **Exercised** — As above, exercised in the last 12 months.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Payment service recovery

Restoring payment services after a cyber attack, not just a hardware failure.

**FT-RE-01** — Have you tested switching critical payment services to disaster recovery and back within your RTO, using a cyber-attack scenario rather than a hardware failure?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: Replicated DR sites copy the attacker's encryption too. Recovery from ransomware depends on clean backups and rebuilt identity, which ordinary DR drills do not test.
- How to verify: DR drill reports with the scenario used and time achieved.
- Answer levels:
  0. **No** — No DR drill.
  1. **Infrastructure failure only** — DR drills test hardware or site failure only.
  2. **Yearly within RTO** — DR drilled at least yearly within the agreed RTO.
  3. **Cyber scenario** — As above, including restoring from clean backups and rebuilding identity services after an attack.

---

## 6) Manufacturing & OT Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a manufacturer or industrial operator would hold up against attacks that stop production: vendor remote access to equipment, ransomware crossing from IT to OT, dependence of the plant on corporate IT, engineering workstation compromise, theft of design IP and producing manually through an outage. Informed by ISA/IEC 62443 concepts.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Ways into production

Routes attackers and malware use to reach the plant floor.

**MFG-IN-01** — How do machine and control-system vendors connect for remote support to PLCs, SCADA, robots or other equipment?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: Remote vendor access straight to equipment bypasses every other control. Attackers who compromise a vendor, or find its always-on connection, can reach the plant floor directly.
- How to verify: List of vendor remote connections to OT, how each is enabled, and session logs.
- Answer levels:
  0. **Always on** — Permanent modems, VPNs or remote tools on equipment.
  1. **VPN always on** — A vendor VPN that is always available.
  2. **On request via jump host** — Enabled on request through a jump host with MFA.
  3. **Approved, recorded, disconnected** — As above, approved by operations for each session, recorded, and disconnected when idle.

**MFG-IN-02** — Can OT devices such as PLCs, HMIs and SCADA servers reach the internet, or be reached from it?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Internet-exposed industrial controllers are found within hours by attackers using search engines such as Shodan, and some have been manipulated remotely.
- How to verify: Firewall rules at the OT boundary and an external scan for industrial protocols.
- Answer levels:
  0. **Yes or unknown** — Some OT devices have internet access or are exposed.
  1. **Some** — Some outbound access is allowed for updates or remote monitoring.
  2. **None** — Outbound and inbound internet access is blocked for OT.
  3. **None, verified** — As above, verified by external scans and monitoring.

**MFG-IN-03** — How are USB drives and laptops brought onto the plant floor by engineers and contractors controlled?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Air-gapped and isolated OT networks are often infected through USB drives and contractor laptops, which carry malware past the network defences.
- How to verify: Removable media procedure and device control settings on HMIs.
- Answer levels:
  0. **Freely** — Any USB drive or laptop can be connected.
  1. **Policy only** — A written rule, not enforced.
  2. **Scanned or dedicated** — Media is scanned at a kiosk or only dedicated media is allowed.
  3. **Blocked by default** — USB ports on OT assets are blocked except for approved, scanned media, and contractor laptops are checked before connection.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### IT and OT separation

Whether an attack on the office network can stop production.

**MFG-SP-01** — What separates the office (IT) network from the production (OT) network?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Ransomware that reaches OT stops production directly. Even without reaching it, a weak boundary forces you to shut production down because you cannot be sure.
- How to verify: IT/OT boundary design and firewall rules.
- Answer levels:
  0. **Nothing** — IT and OT share the network.
  1. **Firewall, broad rules** — A firewall with broad rules allowing direct IT to OT traffic.
  2. **DMZ** — A DMZ for data exchange with no direct IT to OT connections.
  3. **Zones and conduits** — Zones and conduits designed to ISA/IEC 62443, with rules reviewed.

**MFG-SP-02** — Do production systems depend on corporate IT services such as Active Directory, ERP or file shares in order to run?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: Most attacks that stop production never touch the machines. Colonial Pipeline shut down its pipeline because business IT systems were hit, not the pipeline controls.
- How to verify: Dependency map of OT on IT services and the record of a disconnection test.
- Answer levels:
  0. **Heavily** — Production cannot run without corporate IT.
  1. **Some dependencies** — Some production systems depend on corporate services.
  2. **Separate** — OT uses its own identity and services, separate from corporate IT.
  3. **Proven** — As above, and it has been tested that production runs with IT disconnected.

**MFG-SP-03** — Do you have an inventory of OT assets with firmware versions, network connections and vendor support status?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: When an industrial vulnerability is published, plants without an inventory cannot tell whether they are exposed.
- How to verify: OT inventory extract for one production line.
- Answer levels:
  0. **No** — No OT inventory.
  1. **Maintenance list** — An engineering or maintenance list without network or firmware details.
  2. **Complete** — Complete with firmware, connections and support status.
  3. **Discovered passively** — Kept current by passive OT network discovery.

**MFG-SP-04** — Are engineering workstations used to program PLCs restricted to authorised engineers, hardened and kept off email and the internet?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: An engineering workstation can change what machines do. It is the most valuable target in OT, and often the least protected.
- How to verify: Engineering workstation configuration and access list.
- Answer levels:
  0. **Shared, general use** — Shared machines also used for email and browsing.
  1. **Dedicated, shared login** — Dedicated machines with a shared login.
  2. **Named and isolated** — Named accounts, no email or internet access.
  3. **Allowlisted and logged** — As above, with application allowlisting and logging of changes to controller logic.

**MFG-SP-05** — Are safety instrumented systems separated from the control network so that a cyber attack cannot disable safety functions?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: The Triton malware discovered in 2017 targeted the safety controllers of a petrochemical plant, the systems that exist to prevent explosions and loss of life.
- What to consider: Choose Not applicable if you have no safety instrumented systems.
- How to verify: Safety system network design and key switch position records.
- Answer levels:
  0. **No or unknown** — Safety systems share the control network.
  1. **Partly** — Some separation, not verified.
  2. **Separated** — Separated, with a physical key switch for programming mode.
  3. **Separated and reviewed** — As above, verified in a combined safety and cyber review.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Design IP and controller logic

The know-how and configurations that make production possible.

**MFG-PR-01** — Is design and process IP (CAD files, recipes, formulations) restricted to those who need it, with large downloads or transfers flagged?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Industrial espionage targets design and process data. It is usually taken quietly, often by insiders or long-term intruders.
- How to verify: Access list for the main design repository and transfer alert rules.
- Answer levels:
  0. **Open shares** — Stored on broadly accessible shares.
  1. **Restricted folders** — Access is restricted to departments.
  2. **Need-to-know and controlled** — Need-to-know access with controls on external transfer.
  3. **Alerted** — As above, with alerts on bulk downloads reviewed.

**MFG-PR-02** — Are PLC and HMI programs and configurations backed up offline, version-controlled and compared with what is actually running?

- Control: HS-RES-01 Protected and immutable backups (critical)
- Attacker's view: Without a trusted copy of controller logic, recovery means re-engineering from scratch, and unauthorised changes go unnoticed.
- How to verify: Backup repository for controller logic and the last comparison report.
- Answer levels:
  0. **No** — No backups of controller logic.
  1. **On engineers' laptops** — Copies exist on individual engineers' laptops.
  2. **Central and offline** — Central, versioned backups kept offline.
  3. **Change detection** — As above, with automated comparison of running logic against the approved baseline.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### OT monitoring and response

Seeing and responding to attacks in the production environment.

**MFG-DE-01** — Is OT network traffic monitored for unusual commands, new devices and new connections?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Attackers can stay in OT networks for months because nobody watches industrial traffic.
- How to verify: OT monitoring coverage and recent alerts.
- Answer levels:
  0. **No** — No monitoring of OT traffic.
  1. **Firewall logs** — Only firewall logs at the boundary.
  2. **OT-aware monitoring** — An OT-aware monitoring tool covers key segments.
  3. **Full coverage, 24x7** — Full coverage reviewed 24x7.

**MFG-DE-02** — Does your incident plan say who decides to stop or continue production, and has it been exercised with plant operations?

- Control: HS-IR-01 Incident response plan (critical)
- Attacker's view: The decision to stop production is expensive and has to be made fast. Without agreed authority, it is made late or too broadly.
- How to verify: OT incident playbook and exercise record.
- Answer levels:
  0. **No** — No OT incident plan.
  1. **IT plan only** — The IT plan does not cover production decisions.
  2. **OT playbook** — An OT playbook names plant decision makers.
  3. **Exercised** — Exercised with plant operations in the last year.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Producing through an outage

Continuing and restoring production after an attack.

**MFG-RE-01** — If IT systems such as ERP, MES and email were encrypted, could production, shipping and invoicing continue manually?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: When Norsk Hydro was hit by ransomware in 2019, plants switched to manual operation. Manufacturers that can do this lose far less and are under far less pressure to pay.
- How to verify: Manual operation procedures and rehearsal record.
- Answer levels:
  0. **No** — Production would stop.
  1. **For a day or two** — Could continue briefly on improvised processes.
  2. **Documented manual procedures** — Manual procedures are documented for production, shipping and invoicing.
  3. **Rehearsed** — As above, rehearsed in the last year.

**MFG-RE-02** — Have you tested rebuilding an HMI or SCADA server and restoring controller logic from backup, and timed it?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: OT systems are often rebuilt by a single specialist or vendor. Without a tested process, recovery time is unknown until it is needed.
- How to verify: Rebuild test records.
- Answer levels:
  0. **Never** — Never tested.
  1. **Partly** — Some components restored.
  2. **Tested and timed** — Rebuild tested in the last year, with the time recorded.
  3. **Twice yearly, within target** — Tested at least twice a year within the agreed recovery time.

---

## 7) Education Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a school, college or university would hold up against attacks on education: breaches at edtech vendors holding student data, open campus networks, dormant student accounts, fee-payment fraud against parents, tampering with grades and exam material, and running exams and admissions through an outage.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Campus, vendors and accounts

Entry points shaped by open campuses, large user populations and many edtech vendors.

**EDU-IN-01** — Do you know which edtech vendors hold student data (SIS, LMS, exam and admission platforms, apps), and have you checked how they protect it and how quickly they would tell you about a breach?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: In December 2024 attackers used a stolen support credential at PowerSchool, a student information system provider, and took data on tens of millions of students from its school customers.
- How to verify: Edtech vendor register with contract terms and assessment dates.
- Answer levels:
  0. **No** — No list of vendors holding student data.
  1. **List only** — Vendors are known, not assessed.
  2. **Assessed with notification terms** — Assessed before adoption, with breach-notification and data-deletion terms in contracts.
  3. **Minimised and reviewed** — As above, data shared is minimised and vendors are reviewed every year.

**EDU-IN-02** — Are student and guest devices on campus Wi-Fi kept separate from staff systems, exam systems and servers?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: Thousands of unmanaged personal devices join campus networks every day. If they can reach administrative systems, so can any malware they carry.
- How to verify: Network design and firewall rules between student and administrative networks.
- Answer levels:
  0. **Same network** — Students, guests and staff share a network.
  1. **Separate SSID only** — Separate Wi-Fi names, but students can reach internal systems.
  2. **Isolated** — Student and guest networks are isolated from staff and administrative systems.
  3. **Isolated with access control** — As above, with network access control for staff networks.

**EDU-IN-03** — Are accounts of students and staff who have left disabled promptly, including in third-party apps?

- Control: HS-IAM-03 Joiner, mover and leaver process (high)
- Attacker's view: Thousands of dormant student and alumni accounts are a ready supply of logins for attackers, who use them to phish staff from a trusted address.
- How to verify: Count of active accounts for people who left more than 90 days ago.
- Answer levels:
  0. **They stay active** — Accounts remain active indefinitely.
  1. **Annual clean-up** — Removed in a yearly clean-up.
  2. **Within 30 days** — Disabled automatically within 30 days.
  3. **Lifecycle automated** — Created and removed automatically from the SIS and HR systems, including connected apps.

**EDU-IN-04** — How are parents protected from fake fee-payment requests and "changed bank details" messages?

- Control: HS-PAY-02 Payment instruction verification (high)
- Attacker's view: Fraudsters send parents fake fee notices from lookalike addresses or WhatsApp numbers at admission and term time, when payments are expected.
- How to verify: Fee payment communications and the published guidance to parents.
- Answer levels:
  0. **Nothing** — No guidance to parents.
  1. **Occasional warnings** — Warnings sent after incidents.
  2. **Single official channel** — Fees are paid only through one published official channel, and parents are told the institution never changes bank details by email or message.
  3. **Protected and monitored** — As above, with DMARC enforced and lookalike domains and social media accounts monitored.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Academic systems and shared devices

Who can reach grades, exams and admissions, and the state of shared computers.

**EDU-SP-01** — Can student or general staff accounts reach grade, exam or admission systems beyond what their role needs?

- Control: HS-IAM-02 Least privilege and role-based access (high)
- Attacker's view: Students and outsiders target grade and exam systems. Broad access turns one stolen staff password into changed results.
- How to verify: Role configuration in the SIS or exam system and the last access review.
- Answer levels:
  0. **Yes** — Access is broad.
  1. **Partly restricted** — Restricted by department, not by role.
  2. **Role-based** — Access is role-based and changes are approved.
  3. **Role-based and reviewed** — As above, with access reviewed each term and changes to grades logged.

**EDU-SP-02** — Are shared lab and library computers reset to a clean state between users and prevented from saving passwords?

- Control: HS-END-02 Device management and hardening (medium)
- Attacker's view: Keyloggers and saved browser sessions on shared computers hand staff and student credentials to whoever sits down next.
- How to verify: Configuration of lab and library machines.
- Answer levels:
  0. **No** — Shared computers keep changes between users.
  1. **Occasionally reimaged** — Rebuilt occasionally.
  2. **Reset each session** — Reset to a clean state after each session.
  3. **Reset and locked down** — As above, with credential saving disabled and USB restricted.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Student data and exam integrity

Children's data and the integrity of exams and results.

**EDU-PR-01** — Is children's data (health, guardian contacts, photos, identity documents) collected only where needed and access-restricted, with verifiable parental consent where the law requires it?

- Control: HS-DAT-04 Privacy rights and consent (medium)
- Attacker's view: Children's data is valuable to criminals because it can be used for identity fraud for years before anyone notices.
- What to consider: The DPDP Act requires verifiable consent of a parent or guardian before processing a child's personal data.
- How to verify: Data inventory for student records and the consent mechanism.
- Answer levels:
  0. **No controls** — Collected broadly, widely accessible.
  1. **Partly** — Some restrictions, consent not tracked.
  2. **Minimised and consented** — Collected only where needed, access-restricted, consent recorded.
  3. **Reviewed** — As above, reviewed yearly and deleted when no longer needed.

**EDU-PR-02** — Are exam papers, results and admission decisions protected against leaks and tampering before release, with access restricted and changes logged?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Exam paper leaks and changed results cause public harm and loss of trust. They usually start with a compromised staff account or a shared drive.
- How to verify: Access list and logs for exam material storage.
- Answer levels:
  0. **No** — Stored and shared like any other file.
  1. **Restricted** — Access restricted to named people.
  2. **Restricted and logged** — Restricted, with every access and change logged.
  3. **Controlled release** — As above, with controlled release and integrity checks on results.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Spotting misuse

Noticing compromised accounts and tampering.

**EDU-DE-01** — Would IT notice mass email sending from a compromised staff or student account, or grade changes outside the normal process?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Compromised education accounts are used to phish other institutions and parents because messages from a school or university are trusted.
- How to verify: Alert rules for outbound mail volume and grade changes.
- Answer levels:
  0. **No** — Neither is monitored.
  1. **After complaints** — Usually found after complaints.
  2. **Alerted** — Both raise alerts reviewed by IT.
  3. **Alerted and acted on** — As above, with accounts suspended automatically for mass sending.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Exams and admissions through an outage

Continuing teaching, exams and admissions while systems are down.

**EDU-RE-01** — If systems were down during exams or admissions season, is there a plan to run exams, publish results and accept applications?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: Attacks on schools and universities often land at the start of term or around exams, when disruption hurts most and the pressure to pay is highest.
- How to verify: Contingency plans for exams and admissions.
- Answer levels:
  0. **No** — No plan.
  1. **Informal** — Ideas, nothing written.
  2. **Documented** — Documented contingency plans for exams, results and admissions.
  3. **Rehearsed** — As above, rehearsed or tested in the last year.

---

## 8) IT Services & SaaS Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well an IT services firm, managed service provider or SaaS company would hold up against attacks on itself and, through it, its clients: leaked secrets, developer session theft, malicious dependencies, pipeline takeover, access into client environments and rebuilding after a cloud account is destroyed.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Code, developers and client access

Routes into your environment, and through you into your clients.

**ITS-IN-01** — Are secrets such as API keys, cloud credentials and tokens kept out of code, with every repository scanned for leaked secrets, including its history?

- Control: HS-APP-01 Secure development lifecycle (high)
- Attacker's view: Attackers continuously scan public code platforms for leaked keys and use them within minutes, often to reach cloud accounts directly.
- How to verify: Secret scanning configuration and the last detected secret with its revocation time.
- Answer levels:
  0. **No** — Secrets are often stored in code or configuration files.
  1. **Manual checks** — Occasional manual checks.
  2. **Automated scanning** — Automated scanning blocks secrets on push, and secrets are kept in a vault.
  3. **Scanned and auto-revoked** — As above, history scanned, public repositories monitored for your organisation, and leaked secrets revoked automatically.

**ITS-IN-02** — Are developer and administrator sessions protected against token theft, for example by allowing production access only from managed devices and using short-lived credentials?

- Control: HS-IAM-01 Multi-factor authentication (critical)
- Attacker's view: In 2023 malware on a CircleCI engineer's laptop stole a valid session token that bypassed MFA. Every customer had to rotate all their stored secrets.
- How to verify: Conditional access policies for production and cloud consoles, and session lifetime settings.
- Answer levels:
  0. **No** — Production and consoles are reachable from any device with a password.
  1. **MFA only** — MFA is required, but from any device, with long sessions.
  2. **Managed devices only** — Production and cloud console access is only allowed from managed devices with EDR.
  3. **Short-lived and bound** — As above, with phishing-resistant MFA, short-lived credentials and session binding.

**ITS-IN-03** — Are open-source dependencies and build tools monitored for known vulnerabilities and malicious packages?

- Control: HS-APP-01 Secure development lifecycle (high)
- Attacker's view: Attackers publish malicious packages with names close to popular ones, or compromise genuine ones, so that your build pulls their code in.
- How to verify: SCA tool configuration and the last blocked build.
- Answer levels:
  0. **No** — Dependencies are not monitored.
  1. **Occasional audits** — Checked occasionally.
  2. **Automated SCA** — Software composition analysis runs on every build and blocks critical issues.
  3. **Plus provenance** — As above, with dependency pinning, an internal registry or allowlist, and checks for malicious packages.

**ITS-IN-04** — How do your staff access client environments, and is that access separated per client?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: Attackers target IT providers to reach all their clients at once. In 2021 ransomware was pushed through Kaseya, an IT management tool, to up to about 1,500 businesses.
- How to verify: How client credentials are stored, and the access list for one client.
- Answer levels:
  0. **Shared credentials** — Client credentials kept in spreadsheets, chats or shared accounts.
  1. **Named, always on** — Named accounts with standing access to many clients.
  2. **Vaulted and separated** — A privileged access vault with MFA, separated per client.
  3. **Just-in-time and reviewed** — As above, granted just in time, sessions recorded, and access reviewed with each client.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Pipelines and cloud

What an attacker could do once inside your engineering environment.

**ITS-SP-01** — Can a single developer push code to production without review?

- Control: HS-APP-01 Secure development lifecycle (high)
- Attacker's view: An attacker with one developer's access can ship malicious code to production, and from there to every customer.
- How to verify: Branch protection settings for the main repositories.
- Answer levels:
  0. **Yes** — No branch protection or required reviews.
  1. **Sometimes** — Review is expected but can be bypassed.
  2. **Enforced review** — Branch protection and required reviews are enforced.
  3. **Signed and pipeline-only** — As above, builds are signed, provenance is recorded and production deploys only through the pipeline.

**ITS-SP-02** — Who can change CI/CD pipelines and their secrets, and are pipeline credentials scoped to each environment?

- Control: HS-IAM-04 Privileged access management (critical)
- Attacker's view: Pipelines hold the keys to production. A compromised pipeline is a compromised production environment.
- How to verify: Pipeline permissions and credential configuration.
- Answer levels:
  0. **Anyone with repo access** — Pipeline configuration and secrets are broadly editable.
  1. **Restricted, broad credentials** — Changes are restricted, but pipeline credentials have wide access.
  2. **Restricted and scoped** — Changes are restricted and credentials are scoped per environment.
  3. **Short-lived** — As above, using short-lived federated credentials instead of stored keys.

**ITS-SP-03** — Are production cloud accounts separated from development, with guardrails that prevent public storage and over-privileged roles?

- Control: HS-CLD-01 Cloud security posture (high)
- Attacker's view: A test resource with broad permissions in the production account is a common stepping stone from a minor breach to client data.
- How to verify: Cloud organisation structure and preventive policies.
- Answer levels:
  0. **Shared accounts** — Development and production share cloud accounts.
  1. **Separated, no guardrails** — Separate accounts, no preventive guardrails.
  2. **Separated with guardrails** — Separate accounts with policies preventing public exposure and wildcard permissions.
  3. **Guardrails as code** — As above, enforced as code and monitored continuously.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Client data

Protecting client data wherever your teams handle it.

**ITS-PR-01** — Is client production data kept out of development, testing and support tools such as tickets, chat and logs?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Copies of client data in tickets, chats and test systems are far less protected than production, and are often what is stolen.
- How to verify: Masking procedure and a check of one test environment and support queue.
- Answer levels:
  0. **No** — Client data is copied wherever needed.
  1. **Sometimes** — Avoided by habit, not by rule.
  2. **Masked by rule** — Masked or synthetic data is required outside production.
  3. **Enforced** — As above, enforced technically and checked.

**ITS-PR-02** — Is client data separated by tenant and encrypted with keys you manage and rotate, with tenant isolation tested?

- Control: HS-DAT-01 Encryption of data at rest (high)
- Attacker's view: A flaw in tenant isolation can expose every client's data through a single account.
- How to verify: Architecture documentation and the last penetration test covering tenant isolation.
- Answer levels:
  0. **No** — No tenant separation or encryption controls.
  1. **Encrypted only** — Encrypted with provider defaults, isolation untested.
  2. **Isolated and managed keys** — Tenant isolation designed in and keys managed and rotated.
  3. **Isolation tested** — As above, with tenant isolation included in penetration tests.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Engineering and client response

Spotting attacks on engineering systems and telling clients in time.

**ITS-DE-01** — Would you detect unusual activity in your code platform and cloud control plane, such as mass repository cloning, new access keys or logging being switched off?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Source code theft and cloud key creation are early signs of a serious breach, and both are visible in audit logs.
- How to verify: Alert rules for the code platform and cloud audit logs.
- Answer levels:
  0. **No** — Not monitored.
  1. **Logged only** — Audit logs exist but are not reviewed.
  2. **Alerted** — These events raise alerts reviewed by a named team.
  3. **24x7** — Reviewed 24x7 with automated response for high-risk events.

**ITS-DE-02** — Could you notify affected clients within contractual deadlines, and do you know which clients each system serves?

- Control: HS-IR-03 Breach notification and communication (high)
- Attacker's view: For a service provider, a late or vague notification to clients often does more lasting damage than the breach itself.
- How to verify: Client-to-system map and notification procedure.
- Answer levels:
  0. **No** — No mapping of clients to systems; deadlines unknown.
  1. **Partly** — Deadlines known for major clients only.
  2. **Mapped with procedure** — Clients mapped to systems, with a notification procedure and contract deadlines.
  3. **Rehearsed** — As above, rehearsed in an exercise.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Rebuilding after a cloud compromise

Recovering when the attacker controls or destroys your cloud account.

**ITS-RE-01** — If your main cloud account were taken over and its resources deleted, could you rebuild production from code and backups?

- Control: HS-RES-01 Protected and immutable backups (critical)
- Attacker's view: In 2014 an attacker who took over the cloud console of Code Spaces deleted its servers and backups. The company closed within days.
- How to verify: Backup account structure and the last rebuild test.
- Answer levels:
  0. **No** — Backups are in the same account, or there are none.
  1. **Same provider, same credentials** — Backups in another account reachable with the same credentials.
  2. **Separate account and credentials** — Backups in a separate account with separate credentials and immutability.
  3. **Rebuild tested** — As above, and a full rebuild from infrastructure as code has been tested.

---

## 9) Hospitality Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a hotel, resort or restaurant group would hold up against hospitality attacks: phishing through booking platforms, social engineering of the front desk, guest and smart-room networks, vendor access, payment terminal compromise, guest identity documents and running the property without the PMS.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Guests, bookings and vendors

Entry points created by guest-facing operations and property systems.

**HOS-IN-01** — Are reservations and front-desk staff prepared for phishing through booking platforms, such as a "guest" message with a malicious link or attachment sent through an OTA inbox?

- Control: HS-PPL-01 Security awareness training (high)
- Attacker's view: Since 2023, criminals have sent hotels fake guest complaints with malware through booking platforms, then used the hotel's booking account to message real guests asking them to "re-confirm" their card details.
- How to verify: Training material for reservations staff and recent reported messages.
- Answer levels:
  0. **No** — Not covered in any training.
  1. **General awareness** — General phishing awareness only.
  2. **Specific guidance** — Staff are trained on booking-platform phishing and how to check suspicious guest messages.
  3. **Reinforced and reported** — As above, reinforced with simulations and a quick way to report and block.

**HOS-IN-02** — How does your front desk verify callers or visitors who ask for guest details, room numbers or a replacement key card?

- Control: HS-PPL-01 Security awareness training (high)
- Attacker's view: Social engineering of hotel staff is used to locate guests, take over loyalty accounts and gain access to rooms.
- How to verify: Front-desk verification procedure and key reissue log.
- Answer levels:
  0. **No checks** — Information or keys are given on request.
  1. **Informal checks** — Staff use their judgement.
  2. **Defined verification** — Identity is verified against the booking before any detail or key is given.
  3. **Verified and tested** — As above, with periodic testing and logging of key reissues.

**HOS-IN-03** — How do PMS, POS, door-lock and Wi-Fi vendors connect remotely to your properties?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: Hospitality systems are run by many vendors. Their remote access is a common way into property networks and payment systems.
- How to verify: Vendor access list with how each connection is enabled.
- Answer levels:
  0. **Always on** — Permanent remote tools or shared credentials.
  1. **Named, always on** — Named accounts permanently enabled.
  2. **On request with MFA** — Enabled on request with MFA and time limits.
  3. **Restricted and recorded** — As above, limited to the vendor's own systems and recorded.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Guest, room and property networks

Keeping guest and smart-room devices away from business systems.

**HOS-SP-01** — Can a device on guest Wi-Fi reach any hotel system, such as the PMS, POS or room controls?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: Guest networks are open to anyone. If they reach hotel systems, every guest is a potential intruder.
- How to verify: Guest network design and a test from a guest device.
- Answer levels:
  0. **Yes** — Guest Wi-Fi shares the hotel network.
  1. **Partly isolated** — Separate network, but some internal systems are reachable.
  2. **Fully isolated** — Guest Wi-Fi reaches only the internet, and guests cannot reach each other.
  3. **Isolated and tested** — As above, verified by testing.

**HOS-SP-02** — Are smart room devices (locks, TVs, thermostats) and building systems on networks separated from business systems?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: Smart devices are rarely patched and often keep default passwords. On a shared network they become a foothold into hotel systems.
- How to verify: Network design for room and building systems.
- Answer levels:
  0. **No** — They share the business network.
  1. **Some** — Some are separated.
  2. **Separated** — All are on dedicated, restricted networks.
  3. **Separated and monitored** — As above, with default passwords changed and traffic monitored.

**HOS-SP-03** — Do staff share logins on the PMS, POS or booking-platform extranets?

- Control: HS-IAM-05 Credential and password hygiene (medium)
- Attacker's view: Shared logins are never changed when seasonal staff leave and make it impossible to trace fraud to a person.
- How to verify: User lists for the PMS and OTA extranets.
- Answer levels:
  0. **Widely** — Shared logins are normal.
  1. **Some** — Some systems or shifts share logins.
  2. **Individual** — Everyone has individual logins.
  3. **Individual with MFA** — Individual logins, with MFA on extranets and admin functions.

**HOS-SP-04** — Are electronic door-lock and key-card systems on current firmware, given publicly known key-card cloning flaws?

- Control: HS-PHY-01 Physical access control (medium)
- Attacker's view: In 2024 researchers showed that flaws in a widely used hotel lock system let an attacker forge a key that opens every door, affecting millions of locks worldwide.
- How to verify: Lock system version and vendor advisory status.
- Answer levels:
  0. **Unknown** — Firmware status unknown.
  1. **Outdated** — Known to be outdated.
  2. **Current** — Updated to the vendor's current secure version.
  3. **Current and monitored** — As above, with lock audit trails reviewed after incidents.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Guest data and payments

Card details and identity documents that criminals want.

**HOS-PR-01** — Is card data captured by phone or email for bookings stored anywhere, such as PMS notes, mailboxes or paper?

- Control: HS-PAY-01 Payment and transaction security (high)
- Attacker's view: Card numbers left in reservation notes and mailboxes are an easy prize for anyone who gets into the PMS or an email account.
- How to verify: Search of PMS notes and the reservations mailbox for card numbers.
- Answer levels:
  0. **Yes** — Card details are kept in notes, emails or paper.
  1. **Sometimes** — Discouraged, but it happens.
  2. **No** — Card details are only captured through a secure payment link or terminal.
  3. **No, checked** — As above, checked regularly by searching notes and mailboxes.

**HOS-PR-02** — Are copies of guest identity documents (passports, Aadhaar, visas) kept only as long as required and access-restricted?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Identity documents are used for fraud and account opening. A hotel holding years of them is a high-value target.
- How to verify: Storage location and retention setting for guest identity documents.
- Answer levels:
  0. **Kept indefinitely** — Stored indefinitely in shared folders or email.
  1. **Restricted** — Access restricted, no retention limit.
  2. **Restricted and limited** — Restricted, with a retention period enforced.
  3. **Minimised** — As above, only required fields collected and deletion automated.

**HOS-PR-03** — Are channel managers, OTAs, PMS and booking engine providers assessed for security, with breach-notification terms in contracts?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: Guest data is spread across many platforms. A breach at any one of them exposes your guests and your brand.
- How to verify: Supplier register for booking and property systems.
- Answer levels:
  0. **No** — Not assessed.
  1. **Contract terms only** — Some security terms, not assessed.
  2. **Assessed** — Assessed before onboarding with notification terms.
  3. **Reviewed yearly** — As above, reviewed yearly.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Account and booking monitoring

Spotting takeover of booking and property accounts.

**HOS-DE-01** — Would you notice someone signing into the PMS or a booking-platform extranet from an unusual location or at an unusual time?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: A taken-over booking account lets criminals message real guests with convincing payment requests about real reservations.
- How to verify: Sign-in alert configuration for the PMS and extranets.
- Answer levels:
  0. **No** — Not monitored.
  1. **Platform emails only** — Relies on emails from the platform.
  2. **Alerted** — Unusual sign-ins raise alerts reviewed by a named person.
  3. **Alerted 24x7** — Reviewed around the clock.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Running the property without systems

Serving guests while systems are down.

**HOS-RE-01** — If the PMS were down, could you check guests in and out, issue keys and take payments?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: During the 2023 MGM Resorts attack, digital room keys, slot machines and reservation systems were disrupted for days and guests queued for hours.
- How to verify: Manual procedures and the latest offline guest lists.
- Answer levels:
  0. **No** — No fallback.
  1. **Improvised** — Staff would improvise.
  2. **Documented** — Documented manual procedures with daily offline arrival and in-house lists.
  3. **Rehearsed** — As above, rehearsed in the last year.

---

## 10) Logistics & Transport Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a logistics, freight or transport operator would hold up against attacks on logistics: invoice and payment fraud, partner and carrier connections, telematics and IoT devices, warehouse automation, cyber-enabled cargo theft and moving goods while core systems are down.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Partners, devices and payments

The many external connections that make logistics work, and that attackers use.

**LOG-IN-01** — How are changes to carrier, subcontractor and supplier bank details, and unusual freight invoices, verified before payment?

- Control: HS-PAY-02 Payment instruction verification (high)
- Attacker's view: High volumes of invoices from many small carriers make logistics a favourite target for invoice fraud and payment diversion.
- How to verify: Supplier master-data change log with call-back records.
- Answer levels:
  0. **Not verified** — Changes are made from the email or invoice.
  1. **Sometimes checked** — Checked occasionally, with no record.
  2. **Call-back and approval** — A call-back to a number on file and a second approver are required.
  3. **Plus anomaly checks** — As above, with checks for duplicate or unusual invoices before payment.

**LOG-IN-02** — How do partners such as carriers, customs brokers and 3PLs connect to your TMS and WMS?

- Control: HS-NET-03 Secure remote access (high)
- Attacker's view: Partner accounts with shared or weak logins let attackers view and change shipments without breaching you directly.
- How to verify: Partner account list and authentication settings.
- Answer levels:
  0. **Shared logins** — Partners share logins.
  1. **Individual, always on** — Named partner accounts, always enabled, without MFA.
  2. **Individual with MFA or APIs** — Individual accounts with MFA, or authenticated APIs and EDI, limited to their own shipments.
  3. **Reviewed** — As above, with partner access reviewed and removed when contracts end.

**LOG-IN-03** — Are telematics, GPS trackers, handheld scanners and their cloud portals free of default passwords and kept updated?

- Control: HS-IAM-05 Credential and password hygiene (medium)
- Attacker's view: Default passwords on trackers and their portals let attackers locate high-value loads or disable tracking.
- How to verify: Device management console and portal user list.
- Answer levels:
  0. **Unknown** — Not checked.
  1. **Some defaults remain** — Some devices or portals keep default credentials.
  2. **Unique and updated** — Unique credentials, and firmware is updated on a schedule.
  3. **Managed centrally** — As above, devices managed centrally with alerts for unauthorised devices.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Warehouses and operational systems

How far an attack can reach into operations.

**LOG-SP-01** — Are warehouse automation, scanners and IoT devices on networks separated from the corporate network?

- Control: HS-NET-01 Network segmentation (critical)
- Attacker's view: On a shared network, ransomware that starts in the office stops sortation, scanning and dispatch as well.
- How to verify: Network design for warehouse sites.
- Answer levels:
  0. **No** — They share the corporate network.
  1. **Partly** — Some separation.
  2. **Separated** — Dedicated networks with restricted traffic.
  3. **Separated and tested** — As above, tested regularly.

**LOG-SP-02** — Do you know which operational systems (WMS, sortation, yard and terminal systems) depend on corporate IT services such as Active Directory to run?

- Control: HS-OT-01 OT and connected-device security (critical)
- Attacker's view: In the 2017 NotPetya attack Maersk had to reinstall thousands of servers and PCs. Recovery depended on a single surviving domain controller in Ghana that happened to be offline.
- How to verify: Dependency map for operational systems.
- Answer levels:
  0. **No** — Dependencies are unknown.
  1. **Partly** — Known for some systems.
  2. **Mapped** — Dependencies are mapped and documented.
  3. **Mapped and reduced** — As above, critical operations can run without corporate IT, and this has been tested.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Shipments and customer data

Protecting shipment information that criminals can turn into stolen goods.

**LOG-PR-01** — Is access to shipment details, consignee data and delivery addresses limited to those who need them, including in driver apps?

- Control: HS-IAM-02 Least privilege and role-based access (high)
- Attacker's view: Shipment data reveals what high-value goods are moving, where and when. It is used to plan cargo theft.
- How to verify: Role configuration in the TMS and driver app.
- Answer levels:
  0. **Broad** — Most users and devices can see all shipments.
  1. **Partly** — Some restrictions.
  2. **Need-to-know** — Access is limited by role, region and assignment.
  3. **Need-to-know and logged** — As above, with access logged and reviewed.

**LOG-PR-02** — Do you know which partners and platforms would stop your operations if they were breached or went offline?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: In November 2023 a cyber incident at DP World Australia halted container movements at major ports for several days.
- How to verify: Critical partner list with contingency arrangements.
- Answer levels:
  0. **No** — Not identified.
  1. **Known informally** — Known but not documented.
  2. **Identified and assessed** — Critical partners identified and assessed, with contingency options.
  3. **Planned** — As above, with alternatives tested.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Spotting cargo fraud

Noticing manipulation of shipments and bookings.

**LOG-DE-01** — Would you detect fraudulent changes to consignee details, delivery addresses or carrier assignments?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Criminals use compromised accounts and fake carrier identities to redirect loads. US authorities have warned of cyber-enabled cargo theft through hijacked freight accounts.
- How to verify: Change alert rules in the TMS.
- Answer levels:
  0. **No** — Changes are not monitored.
  1. **After a loss** — Found after a missed delivery.
  2. **Alerted** — Changes to high-value shipments raise alerts and need confirmation.
  3. **Alerted and verified** — As above, with out-of-band confirmation for every change.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Moving goods through an outage

Continuing deliveries when systems are unavailable.

**LOG-RE-01** — If the TMS or WMS were down for a week, could you dispatch, track and deliver manually?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: Logistics attacks cause immediate, visible disruption, which makes logistics companies attractive ransomware targets.
- How to verify: Manual operation procedures and rehearsal record.
- Answer levels:
  0. **No** — Operations would stop.
  1. **Briefly** — Improvised for a day or two.
  2. **Documented** — Documented manual dispatch, picking and tracking procedures.
  3. **Rehearsed** — As above, rehearsed in the last year.

**LOG-RE-02** — Have you tested restoring your identity infrastructure (for example Active Directory) from backup in a clean environment?

- Control: HS-RES-02 Recovery testing and continuity (high)
- Attacker's view: Nothing else can be restored until identity services work. Without a tested plan this step alone can take weeks.
- How to verify: Identity restore test record.
- Answer levels:
  0. **Never** — Never tested.
  1. **Assumed** — Backups exist but restoration is untested.
  2. **Tested** — Tested in the last year.
  3. **Tested and timed** — Tested regularly, with time recorded against target.

---

## 11) Professional Services Threat Readiness Assessment

Template 2.0 · HawkSight threat-led industry pack: core attack-path questions plus attack scenarios specific to the industry

Tests how well a law, accounting or consulting firm would hold up against attacks on advisory firms: client payment diversion, takeover of partners' mailboxes, breaches of file-transfer and data-room tools, firm-wide access to client matters, client documents in AI tools and meeting deadlines through an outage.

Core questions (`CORE-*`) are listed in full under the first industry template and referenced afterwards.

### How attackers get in

The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.

#### Passwords, MFA and account recovery

Core questions: CORE-IN-01, CORE-IN-02, CORE-IN-03, CORE-IN-04 (see first industry template).

#### Email and phishing

Core questions: CORE-IN-05, CORE-IN-06, CORE-IN-07 (see first industry template).

#### What you expose to the internet

Core questions: CORE-IN-08, CORE-IN-09, CORE-IN-10, CORE-IN-11 (see first industry template).

#### Supplier and remote access

Core questions: CORE-IN-12, CORE-IN-13 (see first industry template).

#### Client money, mailboxes and file sharing

The routes attackers use against advisory firms and their clients.

**PRO-IN-01** — When clients send you money (fees, escrow, settlement funds), how do you prevent fraudsters impersonating the firm to redirect it?

- Control: HS-PAY-02 Payment instruction verification (high)
- Attacker's view: Fraudsters who read a firm's or client's email send "updated payment details" at the moment a large settlement or property payment is due.
- How to verify: Engagement letter wording on bank details and the procedure for large transfers.
- Answer levels:
  0. **Nothing specific** — Clients are not warned.
  1. **Occasional warnings** — Warnings in some email footers.
  2. **Confirmed out of band** — Bank details are given at engagement and clients are told to confirm any change by phone with a known contact.
  3. **Verified each time** — As above, every large transfer is confirmed by phone before and after.

**PRO-IN-02** — Are partners and senior staff protected against targeted mailbox takeover, for example with impossible-travel alerts, external email warnings and automatic forwarding blocked?

- Control: HS-END-03 Email and web threat protection (high)
- Attacker's view: Partners' mailboxes hold client secrets and approve payments. Attackers watch them quietly for weeks before acting.
- How to verify: Mail transport rules, forwarding policy and sign-in risk alerts.
- Answer levels:
  0. **No** — No specific protection.
  1. **External banner only** — External email warnings only.
  2. **Forwarding blocked and alerts** — Automatic external forwarding blocked and risky sign-ins alerted.
  3. **Hardened senior accounts** — As above, with phishing-resistant MFA for partners and reviewed alerts.

**PRO-IN-03** — Are file-transfer, data-room and e-signature tools assessed for security and kept up to date?

- Control: HS-TPR-01 Third-party security risk management (high)
- Attacker's view: In 2023 a flaw in the MOVEit file-transfer tool let criminals steal data from more than 2,000 organisations, including several large advisory firms.
- How to verify: List of file-transfer and data-room tools with their assessment and patch status.
- Answer levels:
  0. **No** — Chosen by teams without review.
  1. **Approved list** — An approved list exists, not assessed.
  2. **Assessed and patched** — Assessed before use; self-hosted tools patched within days of critical fixes.
  3. **Monitored** — As above, with usage monitored and unapproved tools blocked.

### Stopping an attacker spreading

What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.

#### Administrator accounts and the directory

Core questions: CORE-SP-01, CORE-SP-02, CORE-SP-03 (see first industry template).

#### Devices and patching

Core questions: CORE-SP-04, CORE-SP-05, CORE-SP-06 (see first industry template).

#### Network separation

Core questions: CORE-SP-07 (see first industry template).

#### Matter and engagement segregation

How much client information a single compromised account can reach.

**PRO-SP-01** — Are client matters segregated so that one compromised account cannot reach every client's files, with ethical walls enforced in the document system?

- Control: HS-IAM-02 Least privilege and role-based access (high)
- Attacker's view: Firm-wide access turns one phished junior account into a breach of every client the firm serves.
- How to verify: Document management access model and one matter's access list.
- Answer levels:
  0. **No** — Most staff can open most client files.
  1. **By department** — Restricted by department or office.
  2. **By matter** — Access granted per matter or engagement, with ethical walls enforced.
  3. **By matter, reviewed** — As above, with access reviewed when matters close or teams change.

### Protecting what attackers want

The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.

#### Money and payment instructions

Core questions: CORE-PR-01, CORE-PR-02 (see first industry template).

#### Sensitive data

Core questions: CORE-PR-03, CORE-PR-04, CORE-PR-05, CORE-PR-06 (see first industry template).

#### Cloud and collaboration platforms

Core questions: CORE-PR-07 (see first industry template).

#### Confidential client documents

Keeping client documents within the firm's control.

**PRO-PR-01** — Are confidential documents shared with clients and counterparties through controlled links with expiry and access logs, rather than attachments or personal cloud storage?

- Control: HS-DAT-03 Data loss prevention and minimisation (medium)
- Attacker's view: Documents emailed as attachments are copied into every mailbox they pass through, and any of them can be breached.
- How to verify: File sharing policy and DLP configuration.
- Answer levels:
  0. **Attachments and personal tools** — Email attachments and personal cloud storage are normal.
  1. **Mixed** — A secure tool exists but is used inconsistently.
  2. **Controlled by default** — Controlled sharing is the default and personal cloud storage is blocked.
  3. **Enforced and monitored** — As above, with labelling and data loss prevention on confidential documents.

**PRO-PR-02** — Are AI tools used on client work approved by the firm, with terms that prevent client data being retained or used for training?

- Control: HS-DAT-05 AI and unapproved application data exposure (medium)
- Attacker's view: Client documents pasted into consumer AI tools leave the firm's control and may breach confidentiality obligations and client contracts.
- How to verify: AI policy, approved tool terms and web filter reports.
- Answer levels:
  0. **No** — Staff choose their own tools.
  1. **Guidance only** — Guidance issued, not enforced.
  2. **Approved tools** — Approved enterprise tools with suitable terms and a rule on client data.
  3. **Enforced and disclosed** — As above, unapproved tools blocked and use disclosed to clients where required.

### Noticing and responding

Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.

#### Spotting an attack

Core questions: CORE-DE-01, CORE-DE-02, CORE-DE-03 (see first industry template).

#### Ready to respond

Core questions: CORE-DE-04, CORE-DE-05, CORE-DE-06, CORE-DE-07 (see first industry template).

#### Spotting data theft

Noticing unusual access to client files.

**PRO-DE-01** — Would you notice bulk downloads of client files, or a user opening matters they have never worked on?

- Control: HS-MON-02 Threat detection and alert response (critical)
- Attacker's view: Departing staff and intruders take client files in bulk. The signs are visible in document system logs if anyone looks.
- How to verify: Document system alert rules and an example investigation.
- Answer levels:
  0. **No** — Not monitored.
  1. **Logged only** — Logged but not reviewed.
  2. **Alerted** — Bulk downloads and unusual access raise alerts.
  3. **Alerted and investigated** — As above, investigated within a day.

**PRO-DE-02** — Do you know which clients you would have to notify, and within what contractual deadlines, if a system or mailbox were breached?

- Control: HS-IR-03 Breach notification and communication (high)
- Attacker's view: Advisory firms often owe clients notification within days. Missing those deadlines damages relationships more than the breach.
- How to verify: Register of client notification obligations.
- Answer levels:
  0. **No** — Not known.
  1. **Major clients only** — Known for a few major clients.
  2. **Mapped** — Client notification obligations are recorded and linked to systems.
  3. **Rehearsed** — As above, rehearsed in an exercise.

### Recovering and keeping operations running

How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.

#### Backups attackers cannot destroy

Core questions: CORE-RE-01, CORE-RE-02 (see first industry template).

#### Running the business through an outage

Core questions: CORE-RE-03, CORE-RE-04 (see first industry template).

#### Meeting deadlines through an outage

Continuing client work while systems are unavailable.

**PRO-RE-01** — Could the firm meet court, filing, audit and regulatory deadlines if its systems were down for two weeks?

- Control: HS-RES-03 Operating through an IT outage (high)
- Attacker's view: Ransomware groups know that advisory firms face hard deadlines and that downtime harms clients directly, which increases the pressure to pay.
- How to verify: Business continuity plan for deadline-driven work.
- Answer levels:
  0. **No** — No plan.
  1. **Improvised** — Partners would improvise.
  2. **Planned** — Critical deadlines are tracked outside the main systems, with alternative ways to work and file.
  3. **Rehearsed** — As above, rehearsed in the last year.

---

## Threat scenario library

Each assessment is tested against these attack paths. See METHODOLOGY.md section 8a for how readiness is calculated.

### Ransomware through an internet-facing device (TS-EDGE)

*The fastest-growing way in is not an email. It is the VPN, firewall or remote-access gateway bought to keep attackers out.*

A flaw is announced in a popular VPN, firewall or remote-access product. Within days, criminal groups scan the whole internet for unpatched devices, log in, and quietly work towards administrator control of the network. Days or weeks later they copy data and encrypt everything at once, usually at night or over a holiday.

Relevance: default high

- **Get in through an exposed device** (prevent, all): Exploits an unpatched VPN or firewall, or logs into an exposed remote desktop or a remote-access account without MFA. Controls: HS-VUL-03 External attack surface and edge devices; HS-NET-03 Secure remote access
- **Take over administrator accounts** (prevent, all): Harvests passwords and abuses weaknesses in Active Directory to become a domain or cloud administrator. Controls: HS-IAM-04 Privileged access management; HS-IAM-07 Directory and identity infrastructure protection
- **Spread to every server** (prevent, any): Moves across a flat network and switches off security tools before launching encryption everywhere at once. Controls: HS-NET-01 Network segmentation; HS-END-01 Endpoint detection and response
- **Get caught before encryption** (detect, all): Spends days inside the network. Every one of those days is a chance to be noticed. Controls: HS-MON-02 Threat detection and alert response; HS-MON-01 Centralised logging and SIEM
- **Restore the business** (recover, all): Deletes or encrypts backups first so the victim cannot simply restore. Controls: HS-RES-01 Protected and immutable backups; HS-RES-02 Recovery testing and continuity; HS-RES-03 Operating through an IT outage

Public incidents:
- Colonial Pipeline (2021): Attackers used the password of an old VPN account that had no MFA. The company shut its fuel pipeline down for several days.
- Ivanti Connect Secure users (2024): VPN flaws were exploited at scale within days of disclosure; CISA ordered US federal agencies to disconnect affected appliances.

### Malware delivered by email (TS-PHISH)

*One click by one person is all it takes. What matters is what happens in the hour after.*

An employee opens an invoice, a delivery notice or a QR code that looks routine. Malware lands on their laptop, steals saved passwords and gives the attacker a foothold. From there the attack follows the familiar path: escalate, spread, steal, encrypt.

Relevance: default high

- **Land a malicious email** (prevent, any): Sends a lure that gets past email filtering and convinces someone to click. Controls: HS-END-03 Email and web threat protection; HS-PPL-02 Phishing simulation; HS-PPL-01 Security awareness training
- **Run malware on a laptop** (prevent, any): Runs malware that steals passwords and opens a remote connection, helped by local admin rights. Controls: HS-END-01 Endpoint detection and response; HS-END-02 Device management and hardening
- **Take over the network** (prevent, all): Uses stolen credentials and directory weaknesses to gain admin control and move between systems. Controls: HS-IAM-04 Privileged access management; HS-IAM-07 Directory and identity infrastructure protection
- **Get caught early** (detect, all): Generates alerts that nobody reads outside office hours. Controls: HS-MON-02 Threat detection and alert response
- **Restore the business** (recover, all): Destroys backups before encrypting. Controls: HS-RES-01 Protected and immutable backups; HS-RES-02 Recovery testing and continuity

Public incidents:
- QakBot (2023): Before an international police takedown, this email-borne malware had infected over 700,000 computers and was used to launch ransomware attacks.

### Impersonating staff to the IT helpdesk (TS-HELPDESK)

*Attackers do not need to break your MFA if they can phone your helpdesk and ask for it to be reset.*

An attacker finds an employee on LinkedIn, calls the IT helpdesk (often an outsourced one) pretending to be that person, and asks for a password reset and a new MFA device. Minutes later they are signed in as the employee, ideally one with admin rights, without using any malware.

Relevance: default medium, retail high, hospitality high, fintech high, itservices high, healthcare high

- **Talk the helpdesk into a reset** (prevent, all): Gives an employee ID and manager name found online and asks for a new password and MFA device. Controls: HS-IAM-06 Account recovery and helpdesk verification
- **Sign in as the employee** (prevent, all): Registers their own MFA device and signs in from their own computer. Controls: HS-IAM-01 Multi-factor authentication
- **Reach admin and cloud consoles** (prevent, all): Uses the account, or resets an administrator next, to reach virtualisation and cloud management. Controls: HS-IAM-04 Privileged access management; HS-IAM-07 Directory and identity infrastructure protection
- **New device and odd sign-in spotted** (detect, all): Counts on nobody watching new MFA registrations or sign-ins from unfamiliar locations. Controls: HS-MON-02 Threat detection and alert response
- **Restore the business** (recover, all): Encrypts virtual servers directly from the management console. Controls: HS-RES-01 Protected and immutable backups; HS-RES-03 Operating through an IT outage

Public incidents:
- MGM Resorts (2023): Attackers reportedly impersonated an employee in a call to the IT helpdesk. Hotel and casino systems were disrupted for days; MGM reported a hit of about US$100 million.
- Marks & Spencer (2025): Attackers got in through social engineering involving a third party. Online orders were suspended for about seven weeks, with an estimated £300 million impact on profit.

### Payment diversion and CEO fraud (TS-BEC)

*The email really does come from your supplier's account. That is why it works.*

Attackers break into a supplier's mailbox, or one of yours, and read conversations for weeks. Then they reply inside a genuine invoice thread with "updated bank details". A variant impersonates the CEO or CFO, now increasingly with a cloned voice or deepfake video, asking for an urgent confidential transfer.

Relevance: default high

- **Take over or spoof a mailbox** (prevent, all): Phishes a mailbox password without MFA, or sends from a lookalike or spoofed domain. Controls: HS-IAM-01 Multi-factor authentication; HS-END-03 Email and web threat protection
- **Get a payment approved** (prevent, all): Asks for bank details to be changed, or an urgent transfer to be made, under time pressure. Controls: HS-PAY-02 Payment instruction verification
- **Hidden mailbox rules spotted** (detect, all): Creates rules that hide replies from the real owner. Controls: HS-MON-02 Threat detection and alert response
- **Recall the money** (recover, all): Moves the funds through mule accounts within hours. Controls: HS-IR-01 Incident response plan

Public incidents:
- FBI IC3 report (2023): Business email compromise accounted for about US$2.9 billion in reported losses in a single year.
- Arup (2024): An employee in Hong Kong paid out about US$25 million after a video call in which the CFO and colleagues were deepfakes.

### Stolen passwords used on your cloud services (TS-CREDS)

*Your staff passwords may already be for sale, stolen from a personal laptop you have never seen.*

Infostealer malware on an employee's or contractor's personal device harvests saved passwords and session cookies, which are sold in bulk. Buyers try them on cloud apps, VPNs and data platforms and walk straight in wherever there is no MFA or device check.

Relevance: default high

- **Log in with a stolen password or session** (prevent, all): Uses credentials from an infostealer log on an account without MFA or device restrictions. Controls: HS-IAM-01 Multi-factor authentication
- **Reach data in cloud apps** (prevent, all): Finds broad access rights and misconfigured cloud storage. Controls: HS-CLD-01 Cloud security posture; HS-IAM-02 Least privilege and role-based access
- **Copy the data out** (prevent, all): Exports large volumes of records through normal features. Controls: HS-DAT-03 Data loss prevention and minimisation
- **Unusual sign-in or export noticed** (detect, all): Signs in from new locations and downloads far more than usual. Controls: HS-MON-02 Threat detection and alert response; HS-MON-01 Centralised logging and SIEM
- **Contain and notify** (recover, all): Threatens to publish the data. Controls: HS-IR-01 Incident response plan; HS-IR-03 Breach notification and communication

Public incidents:
- Snowflake customers (2024): Around 165 organisations were notified after attackers used passwords stolen by infostealer malware to log into accounts without MFA and download customer data.

### Breached through a supplier or IT provider (TS-SUPPLIER)

*Your security is only as strong as the supplier who can already log into your network.*

A managed IT provider, software vendor or maintenance contractor with remote access is breached, or the tool they use is. The attacker inherits their trusted access to you, and to their other customers, often bypassing your perimeter entirely.

Relevance: default high

- **Use the supplier's access** (prevent, all): Logs in through the supplier's always-on remote access or management tool. Controls: HS-NET-03 Secure remote access; HS-TPR-01 Third-party security risk management
- **Spread beyond what the supplier needs** (prevent, any): Uses the supplier's broad rights to reach systems unrelated to their job. Controls: HS-IAM-04 Privileged access management; HS-NET-01 Network segmentation
- **Unusual supplier activity noticed** (detect, all): Acts at odd hours from the supplier's accounts, which nobody reviews. Controls: HS-MON-02 Threat detection and alert response
- **Keep operating without them** (recover, all): Takes the supplier's service down for everyone who depends on it. Controls: HS-RES-03 Operating through an IT outage; HS-RES-01 Protected and immutable backups

Public incidents:
- Target (2013): Credentials stolen from a heating and ventilation contractor led to malware on point-of-sale systems and about 40 million stolen cards.
- Change Healthcare (2024): Attackers used stolen credentials on a remote-access portal without MFA. Claims and pharmacy payments for providers across the US were disrupted for weeks.
- Kaseya VSA (2021): Ransomware was pushed through an IT management tool used by managed service providers, reaching up to about 1,500 businesses.

### Data theft and extortion (TS-EXTORT)

*Backups do not help when the threat is to publish your data.*

Instead of encrypting systems, the attacker quietly copies sensitive data, often through a flaw in a file-transfer tool or web application, then demands payment not to publish or sell it. Customers, patients and regulators have to be notified either way.

Relevance: default high

- **Exploit an internet-facing application** (prevent, all): Exploits a flaw in a file-transfer, web or supplier-hosted application. Controls: HS-VUL-03 External attack surface and edge devices; HS-VUL-01 Vulnerability scanning and testing; HS-TPR-01 Third-party security risk management
- **Find the valuable data** (prevent, any): Finds sensitive data where nobody knew it was kept, accessible to too many accounts. Controls: HS-AST-03 Data inventory and classification; HS-IAM-02 Least privilege and role-based access
- **Copy it out** (prevent, all): Downloads it in bulk through ordinary channels without triggering any control. Controls: HS-DAT-03 Data loss prevention and minimisation
- **Data theft noticed** (detect, all): Relies on nobody watching for unusual data volumes. Controls: HS-MON-02 Threat detection and alert response; HS-MON-01 Centralised logging and SIEM
- **Notify and limit harm** (recover, all): Contacts customers or the press directly to increase pressure. Controls: HS-IR-03 Breach notification and communication; HS-IR-01 Incident response plan

Public incidents:
- MOVEit Transfer (2023): A criminal group exploited a flaw in a file-transfer product and stole data from more than 2,000 organisations, including banks, universities and advisory firms.

### Misuse by an insider or former employee (TS-INSIDER)

*The account that leaks your customer list is often one you forgot to switch off.*

A departing employee downloads the customer database, a member of staff browses records they have no reason to see, or a leaver's account is still active months later. No hacking skill is needed.

Relevance: default medium, healthcare high, professional high, fintech high

- **Use existing or leftover access** (prevent, all): Uses an account that should have been removed or rights broader than the job needs. Controls: HS-IAM-03 Joiner, mover and leaver process; HS-IAM-02 Least privilege and role-based access
- **Copy or browse the data** (prevent, all): Forwards files to personal email, cloud storage or USB. Controls: HS-DAT-03 Data loss prevention and minimisation
- **Unusual access noticed** (detect, all): Counts on access logs that nobody reviews. Controls: HS-MON-02 Threat detection and alert response; HS-MON-01 Centralised logging and SIEM
- **Investigate and notify** (recover, all): Leaves before anyone notices. Controls: HS-IR-01 Incident response plan; HS-IR-03 Breach notification and communication

### Card skimming on your website (TS-WEBSKIM)

*Your payment page can be stealing cards while every system reports green.*

Attackers inject a few lines of JavaScript into the checkout page, directly or through a compromised analytics, chat or plugin script. Every customer's card details are copied to the attacker as they type. Sites often run like this for months.

Relevance: default low, retail high, hospitality high · applies to: retail, hospitality or matching profile

- **Change the scripts on your site** (prevent, all): Exploits a vulnerable plugin or compromises a third-party script your page loads. Controls: HS-APP-01 Secure development lifecycle; HS-TPR-01 Third-party security risk management; HS-VUL-01 Vulnerability scanning and testing
- **Capture card details** (prevent, all): Reads card fields as customers type them into your page. Controls: HS-PAY-01 Payment and transaction security
- **Script change noticed** (detect, all): Relies on nobody checking whether payment page scripts changed. Controls: HS-MON-02 Threat detection and alert response
- **Notify and limit harm** (recover, all): Sells the cards before the breach is found. Controls: HS-IR-03 Breach notification and communication

Public incidents:
- British Airways (2018): Malicious code on the booking site captured payment details of about 429,000 customers and staff; the UK regulator fined the airline £20 million.

### Payment terminals and store systems compromised (TS-POS)

*Card-stealing malware has run inside hotel bars and store tills for months without anyone noticing.*

An attacker gets into a store or property network, often through a maintenance vendor or a device still using its default password, then reaches the payment systems and installs malware that collects card data as cards are used.

Relevance: default low, retail high, hospitality high · applies to: retail, hospitality

- **Get into the store network** (prevent, all): Uses vendor remote access or a device with a default password. Controls: HS-NET-03 Secure remote access; HS-IAM-05 Credential and password hygiene
- **Reach the payment systems** (prevent, all): Moves from back-office PCs or guest networks to payment terminals. Controls: HS-NET-01 Network segmentation
- **Collect card data** (prevent, all): Installs malware on outdated terminals or fits skimmers. Controls: HS-PAY-01 Payment and transaction security; HS-VUL-02 Patch and change management; HS-PHY-01 Physical access control
- **Malware noticed** (detect, all): Runs quietly while transactions look normal. Controls: HS-MON-02 Threat detection and alert response

Public incidents:
- Hyatt Hotels (2015): Malware on payment systems in restaurants and other outlets affected about 250 hotels.

### A cyber attack that stops operations or equipment (TS-OT)

*Most attacks that stop plants never touch the machines. They hit the IT systems the plant cannot run without.*

Ransomware enters through the office network and either spreads into production, or forces you to stop because you cannot tell how far it reached, or because scheduling, quality and shipping systems are gone. Vendor remote access straight to equipment is a second way in.

Relevance: default low, manufacturing high, healthcare high, logistics high · applies to: manufacturing, healthcare, logistics or matching profile

- **Cross from IT into operations** (prevent, all): Moves from the office network, or a vendor connection, into the control or device network. Controls: HS-OT-01 OT and connected-device security; HS-NET-01 Network segmentation; HS-NET-03 Secure remote access
- **Disrupt the equipment** (prevent, any): Encrypts operator stations and servers or changes equipment logic from an engineering workstation. Controls: HS-OT-01 OT and connected-device security; HS-IAM-04 Privileged access management
- **Unusual activity noticed** (detect, all): Relies on operational networks having no security monitoring. Controls: HS-MON-02 Threat detection and alert response
- **Keep operating and restore** (recover, all): Leaves you unable to run manually or rebuild controllers quickly. Controls: HS-RES-03 Operating through an IT outage; HS-RES-01 Protected and immutable backups

Public incidents:
- Norsk Hydro (2019): Ransomware hit the aluminium producer's IT network and plants switched to manual operation across the company.
- Colonial Pipeline (2021): The pipeline was shut down as a precaution after ransomware hit business IT systems, not the pipeline controls.

### Compromise through your code or delivery pipeline (TS-CODE)

*If attackers get into your build pipeline, they ship their code to your customers under your name.*

A developer's laptop is infected and their session tokens stolen, a secret is pushed to a public repository, or a malicious open-source package is pulled into a build. Attackers then reach your cloud, your source code and potentially your clients.

Relevance: default low, itservices high, fintech medium · applies to: itservices, fintech or matching profile

- **Steal developer access or poison a dependency** (prevent, all): Steals a session token from a developer laptop, finds a leaked key or plants a malicious package. Controls: HS-APP-01 Secure development lifecycle; HS-IAM-01 Multi-factor authentication; HS-END-01 Endpoint detection and response
- **Take over pipelines and cloud** (prevent, all): Uses broad pipeline and cloud permissions to reach production and client environments. Controls: HS-IAM-04 Privileged access management; HS-CLD-01 Cloud security posture
- **Unusual pipeline activity noticed** (detect, all): Clones repositories and creates access keys without anyone noticing. Controls: HS-MON-02 Threat detection and alert response
- **Rebuild and tell clients** (recover, all): Leaves you rotating every secret and explaining to clients. Controls: HS-RES-01 Protected and immutable backups; HS-IR-03 Breach notification and communication

Public incidents:
- CircleCI (2023): Malware on an engineer's laptop stole a session token; every customer was told to rotate all secrets stored on the platform.
- 3CX (2023): A compromised build environment shipped a trojanised version of the company's desktop app to its customers.

### Fraud through your customers' accounts (TS-CUSTATO)

*Attackers do not need to breach you to steal from your customers. They just log in as them.*

Using passwords leaked from other websites, SIM swaps or one-time codes coaxed out of customers over the phone, fraudsters take over customer accounts and drain balances, loyalty points or stored payment methods. Customers hold you responsible.

Relevance: default low, fintech high, retail medium, hospitality medium · applies to: fintech, retail, hospitality

- **Log in as the customer** (prevent, all): Tries leaked passwords at scale, or tricks the customer into sharing a one-time code. Controls: HS-PAY-01 Payment and transaction security; HS-APP-01 Secure development lifecycle
- **Move money or value** (prevent, all): Adds a new payee or device and transfers funds, points or stored value quickly. Controls: HS-PAY-01 Payment and transaction security
- **Fraud pattern spotted** (detect, any): Counts on transactions not being monitored in real time. Controls: HS-MON-02 Threat detection and alert response; HS-PAY-01 Payment and transaction security
- **Respond to customers** (recover, all): Leaves customers and regulators asking questions. Controls: HS-IR-03 Breach notification and communication

Public incidents:
- 23andMe (2023): Reused passwords gave attackers access to about 14,000 accounts, and through a sharing feature exposed data on about 6.9 million people.

### Confidential data leaking through AI and unapproved apps (TS-AILEAK)

*Your most sensitive documents may already be inside someone else's AI tool.*

Staff paste contracts, source code, patient notes or client documents into free AI chatbots, AI browser extensions and unapproved apps to work faster. Depending on the service, that data may be retained, reviewed or used for training, and it is outside your control.

Relevance: default medium, professional high, itservices high, healthcare medium

- **Staff use unapproved tools** (prevent, any): No attacker needed: unapproved AI services and extensions are free and easy to use. Controls: HS-DAT-05 AI and unapproved application data exposure; HS-AST-02 Software and SaaS inventory
- **Sensitive data is shared** (prevent, any): Confidential content is pasted or uploaded without anyone knowing it is sensitive. Controls: HS-DAT-03 Data loss prevention and minimisation; HS-PPL-01 Security awareness training
- **Usage noticed** (detect, all): Use of new AI services is not monitored. Controls: HS-DAT-05 AI and unapproved application data exposure

Public incidents:
- Samsung (2023): Engineers pasted confidential source code into a public AI chatbot; the company then restricted staff use of generative AI tools.

