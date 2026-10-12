// ============================================
// HawkSight — Threat-led core question set
// Shared by every industry template. The questions follow the order of an
// attack: how attackers get in, how they spread, what they are after, whether
// they would be noticed, and how the business would recover.
//
// Every question carries:
//   control  explicit HawkSight control (no keyword mapping)
//   options  four answer levels, each with a concrete description (detail)
//   attack   what an attacker does with this gap, in plain language
//   verify   how an assessor checks the answer
//   context  what to consider when answering
// Industry templates add their own categories to the same five stages.
// ============================================

// Four-level answer scale. Each level is described per question so that two
// people answering honestly choose the same option.
function levels(l0, l1, l2, l3) {
  return [l0, l1, l2, l3].map((l, value) => ({ label: l[0], value, detail: l[1] }));
}

function q(id, control, text, options, extra) {
  return { id, control, text, options, ...extra };
}

const STAGES = [
  { id: 'entry', name: 'How attackers get in', description: 'The doors attackers use first: stolen or reset passwords, phishing, exposed internet-facing systems and supplier access.' },
  { id: 'spread', name: 'Stopping an attacker spreading', description: 'What an attacker can reach once inside: administrator accounts, the directory, devices and how the network is separated.' },
  { id: 'protect', name: 'Protecting what attackers want', description: 'The money, data and systems attackers are after, and how hard they are to divert, copy or misuse.' },
  { id: 'detect', name: 'Noticing and responding', description: 'Whether an attack would be spotted while it is in progress, and whether the organisation is ready to act.' },
  { id: 'recover', name: 'Recovering and keeping operations running', description: 'How quickly and safely the business could keep running and recover if systems were unavailable or data destroyed.' }
];

const CORE = {
  entry: [
    { id: 'identity', name: 'Passwords, MFA and account recovery', description: 'Whether a stolen password, or a convincing phone call, is enough to become one of your users.', questions: [
      q('CORE-IN-01', 'HS-IAM-01', 'Which of your sign-ins can still be used with a stolen password alone, without a second factor?',
        levels(
          ['Most of them', 'MFA is not enforced for email, remote access or administrator accounts.'],
          ['Several', 'MFA is on for some services (for example email) but not for remote access, cloud consoles or administrators.'],
          ['A few exceptions', 'MFA is enforced for email, remote access, cloud consoles and administrators; some legacy applications or accounts are exempt.'],
          ['None', 'Every interactive sign-in requires MFA. Exceptions are documented, reviewed and compensated.']),
        { context: 'Consider email, VPN and remote desktop gateways, cloud consoles, finance and HR systems, and administrator accounts, including those of contractors.',
          attack: 'Passwords are stolen every day by phishing and infostealer malware and sold in bulk. Without a second factor, a stolen password is a working key.',
          verify: 'Export the identity provider\'s MFA or conditional-access policy and list every account and application excluded from it.' }),
      q('CORE-IN-02', 'HS-IAM-01', 'What type of second factor protects administrator and remote-access accounts?',
        levels(
          ['None', 'Administrator or remote-access accounts have no second factor.'],
          ['SMS or voice codes', 'One-time codes sent by SMS or phone call.'],
          ['Authenticator app', 'App-based codes or push approvals with number matching.'],
          ['Phishing-resistant', 'FIDO2 security keys, passkeys or certificate-based authentication that cannot be relayed through a fake login page.']),
        { context: 'Answer for the weakest method still allowed for these accounts, not the preferred one.',
          attack: 'Attackers relay one-time codes through fake login pages, flood users with push prompts until one is approved, and hijack SMS codes through SIM swaps.',
          verify: 'Identity provider report of registered authentication methods for administrator and remote-access users.' }),
      q('CORE-IN-03', 'HS-IAM-06', 'When someone contacts the IT helpdesk to reset a password or register a new MFA device, how is their identity confirmed?',
        levels(
          ['Details they provide', 'Name, employee ID, date of birth or manager\'s name, all of which can be found online.'],
          ['Call-back', 'The helpdesk calls back on the number held in HR or directory records.'],
          ['Call-back and approval', 'Call-back plus approval from the person\'s manager; the user is notified of every reset.'],
          ['Strong verification and alerting', 'Video or in-person identity check for privileged accounts, and every reset or MFA change raises an alert reviewed by security.']),
        { context: 'If the helpdesk is outsourced, answer for the provider\'s actual practice, not your policy.',
          attack: 'Groups such as Scattered Spider phone helpdesks pretending to be employees, using details found on LinkedIn or in earlier breaches, and ask for MFA to be reset.',
          verify: 'Read the reset procedure, then review the last five reset tickets to see how identity was actually checked.' }),
      q('CORE-IN-04', 'HS-IAM-03', 'When someone leaves, how quickly is all their access removed, including cloud apps, VPN and shared accounts?',
        levels(
          ['No defined process', 'Accounts are removed when someone remembers.'],
          ['Within a week', 'Core accounts are disabled within a week; cloud apps and shared passwords are often missed.'],
          ['Same day', 'Core systems and SaaS applications are covered by a leaver checklist completed on the last day.'],
          ['Automatic', 'Access is removed automatically from the HR exit, and quarterly access reviews find no leftover accounts.']),
        { context: 'Include contractors, interns and temporary staff.',
          attack: 'Accounts of people who have left are rarely watched. Former staff, or attackers who buy their old passwords, can use them unnoticed.',
          verify: 'Compare the list of leavers from the last quarter with active accounts in the directory and two major SaaS applications.' })
    ]},
    { id: 'email', name: 'Email and phishing', description: 'How hard it is to impersonate you by email, and how many malicious emails reach and fool your people.', questions: [
      q('CORE-IN-05', 'HS-END-03', 'How well is your email domain protected against being spoofed?',
        levels(
          ['Not protected', 'No DMARC record, or SPF and DKIM are missing.'],
          ['Monitoring only', 'SPF and DKIM are published and DMARC is set to p=none.'],
          ['Quarantine', 'DMARC is set to p=quarantine for all sending domains.'],
          ['Reject and monitored', 'DMARC is set to p=reject, reports are reviewed, and lookalike domains are monitored.']),
        { context: 'Include every domain you send email from, including marketing and parked domains.',
          attack: 'Without DMARC enforcement, anyone can send email that appears to come from your domain to your customers, suppliers and staff.',
          verify: 'Look up the DMARC record (TXT record at _dmarc.yourdomain) for each domain.' }),
      q('CORE-IN-06', 'HS-END-03', 'What happens to a malicious link or attachment before it reaches someone\'s inbox?',
        levels(
          ['Basic spam filtering', 'Only the email provider\'s default spam filter.'],
          ['Attachment scanning', 'An email security product scans attachments for known malware.'],
          ['Sandboxing and link checks', 'Attachments are detonated in a sandbox and links are checked again when clicked.'],
          ['Plus fast reporting', 'Staff have a one-click report button, and reported emails are triaged and removed from every mailbox.']),
        { attack: 'Phishing is still one of the most common ways in. Modern lures use QR codes, links to trusted file-sharing sites and fake MFA prompts to get past basic filters.',
          verify: 'Email security configuration, and the record of the last reported phishing email being removed from all mailboxes.' }),
      q('CORE-IN-07', 'HS-PPL-02', 'When staff receive a realistic phishing test, what happens?',
        levels(
          ['Never tested', 'No phishing simulations have been run.'],
          ['Occasional', 'Tested rarely; results are not tracked over time.'],
          ['Regular and tracked', 'Tested at least twice a year; click and report rates are tracked and repeat clickers get follow-up training.'],
          ['More report than click', 'Tested at least quarterly with varied lures (QR codes, fake MFA prompts, voice); more people report the test than click it.']),
        { attack: 'Someone will always click eventually. What decides the outcome is whether someone else reports the email quickly enough for it to be stopped.',
          verify: 'Results of the last two simulation campaigns, showing click and report rates.' })
    ]},
    { id: 'exposure', name: 'What you expose to the internet', description: 'Systems anyone on the internet can reach, which attackers scan for constantly.', questions: [
      q('CORE-IN-08', 'HS-VUL-03', 'Do you have a complete, current list of everything you expose to the internet: domains, IP addresses, VPNs, firewalls, remote-access portals and web applications?',
        levels(
          ['No list', 'Nobody holds a list of internet-facing systems.'],
          ['Partial', 'A manually maintained list exists but is not checked against what is actually exposed.'],
          ['Complete and verified', 'The list is complete and verified at least quarterly with an external scan.'],
          ['Continuously discovered', 'Attack surface monitoring continuously finds new exposure, including systems set up by suppliers or teams outside IT.']),
        { attack: 'Attackers scan the entire internet within hours of a new flaw being announced. The forgotten test server or old VPN is usually the one they find.',
          verify: 'Compare the inventory with an external scan of your domains and IP ranges.' }),
      q('CORE-IN-09', 'HS-VUL-03', 'When a critical flaw in a VPN, firewall or other internet-facing device is announced as being actively exploited, how fast is it fixed?',
        levels(
          ['Normal patch cycle', 'No special process; handled with routine updates.'],
          ['Within a month', 'Fixed within 30 days.'],
          ['Within 7 days', 'Fixed within a week; vendor advisories, CISA KEV and CERT-In advisories are tracked.'],
          ['Within 48 hours', 'Fixed or mitigated within 48 hours (isolated the same day if no fix exists) and checked for signs of compromise.']),
        { context: 'Consider VPN and remote-access gateways, firewalls, file-transfer servers, email servers and any device that manages others.',
          attack: 'Flaws in edge devices such as Citrix, Ivanti, Fortinet and Palo Alto have been exploited at scale within days of disclosure. These devices are now among the most common entry points for ransomware.',
          verify: 'For the last two critical advisories affecting your edge devices, show the dates they were published and the dates they were fixed.' }),
      q('CORE-IN-10', 'HS-VUL-03', 'Can anyone on the internet directly reach a remote desktop (RDP), SSH, database or device administration login of yours?',
        levels(
          ['Yes, several', 'Several such services are reachable from the internet.'],
          ['One or two', 'One or two are exposed, protected only by passwords.'],
          ['None directly', 'None are exposed; administration is only possible through VPN or zero-trust access with MFA.'],
          ['None, and checked', 'None are exposed, confirmed by regular external scans that alert if one appears.']),
        { attack: 'Exposed remote desktop is one of the most common ransomware entry points. It is attacked with guessed passwords or logged into with credentials bought from criminal marketplaces.',
          verify: 'External port scan of your IP ranges, or results from an internet search engine such as Shodan.' }),
      q('CORE-IN-11', 'HS-VUL-01', 'How often are your systems scanned for vulnerabilities and tested by someone acting like an attacker?',
        levels(
          ['Never', 'No vulnerability scanning or penetration testing.'],
          ['Occasionally', 'Ad hoc scans or a test some years ago.'],
          ['Regularly', 'Monthly internal and quarterly external scans, and a penetration test of critical systems every year.'],
          ['Regularly, with closure', 'As regular, with findings fixed within agreed timeframes and tests that include social engineering or an assumed-breach scenario.']),
        { attack: 'Attackers use the same scanning tools you can. If you have not looked, they will see your weaknesses first.',
          verify: 'Latest scan reports and penetration test report, with the status of their findings.' })
    ]},
    { id: 'suppliers', name: 'Supplier and remote access', description: 'The trusted connections suppliers and IT providers have into your systems.', questions: [
      q('CORE-IN-12', 'HS-NET-03', 'How do suppliers and IT support providers connect remotely into your systems?',
        levels(
          ['Always on', 'Remote tools (for example TeamViewer or AnyDesk) or VPN accounts are left running permanently, sometimes shared.'],
          ['Named but always on', 'Each supplier has named accounts, but access is permanently enabled.'],
          ['On request with MFA', 'Named accounts with MFA, enabled only when needed and time-limited.'],
          ['Brokered and recorded', 'Access is brokered through a controlled gateway, sessions are recorded and reviewed, and access ends with the contract.']),
        { attack: 'Supplier remote access is a trusted path straight past your defences. Attackers breach the supplier, or simply use its always-on connection.',
          verify: 'List of supplier accounts and remote tools, with last login dates and how each is enabled.' }),
      q('CORE-IN-13', 'HS-TPR-01', 'Do you know which suppliers could seriously hurt you if they were breached or went offline, and have you checked their security?',
        levels(
          ['No', 'No list of critical suppliers.'],
          ['List only', 'Key suppliers are known, but their security has not been assessed.'],
          ['Assessed', 'Critical suppliers are assessed before onboarding and contracts require prompt breach notification.'],
          ['Assessed and rehearsed', 'Reassessed every year, and the loss of a critical supplier is part of incident and continuity planning.']),
        { context: 'Critical suppliers include those holding your data, with access to your systems, or whose outage would stop your operations.',
          attack: 'Many major breaches start at a supplier: an IT provider, a software vendor or a contractor. Their breach becomes yours, and their outage stops your business.',
          verify: 'Supplier register with criticality ratings and the most recent assessment for the top three.' })
    ]}
  ],

  spread: [
    { id: 'admin', name: 'Administrator accounts and the directory', description: 'The accounts that, once taken, let an attacker switch off defences and encrypt everything at once.', questions: [
      q('CORE-SP-01', 'HS-IAM-04', 'How are administrator rights over your domain, cloud tenant and core systems granted and used?',
        levels(
          ['Widely held', 'Many people have administrator rights, often on their everyday accounts.'],
          ['Limited but everyday', 'A small group, but they use administrator rights from accounts they also use for email and browsing.'],
          ['Separate and reviewed', 'Separate administrator accounts with MFA, membership reviewed at least quarterly.'],
          ['Just-in-time and monitored', 'Separate accounts used only from dedicated devices, granted just in time, with every use logged and alerted.']),
        { attack: 'Ransomware operators aim for domain or cloud administrator. With it they can disable security tools and encrypt every server simultaneously.',
          verify: 'Export of privileged group membership (for example Domain Admins, Global Administrators) and the last review record.' }),
      q('CORE-SP-02', 'HS-IAM-07', 'Have you checked your Active Directory or Entra ID for the weaknesses attackers use to escalate, such as stale admin accounts, weak service account passwords and legacy authentication?',
        levels(
          ['Never', 'The directory has never been assessed for security weaknesses.'],
          ['Some time ago', 'An informal review more than a year ago.'],
          ['Assessed and fixed', 'Assessed with a tool such as PingCastle, Purple Knight or BloodHound in the last 12 months, and high-risk issues fixed.'],
          ['Assessed regularly', 'Assessed at least quarterly, legacy authentication disabled and administration tiered.']),
        { context: 'Answer N/A only if you have no directory service at all.',
          attack: 'Most ransomware intrusions go from one infected laptop to full control of the network through weaknesses in Active Directory, often within a day.',
          verify: 'The most recent directory assessment report and the status of its findings.' }),
      q('CORE-SP-03', 'HS-IAM-04', 'Do staff have local administrator rights on their own laptops and desktops?',
        levels(
          ['Most do', 'Most users are local administrators.'],
          ['Some teams', 'Some teams (for example developers or IT) routinely have local admin rights.'],
          ['By exception', 'No standing local admin rights; exceptions are approved and time-limited.'],
          ['None, unique passwords', 'No standing rights, unique local admin passwords per device (for example LAPS) and every elevation logged.']),
        { attack: 'Local admin rights let malware switch off protection and pull passwords from memory. A shared local admin password lets an attacker hop to every machine.',
          verify: 'Endpoint management report of local administrator group membership.' })
    ]},
    { id: 'devices', name: 'Devices and patching', description: 'Whether malicious activity on a laptop or server is stopped, and how long known flaws stay open.', questions: [
      q('CORE-SP-04', 'HS-END-01', 'What share of laptops, desktops and servers run endpoint detection and response (EDR) that someone actually monitors?',
        levels(
          ['Antivirus only', 'Traditional antivirus, or no central view of protection.'],
          ['Some devices', 'EDR on some devices, or alerts rarely reviewed.'],
          ['Nearly all, business hours', 'EDR on 95% or more of devices, alerts reviewed during business hours.'],
          ['All, around the clock', 'EDR on all devices including servers, with tamper protection and 24x7 monitoring (in-house or managed) that can isolate a device.']),
        { attack: 'Attackers routinely switch off or evade basic antivirus. In many investigations the EDR alerts were there, but nobody was watching.',
          verify: 'EDR console coverage report compared with the asset inventory, and the record of the last alert handled out of hours.' }),
      q('CORE-SP-05', 'HS-VUL-02', 'How quickly are critical security updates applied to laptops, servers and business applications?',
        levels(
          ['No regular process', 'Updates are applied irregularly.'],
          ['Within 90 days', 'Most critical updates are applied within three months.'],
          ['Within 30 days', 'Within 30 days, with compliance reported monthly.'],
          ['Within 14 days', 'Within 14 days, sooner for flaws being actively exploited, with compliance above 95%.']),
        { attack: 'Once a patch is published, attackers study it to build exploits. Every week a known flaw stays open is time they can use.',
          verify: 'Patch compliance report for servers and endpoints for the last month.' }),
      q('CORE-SP-06', 'HS-VUL-02', 'Do you still run systems that no longer receive security updates, such as old Windows versions or unsupported databases?',
        levels(
          ['Yes, on the main network', 'Unsupported systems are connected to the general network.'],
          ['Yes, some protection', 'A few remain, with some extra protection.'],
          ['Yes, isolated', 'A few remain, each isolated, monitored and formally risk-accepted with a replacement date.'],
          ['None', 'All unsupported systems have been retired or replaced.']),
        { attack: 'Unsupported systems are permanent open doors: when a new flaw is found, no patch will ever come.',
          verify: 'Inventory filtered by operating system and software end-of-support dates.' })
    ]},
    { id: 'network', name: 'Network separation', description: 'How far an attacker can travel from the first device they compromise.', questions: [
      q('CORE-SP-07', 'HS-NET-01', 'If one office laptop were infected, what could it reach on the network?',
        levels(
          ['Practically everything', 'One flat network; any device can reach any server.'],
          ['Most things', 'Guest Wi-Fi is separate, but staff devices can reach servers and critical systems freely.'],
          ['Critical systems separated', 'Servers, backups, payment, clinical or operational systems are in separate zones with firewall rules.'],
          ['Deny by default, tested', 'Zones only allow required traffic, rules are reviewed, and separation is tested (for example in a penetration test).']),
        { attack: 'On a flat network, ransomware spreads from one laptop to every server within minutes.',
          verify: 'Network diagram, firewall rules between user networks and server networks, and the last segmentation test.' })
    ]}
  ],

  protect: [
    { id: 'money', name: 'Money and payment instructions', description: 'How easily money can be diverted by a fake bank-detail change or an impersonated executive.', questions: [
      q('CORE-PR-01', 'HS-PAY-02', 'If a supplier emails to change their bank account details, what has to happen before the next payment goes out?',
        levels(
          ['Updated from the email', 'Finance updates the details based on the email or letter.'],
          ['Usually a phone check', 'Someone usually phones, but there is no written rule or record.'],
          ['Mandatory call-back and second approver', 'A call-back to a number already on file (never one in the request) is required and recorded, and a second person approves the change.'],
          ['Plus a payment hold', 'As above, plus changed details trigger a hold or small test payment, and staff are tested on the procedure.']),
        { attack: 'In payment diversion fraud the attacker is often inside a real supplier\'s mailbox, so the request arrives in a genuine email thread and looks completely normal.',
          verify: 'Take two recent bank-detail changes and show the call-back record and the approver.' }),
      q('CORE-PR-02', 'HS-PAY-02', 'How are urgent or unusual payment requests that appear to come from senior leaders verified?',
        levels(
          ['Paid if it looks right', 'Requests from the CEO or CFO are actioned on trust.'],
          ['Informal check', 'Staff may check, but there is no rule.'],
          ['Two approvers and out-of-band check', 'Payments over a set threshold need two approvers and confirmation through a separate channel.'],
          ['Deepfake-aware', 'As above, plus staff are briefed on voice and video deepfakes and a call-back or code word is required for urgent requests.']),
        { attack: 'Criminals now clone executives\' voices and faces. In 2024 an employee paid out about US$25 million after a video call in which every other participant was a deepfake.',
          verify: 'Payment approval matrix and the record of the last urgent payment request.' })
    ]},
    { id: 'data', name: 'Sensitive data', description: 'Where your valuable data is, and how easily it could be copied out or leaked.', questions: [
      q('CORE-PR-03', 'HS-AST-03', 'Do you know where your most sensitive data is, including copies in email, file shares, laptops and cloud apps?',
        levels(
          ['No', 'No view of where sensitive data is stored.'],
          ['Main systems only', 'The main databases are known; copies elsewhere are not tracked.'],
          ['Inventory maintained', 'An inventory covers regulated and sensitive data, including major cloud apps, updated in the last year.'],
          ['Automatically discovered', 'Automated discovery finds sensitive data in unexpected places and it is cleaned up.']),
        { context: 'Sensitive data includes personal data, customer and patient records, financial data and intellectual property.',
          attack: 'Extortion groups increasingly steal data instead of, or as well as, encrypting it. You cannot protect, or notify people about, data you do not know you hold.',
          verify: 'Data inventory, and a spot check of one file share or SaaS application for sensitive data not listed.' }),
      q('CORE-PR-04', 'HS-DAT-03', 'Could someone copy a large volume of sensitive data to personal email, USB drives or personal cloud storage without being blocked or flagged?',
        levels(
          ['Yes, easily', 'Nothing prevents or records it.'],
          ['Partly blocked', 'Some channels are blocked (for example USB), others are open.'],
          ['Main channels controlled', 'Email, cloud storage and USB are controlled for sensitive data.'],
          ['Controlled and alerted', 'Main channels are controlled and bulk downloads or uploads raise alerts that are reviewed.']),
        { attack: 'Attackers, and departing staff, copy data out through ordinary channels. Without controls the theft looks like normal work.',
          verify: 'Data loss prevention policy configuration and a recent alert record.' }),
      q('CORE-PR-05', 'HS-DAT-01', 'What share of laptops and mobile devices that hold work data have encryption enforced centrally?',
        levels(
          ['None or unknown', 'Encryption is not enforced.'],
          ['Some', 'Some devices are encrypted, set up manually.'],
          ['Most', 'Most devices are encrypted through device management policy.'],
          ['All, with reporting', 'All devices are encrypted, compliance is reported and recovery keys are held centrally.']),
        { attack: 'A lost or stolen unencrypted laptop is a reportable data breach. With encryption, it is only a lost laptop.',
          verify: 'Device management encryption compliance report.' }),
      q('CORE-PR-06', 'HS-DAT-05', 'What rules govern staff use of AI tools such as ChatGPT, Copilot or Gemini with company, client or customer data?',
        levels(
          ['No rules', 'Staff use whatever tools they like.'],
          ['Informal guidance', 'Guidance has been circulated, but nothing is enforced.'],
          ['Approved tools and policy', 'Approved tools only, under enterprise terms that exclude training on your data, and a written rule on what may be shared.'],
          ['Enforced', 'As above, plus unapproved AI services and AI browser extensions are detected or blocked, and usage is reviewed.']),
        { attack: 'Data pasted into free AI tools leaves your control and, depending on the service, may be retained or used for training. AI browser extensions can read everything on screen.',
          verify: 'AI use policy, approved tool contracts, and a web filter report of AI service usage.' })
    ]},
    { id: 'cloud', name: 'Cloud and collaboration platforms', description: 'Settings in Microsoft 365, Google Workspace and cloud platforms that attackers abuse.', questions: [
      q('CORE-PR-07', 'HS-CLD-01', 'How are your Microsoft 365 or Google Workspace and cloud accounts checked for risky settings such as public file sharing, third-party app consents and storage open to the internet?',
        levels(
          ['Default settings', 'Settings have never been reviewed.'],
          ['Reviewed at setup', 'Reviewed once when the service was set up.'],
          ['Reviewed against a baseline', 'Reviewed at least twice a year against a baseline such as CIS Benchmarks or Microsoft Secure Score.'],
          ['Continuously monitored', 'Monitored continuously (CSPM or SSPM), with alerts for public exposure and new high-privilege app consents.']),
        { attack: 'Attackers trick users into granting a malicious app access to their mailbox or files. That access survives password resets and MFA.',
          verify: 'Secure Score or posture report, external sharing settings and the list of third-party apps with consent.' })
    ]}
  ],

  detect: [
    { id: 'monitoring', name: 'Spotting an attack', description: 'Whether the signs of an attack in progress are recorded, and whether anyone is looking.', questions: [
      q('CORE-DE-01', 'HS-MON-01', 'If you had to investigate a suspicious sign-in from three months ago, would the logs still exist?',
        levels(
          ['No central logs', 'Logs are not collected centrally.'],
          ['Some, short retention', 'Some systems keep logs locally for a few weeks.'],
          ['Centralised, 180 days', 'Identity, email, firewall and VPN, endpoint and critical application logs are centralised and kept at least 180 days.'],
          ['Protected, 12 months', 'As above, kept 12 months or longer, protected from tampering, and searches have been tested.']),
        { context: 'CERT-In directions require logs of ICT systems to be kept securely for a rolling 180 days within India.',
          attack: 'Attackers are often inside for weeks before they are found. Without logs you cannot tell what they touched, so you must assume the worst.',
          verify: 'List of log sources in the central platform and the configured retention.' }),
      q('CORE-DE-02', 'HS-MON-02', 'If an attacker signed in as an administrator at 2 a.m. on a Saturday, who would know, and how quickly?',
        levels(
          ['Nobody', 'Nobody, until damage is visible.'],
          ['Next working day, maybe', 'Alerts exist but are only seen during working hours, if at all.'],
          ['Same business day', 'Alerts for defined high-risk events go to a named team and are reviewed the same business day.'],
          ['Within the hour, 24x7', '24x7 monitoring, in-house or through a managed SOC or MDR, with a target to respond within an hour.']),
        { attack: 'Ransomware is usually launched at night, at weekends or on holidays, when nobody is watching. The days attackers spend inside beforehand are the window to catch them.',
          verify: 'Monitoring service contract or rota, and the timeline of the most recent out-of-hours alert.' }),
      q('CORE-DE-03', 'HS-MON-02', 'Which of these warning signs raise an alert today: new MFA device registered, mailbox forwarding rule created, admin group membership changed, security tool disabled, mass file changes?',
        levels(
          ['None of them', 'None raise an alert.'],
          ['One or two', 'One or two raise an alert.'],
          ['Most', 'Most raise an alert that someone reviews.'],
          ['All, with a playbook', 'All raise an alert, each with a documented response.']),
        { attack: 'These are the fingerprints of almost every intrusion. Without alerts on them, the first sign of the attack is the ransom note.',
          verify: 'Alert rules in the SIEM, EDR or identity platform for each warning sign.' })
    ]},
    { id: 'response', name: 'Ready to respond', description: 'Whether the organisation knows what to do, who decides and who must be told.', questions: [
      q('CORE-DE-04', 'HS-IR-01', 'If ransomware hit tomorrow, would everyone know who decides, who to call and what to switch off?',
        levels(
          ['No plan', 'There is no incident response plan.'],
          ['General plan', 'A general plan exists but is untested and not specific to ransomware.'],
          ['Playbooks and contacts', 'Written playbooks for ransomware, account takeover and data theft, with contacts for forensics, legal, insurer and regulators.'],
          ['Ready offline', 'As above, available offline, and decision authority (for example to shut systems down) agreed in advance.']),
        { attack: 'In the first hours of an attack, confusion costs more than anything. If the plan is on the encrypted file server, there is no plan.',
          verify: 'Incident response plan and playbooks, and where the offline copy is kept.' }),
      q('CORE-DE-05', 'HS-IR-03', 'Could you report a cyber incident to CERT-In within 6 hours and notify regulators, customers and affected people on time?',
        levels(
          ['Not aware', 'Notification deadlines are not known.'],
          ['Aware, no procedure', 'Deadlines are known but there is no procedure.'],
          ['Procedure ready', 'A documented procedure with owners, templates and contacts for CERT-In, sector regulators, the Data Protection Board and customers.'],
          ['Rehearsed', 'As above, rehearsed in an exercise in the last 12 months.']),
        { context: 'CERT-In requires reportable incidents to be reported within 6 hours of noticing them. The DPDP Act requires personal data breaches to be reported to the Data Protection Board and to affected individuals. Sector regulators and contracts add their own deadlines. Outside India, answer for your applicable regulators.',
          attack: 'Missing a notification deadline turns an incident into a regulatory breach as well, and attackers increasingly contact customers directly to add pressure.',
          verify: 'Notification procedure, regulator contact list and template notifications.' }),
      q('CORE-DE-06', 'HS-IR-02', 'When did your leadership team last rehearse a cyber incident in a tabletop exercise?',
        levels(
          ['Never', 'No exercise has been held.'],
          ['Over two years ago', 'The last exercise was more than two years ago.'],
          ['Within a year', 'Within the last 12 months, with lessons recorded.'],
          ['Yearly, realistic', 'At least yearly, using a scenario realistic for your industry and key suppliers, with actions closed.']),
        { attack: 'Decisions such as whether to shut down operations, pay, or tell customers are far harder to make for the first time during a live attack.',
          verify: 'Exercise report and lessons-learned action log.' }),
      q('CORE-DE-07', 'HS-GOV-03', 'Does leadership know the cyber attack scenarios that could seriously hurt the business, and is someone accountable for each?',
        levels(
          ['No', 'Cyber risk is seen as an IT matter.'],
          ['IT view only', 'IT has a view of the main risks, not shared with leadership.'],
          ['Owned and reviewed', 'The main scenarios are documented with owners and reviewed by leadership at least yearly.'],
          ['Driving decisions', 'Reviewed at least quarterly and used to set budget and priorities.']),
        { attack: 'Attackers target whatever the business cannot do without. If leadership has not named those things, they are rarely the best protected.',
          verify: 'Risk register entries for cyber scenarios and the last leadership review.' })
    ]}
  ],

  recover: [
    { id: 'backups', name: 'Backups attackers cannot destroy', description: 'Whether you could restore after attackers with administrator rights have tried to stop you.', questions: [
      q('CORE-RE-01', 'HS-RES-01', 'If an attacker gained full administrator control of your network, could they delete or encrypt your backups?',
        levels(
          ['Yes', 'Backups are on the same network and domain, using the same administrator accounts.'],
          ['Probably', 'Backups are separate but reachable with domain credentials.'],
          ['No', 'At least one copy is offline or immutable and uses separate credentials with MFA.'],
          ['No, and verified', 'As above, immutability is verified regularly and any access to the backup console raises an alert.']),
        { attack: 'Attackers look for backups first. Ransomware groups delete or encrypt backups before launching encryption so that victims cannot simply restore.',
          verify: 'Backup architecture, immutability or offline settings, and who can sign in to the backup console.' }),
      q('CORE-RE-02', 'HS-RES-02', 'When did you last restore a complete critical system, not just a file, from backup, and how long did it take?',
        levels(
          ['Never', 'No restore of a complete system has been tested.'],
          ['Files only', 'Only individual files or folders have been restored.'],
          ['Within a year, timed', 'A complete critical system restored in the last 12 months, with the time recorded against the target.'],
          ['Regularly, from clean', 'Full restores of critical systems tested at least twice a year, including rebuilding identity services from a clean state, within target.']),
        { attack: 'Backups that have never been restored often fail when they are needed, or take far longer than anyone expected.',
          verify: 'Restore test records showing the system, date, time taken and target.' })
    ]},
    { id: 'continuity', name: 'Running the business through an outage', description: 'Whether customers can still be served while systems are down.', questions: [
      q('CORE-RE-03', 'HS-RES-02', 'Have business owners agreed how long each critical service can be down (RTO) and how much data can be lost (RPO)?',
        levels(
          ['No', 'Not defined.'],
          ['IT estimates', 'IT has estimates that the business has not agreed.'],
          ['Agreed', 'Agreed with business owners for critical services, and backup design matches them.'],
          ['Agreed and proven', 'As above, tested and reported to leadership.']),
        { attack: 'Without agreed priorities, recovery after an attack is decided under pressure, and the systems the business most needs may come back last.',
          verify: 'RTO and RPO register signed off by business owners.' }),
      q('CORE-RE-04', 'HS-RES-03', 'If all IT systems were unavailable for two weeks, how would the business keep serving customers?',
        levels(
          ['It could not', 'No plan for operating without IT.'],
          ['Ideas, not written', 'Some teams have ideas, but nothing is written down.'],
          ['Downtime procedures', 'Written procedures for critical processes (manual workflows, contact lists, printed key information).'],
          ['Rehearsed', 'As above, rehearsed in the last year, with forms and offline copies kept ready.']),
        { attack: 'Recovering from serious ransomware usually takes weeks, not days. Organisations that can operate manually lose far less, and are under far less pressure to pay.',
          verify: 'Downtime procedures and the record of the last downtime drill.' })
    ]}
  ]
};

// Compose a template from the core and an industry's additional categories.
// extra: { [stageId]: [category, ...] } ; industry categories follow the
// core categories within each stage.
function composeTemplate(id, extra, stageText) {
  return {
    id,
    modules: STAGES.map(stage => ({
      id: stage.id,
      name: stage.name,
      description: (stageText && stageText[stage.id]) || stage.description,
      icon: '',
      categories: [...CORE[stage.id], ...((extra && extra[stage.id]) || [])]
    }))
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STAGES, CORE, levels, q, composeTemplate };
}
