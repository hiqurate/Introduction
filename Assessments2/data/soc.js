// ============================================
// SOC Capability Maturity Assessment (SOC-CMM)
// Based on SOC Assessment reference data
// 5 Domains, CoBIT 0-5 Maturity Scale
// ============================================

const SOC_DATA = {
  id: 'soc',
  modules: [
    {
      id: 'mission_governance',
      name: 'Mission & Governance',
      description: 'Evaluate SOC mission alignment, charter documentation, governance structures, and stakeholder engagement.',
      icon: '',
      categories: [
        {
          id: 'business_drivers',
          name: 'Business Drivers',
          description: 'Understanding and alignment of SOC with business objectives.',
          questions: [
            { id: 'B1.1', text: 'Business drivers are known and understood within the SOC', context: 'How well does the SOC team understand the core business drivers and objectives?', options: [{label: 'Does Not Exist', value: 0, detail: 'No awareness of business drivers'}, {label: 'Initial', value: 1, detail: 'Business drivers are unknown'}, {label: 'Repeatable', value: 2, detail: 'Basic awareness of business drivers'}, {label: 'Defined', value: 3, detail: 'Some business drivers identified'}, {label: 'Managed', value: 4, detail: 'Most business drivers identified'}, {label: 'Optimized', value: 5, detail: 'All business drivers are well known within the SOC'}] },
            { id: 'B1.2', text: 'Business drivers are documented and maintained', context: 'Is there formal documentation of how SOC activities relate to business objectives?', options: [{label: 'Does Not Exist', value: 0, detail: 'No documentation'}, {label: 'Initial', value: 1, detail: 'No documentation in place'}, {label: 'Repeatable', value: 2, detail: 'Some ad-hoc information across documents'}, {label: 'Defined', value: 3, detail: 'Basic documentation of business drivers'}, {label: 'Managed', value: 4, detail: 'Single document, full description'}, {label: 'Optimized', value: 5, detail: 'Document completed, approved and formally published'}] },
            { id: 'B1.3', text: 'Business drivers are used in SOC decision making', context: 'Are business drivers actively used when making SOC operational decisions?', options: [{label: 'Does Not Exist', value: 0, detail: 'Not part of decision making'}, {label: 'Initial', value: 1, detail: 'Business drivers not part of decisions'}, {label: 'Repeatable', value: 2, detail: 'Referred to on an ad-hoc basis'}, {label: 'Defined', value: 3, detail: 'Occasionally used in decisions'}, {label: 'Managed', value: 4, detail: 'Used in most decisions'}, {label: 'Optimized', value: 5, detail: 'Used in all relevant decisions'}] },
            { id: 'B1.4', text: 'SOC service catalogue is aligned with business drivers', context: 'Does the SOC service catalogue reflect and align with business priorities?', options: [{label: 'Does Not Exist', value: 0, detail: 'No alignment check'}, {label: 'Initial', value: 1, detail: 'Not checked for alignment'}, {label: 'Repeatable', value: 2, detail: 'Ad-hoc alignment'}, {label: 'Defined', value: 3, detail: 'Alignment performed but not maintained'}, {label: 'Managed', value: 4, detail: 'Alignment performed and maintained regularly'}, {label: 'Optimized', value: 5, detail: 'Every change checked against drivers'}] },
            { id: 'B1.5', text: 'Business drivers have been validated with stakeholders', context: 'Have SOC business drivers been validated and agreed upon by key stakeholders?', options: [{label: 'Does Not Exist', value: 0, detail: 'No validation'}, {label: 'Initial', value: 1, detail: 'Not validated'}, {label: 'Repeatable', value: 2, detail: 'Basic awareness among stakeholders'}, {label: 'Defined', value: 3, detail: 'Partially validated'}, {label: 'Managed', value: 4, detail: 'Validated with most stakeholders'}, {label: 'Optimized', value: 5, detail: 'Fully validated and signed off'}] }
          ]
        },
        {
          id: 'charter',
          name: 'SOC Charter & Mission',
          description: 'SOC mission statement, charter documentation, and authorization.',
          questions: [
            { id: 'MG1.1', text: 'SOC has a formal mission statement', context: 'Does the SOC have a clearly defined and documented mission statement?', options: [{label: 'Does Not Exist', value: 0, detail: 'No mission statement'}, {label: 'Initial', value: 1, detail: 'No formal mission'}, {label: 'Repeatable', value: 2, detail: 'Informal understanding'}, {label: 'Defined', value: 3, detail: 'Draft mission statement'}, {label: 'Managed', value: 4, detail: 'Approved mission statement'}, {label: 'Optimized', value: 5, detail: 'Published and regularly reviewed'}] },
            { id: 'MG1.2', text: 'SOC charter is established and maintained', context: 'Is there a formal SOC charter defining scope, authority, and responsibilities?', options: [{label: 'Does Not Exist', value: 0, detail: 'No charter'}, {label: 'Initial', value: 1, detail: 'No charter document'}, {label: 'Repeatable', value: 2, detail: 'Informal scope understanding'}, {label: 'Defined', value: 3, detail: 'Draft charter exists'}, {label: 'Managed', value: 4, detail: 'Approved charter with regular updates'}, {label: 'Optimized', value: 5, detail: 'Comprehensive charter aligned with business strategy'}] },
            { id: 'MG1.3', text: 'SOC authority levels are clearly defined', context: 'Are SOC authority levels for containment, isolation, and escalation clearly established?', options: [{label: 'Does Not Exist', value: 0, detail: 'No authority definition'}, {label: 'Initial', value: 1, detail: 'No defined authority'}, {label: 'Repeatable', value: 2, detail: 'Some informal authority'}, {label: 'Defined', value: 3, detail: 'Basic authority documented'}, {label: 'Managed', value: 4, detail: 'Clear authority with escalation paths'}, {label: 'Optimized', value: 5, detail: 'Full authority matrix with automated escalation'}] },
            { id: 'MG1.4', text: 'SOC governance structure is established', context: 'Is there a formal governance structure with steering committees and reporting lines?', options: [{label: 'Does Not Exist', value: 0, detail: 'No governance structure'}, {label: 'Initial', value: 1, detail: 'Ad-hoc governance'}, {label: 'Repeatable', value: 2, detail: 'Basic reporting lines'}, {label: 'Defined', value: 3, detail: 'Governance structure documented'}, {label: 'Managed', value: 4, detail: 'Active steering committee'}, {label: 'Optimized', value: 5, detail: 'Mature governance with KPIs and continuous improvement'}] }
          ]
        },
        {
          id: 'compliance_drivers',
          name: 'Compliance & Reporting',
          description: 'Compliance frameworks, regulatory requirements, and reporting capabilities.',
          questions: [
            { id: 'MG2.1', text: 'Compliance requirements are identified and tracked', context: 'Have all applicable compliance frameworks (PCI, SOC2, HIPAA, etc.) been identified?', options: [{label: 'Does Not Exist', value: 0, detail: 'No compliance tracking'}, {label: 'Initial', value: 1, detail: 'Not identified'}, {label: 'Repeatable', value: 2, detail: 'Some requirements known'}, {label: 'Defined', value: 3, detail: 'Most requirements identified'}, {label: 'Managed', value: 4, detail: 'All requirements tracked'}, {label: 'Optimized', value: 5, detail: 'Automated compliance monitoring and reporting'}] },
            { id: 'MG2.2', text: 'SOC provides compliance-driven reporting', context: 'Can the SOC generate compliance reports aligned with regulatory requirements?', options: [{label: 'Does Not Exist', value: 0, detail: 'No compliance reporting'}, {label: 'Initial', value: 1, detail: 'No reporting capability'}, {label: 'Repeatable', value: 2, detail: 'Manual ad-hoc reports'}, {label: 'Defined', value: 3, detail: 'Standard report templates'}, {label: 'Managed', value: 4, detail: 'Automated regular reports'}, {label: 'Optimized', value: 5, detail: 'Real-time compliance dashboards'}] },
            { id: 'MG2.3', text: 'SOC metrics and KPIs are defined and measured', context: 'Are operational metrics (MTTD, MTTR, false positive rate) tracked and reported?', options: [{label: 'Does Not Exist', value: 0, detail: 'No metrics defined'}, {label: 'Initial', value: 1, detail: 'No KPIs'}, {label: 'Repeatable', value: 2, detail: 'Basic metrics tracked'}, {label: 'Defined', value: 3, detail: 'Key metrics defined'}, {label: 'Managed', value: 4, detail: 'Comprehensive KPI tracking'}, {label: 'Optimized', value: 5, detail: 'Data-driven optimization with trend analysis'}] }
          ]
        }
      ]
    },
    {
      id: 'people',
      name: 'People',
      description: 'Assess SOC staffing, skills, training, and organizational structure.',
      icon: '',
      categories: [
        {
          id: 'org_structure',
          name: 'Organizational Structure',
          description: 'SOC team structure, roles, and reporting lines.',
          questions: [
            { id: 'P1.1', text: 'SOC organizational structure is defined', context: 'Is there a clear SOC org chart with defined roles (L1, L2, L3, manager)?', options: [{label: 'Does Not Exist', value: 0, detail: 'No org structure'}, {label: 'Initial', value: 1, detail: 'Ad-hoc roles'}, {label: 'Repeatable', value: 2, detail: 'Basic roles defined'}, {label: 'Defined', value: 3, detail: 'Full org structure documented'}, {label: 'Managed', value: 4, detail: 'Tiered structure with career paths'}, {label: 'Optimized', value: 5, detail: 'Optimized structure with continuous review'}] },
            { id: 'P1.2', text: 'SOC staffing levels are adequate for 24/7 operations', context: 'Does the SOC have sufficient staff for required coverage hours?', options: [{label: 'Does Not Exist', value: 0, detail: 'No dedicated SOC staff'}, {label: 'Initial', value: 1, detail: 'Minimal staffing, business hours only'}, {label: 'Repeatable', value: 2, detail: 'Extended hours coverage'}, {label: 'Defined', value: 3, detail: '24/5 coverage'}, {label: 'Managed', value: 4, detail: '24/7 with some gaps'}, {label: 'Optimized', value: 5, detail: 'Full 24/7/365 with adequate backup'}] },
            { id: 'P1.3', text: 'Roles and responsibilities (RACI) are documented', context: 'Is there a RACI matrix defining who is Responsible, Accountable, Consulted, and Informed?', options: [{label: 'Does Not Exist', value: 0, detail: 'No RACI'}, {label: 'Initial', value: 1, detail: 'No documentation'}, {label: 'Repeatable', value: 2, detail: '25% of RACI defined'}, {label: 'Defined', value: 3, detail: '50% of RACI defined'}, {label: 'Managed', value: 4, detail: '75% of RACI defined'}, {label: 'Optimized', value: 5, detail: '100% RACI documented and maintained'}] },
            { id: 'P1.4', text: 'SOC leadership is established', context: 'Is there dedicated SOC management (SOC Manager, CISO reporting line)?', options: [{label: 'Does Not Exist', value: 0, detail: 'No SOC leadership'}, {label: 'Initial', value: 1, detail: 'Part-time responsibility'}, {label: 'Repeatable', value: 2, detail: 'Dedicated team lead'}, {label: 'Defined', value: 3, detail: 'SOC Manager appointed'}, {label: 'Managed', value: 4, detail: 'Manager with clear CISO reporting'}, {label: 'Optimized', value: 5, detail: 'Mature leadership with strategic influence'}] }
          ]
        },
        {
          id: 'skills_training',
          name: 'Skills & Training',
          description: 'Staff competencies, certifications, and professional development.',
          questions: [
            { id: 'P2.1', text: 'Required skill sets for each role are defined', context: 'Are competency frameworks established for each SOC role?', options: [{label: 'Does Not Exist', value: 0, detail: 'No skill definitions'}, {label: 'Initial', value: 1, detail: 'Informal expectations'}, {label: 'Repeatable', value: 2, detail: 'Basic job descriptions'}, {label: 'Defined', value: 3, detail: 'Competency framework for some roles'}, {label: 'Managed', value: 4, detail: 'Full competency framework'}, {label: 'Optimized', value: 5, detail: 'Competency framework with regular assessment'}] },
            { id: 'P2.2', text: 'Training programs are established for SOC staff', context: 'Is there a structured training and development program for analysts?', options: [{label: 'Does Not Exist', value: 0, detail: 'No training program'}, {label: 'Initial', value: 1, detail: 'No formal training'}, {label: 'Repeatable', value: 2, detail: 'Some vendor training'}, {label: 'Defined', value: 3, detail: 'Annual training plan'}, {label: 'Managed', value: 4, detail: 'Comprehensive training with labs'}, {label: 'Optimized', value: 5, detail: 'Continuous learning with certifications and CTF exercises'}] },
            { id: 'P2.3', text: 'Staff certifications are tracked and maintained', context: 'Are industry certifications (CISSP, CEH, GCIA, etc.) tracked and encouraged?', options: [{label: 'Does Not Exist', value: 0, detail: 'No certification tracking'}, {label: 'Initial', value: 1, detail: 'No focus on certifications'}, {label: 'Repeatable', value: 2, detail: 'Some staff certified'}, {label: 'Defined', value: 3, detail: 'Certification goals defined'}, {label: 'Managed', value: 4, detail: 'Active certification program'}, {label: 'Optimized', value: 5, detail: 'Full cert program with budget and time allocation'}] },
            { id: 'P2.4', text: 'Knowledge transfer and documentation practices are in place', context: 'Are runbooks, wikis, and knowledge bases maintained for SOC operations?', options: [{label: 'Does Not Exist', value: 0, detail: 'No knowledge base'}, {label: 'Initial', value: 1, detail: 'Tribal knowledge only'}, {label: 'Repeatable', value: 2, detail: 'Some documentation'}, {label: 'Defined', value: 3, detail: 'Knowledge base started'}, {label: 'Managed', value: 4, detail: 'Comprehensive KB maintained'}, {label: 'Optimized', value: 5, detail: 'Living KB with automated playbook integration'}] },
            { id: 'P2.5', text: 'Staff retention and career development program exists', context: 'Are there career development paths and retention strategies for SOC analysts?', options: [{label: 'Does Not Exist', value: 0, detail: 'No career program'}, {label: 'Initial', value: 1, detail: 'No career paths'}, {label: 'Repeatable', value: 2, detail: 'Informal career guidance'}, {label: 'Defined', value: 3, detail: 'Career ladders defined'}, {label: 'Managed', value: 4, detail: 'Active career development program'}, {label: 'Optimized', value: 5, detail: 'Comprehensive program with mentoring and rotation'}] }
          ]
        }
      ]
    },
    {
      id: 'process',
      name: 'Process',
      description: 'Evaluate SOC operational processes, incident management, threat intelligence, and continuous improvement.',
      icon: '',
      categories: [
        {
          id: 'incident_management',
          name: 'Incident Management',
          description: 'Incident detection, triage, response, and closure processes.',
          questions: [
            { id: 'PR1.1', text: 'Incident management process is formally defined', context: 'Is there a documented incident management lifecycle (detect, triage, respond, close)?', options: [{label: 'Does Not Exist', value: 0, detail: 'No process'}, {label: 'Initial', value: 1, detail: 'Ad-hoc response'}, {label: 'Repeatable', value: 2, detail: 'Basic process exists'}, {label: 'Defined', value: 3, detail: 'Formally documented process'}, {label: 'Managed', value: 4, detail: 'Process with metrics and SLAs'}, {label: 'Optimized', value: 5, detail: 'Continuously improved process with automation'}] },
            { id: 'PR1.2', text: 'Incident classification and prioritization scheme is defined', context: 'Are incidents categorized by type and prioritized by severity and impact?', options: [{label: 'Does Not Exist', value: 0, detail: 'No classification'}, {label: 'Initial', value: 1, detail: 'No scheme'}, {label: 'Repeatable', value: 2, detail: 'Basic high/medium/low'}, {label: 'Defined', value: 3, detail: 'Detailed classification'}, {label: 'Managed', value: 4, detail: 'Classification with business impact'}, {label: 'Optimized', value: 5, detail: 'Dynamic classification with automated prioritization'}] },
            { id: 'PR1.3', text: 'Escalation procedures are defined and followed', context: 'Are escalation paths clear for different incident severities?', options: [{label: 'Does Not Exist', value: 0, detail: 'No escalation process'}, {label: 'Initial', value: 1, detail: 'Informal escalation'}, {label: 'Repeatable', value: 2, detail: 'Basic escalation chart'}, {label: 'Defined', value: 3, detail: 'Documented escalation matrix'}, {label: 'Managed', value: 4, detail: 'Automated escalation with SLAs'}, {label: 'Optimized', value: 5, detail: 'Dynamic escalation with feedback loops'}] },
            { id: 'PR1.4', text: 'Post-incident review process is established', context: 'Are post-incident reviews (PIR/root cause analysis) conducted after incidents?', options: [{label: 'Does Not Exist', value: 0, detail: 'No PIR process'}, {label: 'Initial', value: 1, detail: 'No reviews'}, {label: 'Repeatable', value: 2, detail: 'Reviews for major incidents'}, {label: 'Defined', value: 3, detail: 'Standard PIR template'}, {label: 'Managed', value: 4, detail: 'PIR for all significant incidents'}, {label: 'Optimized', value: 5, detail: 'Systematic PIR with action tracking and trend analysis'}] }
          ]
        },
        {
          id: 'threat_intel',
          name: 'Threat Intelligence',
          description: 'Threat intelligence collection, analysis, and operationalization.',
          questions: [
            { id: 'PR2.1', text: 'Threat intelligence sources are identified and consumed', context: 'Does the SOC subscribe to and consume threat intelligence feeds?', options: [{label: 'Does Not Exist', value: 0, detail: 'No threat intel'}, {label: 'Initial', value: 1, detail: 'No feeds'}, {label: 'Repeatable', value: 2, detail: 'Open source feeds'}, {label: 'Defined', value: 3, detail: 'Multiple feeds consumed'}, {label: 'Managed', value: 4, detail: 'Commercial and open feeds integrated'}, {label: 'Optimized', value: 5, detail: 'Full TIP with automated enrichment'}] },
            { id: 'PR2.2', text: 'Threat intelligence is operationalized in detection rules', context: 'Are IOCs and threat intel integrated into SIEM rules and detection capabilities?', options: [{label: 'Does Not Exist', value: 0, detail: 'Not operationalized'}, {label: 'Initial', value: 1, detail: 'Manual lookups only'}, {label: 'Repeatable', value: 2, detail: 'Some IOCs in SIEM'}, {label: 'Defined', value: 3, detail: 'Regular IOC updates'}, {label: 'Managed', value: 4, detail: 'Automated IOC ingestion'}, {label: 'Optimized', value: 5, detail: 'Full TIP-SIEM-SOAR integration'}] },
            { id: 'PR2.3', text: 'Threat hunting program is established', context: 'Does the SOC conduct proactive threat hunting beyond reactive alerting?', options: [{label: 'Does Not Exist', value: 0, detail: 'No threat hunting'}, {label: 'Initial', value: 1, detail: 'No hunting capability'}, {label: 'Repeatable', value: 2, detail: 'Ad-hoc hunting'}, {label: 'Defined', value: 3, detail: 'Hunting hypotheses documented'}, {label: 'Managed', value: 4, detail: 'Regular hunting program'}, {label: 'Optimized', value: 5, detail: 'Mature hunting with MITRE ATT&CK mapping'}] }
          ]
        },
        {
          id: 'sop_playbooks',
          name: 'SOPs & Playbooks',
          description: 'Standard Operating Procedures and response playbooks.',
          questions: [
            { id: 'PR3.1', text: 'Standard Operating Procedures (SOPs) are documented', context: 'Are day-to-day SOC operations covered by documented SOPs?', options: [{label: 'Does Not Exist', value: 0, detail: 'No SOPs'}, {label: 'Initial', value: 1, detail: 'No documentation'}, {label: 'Repeatable', value: 2, detail: 'Some informal procedures'}, {label: 'Defined', value: 3, detail: 'SOPs for common tasks'}, {label: 'Managed', value: 4, detail: 'Comprehensive SOP library'}, {label: 'Optimized', value: 5, detail: 'SOPs integrated with automation and regularly reviewed'}] },
            { id: 'PR3.2', text: 'Response playbooks exist for common incident types', context: 'Are there detailed playbooks for malware, phishing, ransomware, DDoS, etc.?', options: [{label: 'Does Not Exist', value: 0, detail: 'No playbooks'}, {label: 'Initial', value: 1, detail: 'No playbooks'}, {label: 'Repeatable', value: 2, detail: 'Few basic playbooks'}, {label: 'Defined', value: 3, detail: 'Playbooks for top incident types'}, {label: 'Managed', value: 4, detail: 'Comprehensive playbook library'}, {label: 'Optimized', value: 5, detail: 'Automated playbooks with SOAR integration'}] },
            { id: 'PR3.3', text: 'Use case management process is in place', context: 'Is there a formal process for creating, testing, and tuning detection use cases?', options: [{label: 'Does Not Exist', value: 0, detail: 'No use case management'}, {label: 'Initial', value: 1, detail: 'Default vendor rules only'}, {label: 'Repeatable', value: 2, detail: 'Some custom rules'}, {label: 'Defined', value: 3, detail: 'Use case framework started'}, {label: 'Managed', value: 4, detail: 'Mature use case lifecycle'}, {label: 'Optimized', value: 5, detail: 'Use cases mapped to MITRE with automated testing'}] }
          ]
        }
      ]
    },
    {
      id: 'technology',
      name: 'Technology',
      description: 'Assess SOC technology stack including SIEM, EDR, SOAR, and supporting tools.',
      icon: '',
      categories: [
        {
          id: 'siem',
          name: 'SIEM & Log Management',
          description: 'Security Information and Event Management capabilities.',
          questions: [
            { id: 'T1.1', text: 'SIEM solution is deployed and operational', context: 'Is a SIEM platform deployed and actively processing security events?', options: [{label: 'Does Not Exist', value: 0, detail: 'No SIEM'}, {label: 'Initial', value: 1, detail: 'Basic log collection only'}, {label: 'Repeatable', value: 2, detail: 'SIEM deployed, basic rules'}, {label: 'Defined', value: 3, detail: 'SIEM with custom correlation'}, {label: 'Managed', value: 4, detail: 'Optimized SIEM with advanced analytics'}, {label: 'Optimized', value: 5, detail: 'Next-gen SIEM with ML, UEBA, and full coverage'}] },
            { id: 'T1.2', text: 'Log sources are comprehensive and cover critical assets', context: 'What percentage of critical log sources are integrated into the SIEM?', options: [{label: 'Does Not Exist', value: 0, detail: 'No log sources'}, {label: 'Initial', value: 1, detail: 'Less than 25% coverage'}, {label: 'Repeatable', value: 2, detail: '25-50% coverage'}, {label: 'Defined', value: 3, detail: '50-75% coverage'}, {label: 'Managed', value: 4, detail: '75-90% coverage'}, {label: 'Optimized', value: 5, detail: '90-100% coverage with validation'}] },
            { id: 'T1.3', text: 'Log retention meets compliance requirements', context: 'Are log retention periods aligned with regulatory and business requirements?', options: [{label: 'Does Not Exist', value: 0, detail: 'No retention policy'}, {label: 'Initial', value: 1, detail: 'Default retention'}, {label: 'Repeatable', value: 2, detail: 'Some retention policies'}, {label: 'Defined', value: 3, detail: 'Retention aligned with some requirements'}, {label: 'Managed', value: 4, detail: 'Full compliance alignment'}, {label: 'Optimized', value: 5, detail: 'Tiered retention with cost optimization'}] },
            { id: 'T1.4', text: 'Correlation rules are tuned and effective', context: 'Are SIEM correlation rules regularly tuned to reduce false positives?', options: [{label: 'Does Not Exist', value: 0, detail: 'No correlation rules'}, {label: 'Initial', value: 1, detail: 'Default rules only'}, {label: 'Repeatable', value: 2, detail: 'Some tuning done'}, {label: 'Defined', value: 3, detail: 'Regular tuning schedule'}, {label: 'Managed', value: 4, detail: 'Well-tuned with low false positives'}, {label: 'Optimized', value: 5, detail: 'ML-assisted tuning with continuous optimization'}] }
          ]
        },
        {
          id: 'detection_tools',
          name: 'Detection & Response Tools',
          description: 'EDR, NDR, SOAR, and other security tools.',
          questions: [
            { id: 'T2.1', text: 'Endpoint Detection and Response (EDR) is deployed', context: 'Is EDR/XDR deployed across endpoints with active monitoring?', options: [{label: 'Does Not Exist', value: 0, detail: 'No EDR'}, {label: 'Initial', value: 1, detail: 'Basic antivirus only'}, {label: 'Repeatable', value: 2, detail: 'EDR on some endpoints'}, {label: 'Defined', value: 3, detail: 'EDR on most endpoints'}, {label: 'Managed', value: 4, detail: 'Full EDR with active response'}, {label: 'Optimized', value: 5, detail: 'XDR with full visibility and automated response'}] },
            { id: 'T2.2', text: 'Network Detection and Response (NDR) capabilities exist', context: 'Are network traffic analysis and IDS/IPS capabilities deployed?', options: [{label: 'Does Not Exist', value: 0, detail: 'No NDR'}, {label: 'Initial', value: 1, detail: 'Basic firewall logs'}, {label: 'Repeatable', value: 2, detail: 'IDS/IPS deployed'}, {label: 'Defined', value: 3, detail: 'NDR with traffic analysis'}, {label: 'Managed', value: 4, detail: 'Full NDR with encrypted traffic inspection'}, {label: 'Optimized', value: 5, detail: 'AI-driven NDR with automated threat detection'}] },
            { id: 'T2.3', text: 'Security Orchestration (SOAR) is implemented', context: 'Is a SOAR platform used to automate and orchestrate response actions?', options: [{label: 'Does Not Exist', value: 0, detail: 'No SOAR'}, {label: 'Initial', value: 1, detail: 'Manual processes only'}, {label: 'Repeatable', value: 2, detail: 'Some scripted automation'}, {label: 'Defined', value: 3, detail: 'SOAR deployed with basic playbooks'}, {label: 'Managed', value: 4, detail: 'SOAR with comprehensive playbooks'}, {label: 'Optimized', value: 5, detail: 'Fully automated response with human oversight'}] },
            { id: 'T2.4', text: 'Vulnerability management tools are integrated', context: 'Are vulnerability scanners integrated with the SOC workflow?', options: [{label: 'Does Not Exist', value: 0, detail: 'No vulnerability tools'}, {label: 'Initial', value: 1, detail: 'Standalone scanners'}, {label: 'Repeatable', value: 2, detail: 'Scan results reviewed'}, {label: 'Defined', value: 3, detail: 'Integrated with ticketing'}, {label: 'Managed', value: 4, detail: 'Full integration with risk-based prioritization'}, {label: 'Optimized', value: 5, detail: 'Continuous scanning with automated remediation workflows'}] }
          ]
        }
      ]
    },
    {
      id: 'coverage',
      name: 'Coverage',
      description: 'Assess the breadth and depth of SOC monitoring coverage across the environment.',
      icon: '',
      categories: [
        {
          id: 'monitoring_scope',
          name: 'Monitoring Scope',
          description: 'Breadth of monitoring coverage across infrastructure.',
          questions: [
            { id: 'C1.1', text: 'Critical assets are identified and monitored', context: 'Are all business-critical assets identified, classified, and under SOC monitoring?', options: [{label: 'Does Not Exist', value: 0, detail: 'No asset identification'}, {label: 'Initial', value: 1, detail: 'Few critical assets known'}, {label: 'Repeatable', value: 2, detail: 'Some critical assets monitored'}, {label: 'Defined', value: 3, detail: 'Most critical assets monitored'}, {label: 'Managed', value: 4, detail: 'All critical assets monitored'}, {label: 'Optimized', value: 5, detail: 'Full asset visibility with dynamic classification'}] },
            { id: 'C1.2', text: 'Cloud environments are covered by SOC monitoring', context: 'Are cloud workloads (AWS, Azure, GCP) integrated into SOC monitoring?', options: [{label: 'Does Not Exist', value: 0, detail: 'No cloud monitoring'}, {label: 'Initial', value: 1, detail: 'Cloud not in scope'}, {label: 'Repeatable', value: 2, detail: 'Basic cloud log collection'}, {label: 'Defined', value: 3, detail: 'Cloud security tools deployed'}, {label: 'Managed', value: 4, detail: 'Comprehensive cloud monitoring'}, {label: 'Optimized', value: 5, detail: 'Cloud-native security with CSPM and CWPP'}] },
            { id: 'C1.3', text: 'Remote/mobile workforce is covered', context: 'Does SOC monitoring extend to remote workers and mobile devices?', options: [{label: 'Does Not Exist', value: 0, detail: 'No remote coverage'}, {label: 'Initial', value: 1, detail: 'VPN logs only'}, {label: 'Repeatable', value: 2, detail: 'Some remote monitoring'}, {label: 'Defined', value: 3, detail: 'EDR on remote devices'}, {label: 'Managed', value: 4, detail: 'Comprehensive remote monitoring'}, {label: 'Optimized', value: 5, detail: 'Zero-trust with full remote visibility'}] },
            { id: 'C1.4', text: 'OT/IoT environments are covered', context: 'Are operational technology and IoT devices monitored by the SOC?', options: [{label: 'Does Not Exist', value: 0, detail: 'No OT/IoT coverage'}, {label: 'Initial', value: 1, detail: 'OT/IoT not in scope'}, {label: 'Repeatable', value: 2, detail: 'Basic OT visibility'}, {label: 'Defined', value: 3, detail: 'OT monitoring tools deployed'}, {label: 'Managed', value: 4, detail: 'Integrated IT/OT monitoring'}, {label: 'Optimized', value: 5, detail: 'Full convergence with specialized OT detection'}] }
          ]
        },
        {
          id: 'operating_hours',
          name: 'Operating Hours & Response',
          description: 'SOC operational coverage hours and response capabilities.',
          questions: [
            { id: 'C2.1', text: 'SOC operating hours match business risk profile', context: 'Does the SOC operate during hours aligned with the organization\'s risk exposure?', options: [{label: 'Does Not Exist', value: 0, detail: 'No defined hours'}, {label: 'Initial', value: 1, detail: 'Business hours only'}, {label: 'Repeatable', value: 2, detail: 'Extended hours'}, {label: 'Defined', value: 3, detail: '16/5 coverage'}, {label: 'Managed', value: 4, detail: '24/5 coverage'}, {label: 'Optimized', value: 5, detail: '24/7/365 with follow-the-sun'}] },
            { id: 'C2.2', text: 'After-hours incident response capability exists', context: 'Can the SOC respond to critical incidents outside normal operating hours?', options: [{label: 'Does Not Exist', value: 0, detail: 'No after-hours capability'}, {label: 'Initial', value: 1, detail: 'Call tree only'}, {label: 'Repeatable', value: 2, detail: 'On-call rotation'}, {label: 'Defined', value: 3, detail: 'Formal on-call program'}, {label: 'Managed', value: 4, detail: 'Automated alerting with on-call'}, {label: 'Optimized', value: 5, detail: 'Full 24/7 response with automated initial triage'}] },
            { id: 'C2.3', text: 'Mean Time to Detect (MTTD) is tracked and within acceptable thresholds', context: 'How quickly are security threats detected from initial compromise?', options: [{label: 'Does Not Exist', value: 0, detail: 'MTTD not tracked'}, {label: 'Initial', value: 1, detail: 'Days to weeks'}, {label: 'Repeatable', value: 2, detail: 'Hours to days'}, {label: 'Defined', value: 3, detail: 'Hours'}, {label: 'Managed', value: 4, detail: 'Minutes to hours'}, {label: 'Optimized', value: 5, detail: 'Minutes with continuous improvement'}] },
            { id: 'C2.4', text: 'Mean Time to Respond (MTTR) is tracked and within acceptable thresholds', context: 'How quickly does the SOC respond to and contain security incidents?', options: [{label: 'Does Not Exist', value: 0, detail: 'MTTR not tracked'}, {label: 'Initial', value: 1, detail: 'Days'}, {label: 'Repeatable', value: 2, detail: 'Hours to days'}, {label: 'Defined', value: 3, detail: 'Hours'}, {label: 'Managed', value: 4, detail: 'Under 1 hour for critical'}, {label: 'Optimized', value: 5, detail: 'Minutes with automated containment'}] }
          ]
        }
      ]
    }
  ]
};
