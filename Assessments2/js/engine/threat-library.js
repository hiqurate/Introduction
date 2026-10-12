// ============================================
// HawkSight — Threat Scenario Library
// The attack paths that real organisations are breached through, written for
// the people who run the business. Each scenario is a chain of stages; each
// stage lists the HawkSight controls that can break it. An assessment is
// evaluated against every scenario to show which attack paths are open,
// where the chain would be broken, and the one fix that closes the most.
//
// Incident examples are public, widely reported events. They illustrate the
// path; they are not a statement about any assessed organisation.
// ============================================

(function (root) {
  const THREAT_MODEL_VERSION = '1.0';

  // Industry keys follow the industry template IDs. Profile industries are
  // aliased onto them so framework templates (NIST, SOC) are also evaluated
  // in the organisation's industry context.
  const INDUSTRIES = ['healthcare', 'retail', 'fintech', 'manufacturing', 'education', 'itservices', 'hospitality', 'logistics', 'professional'];
  const INDUSTRY_ALIAS = {
    pharma: 'healthcare', bfsi: 'fintech', technology: 'itservices', energy: 'manufacturing'
  };

  const RELEVANCE_WEIGHT = { high: 1, medium: 0.6, low: 0.3 };

  // Stage types: 'prevent' and 'detect' stages are chances to stop the attack
  // before it causes harm; 'recover' stages limit the harm once it happens.
  const SCENARIOS = [
    {
      id: 'TS-EDGE',
      name: 'Ransomware through an internet-facing device',
      category: 'Ransomware',
      hook: 'The fastest-growing way in is not an email. It is the VPN, firewall or remote-access gateway bought to keep attackers out.',
      narrative: 'A flaw is announced in a popular VPN, firewall or remote-access product. Within days, criminal groups scan the whole internet for unpatched devices, log in, and quietly work towards administrator control of the network. Days or weeks later they copy data and encrypt everything at once, usually at night or over a holiday.',
      impact: 'Systems encrypted, operations stopped for days to weeks, data published if a ransom is not paid.',
      relevance: { default: 'high' },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Get in through an exposed device', attacker: 'Exploits an unpatched VPN or firewall, or logs into an exposed remote desktop or a remote-access account without MFA.', mode: 'all', controls: ['HS-VUL-03', 'HS-NET-03'] },
        { id: 'escalate', type: 'prevent', name: 'Take over administrator accounts', attacker: 'Harvests passwords and abuses weaknesses in Active Directory to become a domain or cloud administrator.', mode: 'all', controls: ['HS-IAM-04', 'HS-IAM-07'] },
        { id: 'spread', type: 'prevent', name: 'Spread to every server', attacker: 'Moves across a flat network and switches off security tools before launching encryption everywhere at once.', mode: 'any', controls: ['HS-NET-01', 'HS-END-01'] },
        { id: 'detect', type: 'detect', name: 'Get caught before encryption', attacker: 'Spends days inside the network. Every one of those days is a chance to be noticed.', mode: 'all', controls: ['HS-MON-02', 'HS-MON-01'] },
        { id: 'recover', type: 'recover', name: 'Restore the business', attacker: 'Deletes or encrypts backups first so the victim cannot simply restore.', mode: 'all', controls: ['HS-RES-01', 'HS-RES-02', 'HS-RES-03'] }
      ],
      examples: [
        { org: 'Colonial Pipeline', year: 2021, summary: 'Attackers used the password of an old VPN account that had no MFA. The company shut its fuel pipeline down for several days.' },
        { org: 'Ivanti Connect Secure users', year: 2024, summary: 'VPN flaws were exploited at scale within days of disclosure; CISA ordered US federal agencies to disconnect affected appliances.' }
      ],
      attack: ['T1190', 'T1133', 'T1078', 'T1486']
    },
    {
      id: 'TS-PHISH',
      name: 'Malware delivered by email',
      category: 'Ransomware',
      hook: 'One click by one person is all it takes. What matters is what happens in the hour after.',
      narrative: 'An employee opens an invoice, a delivery notice or a QR code that looks routine. Malware lands on their laptop, steals saved passwords and gives the attacker a foothold. From there the attack follows the familiar path: escalate, spread, steal, encrypt.',
      impact: 'A single infected laptop becomes a network-wide ransomware incident or a data theft.',
      relevance: { default: 'high' },
      stages: [
        { id: 'deliver', type: 'prevent', name: 'Land a malicious email', attacker: 'Sends a lure that gets past email filtering and convinces someone to click.', mode: 'any', controls: ['HS-END-03', 'HS-PPL-02', 'HS-PPL-01'] },
        { id: 'foothold', type: 'prevent', name: 'Run malware on a laptop', attacker: 'Runs malware that steals passwords and opens a remote connection, helped by local admin rights.', mode: 'any', controls: ['HS-END-01', 'HS-END-02'] },
        { id: 'escalate', type: 'prevent', name: 'Take over the network', attacker: 'Uses stolen credentials and directory weaknesses to gain admin control and move between systems.', mode: 'all', controls: ['HS-IAM-04', 'HS-IAM-07'] },
        { id: 'detect', type: 'detect', name: 'Get caught early', attacker: 'Generates alerts that nobody reads outside office hours.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'recover', type: 'recover', name: 'Restore the business', attacker: 'Destroys backups before encrypting.', mode: 'all', controls: ['HS-RES-01', 'HS-RES-02'] }
      ],
      examples: [
        { org: 'QakBot', year: 2023, summary: 'Before an international police takedown, this email-borne malware had infected over 700,000 computers and was used to launch ransomware attacks.' }
      ],
      attack: ['T1566', 'T1204', 'T1555', 'T1021']
    },
    {
      id: 'TS-HELPDESK',
      name: 'Impersonating staff to the IT helpdesk',
      category: 'Identity takeover',
      hook: 'Attackers do not need to break your MFA if they can phone your helpdesk and ask for it to be reset.',
      narrative: 'An attacker finds an employee on LinkedIn, calls the IT helpdesk (often an outsourced one) pretending to be that person, and asks for a password reset and a new MFA device. Minutes later they are signed in as the employee, ideally one with admin rights, without using any malware.',
      impact: 'Full access as a trusted employee, often leading to ransomware across servers and cloud.',
      relevance: { default: 'medium', retail: 'high', hospitality: 'high', fintech: 'high', itservices: 'high', healthcare: 'high' },
      stages: [
        { id: 'pretext', type: 'prevent', name: 'Talk the helpdesk into a reset', attacker: 'Gives an employee ID and manager name found online and asks for a new password and MFA device.', mode: 'all', controls: ['HS-IAM-06'] },
        { id: 'signin', type: 'prevent', name: 'Sign in as the employee', attacker: 'Registers their own MFA device and signs in from their own computer.', mode: 'all', controls: ['HS-IAM-01'] },
        { id: 'escalate', type: 'prevent', name: 'Reach admin and cloud consoles', attacker: 'Uses the account, or resets an administrator next, to reach virtualisation and cloud management.', mode: 'all', controls: ['HS-IAM-04', 'HS-IAM-07'] },
        { id: 'detect', type: 'detect', name: 'New device and odd sign-in spotted', attacker: 'Counts on nobody watching new MFA registrations or sign-ins from unfamiliar locations.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'recover', type: 'recover', name: 'Restore the business', attacker: 'Encrypts virtual servers directly from the management console.', mode: 'all', controls: ['HS-RES-01', 'HS-RES-03'] }
      ],
      examples: [
        { org: 'MGM Resorts', year: 2023, summary: 'Attackers reportedly impersonated an employee in a call to the IT helpdesk. Hotel and casino systems were disrupted for days; MGM reported a hit of about US$100 million.' },
        { org: 'Marks & Spencer', year: 2025, summary: 'Attackers got in through social engineering involving a third party. Online orders were suspended for about seven weeks, with an estimated £300 million impact on profit.' }
      ],
      attack: ['T1656', 'T1598', 'T1556.006', 'T1078']
    },
    {
      id: 'TS-BEC',
      name: 'Payment diversion and CEO fraud',
      category: 'Fraud',
      hook: 'The email really does come from your supplier\'s account. That is why it works.',
      narrative: 'Attackers break into a supplier\'s mailbox, or one of yours, and read conversations for weeks. Then they reply inside a genuine invoice thread with "updated bank details". A variant impersonates the CEO or CFO, now increasingly with a cloned voice or deepfake video, asking for an urgent confidential transfer.',
      impact: 'Money sent to a criminal account, rarely recovered after the first few hours.',
      relevance: { default: 'high' },
      stages: [
        { id: 'mailbox', type: 'prevent', name: 'Take over or spoof a mailbox', attacker: 'Phishes a mailbox password without MFA, or sends from a lookalike or spoofed domain.', mode: 'all', controls: ['HS-IAM-01', 'HS-END-03'] },
        { id: 'request', type: 'prevent', name: 'Get a payment approved', attacker: 'Asks for bank details to be changed, or an urgent transfer to be made, under time pressure.', mode: 'all', controls: ['HS-PAY-02'] },
        { id: 'detect', type: 'detect', name: 'Hidden mailbox rules spotted', attacker: 'Creates rules that hide replies from the real owner.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'recover', type: 'recover', name: 'Recall the money', attacker: 'Moves the funds through mule accounts within hours.', mode: 'all', controls: ['HS-IR-01'] }
      ],
      examples: [
        { org: 'FBI IC3 report', year: 2023, summary: 'Business email compromise accounted for about US$2.9 billion in reported losses in a single year.' },
        { org: 'Arup', year: 2024, summary: 'An employee in Hong Kong paid out about US$25 million after a video call in which the CFO and colleagues were deepfakes.' }
      ],
      attack: ['T1114', 'T1534', 'T1656']
    },
    {
      id: 'TS-CREDS',
      name: 'Stolen passwords used on your cloud services',
      category: 'Data theft',
      hook: 'Your staff passwords may already be for sale, stolen from a personal laptop you have never seen.',
      narrative: 'Infostealer malware on an employee\'s or contractor\'s personal device harvests saved passwords and session cookies, which are sold in bulk. Buyers try them on cloud apps, VPNs and data platforms and walk straight in wherever there is no MFA or device check.',
      impact: 'Bulk theft of customer data from cloud platforms, followed by extortion.',
      relevance: { default: 'high' },
      stages: [
        { id: 'login', type: 'prevent', name: 'Log in with a stolen password or session', attacker: 'Uses credentials from an infostealer log on an account without MFA or device restrictions.', mode: 'all', controls: ['HS-IAM-01'] },
        { id: 'access', type: 'prevent', name: 'Reach data in cloud apps', attacker: 'Finds broad access rights and misconfigured cloud storage.', mode: 'all', controls: ['HS-CLD-01', 'HS-IAM-02'] },
        { id: 'exfil', type: 'prevent', name: 'Copy the data out', attacker: 'Exports large volumes of records through normal features.', mode: 'all', controls: ['HS-DAT-03'] },
        { id: 'detect', type: 'detect', name: 'Unusual sign-in or export noticed', attacker: 'Signs in from new locations and downloads far more than usual.', mode: 'all', controls: ['HS-MON-02', 'HS-MON-01'] },
        { id: 'respond', type: 'recover', name: 'Contain and notify', attacker: 'Threatens to publish the data.', mode: 'all', controls: ['HS-IR-01', 'HS-IR-03'] }
      ],
      examples: [
        { org: 'Snowflake customers', year: 2024, summary: 'Around 165 organisations were notified after attackers used passwords stolen by infostealer malware to log into accounts without MFA and download customer data.' }
      ],
      attack: ['T1078.004', 'T1539', 'T1530']
    },
    {
      id: 'TS-SUPPLIER',
      name: 'Breached through a supplier or IT provider',
      category: 'Supply chain',
      hook: 'Your security is only as strong as the supplier who can already log into your network.',
      narrative: 'A managed IT provider, software vendor or maintenance contractor with remote access is breached, or the tool they use is. The attacker inherits their trusted access to you, and to their other customers, often bypassing your perimeter entirely.',
      impact: 'Attackers arrive with trusted access; a supplier outage can also stop your own operations.',
      relevance: { default: 'high' },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Use the supplier\'s access', attacker: 'Logs in through the supplier\'s always-on remote access or management tool.', mode: 'all', controls: ['HS-NET-03', 'HS-TPR-01'] },
        { id: 'escalate', type: 'prevent', name: 'Spread beyond what the supplier needs', attacker: 'Uses the supplier\'s broad rights to reach systems unrelated to their job.', mode: 'any', controls: ['HS-IAM-04', 'HS-NET-01'] },
        { id: 'detect', type: 'detect', name: 'Unusual supplier activity noticed', attacker: 'Acts at odd hours from the supplier\'s accounts, which nobody reviews.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'recover', type: 'recover', name: 'Keep operating without them', attacker: 'Takes the supplier\'s service down for everyone who depends on it.', mode: 'all', controls: ['HS-RES-03', 'HS-RES-01'] }
      ],
      examples: [
        { org: 'Target', year: 2013, summary: 'Credentials stolen from a heating and ventilation contractor led to malware on point-of-sale systems and about 40 million stolen cards.' },
        { org: 'Change Healthcare', year: 2024, summary: 'Attackers used stolen credentials on a remote-access portal without MFA. Claims and pharmacy payments for providers across the US were disrupted for weeks.' },
        { org: 'Kaseya VSA', year: 2021, summary: 'Ransomware was pushed through an IT management tool used by managed service providers, reaching up to about 1,500 businesses.' }
      ],
      attack: ['T1199', 'T1133', 'T1195']
    },
    {
      id: 'TS-EXTORT',
      name: 'Data theft and extortion',
      category: 'Data theft',
      hook: 'Backups do not help when the threat is to publish your data.',
      narrative: 'Instead of encrypting systems, the attacker quietly copies sensitive data, often through a flaw in a file-transfer tool or web application, then demands payment not to publish or sell it. Customers, patients and regulators have to be notified either way.',
      impact: 'Regulatory notification, customer harm and reputational damage, with or without a ransom.',
      relevance: { default: 'high' },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Exploit an internet-facing application', attacker: 'Exploits a flaw in a file-transfer, web or supplier-hosted application.', mode: 'all', controls: ['HS-VUL-03', 'HS-VUL-01', 'HS-TPR-01'] },
        { id: 'find', type: 'prevent', name: 'Find the valuable data', attacker: 'Finds sensitive data where nobody knew it was kept, accessible to too many accounts.', mode: 'any', controls: ['HS-AST-03', 'HS-IAM-02'] },
        { id: 'exfil', type: 'prevent', name: 'Copy it out', attacker: 'Downloads it in bulk through ordinary channels without triggering any control.', mode: 'all', controls: ['HS-DAT-03'] },
        { id: 'detect', type: 'detect', name: 'Data theft noticed', attacker: 'Relies on nobody watching for unusual data volumes.', mode: 'all', controls: ['HS-MON-02', 'HS-MON-01'] },
        { id: 'respond', type: 'recover', name: 'Notify and limit harm', attacker: 'Contacts customers or the press directly to increase pressure.', mode: 'all', controls: ['HS-IR-03', 'HS-IR-01'] }
      ],
      examples: [
        { org: 'MOVEit Transfer', year: 2023, summary: 'A criminal group exploited a flaw in a file-transfer product and stole data from more than 2,000 organisations, including banks, universities and advisory firms.' }
      ],
      attack: ['T1190', 'T1005', 'T1567', 'T1657']
    },
    {
      id: 'TS-INSIDER',
      name: 'Misuse by an insider or former employee',
      category: 'Data theft',
      hook: 'The account that leaks your customer list is often one you forgot to switch off.',
      narrative: 'A departing employee downloads the customer database, a member of staff browses records they have no reason to see, or a leaver\'s account is still active months later. No hacking skill is needed.',
      impact: 'Loss of customer data or confidential information to competitors or criminals.',
      relevance: { default: 'medium', healthcare: 'high', professional: 'high', fintech: 'high' },
      stages: [
        { id: 'access', type: 'prevent', name: 'Use existing or leftover access', attacker: 'Uses an account that should have been removed or rights broader than the job needs.', mode: 'all', controls: ['HS-IAM-03', 'HS-IAM-02'] },
        { id: 'exfil', type: 'prevent', name: 'Copy or browse the data', attacker: 'Forwards files to personal email, cloud storage or USB.', mode: 'all', controls: ['HS-DAT-03'] },
        { id: 'detect', type: 'detect', name: 'Unusual access noticed', attacker: 'Counts on access logs that nobody reviews.', mode: 'all', controls: ['HS-MON-02', 'HS-MON-01'] },
        { id: 'respond', type: 'recover', name: 'Investigate and notify', attacker: 'Leaves before anyone notices.', mode: 'all', controls: ['HS-IR-01', 'HS-IR-03'] }
      ],
      examples: [],
      attack: ['T1078', 'T1052', 'T1567']
    },
    {
      id: 'TS-WEBSKIM',
      name: 'Card skimming on your website',
      category: 'Fraud',
      hook: 'Your payment page can be stealing cards while every system reports green.',
      narrative: 'Attackers inject a few lines of JavaScript into the checkout page, directly or through a compromised analytics, chat or plugin script. Every customer\'s card details are copied to the attacker as they type. Sites often run like this for months.',
      impact: 'Customer cards stolen at scale, regulatory fines and loss of the ability to take card payments.',
      relevance: { default: 'low', retail: 'high', hospitality: 'high' },
      when: { industries: ['retail', 'hospitality'], profile: [{ field: 'dataTypes', includes: 'payment' }] },
      stages: [
        { id: 'inject', type: 'prevent', name: 'Change the scripts on your site', attacker: 'Exploits a vulnerable plugin or compromises a third-party script your page loads.', mode: 'all', controls: ['HS-APP-01', 'HS-TPR-01', 'HS-VUL-01'] },
        { id: 'capture', type: 'prevent', name: 'Capture card details', attacker: 'Reads card fields as customers type them into your page.', mode: 'all', controls: ['HS-PAY-01'] },
        { id: 'detect', type: 'detect', name: 'Script change noticed', attacker: 'Relies on nobody checking whether payment page scripts changed.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'respond', type: 'recover', name: 'Notify and limit harm', attacker: 'Sells the cards before the breach is found.', mode: 'all', controls: ['HS-IR-03'] }
      ],
      examples: [
        { org: 'British Airways', year: 2018, summary: 'Malicious code on the booking site captured payment details of about 429,000 customers and staff; the UK regulator fined the airline £20 million.' }
      ],
      attack: ['T1195.002', 'T1056', 'T1185']
    },
    {
      id: 'TS-POS',
      name: 'Payment terminals and store systems compromised',
      category: 'Fraud',
      hook: 'Card-stealing malware has run inside hotel bars and store tills for months without anyone noticing.',
      narrative: 'An attacker gets into a store or property network, often through a maintenance vendor or a device still using its default password, then reaches the payment systems and installs malware that collects card data as cards are used.',
      impact: 'Cards stolen across many locations, investigations and loss of payment privileges.',
      relevance: { default: 'low', retail: 'high', hospitality: 'high' },
      when: { industries: ['retail', 'hospitality'] },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Get into the store network', attacker: 'Uses vendor remote access or a device with a default password.', mode: 'all', controls: ['HS-NET-03', 'HS-IAM-05'] },
        { id: 'reach', type: 'prevent', name: 'Reach the payment systems', attacker: 'Moves from back-office PCs or guest networks to payment terminals.', mode: 'all', controls: ['HS-NET-01'] },
        { id: 'capture', type: 'prevent', name: 'Collect card data', attacker: 'Installs malware on outdated terminals or fits skimmers.', mode: 'all', controls: ['HS-PAY-01', 'HS-VUL-02', 'HS-PHY-01'] },
        { id: 'detect', type: 'detect', name: 'Malware noticed', attacker: 'Runs quietly while transactions look normal.', mode: 'all', controls: ['HS-MON-02'] }
      ],
      examples: [
        { org: 'Hyatt Hotels', year: 2015, summary: 'Malware on payment systems in restaurants and other outlets affected about 250 hotels.' }
      ],
      attack: ['T1133', 'T1078.001', 'T1005']
    },
    {
      id: 'TS-OT',
      name: 'A cyber attack that stops operations or equipment',
      category: 'Operational disruption',
      hook: 'Most attacks that stop plants never touch the machines. They hit the IT systems the plant cannot run without.',
      narrative: 'Ransomware enters through the office network and either spreads into production, or forces you to stop because you cannot tell how far it reached, or because scheduling, quality and shipping systems are gone. Vendor remote access straight to equipment is a second way in.',
      impact: 'Production, clinical or logistics operations stopped; safety and contractual consequences.',
      relevance: { default: 'low', manufacturing: 'high', healthcare: 'high', logistics: 'high' },
      when: { industries: ['manufacturing', 'healthcare', 'logistics'], profile: [{ field: 'technology', includes: 'ot' }] },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Cross from IT into operations', attacker: 'Moves from the office network, or a vendor connection, into the control or device network.', mode: 'all', controls: ['HS-OT-01', 'HS-NET-01', 'HS-NET-03'] },
        { id: 'disrupt', type: 'prevent', name: 'Disrupt the equipment', attacker: 'Encrypts operator stations and servers or changes equipment logic from an engineering workstation.', mode: 'any', controls: ['HS-OT-01', 'HS-IAM-04'] },
        { id: 'detect', type: 'detect', name: 'Unusual activity noticed', attacker: 'Relies on operational networks having no security monitoring.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'recover', type: 'recover', name: 'Keep operating and restore', attacker: 'Leaves you unable to run manually or rebuild controllers quickly.', mode: 'all', controls: ['HS-RES-03', 'HS-RES-01'] }
      ],
      examples: [
        { org: 'Norsk Hydro', year: 2019, summary: 'Ransomware hit the aluminium producer\'s IT network and plants switched to manual operation across the company.' },
        { org: 'Colonial Pipeline', year: 2021, summary: 'The pipeline was shut down as a precaution after ransomware hit business IT systems, not the pipeline controls.' }
      ],
      attack: ['T0866', 'T0886', 'T0827']
    },
    {
      id: 'TS-CODE',
      name: 'Compromise through your code or delivery pipeline',
      category: 'Supply chain',
      hook: 'If attackers get into your build pipeline, they ship their code to your customers under your name.',
      narrative: 'A developer\'s laptop is infected and their session tokens stolen, a secret is pushed to a public repository, or a malicious open-source package is pulled into a build. Attackers then reach your cloud, your source code and potentially your clients.',
      impact: 'Client environments and data exposed through you; loss of client trust.',
      relevance: { default: 'low', itservices: 'high', fintech: 'medium' },
      when: { industries: ['itservices', 'fintech'], profile: [{ field: 'developsSoftware', eq: 'yes' }] },
      stages: [
        { id: 'entry', type: 'prevent', name: 'Steal developer access or poison a dependency', attacker: 'Steals a session token from a developer laptop, finds a leaked key or plants a malicious package.', mode: 'all', controls: ['HS-APP-01', 'HS-IAM-01', 'HS-END-01'] },
        { id: 'escalate', type: 'prevent', name: 'Take over pipelines and cloud', attacker: 'Uses broad pipeline and cloud permissions to reach production and client environments.', mode: 'all', controls: ['HS-IAM-04', 'HS-CLD-01'] },
        { id: 'detect', type: 'detect', name: 'Unusual pipeline activity noticed', attacker: 'Clones repositories and creates access keys without anyone noticing.', mode: 'all', controls: ['HS-MON-02'] },
        { id: 'respond', type: 'recover', name: 'Rebuild and tell clients', attacker: 'Leaves you rotating every secret and explaining to clients.', mode: 'all', controls: ['HS-RES-01', 'HS-IR-03'] }
      ],
      examples: [
        { org: 'CircleCI', year: 2023, summary: 'Malware on an engineer\'s laptop stole a session token; every customer was told to rotate all secrets stored on the platform.' },
        { org: '3CX', year: 2023, summary: 'A compromised build environment shipped a trojanised version of the company\'s desktop app to its customers.' }
      ],
      attack: ['T1195.001', 'T1552', 'T1528']
    },
    {
      id: 'TS-CUSTATO',
      name: 'Fraud through your customers\' accounts',
      category: 'Fraud',
      hook: 'Attackers do not need to breach you to steal from your customers. They just log in as them.',
      narrative: 'Using passwords leaked from other websites, SIM swaps or one-time codes coaxed out of customers over the phone, fraudsters take over customer accounts and drain balances, loyalty points or stored payment methods. Customers hold you responsible.',
      impact: 'Direct fraud losses, refunds, complaints to regulators and customer churn.',
      relevance: { default: 'low', fintech: 'high', retail: 'medium', hospitality: 'medium' },
      when: { industries: ['fintech', 'retail', 'hospitality'] },
      stages: [
        { id: 'login', type: 'prevent', name: 'Log in as the customer', attacker: 'Tries leaked passwords at scale, or tricks the customer into sharing a one-time code.', mode: 'all', controls: ['HS-PAY-01', 'HS-APP-01'] },
        { id: 'transact', type: 'prevent', name: 'Move money or value', attacker: 'Adds a new payee or device and transfers funds, points or stored value quickly.', mode: 'all', controls: ['HS-PAY-01'] },
        { id: 'detect', type: 'detect', name: 'Fraud pattern spotted', attacker: 'Counts on transactions not being monitored in real time.', mode: 'any', controls: ['HS-MON-02', 'HS-PAY-01'] },
        { id: 'respond', type: 'recover', name: 'Respond to customers', attacker: 'Leaves customers and regulators asking questions.', mode: 'all', controls: ['HS-IR-03'] }
      ],
      examples: [
        { org: '23andMe', year: 2023, summary: 'Reused passwords gave attackers access to about 14,000 accounts, and through a sharing feature exposed data on about 6.9 million people.' }
      ],
      attack: ['T1110.004', 'T1111']
    },
    {
      id: 'TS-AILEAK',
      name: 'Confidential data leaking through AI and unapproved apps',
      category: 'Data exposure',
      hook: 'Your most sensitive documents may already be inside someone else\'s AI tool.',
      narrative: 'Staff paste contracts, source code, patient notes or client documents into free AI chatbots, AI browser extensions and unapproved apps to work faster. Depending on the service, that data may be retained, reviewed or used for training, and it is outside your control.',
      impact: 'Loss of confidentiality over client, patient or proprietary information; breach of contract and privacy obligations.',
      relevance: { default: 'medium', professional: 'high', itservices: 'high', healthcare: 'medium' },
      stages: [
        { id: 'use', type: 'prevent', name: 'Staff use unapproved tools', attacker: 'No attacker needed: unapproved AI services and extensions are free and easy to use.', mode: 'any', controls: ['HS-DAT-05', 'HS-AST-02'] },
        { id: 'share', type: 'prevent', name: 'Sensitive data is shared', attacker: 'Confidential content is pasted or uploaded without anyone knowing it is sensitive.', mode: 'any', controls: ['HS-DAT-03', 'HS-PPL-01'] },
        { id: 'detect', type: 'detect', name: 'Usage noticed', attacker: 'Use of new AI services is not monitored.', mode: 'all', controls: ['HS-DAT-05'] }
      ],
      examples: [
        { org: 'Samsung', year: 2023, summary: 'Engineers pasted confidential source code into a public AI chatbot; the company then restricted staff use of generative AI tools.' }
      ],
      attack: []
    }
  ];

  const SCENARIO_INDEX = SCENARIOS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {});

  // Scenarios a control helps to stop, for showing attacker context next to
  // each question.
  function scenariosForControl(controlId) {
    return SCENARIOS.filter(s => s.stages.some(st => st.controls.includes(controlId)));
  }

  function resolveIndustry(frameworkId, profile) {
    if (INDUSTRIES.includes(frameworkId)) return frameworkId;
    const p = (profile && profile.industry) || '';
    if (INDUSTRIES.includes(p)) return p;
    return INDUSTRY_ALIAS[p] || null;
  }

  function profileCondition(cond, profile) {
    const actual = profile ? profile[cond.field] : undefined;
    if (cond.includes !== undefined) return Array.isArray(actual) && actual.includes(cond.includes);
    if (cond.eq !== undefined) return actual !== undefined && String(actual) === String(cond.eq);
    return false;
  }

  // A scenario with a `when` clause applies if the industry matches or any
  // profile condition holds. Scenarios without one apply to everyone.
  function relevanceFor(scenario, industry, profile) {
    if (industry && scenario.relevance[industry]) {
      if (!scenario.when || (scenario.when.industries || []).includes(industry)) return scenario.relevance[industry];
    }
    if (scenario.when) {
      const inIndustry = industry && (scenario.when.industries || []).includes(industry);
      const byProfile = (scenario.when.profile || []).some(c => profileCondition(c, profile));
      if (!inIndustry && !byProfile) return null;
      // Triggered by what the organisation told us about itself: at least medium.
      if (!inIndustry && scenario.relevance.default === 'low') return 'medium';
    }
    return (industry && scenario.relevance[industry]) || scenario.relevance.default || 'medium';
  }

  // Each barrier's chance of stopping the attack grows with the square of its
  // implementation, so partial controls count for much less than complete
  // ones: attackers find the gaps in partial coverage. A fully implemented
  // barrier stops the attack 70% of the time.
  const BARRIER_EFFECT = 0.7;
  // Chains are normalised to this many barriers so scenarios with more stages
  // are not rated as better defended simply because they have more stages.
  const REFERENCE_CHAIN = 3;

  function stageStatus(strength) {
    if (strength === null) return 'unassessed';
    if (strength >= 0.75) return 'strong';
    if (strength >= 0.4) return 'weak';
    return 'open';
  }

  function readinessBand(readiness) {
    if (readiness === null) return 'unassessed';
    if (readiness >= 75) return 'defended';
    if (readiness >= 45) return 'partial';
    return 'open';
  }

  // Weighted implementation per control from scored control rows. Unknown
  // and Planned answers count as zero, as they do in the health score.
  function controlScores(controls) {
    const acc = {};
    (controls || []).forEach(c => {
      if (!c.controlId || !['scored', 'unknown', 'planned'].includes(c.state)) return;
      const a = acc[c.controlId] || (acc[c.controlId] = { earned: 0, possible: 0, questions: 0 });
      const w = c.weight || 1;
      a.earned += (c.fraction || 0) * w;
      a.possible += w;
      a.questions++;
    });
    const out = {};
    Object.keys(acc).forEach(k => { out[k] = acc[k].possible > 0 ? acc[k].earned / acc[k].possible : 0; });
    return out;
  }

  // Stage modes:
  //   'all'  the controls are alternative doors or joint requirements; the
  //          attacker uses the weakest, so the weakest control decides.
  //   'any'  the controls are independent barriers; the strongest one decides.
  // Controls not covered by the assessed template are ignored. The key
  // control is the one that decides the stage: the limiting control for
  // 'all', the strongest barrier for 'any'.
  function stageStrength(stage, scores) {
    const any = stage.mode === 'any';
    let value = null;
    let keyControl = null;
    stage.controls.forEach(id => {
      if (scores[id] === undefined) return;
      if (value === null || (any ? scores[id] > value : scores[id] < value)) { value = scores[id]; keyControl = id; }
    });
    return { strength: value, keyControl };
  }

  function chainReadiness(scenario, scores) {
    const barriers = scenario.stages.filter(s => s.type !== 'recover').map(s => stageStrength(s, scores).strength).filter(s => s !== null);
    if (!barriers.length) return null;
    const pass = barriers.reduce((p, s) => p * (1 - BARRIER_EFFECT * s * s), 1);
    const normalised = Math.pow(pass, REFERENCE_CHAIN / barriers.length);
    return Math.round(100 * (1 - normalised));
  }

  // The single control whose full implementation raises this scenario's
  // readiness the most.
  function bestBreaker(scenario, scores, base) {
    const ids = new Set();
    scenario.stages.filter(s => s.type !== 'recover').forEach(s => s.controls.forEach(id => { if (scores[id] !== undefined && scores[id] < 1) ids.add(id); }));
    let best = null;
    ids.forEach(id => {
      const gain = chainReadiness(scenario, { ...scores, [id]: 1 }) - base;
      if (gain > 0 && (!best || gain > best.gain)) best = { controlId: id, gain };
    });
    return best;
  }

  /**
   * Evaluate an assessment against every scenario.
   * @param {object} input { frameworkId, profile, controls (scoreAssessment rows), controlIndex }
   */
  function evaluateThreats(input) {
    const profile = input.profile || {};
    const industry = resolveIndustry(input.frameworkId, profile);
    const scores = controlScores(input.controls);
    const name = id => (input.controlIndex && input.controlIndex[id] ? input.controlIndex[id].name : id);
    const scenarios = [];
    let notRelevant = 0;

    SCENARIOS.forEach(sc => {
      const relevance = relevanceFor(sc, industry, profile);
      if (!relevance) { notRelevant++; return; }
      const stages = sc.stages.map(st => {
        const { strength, keyControl } = stageStrength(st, scores);
        return {
          id: st.id, name: st.name, type: st.type, mode: st.mode || 'all',
          strength: strength === null ? null : Math.round(strength * 100) / 100,
          status: stageStatus(strength),
          keyControl,
          controls: st.controls.map(id => ({ id, name: name(id), score: scores[id] === undefined ? null : Math.round(scores[id] * 100) / 100 }))
        };
      });
      const barriers = stages.filter(s => s.type !== 'recover');
      const assessedBarriers = barriers.filter(s => s.strength !== null);
      const readiness = assessedBarriers.length >= Math.ceil(barriers.length / 2) ? chainReadiness(sc, scores) : null;
      const recoverStages = stages.filter(s => s.type === 'recover' && s.strength !== null);
      const recovery = recoverStages.length ? Math.min(...recoverStages.map(s => s.strength)) : null;
      const weakest = assessedBarriers.length ? assessedBarriers.reduce((a, b) => (b.strength < a.strength ? b : a)) : null;
      const breaker = readiness === null ? null : bestBreaker(sc, scores, readiness);
      scenarios.push({
        id: sc.id,
        name: sc.name,
        category: sc.category,
        relevance,
        readiness,
        status: readinessBand(readiness),
        recovery: recovery === null ? null : Math.round(recovery * 100) / 100,
        recoveryStatus: stageStatus(recovery),
        weakestStage: weakest ? weakest.id : null,
        breaker: breaker ? { controlId: breaker.controlId, controlName: name(breaker.controlId), gain: breaker.gain } : null,
        coverage: barriers.length ? Math.round((assessedBarriers.length / barriers.length) * 100) : 0,
        stages
      });
    });

    const priority = s => (s.readiness === null ? -1 : RELEVANCE_WEIGHT[s.relevance] * (100 - s.readiness));
    scenarios.sort((a, b) => priority(b) - priority(a));

    // Chain breakers: controls whose full implementation most improves the
    // attack paths that are not yet defended, weighted by relevance.
    const breakerMap = {};
    scenarios.forEach(s => {
      if (s.readiness === null || s.status === 'defended') return;
      const sc = SCENARIO_INDEX[s.id];
      const ids = new Set();
      sc.stages.filter(st => st.type !== 'recover').forEach(st => st.controls.forEach(id => { if (scores[id] !== undefined && scores[id] < 1) ids.add(id); }));
      ids.forEach(id => {
        const gain = chainReadiness(sc, { ...scores, [id]: 1 }) - s.readiness;
        if (gain <= 0) return;
        const b = breakerMap[id] || (breakerMap[id] = { controlId: id, controlName: name(id), value: 0, scenarios: [] });
        b.value += gain * RELEVANCE_WEIGHT[s.relevance];
        b.scenarios.push({ id: s.id, name: s.name, gain });
      });
    });
    const breakers = Object.values(breakerMap)
      .map(b => ({ ...b, value: Math.round(b.value), scenarios: b.scenarios.sort((x, y) => y.gain - x.gain) }))
      .sort((a, b) => b.value - a.value || b.scenarios.length - a.scenarios.length)
      .slice(0, 5);

    const count = st => scenarios.filter(s => s.status === st).length;
    return {
      modelVersion: THREAT_MODEL_VERSION,
      industry,
      summary: { open: count('open'), partial: count('partial'), defended: count('defended'), unassessed: count('unassessed'), notRelevant },
      scenarios,
      breakers
    };
  }

  const api = {
    THREAT_MODEL_VERSION,
    INDUSTRIES,
    INDUSTRY_ALIAS,
    RELEVANCE_WEIGHT,
    BARRIER_EFFECT,
    REFERENCE_CHAIN,
    SCENARIOS,
    SCENARIO_INDEX,
    scenariosForControl,
    resolveIndustry,
    relevanceFor,
    controlScores,
    chainReadiness,
    readinessBand,
    stageStatus,
    evaluateThreats
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.HawkThreats = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
