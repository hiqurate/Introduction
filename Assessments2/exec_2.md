
HAWKSIGHT
HawkSight delivers AI-powered security risk assessments tailored to Indian SMBs across key industries. Each module uses a custom questionnaire covering network, endpoint, identity, email/phishing, cloud/SaaS, data protection, backups/BCP, vendor risk, physical security, logging/monitoring, incident response and governance. We base our controls on widely‑accepted standards: CIS Critical Security Controls (prioritized best practices cost-effective for small orgs) and Indian regulations (e.g. CERT‑In’s 6‑hour incident reporting and 180‑day log retention rules). For example, healthcare is India’s most attacked sector (21.8% of incidents), so our Healthcare module emphasizes PHI protection, endpoints, staff training and backups. Education faces rampant ransomware and phishing, so its module focuses on patching and MFA. Retail/e‑commerce sees account takeovers and payment fraud, so we include MFA, PCI‑DSS and encryption checks. Each question has a risk weight and recommended evidence/remediation. Scores are normalized to 0–100 (higher is better) with thresholds (≥80 good, 60–79 moderate, <60 high/critical risk). HawkSight then generates an AI-driven report: an executive summary, domain heatmap, risk trend chart, top-5 risks, likely threat scenarios, and a prioritized 30/90‑day remediation roadmap. All content (questions, scoring and recommendations) is tuned for Indian SMB context with low-cost, practical fixes (e.g. free MFA, open-source EDR, basic backups) and guidance from CIS Controls and CERT‑In.
Industry-Specific Assessment Modules
Below are sample question sets for each industry. Questions are organized by domain. Each row includes the question, response type, answer options, risk weight (1–5), mapping to controls (for internal use), recommended evidence, and remediation priority (High/Med/Low).
Retail & E‑Commerce Security Assessment
Customers in retail/e‑commerce face account takeover (ATO), POS breaches, payment fraud, supply-chain hacks, and privacy leaks. We include questions on online payments, POS devices, CRM, customer data, and store networks. For example, “Do you use multi-factor authentication (MFA) for all user and admin logins?” (Yes/No, weight=5; evidence: screenshots of MFA config; priority=High) addresses ATO risk.
Question (Retail/E-commerce)
Type
Options / Answer
Weight
Controls Mapping (NIST/SOC)
Evidence (Suggested)
Remediation Priority
Do you use multi-factor authentication (MFA) for all user and administrator accounts (including e-shop back-end)?
MCQ (Single)
Yes/No
5
IA-2; CC6
Screenshot of MFA setup
High
Are your point-of-sale (POS) or payment systems segmented from other networks?
MCQ (Single)
Yes/No
4
PE-2; SC-7
Network diagram, VLAN config
High
Is all payment and customer data encrypted at rest and in transit?
MCQ (Single)
Yes/No
5
SC-12; CP-2
Encryption certificates, logs
High
Do you comply with PCI-DSS (self-attested) for payment processing?
MCQ (Single)
Yes/No/Partial
4
SC-28; CP-3
PCI attestation or policy docs
Medium
Do you regularly update and patch e-commerce platforms and POS software?
MCQ (Single)
Always/Most/Occasionally/Never
5
CM-2; SI-2
Patch records, version history
High
Do you use email filtering or cloud email security to scan order/customer emails for phishing/malware?
MCQ (Single)
Yes/No
4
SI-4; DE-3
Email gateway logs, policy
Medium
Are employee devices (laptops, phones) managed/secured (antivirus, MDM)?
MCQ (Single)
Yes/No
4
CM-7; MP-3
Endpoint management dashboard
Medium
Do you maintain an inventory of all store and IT assets (servers, PCs, IoT devices)?
MCQ (Single)
Yes/No
3
CM-8; MP-8
Asset inventory report
Medium
Do you have a formal incident response plan for security breaches?
MCQ (Single)
Yes/No
5
IR-1; PIA-3
Incident response plan document
High
Do you perform regular vulnerability scans or penetration tests on your network/website?
MCQ (Single)
Yes/No
4
SI-2; RA-5
Scan reports, pentest reports
Medium
Are critical systems (server/backups) backed up offline or to an isolated cloud?
MCQ (Single)
Daily/Weekly/Monthly/Never
5
CP-9; CP-10
Backup logs, cloud backup config
High
How many domains or external web apps do you publicly expose (shop, admin panel, APIs)?
Numeric (integer)
Number (e.g. 3 domains)
3
CM-2; PM-5
Domain listing, screenshot
Low
Are third-party vendors (e.g. logistics, payment gateways) security assessed?
MCQ (Single)
Yes/No
4
SA-12; SR-3
Vendor contracts, attestation
Medium
Do you train staff on phishing and secure checkout procedures at onboarding?
MCQ (Single)
Yes/No
3
AT-2; UA-4
Training attendance sheet
Medium
Domain Scores:
(auto)










– Network Security (firewalls, VPN)
–


sum up
(subset of Q above)


–
– Endpoint Security (antivirus, patching)
–








–
– Access Control (auth, MFA)
–








–
– Data Protection (encryption, PCI)
–








–
– Backup & DR
–








–

Healthcare Security Assessment
Healthcare organizations handle highly sensitive patient data and face frequent ransomware/phishing attacks. Key domains include medical device/IoT security, PHI encryption, compliance (HIPAA/PDPA), staff access control, and incident readiness. Questions emphasize endpoint EDR, secure EMR systems, and rapid response.
Question (Healthcare)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Do you encrypt patient/PHI data at rest and in transit (DB, EMR, devices)?
MCQ (Single)
Yes/No
5
SC-13; SC-12
Encryption certificates/logs
High
Do you use an EDR (Endpoint Detection & Response) or behavior-based antivirus on all hospital/clinic endpoints?
MCQ (Single)
Yes/No
5
SI-3; IR-4
EDR deployment report
High
Are all systems (servers, medical devices, workstations) patched within 30 days?
MCQ (Single)
Yes/No/Partial
4
CM-2; SI-2
Patch management logs
High
Do you segregate medical devices (MRI, infusion pumps) on a separate VLAN/air-gapped network?
MCQ (Single)
Yes/No
4
SC-7; SC-8
Network diagrams
Medium
Is there a formal HIPAA/PDPA compliance program or privacy officer designated?
MCQ (Single)
Yes/No
3
PM-1; PM-5
Compliance policy
Medium
Are staff required to use MFA for hospital systems (EMR, admin portals)?
MCQ (Single)
Yes/No
5
IA-2; PS-8
MFA configuration screenshot
High
Do you conduct annual security awareness training (phishing simulations)?
MCQ (Single)
Yes/No
3
AT-3; PM-6
Training records
Medium
Are there offline (disconnected) backups of critical data (imaging, records)?
MCQ (Single)
Daily/Weekly/Monthly/Never
5
CP-2; CP-9
Backup logs
High
How quickly can you restore operations from backups after an outage?
Free Text
Describe RTO/RPO goals
4
CP-3; IR-7
RTO/RPO documentation
Medium
Do you log and monitor access to patient records and admin systems 24/7?
MCQ (Single)
Yes/No
4
AU-6; SI-4
SIEM/monitoring screenshots
High
Is an incident response team/plan in place for cyber incidents?
MCQ (Single)
Yes/No
5
IR-1; IR-2
IR plan document
High
Are physical areas (server room, pharmacy) locked and access-logged?
MCQ (Single)
Yes/No
3
PE-2; PE-3
Access log prints
Medium
Domain Scores:
(auto)










– Medical/Device Security (IoT, scanners)
–


sum up




–
– Data & Privacy (PHI, encryption)
–








–
– Endpoint & Network Security
–








–
– Backup/Resilience
–








–
– Governance & Training
–








–

Financial Services / FinTech Assessment
FinTech and financial firms must guard highly valuable customer and transaction data. Common threats include BEC, transaction fraud, insider fraud, and sophisticated intrusion. We focus on strong authentication, secure transaction systems (PCI compliance, encryption), fraud monitoring, and vendor risk (e.g. payment processors).
Question (Financial/FinTech)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Do you enforce MFA on all banking/finance applications (online banking, trading)?
MCQ (Single)
Yes/No
5
IA-2; PS-8
MFA config screenshot
High
Is customer financial data (transaction logs, PII) encrypted in storage?
MCQ (Single)
Yes/No
5
SC-12; SC-13
DB encryption settings
High
Are transaction systems and databases regularly monitored for anomalies/fraud?
MCQ (Single)
Yes/No
4
SI-4; IR-5
Monitoring dashboard
Medium
Do you conduct periodic fraud/security audits or penetration tests on your systems?
MCQ (Single)
Yes/No
4
RA-5; SI-2
Audit reports, pentest logs
Medium
Are all systems patched within 30 days and are older versions decommissioned?
MCQ (Single)
Yes/No/Partial
4
CM-2; SI-2
Patch logs
High
Is sensitive data (credit cards, personal data) stored with tokenization or minimal retention?
MCQ (Single)
Yes/No
5
SC-13; CP-2
Data classification policy
High
Do you use secure coding practices / code review for in-house apps?
MCQ (Single)
Yes/No
3
SA-11; SR-5
Code review records
Medium
Are third-party vendors (payment gateways, cloud) security-assessed and SLA-bound?
MCQ (Single)
Yes/No/Partial
4
SA-12; SR-3
Vendor assessments
High
Do employees receive anti-phishing training specific to financial fraud?
MCQ (Single)
Yes/No
3
AT-3; PS-7
Training records
Medium
Do you have off-site backups of critical financial databases?
MCQ (Single)
Daily/Weekly/Monthly/Never
5
CP-2; CP-9
Backup logs
High
Is network segmentation in place between public internet systems and core financial systems?
MCQ (Single)
Yes/No
4
SC-7; SC-8
Network diagram
Medium
Do you log all administrative actions and review them regularly?
MCQ (Single)
Yes/No
4
AU-3; AU-6
Audit log extracts
High
Domain Scores:
(auto)










– Transaction Security (PCI, encryption)
–


sum up




–
– Identity & Access (MFA, RBAC)
–








–
– Monitoring & Auditing
–








–
– Vendor & Compliance
–








–
– Resilience (backup, patches)
–








–

Manufacturing Security Assessment
Manufacturing firms often integrate legacy OT with IT, and face risks to production systems and supply chains. Key concerns include unpatched OT/IoT devices, network segmentation (IT/OT), intellectual property (IP) protection, and ransomware readiness. Questions cover ICS network security, IoT asset management, supplier security, and business continuity.
Question (Manufacturing)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Do you segregate your OT/Industrial Control Systems (ICS) network from IT network?
MCQ (Single)
Yes/No
5
SC-7; SC-8
Network diagram
High
Are IoT/SCADA devices (sensors, controllers) inventoried and patched?
MCQ (Single)
Yes/No
5
CM-8; SI-2
Asset inventory, patch logs
High
Do you have firewalls or NAC to restrict communications to/from IoT devices?
MCQ (Single)
Yes/No
4
SC-7; AC-3
Firewall config, policies
Medium
Is there an incident response plan specific to production disruptions or ransomware?
MCQ (Single)
Yes/No
5
IR-1; CP-3
IR plan, BCP procedures
High
Are backups of operational data (CAD files, specs) stored offline and tested?
MCQ (Single)
Yes/No
5
CP-9; CP-10
Backup logs, test reports
High
Do you require MFA for remote maintenance or vendor access to equipment?
MCQ (Single)
Yes/No
4
IA-2; SR-12
MFA logs, vendor access records
Medium
Are supplier and vendor security requirements documented (supplies, software)?
MCQ (Single)
Yes/No
4
SA-12; SR-3
Contracts, questionnaires
Medium
Do you encrypt sensitive design/IP data at rest?
MCQ (Single)
Yes/No
4
SC-12; SC-13
Encryption policy, logs
Medium
Is there a patch management process for both IT and OT systems?
MCQ (Single)
Yes/No
5
CM-2; CM-3
PMO policy, patch schedule
High
Do you perform annual risk assessments for supply chain and vendor cyber risk?
MCQ (Single)
Yes/No
3
RA-1; SR-2
Risk assessment report
Medium
Are physical security measures in place (CCTV, guards) around manufacturing floor/servers?
MCQ (Single)
Yes/No
3
PE-2; PE-4
Security audit logs
Medium
Domain Scores:
(auto)










– Network & ICS Segmentation
–


sum up




–
– Asset Management (IoT/OT devices)
–








–
– Business Continuity
–








–
– Supply Chain/Vendor Risk
–








–
– Governance & Training
–








–

Education Sector Security Assessment
Schools and colleges store vast student data but often lack robust security. Common threats include ransomware, phishing (even QR code scams), unpatched learning platforms, and weak network segmentation. This module covers BYOD policies, LMS security, data privacy for minors, and user training.
Question (Education)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Are student/staff accounts protected with MFA (especially admin)?
MCQ (Single)
Yes/No
5
IA-2; PM-5
MFA config screenshot
High
Are laptops/tablets used by students managed by the school (EDR/antivirus)?
MCQ (Single)
Yes/No
4
CM-6; MP-2
MDM/EDR logs
Medium
Do you regularly update/patch learning management systems and admin portals?
MCQ (Single)
Yes/No/Partial
5
SI-2; CM-3
Update schedule, logs
High
Are school networks segmented (guest Wi-Fi vs staff vs servers)?
MCQ (Single)
Yes/No
4
SC-7; SC-8
Network config diagram
Medium
Do you restrict and monitor file sharing (e.g. Google Drive, USB) to prevent data leaks?
MCQ (Single)
Yes/No
4
MP-5; SI-4
DLP policy, logs
Medium
Are backups of student records and admin data kept offsite/offline?
MCQ (Single)
Daily/Weekly/Monthly/Never
5
CP-9; CP-10
Backup logs
High
Do employees and students receive security awareness training (phishing/QR)?
MCQ (Single)
Yes/No
3
AT-2; PM-6
Training records
Medium
Are major educational platforms (SIS, LMS) audited for security?
MCQ (Single)
Yes/No
3
RA-5; SA-11
Audit reports
Low
Is personal data of minors (health, guardian info) encrypted and access-controlled?
MCQ (Single)
Yes/No
4
SC-12; SC-13
Data protection policy
Medium
Do you log and review network access/authentication logs regularly?
MCQ (Single)
Yes/No
4
AU-6; IR-5
SIEM reports
Medium
Is there a plan for incident communication (to parents, authorities) if breach occurs?
MCQ (Single)
Yes/No
3
IR-2; IR-4
Communication plan
Low
Domain Scores:
(auto)










– Access Control (MFA, account management)
–


sum up




–
– Endpoint & Patch Management (EDR, updates)
–








–
– Data Protection (student records, privacy)
–








–
– Backup & Continuity
–








–
– Awareness & Policies
–








–

Professional Services / IT/Startup Security Assessment
Consultancies, IT firms and startups handle client IP and typically use cloud/SaaS. They face threats from compromised developer accounts, source code leaks, remote work VPN exploits, and phishing. We include questions on code repository security, cloud SaaS controls, and insider risk.
Question (Professional/IT)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Is source code (repos) access controlled (MFA, SSO) and regularly audited?
MCQ (Single)
Yes/No
4
IA-2; PM-4
Repo access logs
High
Do you enforce MFA on all cloud/SaaS accounts (Google Workspace, AWS, etc.)?
MCQ (Single)
Yes/No
5
IA-2; AC-2
Cloud IAM policy screenshots
High
Are employee laptops (especially dev machines) encrypted and company-managed?
MCQ (Single)
Yes/No
4
MP-2; CM-8
MDM inventory, encryption logs
High
Do you restrict personal (BYOD) device access or implement conditional access?
MCQ (Single)
Yes/No
3
AC-3; IA-4
BYOD policy, CASB logs
Medium
Are cloud assets (VMs, databases) continuously monitored for misconfigurations?
MCQ (Single)
Yes/No
4
SI-4; CM-6
Cloud console snapshots
Medium
Do you perform regular pentests on your public apps and network?
MCQ (Single)
Yes/No
3
RA-5; SI-2
Pentest reports
Medium
Are all employees trained on secure development and phishing (SOC2 meets CIA)?
MCQ (Single)
Yes/No
3
AT-3; PM-6
Training logs
Medium
Do you have a clear data classification policy and encryption for sensitive data (customer IP, PII)?
MCQ (Single)
Yes/No
4
SC-12; SC-13
Classification document
Medium
Are backups of critical code and data kept in separate environments (e.g. offline Git backup)?
MCQ (Single)
Yes/No
4
CP-9; CP-10
Backup procedures
High
Is detailed logging enabled (cloud IAM logs, app logs) and retained 90+ days?
MCQ (Single)
Yes/No
4
AU-6; CP-3
SIEM retention settings
Medium
Is there an incident response process for a compromised developer/administrator account?
MCQ (Single)
Yes/No
4
IR-1; IR-2
IR plan
High
Domain Scores:
(auto)










– Identity & Access (SSO, MFA)
–


sum up




–
– Cloud/SaaS Security
–








–
– Data & IP Protection
–








–
– Logging & Monitoring
–








–
– Incident Readiness
–








–

Hospitality Security Assessment
Hotels and restaurants store guest PII and payment details, and use many IoT devices (smart locks, POS, HVAC). They face phishing, POS malware and DDoS (online bookings). Questions cover guest Wi-Fi isolation, POS/Mobile payment security, and multimedia systems.
Question (Hospitality)
Type
Options / Answer
Weight
Controls Mapping
Evidence (Suggested)
Remediation Priority
Is guest Wi-Fi completely isolated from your corporate and POS networks?
MCQ (Single)
Yes/No
4
SC-7; AC-4
Network diagram
High
Do you use antivirus/EDR on POS terminals and connected devices?
MCQ (Single)
Yes/No
4
SI-3; SI-4
Endpoint logs
High
Are online booking/payment systems (websites) regularly scanned for vulnerabilities?
MCQ (Single)
Yes/No
4
RA-5; SI-2
Scan reports
Medium
Is customer payment card data tokenized or encrypted?
MCQ (Single)
Yes/No
5
SC-13; CP-2
POS configuration
High
Do employees use MFA for hotel management and POS software access?
MCQ (Single)
Yes/No
5
IA-2; PS-8
MFA logs
High
Are smart devices in rooms (locks, thermostats) regularly updated or isolated?
MCQ (Single)
Yes/No
3
CM-2; SC-7
Firmware update logs
Medium
Do staff receive training on phishing and social engineering?
MCQ (Single)
Yes/No
3
AT-3; PM-6
Training records
Medium
Are CCTV and door access logs stored securely and reviewed periodically?
MCQ (Single)
Yes/No
3
PE-2; AU-6
Access log archives
Low
Do you maintain backups of reservation and payment systems?
MCQ (Single)
Daily/Weekly/Monthly/Never
5
CP-9; CP-10
Backup logs
High
Is there a disaster recovery plan for major outages (e.g. DDoS, ransomware)?
MCQ (Single)
Yes/No
4
IR-1; IR-2
DR plan
Medium
Domain Scores:
(auto)










– Network Segmentation (guest vs internal)
–


sum up




–
– Payment/Data Protection
–








–
– Device & Endpoint Security
–








–
– Response & Continuity
–








–
– Physical & Personnel
–








–

Scoring Model
Each question’s answer yields points (0 for worst, up to full weight for best answers). Domain scores are the sum of points for questions in that domain, normalized to a 0–100 scale. Then we apply domain weights to compute the overall security score. Suggested domain weights (can vary by industry) are:
Domain
Weight (Retail)
Weight (Healthcare)
Weight (FinTech)
Weight (Manufacturing)
Weight (Education)
Weight (IT Services)
Weight (Hospitality)
Identity & Access
15%
15%
20%
15%
15%
20%
15%
Network & Endpoint
20%
20%
20%
20%
15%
15%
20%
Data Protection
15%
15%
15%
10%
20%
15%
15%
Backup & Continuity
15%
15%
10%
15%
15%
10%
15%
Monitoring & Incident
15%
15%
15%
15%
15%
20%
15%
Governance & Training
10%
10%
5%
10%
10%
10%
10%
Third-Party Risk
10%
10%
15%
10%
10%
10%
10%
Total
100%
100%
100%
100%
100%
100%
100%

The Overall Security Score = Σ(domain_score × domain_weight). We normalize to 0–100. Severity thresholds can be: >=80: Good (low risk); 60–79: Moderate risk; 40–59: High risk; <40: Critical risk.
Sample Report & Visuals (HawkSight Output)
After assessment, HawkSight’s AI engine generates: an Executive Summary, Top Risks, Threat Predictions, a Remediation Roadmap, and interactive charts. For illustration, consider a Retail SME scoring 65/100:
Executive Summary: “Your overall Cyber Health Score is 65/100, indicating moderate risk. Key gaps are in backup practices, endpoint protection, and third‑party security. Retail threats like payment fraud and ransomware are likely given your current posture. We recommend immediate MFA deployment, patching of all POS endpoints, and isolating backups. Over 90 days, implement quarterly phishing training and segment your network for POS devices.”
Top 5 Risks:
No MFA on admin/shop accounts (Risk: account takeover).
Outdated POS systems (Risk: POS malware).
Weak backups (Risk: prolonged outage if ransomed).
Shared credentials (Risk: insider fraud).
Publicly exposed management panel (Risk: external hacking).
Threat Predictions: Based on your answers, the most likely threats are Ransomware(via phishing or vulnerable servers), Payment Fraud (via unencrypted cards), and Business Email Compromise (due to missing MFA).
30/90‑Day Remediation Roadmap: (see timeline below)
Days 0–30: Enable MFA on critical accounts; patch all systems; implement encrypted backups (offline); train staff on phishing.
Days 31–60: Segment POS network; deploy antivirus/EDR; start vendor security review.
Days 61–90: Conduct tabletop incident response drill; review logs (CERT-In 6‑hour report readiness); implement basic SIEM alerts.
Charts:
Radar Chart: Shows sub-scores by domain (e.g. Network, Identity, Data, BC, etc.) in a radial graph.
Risk Heatmap: A color-coded grid of domain vs. severity showing critical (red) to good (green) areas.
Trend Chart: Line or bar chart comparing current vs. previous assessment scores by domain.
Figure: Example industry risk distribution (education vs. others) from Bitsight – HawkSight would produce similar radar/heatmap charts for your company’s domains.
mermaid
Copy
flowchart LR
    A[Admin sets up Customer Org & Modules] --> B[Customer completes Q&A]
    B --> C[AI Analysis (LLM + RAG)]
    C --> D[Generate Score & Findings]
    D --> E[Generate PDF Report & Dashboard]
    E --> F[Customer reviews report & remediation plan]
2026-07-052026-07-122026-07-192026-07-262026-08-022026-08-092026-08-162026-08-232026-08-30Enable MFA and Patch Staff Phishing Training Network Segmentation & EDR Vendor Security Review IR Drill & Log Review Policy & Process Updates Initial (0–30 days)Secondary (31–60 days)Later (61–90 days)30/90-Day Remediation Plan
Show code
HawkSight Modules & Website Copy
Module Names/Titles (by industry):
RetailShield – Retail & E‑Commerce Security Check
HealthShield – Healthcare Cyber Risk Assessment
FinShield – Finance & FinTech Security Check
ManuShield – Manufacturing Security Assessment
EduShield – Education Security Healthcheck
TechShield – IT/Startup Security Assessment
HotelShield – Hospitality Cybersecurity Check
Website Hero Snippet: “HawkSight: AI-Powered Security Readiness for SMBs. Instantly gauge your company’s cyber health with industry-specific assessments. Get a clear risk score, detailed remediation plan and compliance insights – no jargon, just actionable intelligence.”
Features (Sample Bullets):
Automated Questionnaires: Industry-tailored questions (Retail, Healthcare, Finance, etc.) covering networks to backups.
Instant Scoring: Weighted risk scoring (0–100) with severity levels.
AI-Driven Reports: Natural-language executive summaries, top risks, and 30/90-day remediation roadmap (based on CERT-In/CIS best practices).
Visual Dashboards: Domain radar charts, risk heatmaps, and progress trends.
Evidence Collection: Upload documents (policies, configs) and annotate answers for audit readiness.
Historical Tracking: Compare past assessments to show security improvements.
Pricing Tiers:
Free “Quick Scan”: 15‑minute high-level questionnaire (10 questions) with instant score and basic report. Perfect for a quick health snapshot. (No obligation, unlimited use for 1 site).
Standard Assessment (Paid): Full module access (50–100 questions) in one industry. Includes detailed AI report PDF, baseline remediation plan, and 1-month dashboard history. (E.g. ₹20K/site one-time or ₹5K/month subscription for continuous self-assessments.)
Comprehensive Package (Paid): Multiple modules (up to 3 industries) + benchmark analytics + quarterly reassessments. Includes advanced features: custom risk weighting, executive presentation, and prioritization matrix. (Contact for enterprise pricing; bundles start ~₹50–100K/year.)
Each package emphasizes practical, low-cost fixes (MFA, patch schedules, free tools) and maps to CIS Controls and CERT-In rules. HawkSight is marketed as “Your SMB Cyber Health Companion” – delivering insights and a clear roadmap so businesses can improve security posture without the complexity of full compliance audits.
Sources: CIS Controls (best practice framework); CERT-In India (incident reporting, logs); industry threat reports.

