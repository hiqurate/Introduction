// ============================================
// HawkSight — Unified Control Library
// Canonical HawkSight controls with many-to-many framework mappings.
// Questionnaire items from every framework and industry pack are mapped
// onto these controls, so one assessment can be reported against
// multiple frameworks without duplicating questionnaires.
//
// Mapping references are indicative crosswalks maintained by HiQurate Ops.
// They support gap analysis and are not a substitute for a certification audit.
// ============================================

(function (root) {
  const FRAMEWORK_REFERENCES = {
    nist_csf_2: { id: 'nist_csf_2', name: 'NIST Cybersecurity Framework', version: '2.0', released: '2024-02-26', publisher: 'NIST' },
    iso27001: { id: 'iso27001', name: 'ISO/IEC 27001 Annex A', version: '2022', released: '2022-10-25', publisher: 'ISO/IEC' },
    cis_v8: { id: 'cis_v8', name: 'CIS Critical Security Controls', version: '8.1', released: '2024-06-24', publisher: 'Center for Internet Security' },
    soc2: { id: 'soc2', name: 'SOC 2 Trust Services Criteria', version: '2017 (rev. 2022)', released: '2022-09-30', publisher: 'AICPA' },
    pci_dss: { id: 'pci_dss', name: 'PCI DSS', version: '4.0.1', released: '2024-06-11', publisher: 'PCI SSC' },
    hipaa: { id: 'hipaa', name: 'HIPAA Security Rule', version: '45 CFR Part 164 Subpart C', released: '2013-01-25', publisher: 'US HHS' },
    dpdp: { id: 'dpdp', name: 'Digital Personal Data Protection Act (India)', version: '2023', released: '2023-08-11', publisher: 'Government of India' },
    gdpr: { id: 'gdpr', name: 'EU General Data Protection Regulation', version: '2016/679', released: '2016-04-27', publisher: 'European Union' }
  };

  const DOMAINS = [
    { id: 'governance', name: 'Governance & Risk Management' },
    { id: 'asset', name: 'Asset Management' },
    { id: 'identity', name: 'Identity & Access Management' },
    { id: 'data', name: 'Data Protection & Privacy' },
    { id: 'endpoint', name: 'Endpoint & Platform Security' },
    { id: 'network', name: 'Network Security' },
    { id: 'vulnerability', name: 'Vulnerability & Patch Management' },
    { id: 'monitoring', name: 'Security Monitoring & Detection' },
    { id: 'incident', name: 'Incident Response' },
    { id: 'resilience', name: 'Backup, Recovery & Continuity' },
    { id: 'thirdparty', name: 'Third-Party & Supply Chain Risk' },
    { id: 'people', name: 'Security Awareness & Training' },
    { id: 'appsec', name: 'Application & Development Security' },
    { id: 'cloud', name: 'Cloud Security' },
    { id: 'physical', name: 'Physical & Environmental Security' },
    { id: 'ot', name: 'OT, IoT & Connected Devices' },
    { id: 'payments', name: 'Payment & Transaction Security' },
    { id: 'secops', name: 'Security Operations Capability' }
  ];

  // Criticality tiers. Weights are defaults; administrators can change them
  // in the scoring configuration console.
  const CRITICALITY_TIERS = {
    critical: { id: 'critical', label: 'Critical', weight: 4, description: 'Safeguards whose absence materially enables a breach or prevents recovery (for example MFA, EDR, offline backups, centralised monitoring). Critical controls are subject to score gating.' },
    high: { id: 'high', label: 'High', weight: 3, description: 'Controls that significantly reduce likelihood or impact of common attack paths.' },
    medium: { id: 'medium', label: 'Medium', weight: 2, description: 'Controls that formalise, standardise or strengthen the security programme.' },
    foundational: { id: 'foundational', label: 'Foundational', weight: 1, description: 'Baseline hygiene, documentation and governance practices expected in any organisation.' }
  };

  // Each control: id, name, domain, criticality, objective, expectedState,
  // evidenceRequired, evidenceExamples, keywords (lower-case phrases used to
  // map questionnaire items), mappings, remediation.
  const CONTROLS = [
    {
      id: 'HS-GOV-01', name: 'Information security policy', domain: 'governance', criticality: 'foundational',
      objective: 'Security expectations are defined, approved by management and communicated.',
      expectedState: 'An approved information security policy set exists, is reviewed at least annually and is acknowledged by the workforce.',
      evidenceRequired: false, evidenceExamples: ['Approved policy document with version history', 'Policy acknowledgement records'],
      keywords: ['security policy', 'information security policy', 'acceptable use', 'acceptable-use', 'policies are established', 'policy defined'],
      mappings: { nist_csf_2: ['GV.PO-01', 'GV.PO-02'], iso27001: ['5.1', '5.10'], cis_v8: ['14.1'], soc2: ['CC5.3'], pci_dss: ['12.1'], hipaa: ['164.316(a)'], dpdp: ['Sec 8(4)'], gdpr: ['Art 24'] },
      remediation: { quickWin: 'Publish a concise top-level security policy approved by senior management.', mediumTerm: 'Develop supporting standards (access, data handling, acceptable use) and collect workforce acknowledgements.', longTerm: 'Establish an annual policy review cycle tied to risk assessment outcomes.', owner: 'CISO / Head of IT', reference: 'ISO/IEC 27001:2022 A.5.1' }
    },
    {
      id: 'HS-GOV-02', name: 'Security roles and accountability', domain: 'governance', criticality: 'medium',
      objective: 'Accountability for cybersecurity is assigned and resourced.',
      expectedState: 'Security roles, responsibilities and escalation paths are documented, with a named accountable executive.',
      evidenceRequired: false, evidenceExamples: ['RACI matrix', 'Organisation chart showing security function', 'Job descriptions'],
      keywords: ['data protection officer', 'privacy lead', 'roles and responsibilities', 'roles & responsibilities', 'security function', 'dedicated security', 'security team', 'privacy officer', 'compliance officer', 'governance structure', 'authority levels', 'charter'],
      mappings: { nist_csf_2: ['GV.RR-01', 'GV.RR-02'], iso27001: ['5.2', '5.3'], cis_v8: ['17.1'], soc2: ['CC1.3'], pci_dss: ['12.4'], hipaa: ['164.308(a)(2)'], dpdp: ['Sec 8(9)'], gdpr: ['Art 37'] },
      remediation: { quickWin: 'Name an accountable owner for cybersecurity and document escalation contacts.', mediumTerm: 'Publish a RACI for security processes across IT, HR, legal and business owners.', longTerm: 'Report security performance to leadership through a standing governance forum.', owner: 'Executive leadership', reference: 'NIST CSF 2.0 GV.RR' }
    },
    {
      id: 'HS-GOV-03', name: 'Cyber risk assessment', domain: 'governance', criticality: 'high',
      objective: 'Cyber risks are identified, analysed and prioritised using a repeatable method.',
      expectedState: 'A documented risk assessment is performed at least annually and when significant change occurs, with a maintained risk register.',
      evidenceRequired: true, evidenceExamples: ['Risk register', 'Risk assessment methodology', 'Most recent risk assessment report'],
      keywords: ['cyber insurance', 'risk assessment', 'risk management process', 'risk tolerance', 'risk responses', 'business impact', 'likelihoods', 'determine risk', 'threat modeling', 'threats, both internal', 'risk analysis'],
      mappings: { nist_csf_2: ['ID.RA-04', 'ID.RA-05', 'GV.RM-01'], iso27001: ['5.7', '6.1 (clause)'], cis_v8: ['—'], soc2: ['CC3.1', 'CC3.2'], pci_dss: ['12.3.1'], hipaa: ['164.308(a)(1)(ii)(A)', '164.308(a)(1)(ii)(B)'], dpdp: ['Sec 10(2)(c)'], gdpr: ['Art 32(1)', 'Art 35'] },
      remediation: { quickWin: 'Run a facilitated risk workshop covering the top ten business-critical services.', mediumTerm: 'Adopt a documented risk methodology and maintain a risk register with owners and treatment plans.', longTerm: 'Integrate cyber risk into enterprise risk reporting with defined risk appetite.', owner: 'Risk / Compliance lead', reference: 'NIST CSF 2.0 ID.RA' }
    },
    {
      id: 'HS-GOV-04', name: 'Regulatory and contractual compliance', domain: 'governance', criticality: 'medium',
      objective: 'Applicable legal, regulatory and contractual security obligations are known and tracked.',
      expectedState: 'An obligations register exists, owners are assigned and compliance is reviewed periodically.',
      evidenceRequired: false, evidenceExamples: ['Obligations register', 'Compliance review minutes', 'Audit reports'],
      keywords: ['legal and regulatory', 'regulatory', 'compliance program', 'compliant with', 'comply with', 'pci-dss (self', 'hipaa/pdpa', 'ferpa', 'financial regulations', 'compliance drivers'],
      mappings: { nist_csf_2: ['GV.OC-03'], iso27001: ['5.31', '5.36'], cis_v8: ['—'], soc2: ['CC2.3'], pci_dss: ['12.4'], hipaa: ['164.316'], dpdp: ['Sec 8(1)'], gdpr: ['Art 5(2)'] },
      remediation: { quickWin: 'List applicable regulations and contractual security clauses with an owner for each.', mediumTerm: 'Map obligations to controls and track compliance status.', longTerm: 'Schedule independent compliance reviews aligned to regulatory cycles.', owner: 'Compliance officer', reference: 'ISO/IEC 27001:2022 A.5.31' }
    },
    {
      id: 'HS-GOV-05', name: 'Independent security assurance', domain: 'governance', criticality: 'medium',
      objective: 'Security controls are independently tested and findings are tracked to closure.',
      expectedState: 'Periodic internal or external audits are performed and findings are remediated within defined SLAs.',
      evidenceRequired: true, evidenceExamples: ['Audit reports', 'Findings tracker with closure evidence'],
      keywords: ['certification for client assurance', 'security questionnaires', 'security audits', 'audited for security', 'independent assessment', 'external audit', 'audit findings', 'red-team', 'fraud/security audits'],
      mappings: { nist_csf_2: ['GV.OV-01', 'ID.IM-02'], iso27001: ['5.35'], cis_v8: ['18.1'], soc2: ['CC4.1'], pci_dss: ['12.4.2'], hipaa: ['164.308(a)(8)'], dpdp: ['Sec 10(2)(b)'], gdpr: ['Art 32(1)(d)'] },
      remediation: { quickWin: 'Consolidate open audit findings into a single tracker with owners and due dates.', mediumTerm: 'Commission an independent security review of the highest-risk systems.', longTerm: 'Establish an annual assurance plan covering technical testing and process audits.', owner: 'Internal audit / CISO', reference: 'ISO/IEC 27001:2022 A.5.35' }
    },
    {
      id: 'HS-GOV-06', name: 'Security metrics and management oversight', domain: 'governance', criticality: 'foundational',
      objective: 'Leadership receives meaningful information on cyber risk and programme performance.',
      expectedState: 'Defined security metrics are reported to management at a regular cadence and drive decisions.',
      evidenceRequired: false, evidenceExamples: ['Security dashboard or board pack', 'Meeting minutes'],
      keywords: ['metrics', 'kpi', 'management oversight', 'risk reporting', 'business drivers', 'mission', 'priorities for organizational', 'service catalogue', 'stakeholders'],
      mappings: { nist_csf_2: ['GV.OV-02', 'GV.OC-01'], iso27001: ['9.1 (clause)'], cis_v8: ['—'], soc2: ['CC4.2'], pci_dss: ['12.4.1'], hipaa: ['164.308(a)(1)'], dpdp: ['—'], gdpr: ['Art 24'] },
      remediation: { quickWin: 'Agree five to eight security metrics with leadership.', mediumTerm: 'Produce a quarterly security report with trends and decisions required.', longTerm: 'Link metrics to risk appetite thresholds and budget planning.', owner: 'CISO', reference: 'NIST CSF 2.0 GV.OV' }
    },
    {
      id: 'HS-AST-01', name: 'Hardware and device inventory', domain: 'asset', criticality: 'high',
      objective: 'All enterprise devices are known so they can be protected.',
      expectedState: 'An accurate, regularly reconciled inventory of devices exists, ideally maintained through automated discovery.',
      evidenceRequired: true, evidenceExamples: ['Asset register export', 'Discovery tool report'],
      keywords: ['asset inventory', 'discovering new devices', 'inventory of all', 'devices and systems within the organization are inventoried', 'asset register', 'inventoried', 'inventory of all store', 'device inventory', 'unauthorized devices', 'connected medical devices'],
      mappings: { nist_csf_2: ['ID.AM-01'], iso27001: ['5.9'], cis_v8: ['1.1', '1.2'], soc2: ['CC6.1'], pci_dss: ['12.5.1'], hipaa: ['164.310(d)(1)'], dpdp: ['—'], gdpr: ['Art 30'] },
      remediation: { quickWin: 'Export device lists from directory, MDM and network tools into one register.', mediumTerm: 'Deploy automated discovery and reconcile the inventory monthly.', longTerm: 'Integrate inventory with vulnerability and configuration management.', owner: 'IT Operations', reference: 'CIS Controls v8 Control 1' }
    },
    {
      id: 'HS-AST-02', name: 'Software and SaaS inventory', domain: 'asset', criticality: 'medium',
      objective: 'Authorised software and SaaS services are known; unauthorised software is identified.',
      expectedState: 'A software and SaaS inventory exists with an approval process for new applications.',
      evidenceRequired: false, evidenceExamples: ['Software inventory', 'Approved application list'],
      keywords: ['software platforms', 'inventory of all software', 'software inventory', 'approved list of corporate apps', 'unsanctioned saas', 'unauthorized saas', 'new saas tools', 'shadow it'],
      mappings: { nist_csf_2: ['ID.AM-02'], iso27001: ['5.9', '8.19'], cis_v8: ['2.1', '2.3'], soc2: ['CC6.8'], pci_dss: ['6.3.2'], hipaa: ['—'], dpdp: ['—'], gdpr: ['Art 30'] },
      remediation: { quickWin: 'Pull a list of installed software and SaaS sign-ups from SSO and finance records.', mediumTerm: 'Introduce an application approval process and block unapproved installs.', longTerm: 'Monitor SaaS usage continuously through CASB or SSO analytics.', owner: 'IT Operations', reference: 'CIS Controls v8 Control 2' }
    },
    {
      id: 'HS-AST-03', name: 'Data inventory and classification', domain: 'data', criticality: 'high',
      objective: 'Sensitive data is identified, classified and handled according to its sensitivity.',
      expectedState: 'A classification scheme is in place, sensitive data stores are known and data flows are mapped.',
      evidenceRequired: false, evidenceExamples: ['Classification policy', 'Data inventory', 'Data flow diagrams'],
      keywords: ['classif', 'data flows', 'data flow', 'sensitivity level', 'resources are prioritized'],
      mappings: { nist_csf_2: ['ID.AM-07', 'ID.AM-03', 'ID.AM-05'], iso27001: ['5.12', '5.13'], cis_v8: ['3.1', '3.2', '3.7'], soc2: ['C1.1'], pci_dss: ['12.5.2'], hipaa: ['164.308(a)(1)(ii)(A)'], dpdp: ['Sec 8(4)'], gdpr: ['Art 30'] },
      remediation: { quickWin: 'Agree a three or four level classification scheme and label the main data stores.', mediumTerm: 'Build a data inventory showing where regulated data is stored and processed.', longTerm: 'Automate discovery and labelling of sensitive data.', owner: 'Data owner / DPO', reference: 'ISO/IEC 27001:2022 A.5.12' }
    },
    {
      id: 'HS-IAM-01', name: 'Multi-factor authentication', domain: 'identity', criticality: 'critical',
      objective: 'Account takeover through stolen or guessed credentials is prevented.',
      expectedState: 'MFA is enforced for all remote access, cloud consoles, email and privileged accounts.',
      evidenceRequired: true, evidenceExamples: ['Identity provider MFA policy export', 'Conditional access policy screenshot', 'MFA enrolment report'],
      keywords: ['multi-factor auth', 'use 2fa', 'mfa', 'multi-factor', 'multi factor', 'two-factor', '2fa', 'hardware mfa'],
      mappings: { nist_csf_2: ['PR.AA-03'], iso27001: ['8.5'], cis_v8: ['6.3', '6.4', '6.5'], soc2: ['CC6.1'], pci_dss: ['8.4.1', '8.4.2', '8.4.3'], hipaa: ['164.312(d)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32(1)(b)'] },
      remediation: { quickWin: 'Enforce MFA for all administrator and remote access accounts immediately.', mediumTerm: 'Extend MFA to all users for email, SaaS and VPN with conditional access.', longTerm: 'Adopt phishing-resistant MFA (FIDO2) for privileged users.', owner: 'Identity / IT Security', reference: 'CIS Controls v8 Safeguards 6.3–6.5' }
    },
    {
      id: 'HS-IAM-02', name: 'Least privilege and role-based access', domain: 'identity', criticality: 'high',
      objective: 'Users have only the access their role requires.',
      expectedState: 'Access is granted through defined roles with approval, and segregation of duties is enforced for sensitive functions.',
      evidenceRequired: false, evidenceExamples: ['Role matrix', 'Access request approvals', 'SoD rule set'],
      keywords: ['least functionality', 'ethical walls', 'information barriers', 'role-based', 'rbac', 'least privilege', 'least-privilege', 'segregation of duties', 'restricted based on', 'restricted by role', 'access permissions', 'elevated access', 'need-to-know', 'separate accounts'],
      mappings: { nist_csf_2: ['PR.AA-05'], iso27001: ['5.15', '5.18', '8.3'], cis_v8: ['6.8'], soc2: ['CC6.3'], pci_dss: ['7.2'], hipaa: ['164.308(a)(4)', '164.312(a)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 25', 'Art 32'] },
      remediation: { quickWin: 'Remove standing administrator rights from day-to-day user accounts.', mediumTerm: 'Define role profiles for key systems and route access through an approval workflow.', longTerm: 'Automate provisioning from HR events and enforce segregation of duties rules.', owner: 'IT / Application owners', reference: 'ISO/IEC 27001:2022 A.5.15' }
    },
    {
      id: 'HS-IAM-03', name: 'Joiner, mover and leaver process', domain: 'identity', criticality: 'high',
      objective: 'Access is removed promptly when people leave or change roles.',
      expectedState: 'Leaver access is revoked within one business day and access is recertified at least quarterly for critical systems.',
      evidenceRequired: true, evidenceExamples: ['Leaver checklist with timestamps', 'Access review sign-off'],
      keywords: ['granting and revoking', 'revoked', 'deactivated', 'access reviews', 'access rights reviewed', 'off-boarding', 'terminated', 'leave or change roles', 'quarterly access review', 'inactive'],
      mappings: { nist_csf_2: ['PR.AA-01', 'PR.AA-05'], iso27001: ['5.16', '5.18'], cis_v8: ['5.3', '6.2'], soc2: ['CC6.2', 'CC6.3'], pci_dss: ['8.2.5', '8.2.6', '7.2.4'], hipaa: ['164.308(a)(3)(ii)(C)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Run an immediate review of active accounts against the HR leaver list.', mediumTerm: 'Link HR exits to automatic account disablement and perform quarterly access reviews.', longTerm: 'Implement identity governance with certification campaigns.', owner: 'HR and IT', reference: 'CIS Controls v8 Safeguard 5.3' }
    },
    {
      id: 'HS-IAM-04', name: 'Privileged access management', domain: 'identity', criticality: 'critical',
      objective: 'Administrative accounts are tightly controlled and monitored.',
      expectedState: 'Privileged accounts are inventoried, separated from daily accounts, protected with MFA and their sessions are logged.',
      evidenceRequired: true, evidenceExamples: ['Privileged account inventory', 'PAM session logs', 'Admin group membership review'],
      keywords: ['privileged', 'administrative access', 'admin account', 'pam', 'root/owner', 'local admin', 'administrative actions', 'dba'],
      mappings: { nist_csf_2: ['PR.AA-05', 'PR.PS-04'], iso27001: ['8.2', '8.18'], cis_v8: ['5.4', '6.5'], soc2: ['CC6.1', 'CC6.3'], pci_dss: ['7.2.2', '8.2.2', '10.2.1.2'], hipaa: ['164.312(a)(1)', '164.312(b)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Inventory privileged accounts and remove unnecessary administrators.', mediumTerm: 'Separate admin accounts from daily accounts and require MFA for all privileged access.', longTerm: 'Deploy PAM with session recording and just-in-time elevation.', owner: 'IT Security', reference: 'ISO/IEC 27001:2022 A.8.2' }
    },
    {
      id: 'HS-IAM-05', name: 'Credential and password hygiene', domain: 'identity', criticality: 'medium',
      objective: 'Credentials are strong, unique and not left at defaults.',
      expectedState: 'Default credentials are changed before deployment, password standards are enforced and service account secrets are rotated.',
      evidenceRequired: false, evidenceExamples: ['Password policy configuration', 'Hardening checklist', 'Secrets rotation log'],
      keywords: ['identities and credentials', 'passwords on guest', 'login credentials', 'shared accounts', 'individual credentials', 'sharing passwords', 'default credentials', 'default passwords', 'password polic', 'strong password', 'service/system accounts', 'service account', 'shared/generic accounts', 'secrets', 'failed login', 'session timeouts', 'auto-logout', 'single sign-on', 'sso'],
      mappings: { nist_csf_2: ['PR.AA-01', 'PR.AA-03'], iso27001: ['5.17', '8.5'], cis_v8: ['4.7', '5.2'], soc2: ['CC6.1'], pci_dss: ['2.2.2', '8.3.6', '8.6'], hipaa: ['164.308(a)(5)(ii)(D)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Change all default credentials on network and line-of-business devices.', mediumTerm: 'Enforce a password standard via the identity provider and vault service account secrets.', longTerm: 'Move to SSO with passwordless authentication where supported.', owner: 'IT Operations', reference: 'CIS Controls v8 Safeguard 4.7' }
    },
    {
      id: 'HS-IAM-06', name: 'Account recovery and helpdesk verification', domain: 'identity', criticality: 'high',
      objective: 'Attackers cannot take over an account by impersonating an employee to the helpdesk.',
      expectedState: 'Identity is verified through an independent channel before any password reset or MFA change, privileged resets need additional approval, the same rules bind any outsourced helpdesk, and every change is alerted.',
      evidenceRequired: false, evidenceExamples: ['Helpdesk reset procedure', 'Sample of recent reset tickets showing verification', 'Outsourced service desk contract clauses'],
      keywords: ['helpdesk', 'help desk', 'service desk', 'password reset', 'mfa reset'],
      mappings: { nist_csf_2: ['PR.AA-02'], iso27001: ['5.16', '5.17'], cis_v8: ['—'], soc2: ['CC6.2'], pci_dss: ['8.3.3'], hipaa: ['164.312(d)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Require a call-back to the number held in HR records before any password or MFA reset, and notify the user of every change.', mediumTerm: 'Add manager approval and stronger verification for privileged accounts, apply the same rules to any outsourced helpdesk and audit a sample of resets monthly.', longTerm: 'Move to verified self-service recovery with phishing-resistant authenticators and alert security on every MFA registration.', owner: 'IT service desk / Identity', reference: 'PCI DSS 4.0.1 Req. 8.3.3' }
    },
    {
      id: 'HS-IAM-07', name: 'Directory and identity infrastructure protection', domain: 'identity', criticality: 'high',
      objective: 'An attacker on one device cannot escalate to control of the whole directory.',
      expectedState: 'Active Directory and cloud identity are assessed regularly for escalation paths, legacy authentication is disabled, local administrator passwords are unique and administration follows a tiered model.',
      evidenceRequired: true, evidenceExamples: ['Directory security assessment report (e.g. PingCastle, Purple Knight)', 'Legacy authentication policy', 'LAPS deployment report'],
      keywords: ['active directory', 'entra id', 'domain controller', 'legacy authentication'],
      mappings: { nist_csf_2: ['PR.AA-05', 'PR.PS-01'], iso27001: ['8.2', '8.5', '8.9'], cis_v8: ['5.4', '12.8'], soc2: ['CC6.1'], pci_dss: ['7.2', '8.6'], hipaa: ['164.312(a)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Run a free directory security assessment (e.g. PingCastle or Purple Knight) and fix the highest-risk findings.', mediumTerm: 'Disable legacy authentication, remove stale admin and service accounts and deploy unique local administrator passwords (LAPS).', longTerm: 'Implement an administrative tier model with dedicated admin workstations and a tested identity recovery plan.', owner: 'Identity / Infrastructure', reference: 'CIS Controls v8.1 Safeguard 5.4' }
    },
    {
      id: 'HS-DAT-01', name: 'Encryption of data at rest', domain: 'data', criticality: 'high',
      objective: 'Sensitive data remains protected if storage or devices are lost or accessed without authorisation.',
      expectedState: 'Sensitive databases, file stores, laptops and removable media are encrypted, with keys managed centrally.',
      evidenceRequired: true, evidenceExamples: ['Disk encryption compliance report', 'Database encryption configuration', 'KMS key policy'],
      keywords: ['encrypted in storage', 'encrypted and access', 'data-at-rest', 'encrypt', 'full-disk', 'key management', 'encryption keys', 'hsm', 'kms'],
      mappings: { nist_csf_2: ['PR.DS-01'], iso27001: ['8.24'], cis_v8: ['3.6', '3.11'], soc2: ['CC6.1', 'C1.1'], pci_dss: ['3.5.1', '3.6'], hipaa: ['164.312(a)(2)(iv)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32(1)(a)'] },
      remediation: { quickWin: 'Enable full-disk encryption on all laptops through MDM.', mediumTerm: 'Encrypt databases and backups holding regulated data and centralise key management.', longTerm: 'Apply key rotation and separation of duties for key custodians.', owner: 'IT Security', reference: 'ISO/IEC 27001:2022 A.8.24' }
    },
    {
      id: 'HS-DAT-02', name: 'Encryption of data in transit', domain: 'data', criticality: 'high',
      objective: 'Data cannot be intercepted or altered in transit.',
      expectedState: 'TLS 1.2 or higher is enforced on all external services and APIs; legacy protocols are disabled.',
      evidenceRequired: false, evidenceExamples: ['External TLS scan results', 'Load balancer configuration'],
      keywords: ['data-in-transit', 'wpa', 'tls', 'in transit', 'point-to-point encryption', 'p2pe', 'email encryption'],
      mappings: { nist_csf_2: ['PR.DS-02'], iso27001: ['8.24', '5.14'], cis_v8: ['3.10'], soc2: ['CC6.7'], pci_dss: ['4.2.1'], hipaa: ['164.312(e)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32(1)(a)'] },
      remediation: { quickWin: 'Scan external endpoints and disable TLS 1.0/1.1 and weak ciphers.', mediumTerm: 'Enforce TLS for internal service-to-service traffic carrying sensitive data.', longTerm: 'Automate certificate lifecycle management.', owner: 'Infrastructure', reference: 'PCI DSS 4.0.1 Req. 4.2' }
    },
    {
      id: 'HS-DAT-03', name: 'Data loss prevention and minimisation', domain: 'data', criticality: 'medium',
      objective: 'Sensitive data is retained only as needed and cannot easily leave the organisation.',
      expectedState: 'Retention schedules are enforced, sensitive data is masked or tokenised, and egress channels are monitored.',
      evidenceRequired: false, evidenceExamples: ['Retention schedule', 'DLP policy configuration', 'Tokenisation design'],
      keywords: ['decommissioned securely', 'removal, transfers', 'data leaks', 'dlp', 'data loss', 'retention', 'disposal', 'tokeniz', 'masked', 'masking', 'truncated', 'anonymized', 'file sharing', 'external sharing', 'usb ports', 'removable media', 'stored only where', 'production data environments'],
      mappings: { nist_csf_2: ['PR.DS-01', 'PR.DS-10'], iso27001: ['8.10', '8.11', '8.12'], cis_v8: ['3.1', '3.4', '3.13'], soc2: ['C1.2'], pci_dss: ['3.2.1', '3.4.1'], hipaa: ['164.310(d)(2)'], dpdp: ['Sec 8(7)'], gdpr: ['Art 5(1)(c)', 'Art 5(1)(e)'] },
      remediation: { quickWin: 'Restrict USB storage and external sharing for users handling regulated data.', mediumTerm: 'Define retention schedules and mask sensitive values in non-production systems and logs.', longTerm: 'Deploy DLP across email, endpoint and cloud storage with incident workflows.', owner: 'Data owner / IT Security', reference: 'ISO/IEC 27001:2022 A.8.12' }
    },
    {
      id: 'HS-DAT-04', name: 'Privacy rights and consent', domain: 'data', criticality: 'medium',
      objective: 'Personal data is processed lawfully and individuals can exercise their rights.',
      expectedState: 'Consent and notice are captured, data principal requests are handled within statutory timelines and minors\' data receives additional protection.',
      evidenceRequired: false, evidenceExamples: ['Privacy notice', 'Consent records', 'Data subject request log'],
      keywords: ['consent', 'request deletion', 'personal data of minors', 'student data privacy', 'privacy regulations', 'edtech vendors assessed for data privacy'],
      mappings: { nist_csf_2: ['GV.OC-03'], iso27001: ['5.34'], cis_v8: ['—'], soc2: ['P2.1', 'P4.1'], pci_dss: ['—'], hipaa: ['—'], dpdp: ['Sec 5', 'Sec 6', 'Sec 9', 'Sec 12'], gdpr: ['Art 6', 'Art 7', 'Art 17'] },
      remediation: { quickWin: 'Publish a privacy notice and record consent at every collection point.', mediumTerm: 'Implement a tracked process for access, correction and erasure requests.', longTerm: 'Embed privacy-by-design reviews into new projects.', owner: 'DPO / Legal', reference: 'DPDP Act 2023 Sec 6' }
    },
    {
      id: 'HS-DAT-05', name: 'AI and unapproved application data exposure', domain: 'data', criticality: 'medium',
      objective: 'Confidential data does not leak through AI tools, browser extensions or applications the organisation has not approved.',
      expectedState: 'Approved AI and SaaS tools are defined with data protection terms, staff know what may never be entered, and unapproved services are detected or blocked.',
      evidenceRequired: false, evidenceExamples: ['AI acceptable-use rule', 'Approved AI tool list and contract terms', 'Web filter or CASB report of AI service usage'],
      keywords: ['ai tools', 'chatgpt', 'generative ai', 'copilot'],
      mappings: { nist_csf_2: ['GV.PO-01', 'PR.DS-01'], iso27001: ['5.10', '5.23'], cis_v8: ['2.3'], soc2: ['CC6.7'], pci_dss: ['—'], hipaa: ['—'], dpdp: ['Sec 8(5)'], gdpr: ['Art 28', 'Art 32'] },
      remediation: { quickWin: 'Publish a one-page rule on which AI tools are approved and what data must never be entered.', mediumTerm: 'Provide an approved enterprise AI tool with data protection terms and block or monitor unapproved AI services and browser extensions.', longTerm: 'Include AI services in the SaaS inventory and supplier assessments and review usage quarterly.', owner: 'CIO / DPO', reference: 'ISO/IEC 27001:2022 A.5.10' }
    },
    {
      id: 'HS-END-01', name: 'Endpoint detection and response', domain: 'endpoint', criticality: 'critical',
      objective: 'Malware and hands-on-keyboard attacks on endpoints are detected and contained.',
      expectedState: 'EDR or behaviour-based protection is deployed on all workstations and servers, centrally managed and monitored.',
      evidenceRequired: true, evidenceExamples: ['EDR console coverage report', 'Policy configuration', 'Sample alert handling record'],
      keywords: ['malicious code', 'mobile code', 'edr', 'xdr', 'endpoint detection', 'antivirus', 'anti-virus', 'endpoint protection', 'malware', 'behavior-based', 'behaviour-based'],
      mappings: { nist_csf_2: ['DE.CM-09', 'PR.PS-05'], iso27001: ['8.7'], cis_v8: ['10.1', '10.2', '13.2'], soc2: ['CC6.8'], pci_dss: ['5.2.1', '5.3.1'], hipaa: ['164.308(a)(5)(ii)(B)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Identify unmanaged endpoints and close coverage gaps in the existing tool.', mediumTerm: 'Deploy EDR across all endpoints and servers with alerts routed to a monitored queue.', longTerm: 'Integrate EDR with SIEM and enable automated isolation playbooks.', owner: 'IT Security', reference: 'CIS Controls v8 Control 10' }
    },
    {
      id: 'HS-END-02', name: 'Device management and hardening', domain: 'endpoint', criticality: 'medium',
      objective: 'Devices are configured securely and remain under organisational control.',
      expectedState: 'Devices are enrolled in management, follow a secure baseline, lock automatically and can be wiped remotely.',
      evidenceRequired: false, evidenceExamples: ['MDM compliance report', 'Configuration baseline', 'Screen lock policy'],
      keywords: ['mdm-managed', 'baseline configuration', 'mdm', 'managed/secured', 'devices are encrypted and managed', 'byod', 'screen lock', 'remote wipe', 'host-based firewall', 'secure configuration', 'clean state', 'workstations configured', 'positioned to prevent screen', 'configuration management'],
      mappings: { nist_csf_2: ['PR.PS-01'], iso27001: ['8.1', '8.9'], cis_v8: ['4.1', '4.3', '4.10'], soc2: ['CC6.8', 'CC7.1'], pci_dss: ['2.2'], hipaa: ['164.310(b)', '164.310(c)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Enforce screen lock and disk encryption through existing management tooling.', mediumTerm: 'Enrol all corporate devices in MDM and apply a CIS-aligned baseline.', longTerm: 'Monitor configuration drift continuously and remediate automatically.', owner: 'IT Operations', reference: 'CIS Controls v8 Control 4' }
    },
    {
      id: 'HS-END-03', name: 'Email and web threat protection', domain: 'endpoint', criticality: 'high',
      objective: 'Phishing, spoofing and malicious web content are filtered before reaching users.',
      expectedState: 'Email filtering, SPF/DKIM/DMARC enforcement and DNS or web filtering are in place, with an easy reporting path for users.',
      evidenceRequired: false, evidenceExamples: ['DMARC policy record', 'Email gateway configuration', 'DNS filtering report'],
      keywords: ['email filtering', 'email security', 'spf', 'dkim', 'dmarc', 'suspicious emails', 'web content filtering', 'dns filtering', 'malicious domains', 'cloud email'],
      mappings: { nist_csf_2: ['PR.PS-05', 'DE.CM-01'], iso27001: ['8.23', '5.14'], cis_v8: ['9.2', '9.3', '9.5', '9.6'], soc2: ['CC6.8'], pci_dss: ['5.4.1'], hipaa: ['164.308(a)(5)(ii)(B)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Publish SPF and DKIM and move DMARC to quarantine after monitoring.', mediumTerm: 'Enable advanced email filtering and a phishing report button.', longTerm: 'Add DNS-layer protection and browser isolation for high-risk users.', owner: 'IT Operations', reference: 'CIS Controls v8 Control 9' }
    },
    {
      id: 'HS-NET-01', name: 'Network segmentation', domain: 'network', criticality: 'critical',
      objective: 'Compromise of one zone does not give attackers free movement to critical systems.',
      expectedState: 'Critical systems, payment, clinical, OT and guest networks are separated with enforced, reviewed rules.',
      evidenceRequired: true, evidenceExamples: ['Network diagram', 'Firewall/VLAN rule export', 'Segmentation test results'],
      keywords: ['segment', 'segregat', 'vlan', 'dmz', 'isolated from', 'guest wi-fi', 'guest/customer wi-fi', 'micro-segmentation', 'air-gapped', 'east-west'],
      mappings: { nist_csf_2: ['PR.IR-01'], iso27001: ['8.22'], cis_v8: ['12.2', '13.4'], soc2: ['CC6.6'], pci_dss: ['1.2', '1.3', '1.4'], hipaa: ['164.312(e)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Isolate guest Wi-Fi and restrict management interfaces to an admin network.', mediumTerm: 'Segment critical, payment, clinical or OT systems with deny-by-default rules.', longTerm: 'Validate segmentation annually through testing and adopt micro-segmentation for high-value assets.', owner: 'Network team', reference: 'ISO/IEC 27001:2022 A.8.22' }
    },
    {
      id: 'HS-NET-02', name: 'Perimeter and firewall management', domain: 'network', criticality: 'high',
      objective: 'Network boundaries enforce only approved traffic.',
      expectedState: 'Firewall and WAF rules are documented, reviewed at least every six months and unnecessary rules are removed.',
      evidenceRequired: false, evidenceExamples: ['Firewall rule review record', 'WAF policy'],
      keywords: ['control networks are protected', 'firewall', 'waf', 'web application firewall', 'network diagrams', 'nac', 'perimeter'],
      mappings: { nist_csf_2: ['PR.IR-01', 'PR.PS-01'], iso27001: ['8.20', '8.21'], cis_v8: ['4.4', '12.1', '13.10'], soc2: ['CC6.6'], pci_dss: ['1.2.7', '6.4.2'], hipaa: ['164.312(e)(1)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Review internet-facing rules and close unused inbound ports.', mediumTerm: 'Establish a semi-annual rule review with documented business justification.', longTerm: 'Automate rule analysis and change approval.', owner: 'Network team', reference: 'PCI DSS 4.0.1 Req. 1.2.7' }
    },
    {
      id: 'HS-NET-03', name: 'Secure remote access', domain: 'network', criticality: 'high',
      objective: 'Remote users and vendors connect securely and only to what they need.',
      expectedState: 'Remote access uses VPN or zero-trust access with MFA; vendor access is time-bound, approved and recorded.',
      evidenceRequired: false, evidenceExamples: ['Remote access policy', 'Vendor access logs'],
      keywords: ['time-limited', 'remote access', 'vpn', 'zero-trust', 'remote maintenance', 'vendor remote access', 'remote/vpn', 'remote employees', 'remote depots'],
      mappings: { nist_csf_2: ['PR.AA-05', 'PR.IR-01'], iso27001: ['6.7', '8.20'], cis_v8: ['6.4', '12.7'], soc2: ['CC6.6'], pci_dss: ['8.4.3', '8.2.7'], hipaa: ['164.312(d)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Disable persistent vendor connections and require MFA for VPN.', mediumTerm: 'Introduce approval and time-boxing for vendor remote sessions.', longTerm: 'Move to zero-trust network access with device posture checks.', owner: 'Network / IT Security', reference: 'CIS Controls v8 Safeguard 12.7' }
    },
    {
      id: 'HS-VUL-01', name: 'Vulnerability scanning and testing', domain: 'vulnerability', criticality: 'critical',
      objective: 'Technical weaknesses are found before attackers find them.',
      expectedState: 'Authenticated vulnerability scans run at least monthly (internal) and quarterly (external), with annual penetration testing of critical systems.',
      evidenceRequired: true, evidenceExamples: ['Latest scan reports', 'Penetration test report', 'Scan schedule'],
      keywords: ['scanning vendor', 'vulnerability management plan', 'vulnerability scan', 'vulnerability assessment', 'vulnerabilities are identified', 'penetration test', 'pentest', 'asv', 'vulnerability management program', 'vulnerability scanning', 'security testing', 'owasp api'],
      mappings: { nist_csf_2: ['ID.RA-01', 'DE.CM-08'], iso27001: ['8.8', '8.29'], cis_v8: ['7.1', '7.5', '7.6', '18.2'], soc2: ['CC7.1'], pci_dss: ['11.3.1', '11.3.2', '11.4.1'], hipaa: ['164.308(a)(1)(ii)(A)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32(1)(d)'] },
      remediation: { quickWin: 'Run an external vulnerability scan of all internet-facing assets this week.', mediumTerm: 'Schedule recurring authenticated internal scans with risk-based remediation SLAs.', longTerm: 'Commission annual penetration tests and track findings to closure.', owner: 'IT Security', reference: 'CIS Controls v8 Control 7' }
    },
    {
      id: 'HS-VUL-02', name: 'Patch and change management', domain: 'vulnerability', criticality: 'high',
      objective: 'Known vulnerabilities are remediated within defined timeframes without destabilising operations.',
      expectedState: 'Critical patches are applied within 14 days, others within 30 days; changes follow an approved, tested process; unsupported systems have compensating controls.',
      evidenceRequired: true, evidenceExamples: ['Patch compliance report', 'Change records', 'Exception register for legacy systems'],
      keywords: ['newly identified vulnerabilities', 'change control', 'patched within', 'patch', 'firmware', 'updated', 'update/patch', 'end-of-life', 'legacy', 'change management', 'staging environment', 'remediat', 'decommissioned'],
      mappings: { nist_csf_2: ['PR.PS-02', 'ID.RA-06'], iso27001: ['8.8', '8.32'], cis_v8: ['7.3', '7.4', '7.7'], soc2: ['CC8.1', 'CC7.1'], pci_dss: ['6.3.3', '6.5.1'], hipaa: ['164.308(a)(1)(ii)(B)'], dpdp: ['—'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Apply outstanding critical patches on internet-facing systems.', mediumTerm: 'Define patch SLAs by severity and report compliance monthly.', longTerm: 'Automate patch deployment and retire unsupported platforms.', owner: 'IT Operations', reference: 'PCI DSS 4.0.1 Req. 6.3.3' }
    },
    {
      id: 'HS-VUL-03', name: 'External attack surface and edge devices', domain: 'vulnerability', criticality: 'critical',
      objective: 'Everything reachable from the internet is known, minimised and fixed before attackers exploit it.',
      expectedState: 'An inventory of internet-facing assets is verified by external scanning, no remote desktop, database or admin interfaces are directly exposed, and actively exploited flaws in VPNs, firewalls and gateways are fixed or mitigated within 48 hours.',
      evidenceRequired: true, evidenceExamples: ['External attack surface scan', 'Internet-facing asset inventory', 'Patch dates for recent edge-device advisories'],
      keywords: ['internet-facing', 'attack surface', 'exposed to the internet', 'edge device'],
      mappings: { nist_csf_2: ['ID.AM-02', 'ID.RA-01', 'PR.PS-02'], iso27001: ['8.8', '8.20', '8.21'], cis_v8: ['7.6', '7.7', '12.1'], soc2: ['CC7.1'], pci_dss: ['6.3.3', '11.3.2', '1.3'], hipaa: ['164.308(a)(1)(ii)(B)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Scan your domains and IP ranges from the internet and close any exposed remote desktop, database or admin interfaces.', mediumTerm: 'Maintain an internet-facing asset inventory and fix actively exploited flaws on edge devices within 48 hours, tracking CISA KEV and CERT-In advisories.', longTerm: 'Adopt continuous attack surface monitoring and replace legacy VPNs with zero-trust access.', owner: 'Infrastructure / IT Security', reference: 'CIS Controls v8.1 Safeguard 7.6' }
    },
    {
      id: 'HS-MON-01', name: 'Centralised logging and SIEM', domain: 'monitoring', criticality: 'critical',
      objective: 'Security-relevant events are collected centrally so attacks can be detected and investigated.',
      expectedState: 'Logs from identity, endpoints, network, cloud and critical applications are centralised, protected from tampering and retained to meet requirements.',
      evidenceRequired: true, evidenceExamples: ['SIEM log source list', 'Retention configuration', 'Sample correlation rules'],
      keywords: ['centralized siem', 'siem', 'centralized logging', 'centralised logging', 'central log', 'log and monitor', 'logs regularly', 'audit logs', 'logs retained', 'logged and auditable', 'logs are retained', 'log audit', 'tamper-proof', 'access logs', 'logged and recorded', 'access-logged'],
      mappings: { nist_csf_2: ['PR.PS-04', 'DE.CM-01', 'DE.CM-03'], iso27001: ['8.15', '8.17'], cis_v8: ['8.2', '8.9', '8.10'], soc2: ['CC7.2'], pci_dss: ['10.2', '10.3', '10.5.1'], hipaa: ['164.312(b)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Forward identity, firewall and email logs to a central store with restricted access.', mediumTerm: 'Implement SIEM correlation for priority use cases (privileged activity, impossible travel, malware).', longTerm: 'Establish 24x7 monitoring with tuned detections and automated response.', owner: 'Security Operations', reference: 'CIS Controls v8 Control 8' }
    },
    {
      id: 'HS-MON-02', name: 'Threat detection and alert response', domain: 'monitoring', criticality: 'critical',
      objective: 'Anomalous and malicious activity is identified and triaged in a timely way.',
      expectedState: 'Alerts for defined use cases are triaged within agreed timeframes by a staffed function or managed service.',
      evidenceRequired: true, evidenceExamples: ['Alert triage records', 'Use case catalogue', 'MDR/SOC service report'],
      keywords: ['notifications from detection', 'are investigated', 'alerts', 'anomal', 'intrusion detection', 'ids/ips', 'monitored for', 'monitoring or anomaly', 'detection', 'unusual', 'insider threat', 'fraud', 'monitoring for leaked'],
      mappings: { nist_csf_2: ['DE.AE-02', 'DE.AE-03', 'DE.CM-01'], iso27001: ['8.16'], cis_v8: ['13.1', '13.3', '13.6'], soc2: ['CC7.2', 'CC7.3'], pci_dss: ['10.4.1', '11.5.1'], hipaa: ['164.308(a)(1)(ii)(D)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Define the ten highest-priority alert scenarios and who responds to each.', mediumTerm: 'Route alerts to a monitored queue with triage SLAs, internally or through MDR.', longTerm: 'Mature into threat hunting and detection engineering.', owner: 'Security Operations', reference: 'NIST CSF 2.0 DE.AE' }
    },
    {
      id: 'HS-IR-01', name: 'Incident response plan', domain: 'incident', criticality: 'critical',
      objective: 'The organisation can respond to a cyber incident in a coordinated way.',
      expectedState: 'A documented incident response plan defines roles, escalation, decision authority and playbooks for likely scenarios.',
      evidenceRequired: true, evidenceExamples: ['Incident response plan', 'Playbooks', 'Contact and escalation list'],
      keywords: ['incident response', 'incident plan', 'response plan', 'escalation procedure', 'ir team', 'response processes', 'incidents are contained', 'incidents are mitigated', 'incident is contained', 'analysis is conducted', 'manual/standalone mode'],
      mappings: { nist_csf_2: ['RS.MA-01', 'ID.IM-04'], iso27001: ['5.24', '5.26'], cis_v8: ['17.4'], soc2: ['CC7.3', 'CC7.4'], pci_dss: ['12.10.1'], hipaa: ['164.308(a)(6)'], dpdp: ['Sec 8(6)'], gdpr: ['Art 33'] },
      remediation: { quickWin: 'Document incident contacts, escalation thresholds and external support (legal, forensics, insurer).', mediumTerm: 'Write an incident response plan with playbooks for ransomware, account compromise and data breach.', longTerm: 'Integrate the plan with monitoring and review it after every significant incident.', owner: 'CISO', reference: 'NIST CSF 2.0 RS.MA' }
    },
    {
      id: 'HS-IR-02', name: 'Incident exercises', domain: 'incident', criticality: 'medium',
      objective: 'Responders and executives have practised their roles before a real incident.',
      expectedState: 'Tabletop or technical exercises are conducted at least annually and lessons learned are tracked.',
      evidenceRequired: false, evidenceExamples: ['Exercise report', 'Lessons-learned action log'],
      keywords: ['strategies are updated', 'post-incident', 'postmortem', 'tabletop', 'ir drills', 'exercises', 'drills', 'lessons learned', 'improvements'],
      mappings: { nist_csf_2: ['ID.IM-02', 'ID.IM-03'], iso27001: ['5.27'], cis_v8: ['17.7'], soc2: ['CC7.5'], pci_dss: ['12.10.2'], hipaa: ['164.308(a)(7)(ii)(D)'], dpdp: ['—'], gdpr: ['Art 32(1)(d)'] },
      remediation: { quickWin: 'Run a ninety-minute ransomware tabletop with IT and leadership.', mediumTerm: 'Hold annual exercises covering technical and executive decision-making.', longTerm: 'Include third parties and OT or clinical scenarios where relevant.', owner: 'CISO', reference: 'ISO/IEC 27001:2022 A.5.27' }
    },
    {
      id: 'HS-IR-03', name: 'Breach notification and communication', domain: 'incident', criticality: 'high',
      objective: 'Regulators, customers and affected individuals are notified correctly and on time.',
      expectedState: 'Notification obligations and timelines are documented, with pre-approved templates and decision owners.',
      evidenceRequired: false, evidenceExamples: ['Notification procedure', 'Regulator contact list', 'Communication templates'],
      keywords: ['notification', 'notifying', 'communication plan', 'incident communication', 'breach notification', 'coordinated with', 'public relations', 'reputation'],
      mappings: { nist_csf_2: ['RS.CO-02', 'RS.CO-03', 'RC.CO-03'], iso27001: ['5.26', '6.8'], cis_v8: ['17.2', '17.6'], soc2: ['CC7.4', 'CC2.3'], pci_dss: ['12.10.1'], hipaa: ['164.404–164.410 (Breach Rule)'], dpdp: ['Sec 8(6)'], gdpr: ['Art 33', 'Art 34'] },
      remediation: { quickWin: 'List notification obligations (CERT-In 6 hours, DPDP, GDPR 72 hours, contractual) with owners.', mediumTerm: 'Prepare templates and an approval workflow for regulator and customer notifications.', longTerm: 'Test notification decisions during annual exercises.', owner: 'Legal / DPO', reference: 'DPDP Act 2023 Sec 8(6)' }
    },
    {
      id: 'HS-RES-01', name: 'Protected and immutable backups', domain: 'resilience', criticality: 'critical',
      objective: 'Critical data can be recovered even after ransomware or destructive attacks.',
      expectedState: 'Critical systems are backed up with at least one offline or immutable copy, encrypted and stored separately from production.',
      evidenceRequired: true, evidenceExamples: ['Backup job report', 'Immutable storage configuration', 'Backup coverage list'],
      keywords: ['backup', 'backed up', 'offline', 'off-site', 'offsite', 'version-controlled offsite'],
      mappings: { nist_csf_2: ['PR.DS-11'], iso27001: ['8.13'], cis_v8: ['11.2', '11.3', '11.4'], soc2: ['A1.2'], pci_dss: ['12.10.1'], hipaa: ['164.308(a)(7)(ii)(A)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32(1)(c)'] },
      remediation: { quickWin: 'Confirm backup coverage of critical systems and create one offline or immutable copy.', mediumTerm: 'Implement 3-2-1 backups with separate credentials for the backup platform.', longTerm: 'Automate backup integrity validation and alert on failures.', owner: 'IT Operations', reference: 'CIS Controls v8 Control 11' }
    },
    {
      id: 'HS-RES-02', name: 'Recovery testing and continuity', domain: 'resilience', criticality: 'high',
      objective: 'The organisation knows how quickly it can recover and has proven it.',
      expectedState: 'RTO and RPO are defined for critical services, restoration is tested at least annually and continuity plans cover loss of key systems.',
      evidenceRequired: true, evidenceExamples: ['Restore test record', 'BCP/DR plan', 'RTO/RPO register'],
      keywords: ['restore operations', 'manual processes', 'adequate capacity', 'plans are tested', 'restoration', 'restore', 'rto', 'rpo', 'recovery plan', 'continuity', 'bcp', 'disaster recovery', 'resilience requirements', 'recovery activities', 'recovery time', 'dependencies and critical functions', 'ups', 'environmental controls'],
      mappings: { nist_csf_2: ['RC.RP-01', 'RC.RP-03', 'PR.IR-03'], iso27001: ['5.29', '5.30'], cis_v8: ['11.5'], soc2: ['A1.3', 'CC7.5'], pci_dss: ['12.10.1'], hipaa: ['164.308(a)(7)(ii)(B)', '164.308(a)(7)(ii)(D)'], dpdp: ['—'], gdpr: ['Art 32(1)(c)'] },
      remediation: { quickWin: 'Restore one critical system from backup and record the time taken.', mediumTerm: 'Agree RTO and RPO with business owners and test against them annually.', longTerm: 'Maintain an exercised business continuity programme covering cyber scenarios.', owner: 'IT Operations / Business continuity', reference: 'ISO/IEC 27001:2022 A.5.30' }
    },
    {
      id: 'HS-RES-03', name: 'Operating through an IT outage', domain: 'resilience', criticality: 'high',
      objective: 'Critical business processes keep running safely while systems are unavailable for days or weeks.',
      expectedState: 'Downtime procedures exist for every critical process, with forms, offline copies of key information and alternative communications ready, and they are rehearsed with the teams that would use them.',
      evidenceRequired: true, evidenceExamples: ['Downtime procedures', 'Downtime kit contents', 'Record of the last downtime drill'],
      keywords: ['downtime procedure', 'manual processes', 'manual/standalone mode', 'without it systems'],
      mappings: { nist_csf_2: ['PR.IR-03', 'ID.IM-04'], iso27001: ['5.29', '5.30'], cis_v8: ['—'], soc2: ['A1.3', 'CC7.5'], pci_dss: ['12.10.1'], hipaa: ['164.308(a)(7)(ii)(C)'], dpdp: ['—'], gdpr: ['Art 32(1)(b)'] },
      remediation: { quickWin: 'For each critical process, write down how it would run for two weeks without IT and print the key contact lists.', mediumTerm: 'Prepare downtime kits (forms, offline copies of critical data, alternative communications) and train the teams that would use them.', longTerm: 'Rehearse a multi-day outage every year with business teams and agree the restore order by business priority.', owner: 'Business continuity / Operations', reference: 'ISO/IEC 27001:2022 A.5.29' }
    },
    {
      id: 'HS-TPR-01', name: 'Third-party security risk management', domain: 'thirdparty', criticality: 'high',
      objective: 'Suppliers with access to data or systems meet security expectations.',
      expectedState: 'Suppliers are tiered by risk, assessed before onboarding and periodically, and contracts include security and breach notification clauses.',
      evidenceRequired: false, evidenceExamples: ['Supplier register with risk tiers', 'Completed assessments', 'Contract security schedule'],
      keywords: ['vendor slas reviewed', 'vendor contracts include', 'partners', 'third-party', 'third party', 'vendor', 'supplier', 'supply chain', 'business associate', 'baa', 'soc 2 or equivalent', 'external information systems', 'integrations (plugins', 'plugins, extensions', 'edtech'],
      mappings: { nist_csf_2: ['GV.SC-04', 'GV.SC-05', 'GV.SC-07'], iso27001: ['5.19', '5.20', '5.21', '5.22'], cis_v8: ['15.1', '15.2', '15.4'], soc2: ['CC9.2'], pci_dss: ['12.8'], hipaa: ['164.308(b)(1)', '164.314(a)'], dpdp: ['Sec 8(2)'], gdpr: ['Art 28'] },
      remediation: { quickWin: 'List suppliers with access to sensitive data or systems and rank them by risk.', mediumTerm: 'Introduce security due diligence and contract clauses for high-risk suppliers.', longTerm: 'Monitor supplier posture continuously and reassess annually.', owner: 'Procurement / Risk', reference: 'NIST CSF 2.0 GV.SC' }
    },
    {
      id: 'HS-PPL-01', name: 'Security awareness training', domain: 'people', criticality: 'high',
      objective: 'People recognise and report common attacks.',
      expectedState: 'All staff complete onboarding and annual awareness training; high-risk roles receive targeted training.',
      evidenceRequired: true, evidenceExamples: ['Training completion report', 'Training content outline'],
      keywords: ['train staff on email', 'trained to report', 'onboarding training', 'cybersecurity onboarding', 'role-specific training', 'verify guest identity', 'signage/policy', 'awareness training', 'security awareness', 'trained on', 'train staff', 'receive training', 'training on', 'cybersecurity awareness', 'cyber safety', 'cross-trained', 'specialized training', 'role-specific security training', 'informed and trained', 'anti-phishing training', 'receive anti-phishing'],
      mappings: { nist_csf_2: ['PR.AT-01', 'PR.AT-02'], iso27001: ['6.3'], cis_v8: ['14.1', '14.2', '14.9'], soc2: ['CC1.4', 'CC2.2'], pci_dss: ['12.6.1', '12.6.3'], hipaa: ['164.308(a)(5)(i)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 39(1)(b)'] },
      remediation: { quickWin: 'Deliver a short phishing and reporting briefing to all staff.', mediumTerm: 'Run an annual programme with onboarding modules and completion tracking.', longTerm: 'Tailor content to role risk and measure behavioural change.', owner: 'HR / IT Security', reference: 'CIS Controls v8 Control 14' }
    },
    {
      id: 'HS-PPL-02', name: 'Phishing simulation', domain: 'people', criticality: 'medium',
      objective: 'Susceptibility to phishing is measured and reduced over time.',
      expectedState: 'Phishing simulations run at least quarterly with follow-up training for repeat clickers.',
      evidenceRequired: false, evidenceExamples: ['Simulation campaign results', 'Trend of click and report rates'],
      keywords: ['phishing simulation', 'phishing test', 'simulation exercises', 'phishing campaign'],
      mappings: { nist_csf_2: ['PR.AT-01'], iso27001: ['6.3'], cis_v8: ['14.2'], soc2: ['CC2.2'], pci_dss: ['12.6.3.1'], hipaa: ['164.308(a)(5)(ii)(A)'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Run a baseline phishing simulation to measure click and report rates.', mediumTerm: 'Schedule quarterly simulations with just-in-time training.', longTerm: 'Track trends by department and feed results into risk reporting.', owner: 'IT Security', reference: 'CIS Controls v8 Safeguard 14.2' }
    },
    {
      id: 'HS-APP-01', name: 'Secure development lifecycle', domain: 'appsec', criticality: 'high',
      objective: 'Applications are designed, built and released securely.',
      expectedState: 'Secure coding standards, peer review, SAST/DAST/SCA and secrets scanning are part of the pipeline with security sign-off before release.',
      evidenceRequired: false, evidenceExamples: ['SDLC procedure', 'Pipeline scan results', 'Release approval records'],
      keywords: ['system development life cycle', 'apis', 'separate from production', 'secure coding', 'code review', 'sast', 'dast', 'software composition', 'sca', 'secure development', 'owasp', 'ci/cd', 'build artifacts', 'container images', 'secrets scanning', 'security sign-off', 'branch protection', 'repository', 'code repositories', 'webhook', 'api', 'content security policy', 'unauthorized code changes', 'third-party scripts', 'infrastructure provisioned as code', 'development or testing environments'],
      mappings: { nist_csf_2: ['PR.PS-06'], iso27001: ['8.25', '8.26', '8.28', '8.29'], cis_v8: ['16.1', '16.9', '16.12'], soc2: ['CC8.1'], pci_dss: ['6.2', '6.4.3'], hipaa: ['—'], dpdp: ['Sec 8(4)'], gdpr: ['Art 25'] },
      remediation: { quickWin: 'Enable dependency and secrets scanning on main repositories.', mediumTerm: 'Add SAST and mandatory peer review to the CI/CD pipeline with release gates.', longTerm: 'Adopt threat modelling for new features and DAST for externally facing applications.', owner: 'Engineering lead', reference: 'ISO/IEC 27001:2022 A.8.25' }
    },
    {
      id: 'HS-CLD-01', name: 'Cloud security posture', domain: 'cloud', criticality: 'high',
      objective: 'Cloud environments are configured securely and misconfigurations are detected.',
      expectedState: 'Cloud accounts follow a secure baseline, public exposure is blocked by default and posture is continuously monitored.',
      evidenceRequired: false, evidenceExamples: ['CSPM report', 'Cloud baseline', 'Storage access policies'],
      keywords: ['cloud', 'cspm', 'casb', 'buckets', 'iac'],
      mappings: { nist_csf_2: ['PR.PS-01', 'ID.AM-02'], iso27001: ['5.23', '8.9'], cis_v8: ['4.1', '15.1'], soc2: ['CC6.1', 'CC7.1'], pci_dss: ['2.2', '12.8'], hipaa: ['164.308(b)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 28', 'Art 32'] },
      remediation: { quickWin: 'Block public access on storage accounts and enable cloud provider security baselines.', mediumTerm: 'Deploy CSPM and remediate high-severity misconfigurations.', longTerm: 'Enforce guardrails through policy-as-code.', owner: 'Cloud / DevOps', reference: 'ISO/IEC 27001:2022 A.5.23' }
    },
    {
      id: 'HS-PHY-01', name: 'Physical access control', domain: 'physical', criticality: 'medium',
      objective: 'Only authorised people can physically reach sensitive systems and information.',
      expectedState: 'Server rooms and sensitive areas are locked, access is logged, visitors are escorted and CCTV covers critical areas.',
      evidenceRequired: false, evidenceExamples: ['Access control logs', 'Visitor log', 'CCTV coverage plan'],
      keywords: ['locked and access-logged', 'key card', 'physical', 'server room', 'cctv', 'badge', 'biometric', 'visitor', 'control rooms', 'locked', 'guards', 'tampering or skimming'],
      mappings: { nist_csf_2: ['PR.AA-06'], iso27001: ['7.1', '7.2', '7.4'], cis_v8: ['—'], soc2: ['CC6.4'], pci_dss: ['9.2', '9.5.1'], hipaa: ['164.310(a)(1)'], dpdp: ['Sec 8(5)'], gdpr: ['Art 32'] },
      remediation: { quickWin: 'Restrict server and network room keys to named IT staff.', mediumTerm: 'Introduce badge access with logging and visitor management.', longTerm: 'Review physical access quarterly and correlate with HR records.', owner: 'Facilities', reference: 'ISO/IEC 27001:2022 A.7.2' }
    },
    {
      id: 'HS-OT-01', name: 'OT and connected-device security', domain: 'ot', criticality: 'critical',
      objective: 'Industrial, medical and IoT devices cannot be used to disrupt operations or pivot into the network.',
      expectedState: 'OT/IoT devices are inventoried, isolated, hardened, monitored with protocol-aware tooling and procured with security requirements.',
      evidenceRequired: true, evidenceExamples: ['OT asset inventory', 'Zone and conduit diagram', 'OT monitoring report'],
      keywords: ['ot/', ' ot ', 'ot network', 'ics', 'scada', 'plc', 'hmi', 'iot', 'industrial', 'medical device', 'modbus', 'opc ua', 'manufacturing floor'],
      mappings: { nist_csf_2: ['ID.AM-01', 'PR.IR-01', 'DE.CM-01'], iso27001: ['8.20', '8.22'], cis_v8: ['1.1', '12.2', '13.4'], soc2: ['CC6.6'], pci_dss: ['—'], hipaa: ['164.310(d)(1)'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Block direct internet access from OT and medical device networks.', mediumTerm: 'Inventory OT/IoT assets and segment them into zones with controlled conduits.', longTerm: 'Deploy protocol-aware monitoring and include OT in incident exercises (aligned to ISA/IEC 62443).', owner: 'OT / Engineering', reference: 'ISA/IEC 62443-3-3' }
    },
    {
      id: 'HS-PAY-01', name: 'Payment and transaction security', domain: 'payments', criticality: 'high',
      objective: 'Payment channels and financial transactions are protected from fraud and compromise.',
      expectedState: 'Cardholder data scope is minimised, payment systems meet PCI DSS, and transactions are monitored for fraud in real time.',
      evidenceRequired: true, evidenceExamples: ['PCI DSS SAQ or AOC', 'Fraud monitoring rules', 'Scope diagram'],
      keywords: ['payment', 'pos', 'cardholder', 'card transactions', 'transaction', 'adaptive authentication', 'high-value', 'pci'],
      mappings: { nist_csf_2: ['PR.DS-01', 'DE.AE-02'], iso27001: ['8.24', '8.16'], cis_v8: ['3.11'], soc2: ['PI1.3'], pci_dss: ['3', '4', '11.6.1', '12.5.2'], hipaa: ['—'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Confirm cardholder data is not stored after authorisation and review POS firmware levels.', mediumTerm: 'Reduce PCI scope through P2PE or tokenisation and complete the applicable SAQ.', longTerm: 'Implement real-time fraud analytics with tuned rules.', owner: 'Finance / Payments', reference: 'PCI DSS 4.0.1' }
    },
    {
      id: 'HS-PAY-02', name: 'Payment instruction verification', domain: 'payments', criticality: 'high',
      objective: 'Money cannot be diverted by a fraudulent bank-detail change or an impersonated payment request.',
      expectedState: 'Bank-detail changes and urgent or unusual payment requests are confirmed through an independent channel already on file, a second person approves them, and finance staff are trained on payment diversion and deepfake tactics.',
      evidenceRequired: false, evidenceExamples: ['Supplier master-data change procedure', 'Call-back records for recent changes', 'Payment approval matrix'],
      keywords: ['bank details', 'bank account details', 'payment request', 'payment instructions'],
      mappings: { nist_csf_2: ['PR.AA-05', 'PR.AT-01'], iso27001: ['5.3', '6.3'], cis_v8: ['14.2'], soc2: ['—'], pci_dss: ['—'], hipaa: ['—'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Adopt a written rule: bank-detail changes and urgent payment requests are confirmed by calling a number already on file, never one given in the request.', mediumTerm: 'Enforce dual approval for supplier master-data changes and payments above a threshold, and train finance staff on payment diversion and deepfake tactics.', longTerm: 'Add automated holds and payee name verification for changed bank details and monitor for lookalike supplier domains.', owner: 'Finance / CFO', reference: 'ISO/IEC 27001:2022 A.5.3' }
    },
    {
      id: 'HS-SOC-01', scope: ['soc'], name: 'SOC people and skills', domain: 'secops', criticality: 'medium',
      objective: 'The security operations function is adequately staffed and skilled.',
      expectedState: 'SOC roles, staffing model, training paths and retention measures are defined and resourced.',
      evidenceRequired: false, evidenceExamples: ['SOC staffing plan', 'Training records', 'Shift roster'],
      keywords: ['staffing', 'employees', 'analyst', 'skill', 'career', 'knowledge management', 'education', 'hiring', 'team'],
      mappings: { nist_csf_2: ['GV.RR-03', 'PR.AT-02'], iso27001: ['6.3', '7.2 (clause)'], cis_v8: ['14.9'], soc2: ['CC1.4'], pci_dss: ['12.6'], hipaa: ['—'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Document SOC roles and current coverage hours.', mediumTerm: 'Define training paths and certification targets for analysts.', longTerm: 'Build a sustainable staffing and retention model with measured capability.', owner: 'SOC manager', reference: 'SOC-CMM People domain' }
    },
    {
      id: 'HS-SOC-02', scope: ['soc'], name: 'SOC processes and services', domain: 'secops', criticality: 'high',
      objective: 'Security operations follow defined, measured processes.',
      expectedState: 'Triage, escalation, threat intelligence, hunting and reporting processes are documented, measured and improved.',
      evidenceRequired: false, evidenceExamples: ['SOC procedures', 'SLA and metric reports', 'Threat intelligence feeds'],
      keywords: ['process', 'procedure', 'playbook', 'use case', 'threat intel', 'threat intelligence', 'hunting', 'sla', 'reporting', 'service'],
      mappings: { nist_csf_2: ['DE.AE-07', 'ID.RA-02', 'RS.AN-03'], iso27001: ['5.7', '8.16'], cis_v8: ['13.1'], soc2: ['CC7.2', 'CC7.3'], pci_dss: ['10.4'], hipaa: ['—'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Document triage and escalation procedures for the top alert types.', mediumTerm: 'Introduce SLAs and monthly SOC performance reporting.', longTerm: 'Add threat hunting and continuous detection improvement.', owner: 'SOC manager', reference: 'SOC-CMM Process domain' }
    },
    {
      id: 'HS-SOC-03', scope: ['soc'], name: 'SOC technology and tooling', domain: 'secops', criticality: 'high',
      objective: 'The SOC has the tooling and integration needed to detect and respond.',
      expectedState: 'SIEM, EDR, SOAR and supporting tools are deployed, integrated, maintained and covered by support agreements.',
      evidenceRequired: false, evidenceExamples: ['Tooling architecture', 'Integration list', 'Maintenance records'],
      keywords: ['soar', 'automation', 'tool', 'technology', 'integration', 'platform', 'maintenance'],
      mappings: { nist_csf_2: ['DE.CM-01', 'RS.MA-02'], iso27001: ['8.16'], cis_v8: ['8.11', '13.1'], soc2: ['CC7.2'], pci_dss: ['10.4.1.1'], hipaa: ['—'], dpdp: ['—'], gdpr: ['—'] },
      remediation: { quickWin: 'Inventory SOC tools, owners and integration gaps.', mediumTerm: 'Close critical log source and integration gaps; formalise tool maintenance.', longTerm: 'Introduce SOAR for repeatable response actions.', owner: 'SOC manager', reference: 'SOC-CMM Technology domain' }
    }
  ];

  const CONTROL_INDEX = CONTROLS.reduce((acc, c) => { acc[c.id] = c; return acc; }, {});

  // Explicit question → control assignments for questions that do not carry
  // a `control` field. Shipped templates set `control` on every question;
  // this map is kept for content added outside the data files.
  const EXPLICIT_QUESTION_MAP = {};

  // Category-level fallbacks used when an item has no specific keyword match.
  // For SOC-CMM the category is the most reliable signal, so it is applied
  // before keyword matching.
  const CATEGORY_MAP = {
    soc: {
      business_drivers: 'HS-GOV-06', charter: 'HS-GOV-02', compliance_drivers: 'HS-GOV-04',
      org_structure: 'HS-SOC-01', skills_training: 'HS-SOC-01',
      incident_management: 'HS-IR-01', threat_intel: 'HS-SOC-02', sop_playbooks: 'HS-SOC-02',
      siem: 'HS-MON-01', detection_tools: 'HS-SOC-03',
      monitoring_scope: 'HS-MON-02', operating_hours: 'HS-MON-02'
    }
  };
  const CATEGORY_FIRST = { soc: true };

  function normalise(text) {
    return ` ${String(text || '').toLowerCase().replace(/[()]/g, ' ').replace(/\s+/g, ' ')} `;
  }

  const KW_CACHE = {};
  // Keywords must start on a word boundary; short keywords (four characters
  // or fewer, e.g. "pos", "rto", "ics") must also end on one, so that "pos"
  // does not match "posture" and "ics" does not match "logistics".
  function keywordHit(text, kw) {
    let re = KW_CACHE[kw];
    if (!re) {
      const escaped = kw.trim().replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
      const tail = kw.trim().length <= 4 ? '(?![a-z0-9])' : '';
      re = new RegExp('(?<![a-z0-9])' + escaped + tail);
      KW_CACHE[kw] = re;
    }
    return re.test(text);
  }

  function keywordMatch(question, frameworkId) {
    const text = normalise(question.text);
    let best = null;
    let bestScore = 0;
    // Longer, more specific phrases win; critical controls get a small
    // preference so that "MFA" outranks a generic access phrase.
    for (const control of CONTROLS) {
      if (control.scope && !control.scope.includes(frameworkId)) continue;
      for (const kw of control.keywords) {
        if (keywordHit(text, kw)) {
          const score = kw.length + (control.criticality === 'critical' ? 1 : 0);
          if (score > bestScore) {
            best = control;
            bestScore = score;
          }
        }
      }
    }
    return best;
  }

  // Map a questionnaire item to a canonical control.
  // context: { frameworkId, categoryId, overrides }
  // Returns { control, method } where method is one of
  // 'override' | 'explicit' | 'category' | 'keyword' | 'unmapped'.
  function mapQuestionToControl(question, context) {
    const ctx = context || {};
    const overrides = ctx.overrides || {};
    const ov = overrides[question.id];
    if (ov && ov.controlId && CONTROL_INDEX[ov.controlId]) {
      return { control: CONTROL_INDEX[ov.controlId], method: 'override' };
    }
    if (question.control && CONTROL_INDEX[question.control]) {
      return { control: CONTROL_INDEX[question.control], method: 'explicit' };
    }
    if (EXPLICIT_QUESTION_MAP[question.id]) {
      return { control: CONTROL_INDEX[EXPLICIT_QUESTION_MAP[question.id]], method: 'explicit' };
    }
    const categoryControlId = CATEGORY_MAP[ctx.frameworkId] && CATEGORY_MAP[ctx.frameworkId][ctx.categoryId];
    if (categoryControlId && CATEGORY_FIRST[ctx.frameworkId]) {
      const kw = keywordMatch(question, ctx.frameworkId);
      // In SOC-CMM a strong technical keyword (e.g. SIEM) still wins.
      if (kw && kw.criticality === 'critical') return { control: kw, method: 'keyword' };
      return { control: CONTROL_INDEX[categoryControlId], method: 'category' };
    }
    const kw = keywordMatch(question, ctx.frameworkId);
    if (kw) return { control: kw, method: 'keyword' };
    if (categoryControlId) return { control: CONTROL_INDEX[categoryControlId], method: 'category' };
    return { control: null, method: 'unmapped' };
  }

  const api = {
    FRAMEWORK_REFERENCES,
    DOMAINS,
    CRITICALITY_TIERS,
    CONTROLS,
    CONTROL_INDEX,
    EXPLICIT_QUESTION_MAP,
    CATEGORY_MAP,
    mapQuestionToControl
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.HawkControls = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
