
Executive Summary
Indian SMBs face a surge of cyber risks across sectors. Studies report 43% of all attacks target small businesses, and 60% of victimized SMBs go out of business within months. Cybercriminals see SMBs as “easy targets” due to weaker defenses. To address this, we propose AI-powered, industry-specific risk assessment modules (not rigid compliance checklists). Each module – e.g. Retail/E-commerce, Healthcare, FinTech/Financial Services, Manufacturing, IT Services, Education, Hospitality, Logistics, Professional Services – has 10–12 security domains (Identity, Endpoints, Network, Cloud, Email/Phishing, Data Protection, Backup/BCP, Third-Party Risk, Physical Security, Incident Response, Monitoring, etc.). Within each domain we include ~80–150 probing questions (multiple choice, multi-select, free text, date, numeric, file uploads) tailored to industry risks. This yields a comprehensive questionnaire for each industry. Answers map to weighted scores and risk levels, and the AI engine cross-references answers against best-practice guidance (CIS/NIST controls, OWASP, CERT-In advisories, etc.). The AI then predicts likely threats (e.g. ransomware for healthcare, payment fraud for retail), generates prioritized remediation roadmaps (immediate, 30-, 90-day), and computes a Posture Score per domain and overall. Results are shown via executive-friendly reports with charts (e.g. spider/radar charts of domain scores, risk heatmaps, trend lines) and business-impact narratives. This platform helps SMBs see “How secure am I?” and “What should I fix next?” in clear language.
The solution emphasizes risk and impact over formal compliance. For example, a hospital will see questions framed as protecting patient data and devices (HIPAA-type controls), while a retailer’s module focuses on payment security and supply-chain. Each industry module incorporates relevant examples: e.g. hospitality questions on guest Wi-Fi and POS networks (72% of hotel POS systems were attacked last season), logistics questions on IoT/truck security and supply-chain (Infosys notes most logistics firms lack a dedicated CISO), etc. Every question ties to a “business impact” (e.g. “Email fraud could lead to financial loss or brand damage”), and each answer choice has a score (0–5) and severity. The AI uses these to compute domain scores and an overall security posture percentage.
The following sections outline the industry modules, example questions and outputs, scoring model, reporting elements, and system architecture. Where possible we cite authoritative sources for best practices and threat data.
Industry-Specific Assessment Modules
We design a separate module for each major SMB sector. Each module contains ~10–12 domains reflecting the industry’s typical risks. Below we summarize the domain coverage and give sample questions (not exhaustive) for each industry. (NIST CSF and generic SOC/CMM modules remain as-is and are not repeated here.) We also indicate question types, expected evidence, and rough scoring weights. All questions focus on risk factors(e.g. “Is customer data encrypted?”) rather than compliance checkbox. SMB-tailored phrasing (non-technical language) and low-cost solutions are prioritized.
Table 1. Common Assessment Domains (per Industry Module)
(Illustrative, each industry picks relevant domains)
Identity & Access: Account/MFA/password policies, privilege management.
Endpoint & Device Security: Antivirus, patching, mobile/IoT devices.
Network & Perimeter: Firewalls, Wi-Fi segregation, VPN, segmentation.
Cloud & SaaS: Office365/G Suite security, cloud configs, patching.
Email/Phishing: Filtering, training, spoof protection (SPF/DKIM).
Data Protection & Privacy: Encryption, data classification, regulatory privacy (HIPAA/DPDP, GDPR basics).
Backups & Business Continuity: Backup frequency, offsite/immutable copies, DR plan.
Third-party/Vendor Risk: Vendor access, shared credentials, vendor assessment.
Physical Security: Server room locks, CCTV, device locks, visitor badges.
Incident Response: IR plan, breach drills, reporting, roles.
Monitoring & Logging: SIEM/log review, IDS/IPS, anomalous behavior detection.
Application & Software (Dev/IT Services): Secure coding, patch management, vulnerability scanning (for IT firms).
Below we outline each industry module, highlighting key domains, example questions (MCQ types, answer options, evidence), and known threat context (with sources):
Retail & E-commerce Module
Context: Retailers face growing online threats. In 2025, 53% of retail data breaches involved customer PII (credit-card data is now less frequently stolen), and 44% of retail breaches had ransomware present. Supply-chain and third-party risks are high: 30% of retail breaches involved a vendor/partner. Large e-commerce and point-of-sale (POS) systems attract bot attacks and API exploits.
Key Domains: Payment/POS Security; Web/App Security (OWASP Top-10); Data/PII protection; Identity & Access; Network (segmented guest Wi-Fi); Endpoint (POS terminals, cash register PCs); Third-party risk (vendors, payment gateways); Incident Response; Monitoring (fraud logs).
Sample Questions (Retail):
Domain
Question (Answer Type)
Sample Answer Options
Evidence Example
Weight
Risk If No
Payment/POS
Are customer payment-card (PCI) details encrypted at rest? (Single-select)
Yes (full), Partial, No
Screenshot of DB/encryption config
5
High (card data theft)


Do you use two-factor authentication for admin interfaces (e.g. ecommerce backend)? (MCQ)
[ ] Yes, for all admins<br>[ ] Yes, for some<br>[ ] No, none
MFA logs, policy doc, screenshots
4
High (account compromise)


Is the POS/network separated from corporate network (VLAN/firewall)? (Yes/No)
Yes / No / “Don’t know”
Network diagram, firewall rule
3
Medium (lateral attacks)
Web Security
When was last web-application pentest or OWASP scan? (Date answer)
[date]
Pentest report
3
High (web vuln)


Do you perform code reviews or use an SAST tool for your e-commerce code? (MCQ)
[ ] Yes – code review<br>[ ] Yes – automated scans<br>[ ] No / Don’t know
Scan reports, commit logs
2
Medium (software flaws)
Data/Privacy
Are customer databases encrypted at rest (AES/RSA)? (Yes/No)
Yes / No
Encryption config screenshot
5
High (data leak)


Do you purge old customer data (per retention policy)? (MCQ)
[ ] Regularly purge<br>[ ] Irregularly purge<br>[ ] Never
Policy doc, DB retention config
2
Low (accumulated risk)
Endpoint
Do employee devices (POS terminals, laptops) run up-to-date antivirus/EDR? (Yes/No)
Yes / No
Antivirus dashboard
4
High (malware)
Third-Party
Do you assess vendors (e.g. payment gateway, shipping APIs) for security controls? (MCQ)
[ ] Annual risk assessment<br>[ ] Some vetting<br>[ ] None
Vendor audit report, contract clause
4
High (supply chain breach)
Email/Phish
Have employees had phishing-awareness training in past year? (MCQ)
[ ] Yes – regular sims<br>[ ] Only once<br>[ ] Never
Training certificates
2
Medium (email compromise)
Backup/BCP
Do you maintain offline (disconnected) backups of sales and inventory data? (Yes/No)
Yes / No
Backup logs, offsite backup config
5
High (ransomware)
Network
Is wireless (guest vs. staff) SSID segmented with strong WPA2/3? (MCQ)
[ ] Yes, segmented<br>[ ] Same network w/password<br>[ ] No Wi-Fi/Unknown
Wifi config screenshot
3
Medium (Wi-Fi attack)
Monitoring
Do you have logs/alerts for abnormal transactions (e.g. large refunds, bulk exports)? (MCQ)
[ ] Yes (IDS/alerts)<br>[ ] Manual review<br>[ ] No
SIEM dashboard, screenshot
3
Medium (fraud undetected)
Incident Response
Is there an incident response plan addressing a data breach or POS attack? (Yes/No)
Yes / No
IR plan document
4
High (chaotic response)

Retail Insights (citations): With online payments, customer PII is at high risk; similarly, POS/network hardening and segmentation are critical to prevent large-scale theft. The high incidence of ransomware in retail underscores the need for offline backups. Third-party (supply chain) security is also crucial—vendors have been exploited in 30% of retail breaches. This module’s questions emphasize protecting customer data and transaction systems first, with weight on encryption, MFA and backups (highest-score items).
Healthcare & Pharma Module
Context: Healthcare is now India’s most-attacked sector (≈21.8% of all Indian attacks in 2024). Hospitals hold vast sensitive patient data (PHI), run many medical devices, and must operate 24/7. Ransomware and targeted phishing are rampant; attackers know patient care hinges on quick recovery. IoT/medical devices often lack strong defenses. The AI-driven growth in telehealth and cloud EMRs adds new vulnerabilities.
Key Domains: Protected Health Information (PHI) security; Identity & Access (role-based, session timeouts); Endpoint (PCs, medical kit); Medical Device / IoT (X-Ray machines, pumps); Network (segmentation of device networks); Email/Phishing (staff training, whitelisting); Backup/Continuity (encrypted backups of records); Third-party (labs, EMR vendors); Incident Response (regulatory reporting); Monitoring (audit logs).
Sample Questions (Healthcare):
Domain
Question
Answer Type
Evidence
Weight
Business Impact
Data/Privacy
Is patient data (EHR, imaging) encrypted at rest and in transit?
Yes/No/Multi
Encryption config, TLS certs
5
Breach of PHI (legal fines)


Do you have a data classification policy for PHI vs. general data?
MCQ (Yes/No/Partial)
Policy doc
3
Data handling errors
Identity
Do staff use multi-factor auth for medical system logins?
MCQ (Yes/No/Partial)
MFA system logs
4
Unauthorized access


Are user accounts automatically disabled upon employee exit?
Yes/No
HR offboarding records
3
Insider misuse
Endpoints
Are all PCs/tablets regularly patched and monitored by antivirus?
MCQ
Patch management report
4
Malware infection


Do physicians have locked screens (auto-lock) on shared devices?
Yes/No
Endpoint settings
2
Opportunistic access
Medical IoT
Are networked medical devices on a separate VLAN?
Yes/No
Network diagram
5
Device compromise


Do you track software versions on all medical devices?
Yes/No
Asset inventory list
3
Unpatched vuln
Email/Phish
Do all employees complete annual phishing simulation training?
MCQ
Training records
3
Successful spear-phish


Is inbound email scanned for malware/links (ATP) and spoofing?
Yes/No
Email security logs
4
Malicious email delivery
Backup/BCP
Are patient records backed up to an offsite, encrypted location?
Yes/No
Backup logs
5
Data unavailability


Is disaster recovery (e.g. generator, failover) tested yearly?
MCQ
Test report
3
Extended downtime
Third-Party
Do third-party labs/vendors sign data protection agreements?
MCQ
Contracts
4
Data leakage via partner


Is vendor access to systems restricted (VPN, limited accounts)?
Yes/No
Access control logs
3
Supply chain entry
Incident Resp.
Do you have a HIPAA-style incident response plan?
Yes/No
IR plan doc
4
Regulatory penalties

Healthcare Insights (citations): The high attack rate (21.8% of attacks in India in 2024) shows healthcare must treat security as a core function. Attackers often use phishing or unpatched vulnerabilities to deliver ransomware. Thus, this module stresses backup plans(ransomware readiness) and behavior-based detection (per Seqrite’s advice). Protecting patient data (encryption) and devices (segmentation) are weighted highest because health data breaches can have severe patient-safety and legal impacts.
Financial Services & FinTech Module
Context: Financial firms handle money and personal financial data, facing strict regulations (RBI, PCI, KYC, etc.). FinTech apps rely heavily on APIs, mobile apps and integrated services, which expand attack surface. Threats include insecure APIs, broken access controls, and business-logic flaws. Phishing (to steal credentials) and mobile-banking malware are common. Ensuring strong encryption (TLS, tokenization) and fraud detection is essential.
Key Domains: Payment/Transaction Security (PCI, AML basics); Identity & Access Management (MFA for users/admins); API & Application Security; DevSecOps/CI-CD security; Endpoint (developer workstations, mobile devices); Data Encryption (in transit/rest); Network (secure DMZ for services); Third-party (partner banks, cloud providers); Email/Phishing (BEC threats); Monitoring (anomaly/fraud detection logs).
Sample Questions (FinTech):
Domain
Question
Type
Evidence
Weight
Risk
APIs/Apps
Are all API endpoints (customer or internal) authenticated and rate-limited?
MCQ
API gateway config
5
Unauthorized access, DoS


Do you regularly scan your code/API with a SAST/DAST tool?
Yes/No
Scan report
3
Undetected bugs
Access Control
Is role-based access enforced in transaction systems (least privilege)?
Yes/No
IAM policy
4
Excess privileges


Do you enforce session timeouts on banking apps?
Yes/No
System logs
3
Hijacked sessions
Encryption
Are all transactions (backend and mobile) protected with TLS 1.2+?
Yes/No
TLS config
5
Data interception


Is sensitive data (e.g. account numbers) tokenized or encrypted in databases?
Yes/No
DB schema docs
4
Data theft
Endpoint
Do employee endpoints run EDR/antivirus and are encrypted at disk level?
Yes/No
EDR dashboard
4
Malware, lost device
Third-Party
Do you vet cloud service providers and banks for security certifications (SOC2, ISO27001)?
MCQ
Vendor audits
3
Cloud misconfig


Are third-party software libraries checked for vulnerabilities (SBOM/SCA)?
Yes/No
SBOM
3
Supply chain vuln
Monitoring
Is there real-time fraud detection (transaction anomaly monitoring)?
Yes/No
Fraud system logs
4
Losses, compliance


Are system logs centrally collected and reviewed for suspicious activity?
Yes/No
SIEM logs
3
Undetected breach
IR/BCP
Do you have an incident response plan for cyber fraud or breach?
Yes/No
IR plan
4
Financial damage

FinTech Insights: FinTech apps’ insecure API endpoints are a prime risk, as noted in industry reports. Likewise, broken access control (missing least-privilege) is high risk. This module’s top-weight questions enforce strong authentication (MFA), encryption (PCI/TLS), and code reviews. Because fintech impacts money, trust and compliance, we emphasize access logs, encryption of financial data, and transaction monitoring.
Manufacturing & Industrial Module
Context: Manufacturing faces IT/OT convergence issues. Industries often have legacy control systems and many IoT sensors. Insider theft and espionage (IP theft) are significant. Ransomware can halt entire production lines (e.g. Honda attack). Unmanaged IoT/OT devices (40% of attacks as per industry studies) are common targets. Complex supply chains introduce third-party risks and dependencies.
Key Domains: Industrial Control (SCADA/PLC) Security; IT/OT Segmentation; Asset Inventory (machines, IoT); Patch/Vulnerability Management (industrial systems); Third-Party/Supply Chain (suppliers, contractors); Data Protection (design/IP safeguards); Access Control; Endpoint (工厂办公PCs); Backup/Recovery (production data, configs); Monitoring (SCADA logs, anomaly detection); Incident Response (production outage plan); Physical (plant access, device locks).
Sample Questions (Manufacturing):
Domain
Question
Type
Evidence
Weight
Risk
OT Security
Are OT/ICS networks strictly segmented from corporate networks?
Yes/No
Network diagrams
5
Production compromise


Do you maintain an inventory of all industrial control devices and their firmware versions?
Yes/No
Asset registry
4
Unknown vuln
Endpoint
Are production-line PCs protected by EDR and isolated?
Yes/No
EDR logs
4
Malware (Shodan bots)
Patch Mgmt
Are critical patch updates applied in a timely, tested manner on industrial PCs?
MCQ
Patch report
4
Known exploits
Supply Chain
Do you audit major suppliers for cybersecurity (e.g. vendor questionnaires)?
Yes/No
Audit evidence
4
Vendor breach risk
Insider
Do you log and review employee access to sensitive IP (e.g. design docs)?
MCQ
Access logs
3
IP theft
Email/Phish
Have engineers/staff received targeted phishing/vishing training?
Yes/No
Training record
3
Spear-phish risk
Backup/BCP
Are production plans and software backed up offsite and regularly tested?
Yes/No
Backup report
5
Ransomware downtime
Monitoring
Is anomaly detection (e.g. unexpected process changes) in place on control systems?
Yes/No
IDS/SCADA log
3
Delayed breach detection
Incident Resp
Is there a crisis plan for cyber incidents affecting the factory floor?
Yes/No
IR plan
4
Extended outage

Manufacturing Insights: Major manufacturers have internal threats and IP theft. Unpatched IoT/OT devices (often running old OS) are a known gap. Ransomware targeting production is a nightmare. We thus weight high on network segmentation, asset inventory, and offline backups. (For example, DataGuard advises isolating IoT devices and patching them regularly.) Third-party (equipment vendors) security is also critical given complex supplier networks.
IT & Software Services Module
Context: IT firms and consultancies have many developers and manage client data. Key issues are secure software development (SDLC), cloud/DevOps practices, and data security. Common risks: insecure code (OWASP Top-10), leaked credentials (Git repos), and BYOD/remote-work security. They often adopt modern tools (cloud, SaaS) but may lag on governance.
Key Domains: Secure DevOps (SDLC, code review, SAST/DAST); Cloud Security (AWS/Azure configs, IAM); Data Protection (client data); Identity (SSO, MFA for all); Endpoint Security (laptops, mobile BYOD); Network (VPN, firewalls); Third-Party (open-source components, subcontractors); Email/Phish; Backup/BCP (code repo backups, project archives); Incident Response; Monitoring (application logs, intrusion).
Sample Questions (IT Services):
Domain
Question
Type
Evidence
Weight
Risk
SDLC
Do you enforce code reviews and use SAST/DAST for all projects?
MCQ
CI logs/reports
4
Vulnerable app


Is there a secure development guideline in place for developers?
Yes/No
Policy doc
3
Weak dev practices
Cloud/IAM
Is multi-factor authentication required for all cloud console logins?
Yes/No
IAM logs
5
Cloud takeover


Do you use role-based access on cloud resources (least privilege)?
Yes/No
Cloud IAM policy
4
Excess access
Endpoint/Remote
Are all employee devices (workstations) encrypted and managed?
Yes/No
MDM logs
4
Lost device exposure


Do you have an approved list of corporate apps (no unsanctioned SaaS)?
Yes/No
ITSM inventory
3
Shadow IT risk
Email/Phish
Do you train staff on email security (common IT threats, safe dev ops)?
Yes/No
Training records
2
Phish, social eng.
Data Sec
Are client databases (even dev/test) encrypted and access-logged?
Yes/No
DB config
4
Data leakage
Backup
Are code repositories backed up and version-controlled offsite?
Yes/No
Repo logs
4
Code loss
IR/BCP
Is there an incident plan for a code repo breach or cloud compromise?
Yes/No
IR plan
3
Devops downtime

IT Services Insights: This module emphasizes secure development and cloud governance. Practices like code scanning and strict IAM reflect OWASP/CIS guidelines. Questions about unsanctioned cloud apps address shadow-IT (a known SMB gap). Primary threats here are data leaks and compromised developer credentials.
Education Module
Context: Schools and colleges are increasingly targeted by cyberattacks. Ransomware against educational institutions jumped 105% from 2022 to 2023. Students and staff often have low security awareness; phishing and USB attacks are common vectors. Education typically has many open networks (campus Wi-Fi), shared computers, and BYOD, amplifying risk.
Key Domains: Student/Staff Data Privacy (academic records); Network (segmented Wi-Fi for students, faculty, admin); Endpoint (computer labs, library PCs); Email/Phish (faculty/students training, spam filter); Cloud/LMS Security (Canvas, Google Classroom configs); BYOD/Gaming consoles control; Backup/BCP (grades, exam results); Physical (computer lab access, CCTV); Incident Response (day-night operations); Monitoring (access logs).
Sample Questions (Education):
Domain
Question
Type
Evidence
Weight
Impact
Network
Is student/visitor Wi-Fi segregated from staff/admin networks?
MCQ
AP config
4
Data snooping
Endpoint
Are lab computers locked down (whitelisted apps, USB disabled)?
Yes/No
PC config
4
Malware introduction
Email
Do faculty/students have spam/phishing filters and training?
Yes/No
Mail gateway logs
3
Credential theft
Data/Privacy
Are student records encrypted and access-controlled?
Yes/No
DB settings
4
Privacy breach
Backup
Are exam results and grades backed up off-site and tested?
Yes/No
Backup logs
4
Data loss (edu license)
Physical
Are server rooms and admin offices physically locked?
Yes/No
Photos
3
Unauthorized access
Monitoring
Is there logging of campus keycard or login usage?
Yes/No
Access logs
3
Vandalism/intrusion
Incident Resp
Is there a plan for cyber incidents during school hours or exams?
Yes/No
IR plan
3
Exam disruption

Education Insights: Kaspersky reports show educational ransomware is rising sharply. The module stresses basic hygiene (patches, locked screens, anti-virus) and phishing trainingfor all staff. Open Wi-Fi and lab PCs are highlighted: student networks must be firewalled off. Backup of critical data (attendance, results) is weighted high, since ransomware could cripple operations.
Hospitality (Hotels/Restaurants) Module
Context: Hotels and restaurants handle payment data and personal guest information, and often have high staff turnover and many connected systems (booking engines, POS, guest Wi-Fi). A 2025 survey found 82% of hotels were hit by cyberattacks over a summer, with 72% reporting POS breaches and 56% Wi-Fi issues. AI-driven attacks and phishing are rising. Guest-facing tech (POS, Wi-Fi, booking) is especially vulnerable.
Key Domains: Payment/POS Security (PCI, POS terminals); Network (isolated guest Wi-Fi, segmented admin network); Data/PII protection (guest profiles, IDs); Endpoint (front-desk terminals, housekeeping tablets); Email/Phish (staff training, travel agent fraud); Third-party (OTAs, payment processors); Backup/BCP (reservation and POS data); Monitoring (CCTV, POS logs); Physical (door locks, keycards); Incident Response (guest notification).
Sample Questions (Hospitality):
Domain
Question
Type
Evidence
Weight
Impact
Payment
Are POS terminals updated and encrypted according to PCI-DSS?
MCQ
POS config
5
Credit-card theft


Do staff use 2FA for all payment system logins?
Yes/No
Auth logs
4
Fraud takeover
Wi-Fi
Is guest Wi-Fi on a separate VLAN with bandwidth limits?
Yes/No
Network diagram
4
Guest data snoop


Are passwords on guest networks changed regularly?
Yes/No
Policy
2
Unauthorized guest access
Data
Is guest PII (passport, credit info) encrypted in databases?
Yes/No
DB config
5
Privacy breach
Staff Access
Do staff change login credentials on shift changes (hotel)?
Yes/No
HR logs
3
Insider misuse
Third-Party
Are online booking platforms/security updated (e.g. OTA integrations)?
Yes/No
Vendor SLA
3
OTA vulnerability
Endpoint
Are tablets/cell phones used by staff MDM-managed and encrypted?
Yes/No
MDM console
4
Lost device risk
Monitoring
Are unusual logins (e.g. admin at midnight) flagged?
Yes/No
SIEM logs
3
Late-night breach
IR/BCP
Do you have an incident plan for data breaches (incl. guest notifications)?
Yes/No
IR plan
4
Reputational/legal risk

Hospitality Insights: The 2025 Hotel Cyber Report found payment systems are top risk(34% of hotels worried about POS attacks). Guest Wi-Fi misuse was cited by 56% of hotels. Third-party systems (booking engines) and legacy tech (40% of hoteliers cited old systems) are major vulnerabilities. This module strongly weights POS/network isolation and encryption. It also emphasizes staff training and change of credentials due to high employee turnover.
Logistics & Transport Module
Context: Logistics firms use IoT (tracking devices), cloud TMS, and many third-party connectors (carriers, partners). They often have weak security culture: an Infosys study noted only 35% of providers have a CISO, and 55% of staff feel unprepared for attacks. IoT devices (GPS trackers, sensors) and obsolete control systems are exposed on the Internet. Attacks could disrupt supply chains and lead to cargo theft.
Key Domains: Fleet/IoT Security (vehicle telematics, sensors); Network (secure VPN for remote offices, wireless links); Endpoint (warehouse terminals, trucks’ onboard computers); Cloud/SaaS (logistics apps, GPS services); Data Protection (customer/shipment data); Third-party (carriers, cloud providers); Email/Phish (spear-phish to dispatchers); Backup/Continuity (route data, inventory); Monitoring (live tracking, anomaly detection); Physical (gate/barrier controls at depots); Incident Response (breach in transit plan).
Sample Questions (Logistics):
Domain
Question
Type
Evidence
Weight
Impact
IoT/Asset
Are all tracking devices (GPS/IoT) on unique accounts (no default credentials)?
Yes/No
Device config
5
Hijack vehicle


Do you map and classify all IT/IoT assets (asset inventory)?
Yes/No
Asset inventory
4
Blind spots
Network
Is remote warehouse/server access via VPN or zero-trust?
Yes/No
VPN logs
4
Exposed endpoints
Staff
Are drivers/dispatchers trained to report phishing and system anomalies?
Yes/No
Training log
3
Social engineering
Data
Is shipment/customer data encrypted in transit (mobile apps) and at rest?
Yes/No
TLS config
4
Data interception
Third-Party
Do you vet partner carriers/cargo vendors for security (e.g. data sharing agreements)?
Yes/No
Vendor audits/SLA
4
Supply chain breach
Backup
Is logistics data (routes, manifests) backed up to offsite/cloud?
Yes/No
Backup logs
4
Operational halt
Physical
Are truck depot gates and server rooms physically secured (locks, cameras)?
Yes/No
Photos
3
Theft/intrusion
Monitoring
Do you have real-time alerts for route deviations or system failures?
Yes/No
Monitoring dashboard
3
Theft or attack
IR
Is there a response plan for major disruptions (e.g. cyber attack on TMS)?
Yes/No
IR plan
3
Supply chain chaos

Logistics Insights: The logistics sector suffers from low security awareness and staffing. The influx of IoT without visibility is noted as a “golden opportunity for hackers”. This module heavily weights asset discovery and inventory, as well as segmentation and VPN (Infosys recommends full asset mapping and network transparency). Since logistics is all about uptime, backup of critical data is scored high.
Professional Services Module (Law Firms, Consultancies, Accounting, etc.)
Context: Professional services hold highly sensitive client data (legal documents, financial plans, IP). They’re prime targets for phishing and espionage. A Darktrace analysis highlights “human error” (mis-sent emails, misconfiguration) as a top law-firm threat. Phishing/BEC is rampant: Microsoft logged 70+ billion identity attacks in 2022. Losing client trust from a breach can be fatal for reputation.
Key Domains: Client Data Protection (confidential docs); Endpoint Encryption (laptops, USB storage); Email Security (phishing detection, encryption); Identity (strict MFA, least privilege); Cloud/Collab Apps (Google Drive, SharePoint controls); Access Management (guest accounts, privileges); Backup (client files, emails); Third-party (co-counsels, consultants access); Incident Response (breach notification); Physical (office locks, visitor logs).
Sample Questions (Professional Svcs):
Domain
Question
Type
Evidence
Weight
Impact
Human/Process
Do you conduct regular security awareness training on phishing and data handling?
Yes/No
Training certs
3
Data breach (reputation)
Endpoint
Are employee laptops fully encrypted and managed (MDM)?
Yes/No
MDM console
4
Stolen device data
Email
Do you use email encryption for transmitting client confidential info?
Yes/No
Encryption gateway logs
4
Leakage via email
Identity
Is multi-factor auth enforced on all remote-access (VPN, email) and admin accounts?
Yes/No
Auth logs
5
Account takeover
Access Control
Are access rights reviewed quarterly for each client/project?
MCQ
Access matrix
3
Former-client data access
Data
Are backups of financial/legal records tested and offline?
Yes/No
Backup logs
4
Data loss, compliance fine
Cloud/SaaS
Are cloud sharing settings (Docs/Drive) restricted by policy?
MCQ
Share settings
3
Accidental leak
Incident Resp
Is there a response plan for a major breach (incl. client notification)?
Yes/No
IR plan
4
Regulatory/legal
Monitoring
Are audit logs (file access, admin actions) collected and reviewed?
Yes/No
Audit log
3
Undetected exfiltration

Professional Insights: Confidentiality is paramount for lawyers/consultants, so questions stress encryption and strict access controls. Darktrace emphasizes that human error and phishing are top law-firm threats; accordingly, we include training and email safeguards. Because professional firms have heavy regulatory exposure (breach notifications, malpractice suits), we give weight to IR preparedness and data recovery.
Scoring Model and AI Analysis
Answer Scoring: Each question maps answers to a numeric score (e.g. “Yes – fully implemented” =5, “Partial”=3, “No”=0). Weights reflect impact: fundamental controls (encryption, MFA, backups) have higher weight. A running domain score is computed as the weighted average of its question scores, and an overall Posture Score (0–100%) is an aggregate of all domain scores. Risk severity (Low/Med/High) is derived from answers: for example, “No MFA” => High, “Partial patching” => Medium. The scoring rubric can follow CIS Controls guidance (e.g. CIS Control 1: inventory, Control 4: MFA etc.).
Threat Prediction & Remediation (AI): The AI layer uses retrieval-augmented generation (RAG) on industry threat intel to interpret answers. For instance, if “no offline backups” is answered, AI may predict “High ransomware risk” and advise immediate action. Known attack patterns are applied (e.g. healthcare⇒ransomware, hospitality⇒POS breach). The AI outputs two key pieces:
Threat Predictions: Based on gaps, list likely threats (e.g. “Based on exposed endpoints and lack of backups, ransomware is a major threat”). These are drawn from current reports: e.g. healthcare ransomware trend, retail fraud stats, hospitality phishing risk, etc.
Remediation Roadmap: A prioritized action plan, e.g.:
Immediate (24h-1w): e.g. enable MFA, isolate affected systems, reset passwords.
30-Day: e.g. deploy patches, configure encryption, conduct staff training.
90-Day: e.g. implement SIEM monitoring, full audit of third-parties, update policies.
These suggestions reference best practices from sources (CIS, NIST, CERT). For example, healthcare advice from Seqrite: “harden endpoints, train staff, and ensure backups”. Remediations are written in business terms (e.g. “Install multi-factor login on all systems” or “Segment the guest Wi-Fi from your POS network”).
Business Impact Mapping: Each finding is linked to an impact statement. For example, if “no network segmentation,” impact might be “Malicious insiders or malware could pivot from one system to critical servers, risking data theft or downtime”. This helps executives understand costs (e.g. “₹5L–₹20L potential loss”).
Reporting and Visuals
Report Sections: The generated report will include (for each assessment):
Executive Summary: Overall posture score, top 3-5 risks (in layman’s terms), brief comparison to industry peer (if data available).
Domain Scores: Table or chart showing each domain’s score (e.g. “Network Security – 60% (Medium Risk)”).
Heatmap of Risks: A risk matrix plotting each identified risk by likelihood vs impact (high risk items red). Risk scores use color coding for impact (as in risk heat maps).
Trend Analysis: If prior assessments exist, a line graph of overall posture (showing improvement or decline). For example, “Your Security Score improved from 45% to 58% since last year.”
Detailed Findings: For each major gap, a narrative (AI-generated) explaining the issue, business impact, and remediation steps. These pull from evidence (answers) and threat context.
Charts: e.g. radar/spider chart comparing your scores across domains (identity, endpoint, etc.), pie-chart of answer distribution (Yes/No/Partial), bar charts of risk counts. These visual aids are auto-generated from scores.
Sample Visuals (conceptual):
A radar chart might plot domain scores (higher is better) for quick visual of weak areas.
A risk heatmap (impact vs. likelihood) to prioritize top threats (red zone = urgent).
A trend line showing posture score over time (with milestones of fixes).
Each figure would be captioned and explained. (For example, “Figure: Security posture over past assessments.”)
Table 2. Example Question Bank (Excerpt)
Q_ID
Domain
Question
Type
Answer Options
Evidence Example
Weight
Risk Level (if “No”)
R1
Payment Security
“Are card details encrypted at rest?”
MCQ
Yes / No / Partial
DB config screenshot
5
High – PCI fine
R2
Payment Security
“Is MFA enabled for POS login?”
Yes/No
Yes / No
MFA log
4
High – takeover
R3
Network (Retail)
“Guest Wi-Fi segregated?”
Yes/No
Yes / No
Firewall/VLAN diagram
3
Med – lateral movement
H1
PHI Data (Health)
“Patient data encrypted in transit?”
Yes/No
Yes / No
TLS cert config
5
High – data breach
H2
Backup (Health)
“Offline backups of EHRs?”
Yes/No
Yes / No
Backup log/report
5
High – ransomware
F1
API Security
“Are all APIs authenticated?”
Yes/No
Yes / No
API gateway settings
5
High – API abuse
M1
OT Segmentation
“IT/OT networks segmented?”
Yes/No
Yes / No
Network map
5
High – production stop
P1
Email (LawFirm)
“Do employees get phishing training?”
Yes/No
Yes / No
Training records
3
Medium – credential theft

This table is illustrative; each module will have ~100 questions covering all listed domains.
Scoring Rubric (Table 3) – For example:
MCQ Single-Answer: assign scores 0 (No), 3 (Partial), 5 (Yes).
Multiple-Answer: partial credit for each correct selection, normalized (so total ≤5).
Yes/No: simply 5 or 0.
Free text: scored by AI rubric (e.g. “Describe your backup process”).
Evidence Upload: Checked manually (if evidence quality meets criteria, full points, else 0).
Each question’s weight reflects its criticality. The risk level (Low/Med/High) can be a function of both answer and weight. For example, “No MFA on admin” might be High risk even if weight is 4.
Table 4. Scoring & Risk Levels (example excerpt)
Answer
Score
Risk Level (Severity)
Comment
Yes – Fully met
5
Low (Good)
Control in place
Partial/Some
3
Medium (Attention)
Partial control – improve
No – Not met
0
High (Critical)
Urgent fix needed

Table 5. Sample Excel Question Bank Columns (for export)
Columns could include: Q_ID, Industry, Domain, Question Text, Answer Type (MCQ/YesNo/Text/Date/File), Allowed Responses, Weight, Risk Category, Evidence Required (Yes/No), Suggested Remediation, Business Impact, etc. Each row in this sheet is one question. Example:
pgsql
Copy
Q_ID | Industry | Domain     | Question                                 | AnswerType | Options                   | Weight | RiskCategory | EvidenceRequired | RemediationSnippets                | ImpactStatement
-----|----------|------------|------------------------------------------|------------|---------------------------|--------|--------------|------------------|------------------------------------|-----------------
R001 | Retail   | Data/Privacy| "Is customer data encrypted at rest?"   | YesNo      | "Yes;No"                  | 5      | DataBreach   | Yes              | "Enable AES encryption on DB."      | "Without encryption, hackers can steal customer records leading to legal fines."
R002 | Retail   | Email      | "Staff phishing training done in past yr?"| MCQ        | "Yes - regularly;Yes - once;No" | 3  | Phishing     | Yes              | "Run quarterly phishing simulations."| "Untrained staff are likely to fall for email scams."

These tables (sample questions, rubric, Excel layout) illustrate how we organize the questionnaire data.
Scoring Algorithm and Posture Calculation
Domain Score: Sum of (answer_score × weight) for that domain ÷ (max possible domain score) × 100%.
Overall Posture Score: Weighted average of all domain scores (weights may be equal or customized by industry).
Risk Matrix: We may bucket scores into red/amber/green thresholds (e.g. <50% high risk, 50–75% medium, >75% low).
Growth Tracking: If prior assessment exists, compute score change. AI can highlight “top improved area” and “top regressions”.
Reporting Layout and Visuals
A polished PDF/HTML report is generated. Key visuals include:
Spider/Radar Chart: e.g. axes = domains, values = % scores (easy to spot weak spokes).
Heatmap Chart: for overall risk, plotting likelihood vs impact of major findings.
Trend Chart: line graph of overall posture over time (with annotations, e.g. “After patching, posture rose from 40% to 60%”).
Bar/Pie Charts: e.g. “Answer distribution” or “Risk count by category”.
All visuals have captions and are embedded. (For example, a risk heatmap chart helps executives focus on the riskiest areas, and a radar chart clearly shows domain imbalances.)
System Architecture (Mermaid Diagram)
mermaid
Copy
flowchart LR
  subgraph Admin[Administration Portal]
    A1[Tenant & Framework Management] --> A2[Assign Assessments]
    A2 --> DB[(Config & Questions DB)]
    A3[User Management & Auth] --> A2
  end

  subgraph User[Customer Portal]
    U1[Login (SSO/MFA)] --> U2[Dashboard/Assignm’ts]
    U2 --> U3[Take Assessment (questionnaire UI)]
    U3 --> DB
    U3 --> FileStore[(Evidence Uploads)]
  end

  subgraph AI[AI Analysis Layer]
    DB --> AIEngine[LLM + RAG Engine]
    FileStore --> AIEngine
    AIEngine --> ReportEngine
  end

  subgraph Reporting[Reporting & Dashboard]
    ReportEngine --> PDFGenerator[PDF/Charts Engine]
    PDFGenerator --> U1
    ReportEngine --> U1
  end

  A3 --> U1
Figure: Assessment lifecycle flow. Admin portal sets up tenants and modules, customers log in to answer questions and upload evidence, AI engine processes data and generates reports back to dashboards.
owns
employs
belongs_to
has
based_on
answered_by
generates
answers
relates_to
tracks
belongs_to
ORGANIZATION
ASSESSMENT
USER
RESPONSE
FRAMEWORK
QUESTION
AI_FINDING
METRIC
Show code
Figure: Entity-Relationship model. Organizations have Users and Assessments; each Assessment covers many Questions, yielding many Responses and AI Findings. Historical Metrics track each Org’s scores over time.
References and Sources
We leveraged best-practice sources to design questions and risk mappings. For example, the CIS Controls and OWASP Top-10 informed our security domains, while industry threat reports provided context. Indian-specific data (e.g. CyberPeace/DSCI reports) highlights SMB exposure. All controls and recommendations are cited accordingly, ensuring the assessment is anchored in current cybersecurity standards and Indian SMB realities.

