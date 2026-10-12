// ============================================
// HawkSight — Professional Services threat-led template
// Core question set plus the attack paths specific to law, accounting and
// consulting firms: client payment diversion, partner mailbox takeover,
// file-transfer and data-room tools, matter segregation, confidential
// documents in AI tools and meeting client deadlines through an outage.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const PROFESSIONAL_DATA = composeTemplate('professional', {
  entry: [
    { id: 'pro_entry', name: 'Client money, mailboxes and file sharing', description: 'The routes attackers use against advisory firms and their clients.', questions: [
      q('PRO-IN-01', 'HS-PAY-02', 'When clients send you money (fees, escrow, settlement funds), how do you prevent fraudsters impersonating the firm to redirect it?',
        levels(
          ['Nothing specific', 'Clients are not warned.'],
          ['Occasional warnings', 'Warnings in some email footers.'],
          ['Confirmed out of band', 'Bank details are given at engagement and clients are told to confirm any change by phone with a known contact.'],
          ['Verified each time', 'As above, every large transfer is confirmed by phone before and after.']),
        { attack: 'Fraudsters who read a firm\'s or client\'s email send "updated payment details" at the moment a large settlement or property payment is due.',
          verify: 'Engagement letter wording on bank details and the procedure for large transfers.' }),
      q('PRO-IN-02', 'HS-END-03', 'Are partners and senior staff protected against targeted mailbox takeover, for example with impossible-travel alerts, external email warnings and automatic forwarding blocked?',
        levels(
          ['No', 'No specific protection.'],
          ['External banner only', 'External email warnings only.'],
          ['Forwarding blocked and alerts', 'Automatic external forwarding blocked and risky sign-ins alerted.'],
          ['Hardened senior accounts', 'As above, with phishing-resistant MFA for partners and reviewed alerts.']),
        { attack: 'Partners\' mailboxes hold client secrets and approve payments. Attackers watch them quietly for weeks before acting.',
          verify: 'Mail transport rules, forwarding policy and sign-in risk alerts.' }),
      q('PRO-IN-03', 'HS-TPR-01', 'Are file-transfer, data-room and e-signature tools assessed for security and kept up to date?',
        levels(
          ['No', 'Chosen by teams without review.'],
          ['Approved list', 'An approved list exists, not assessed.'],
          ['Assessed and patched', 'Assessed before use; self-hosted tools patched within days of critical fixes.'],
          ['Monitored', 'As above, with usage monitored and unapproved tools blocked.']),
        { attack: 'In 2023 a flaw in the MOVEit file-transfer tool let criminals steal data from more than 2,000 organisations, including several large advisory firms.',
          verify: 'List of file-transfer and data-room tools with their assessment and patch status.' })
    ]}
  ],
  spread: [
    { id: 'pro_matters', name: 'Matter and engagement segregation', description: 'How much client information a single compromised account can reach.', questions: [
      q('PRO-SP-01', 'HS-IAM-02', 'Are client matters segregated so that one compromised account cannot reach every client\'s files, with ethical walls enforced in the document system?',
        levels(
          ['No', 'Most staff can open most client files.'],
          ['By department', 'Restricted by department or office.'],
          ['By matter', 'Access granted per matter or engagement, with ethical walls enforced.'],
          ['By matter, reviewed', 'As above, with access reviewed when matters close or teams change.']),
        { attack: 'Firm-wide access turns one phished junior account into a breach of every client the firm serves.',
          verify: 'Document management access model and one matter\'s access list.' })
    ]}
  ],
  protect: [
    { id: 'pro_confidential', name: 'Confidential client documents', description: 'Keeping client documents within the firm\'s control.', questions: [
      q('PRO-PR-01', 'HS-DAT-03', 'Are confidential documents shared with clients and counterparties through controlled links with expiry and access logs, rather than attachments or personal cloud storage?',
        levels(
          ['Attachments and personal tools', 'Email attachments and personal cloud storage are normal.'],
          ['Mixed', 'A secure tool exists but is used inconsistently.'],
          ['Controlled by default', 'Controlled sharing is the default and personal cloud storage is blocked.'],
          ['Enforced and monitored', 'As above, with labelling and data loss prevention on confidential documents.']),
        { attack: 'Documents emailed as attachments are copied into every mailbox they pass through, and any of them can be breached.',
          verify: 'File sharing policy and DLP configuration.' }),
      q('PRO-PR-02', 'HS-DAT-05', 'Are AI tools used on client work approved by the firm, with terms that prevent client data being retained or used for training?',
        levels(
          ['No', 'Staff choose their own tools.'],
          ['Guidance only', 'Guidance issued, not enforced.'],
          ['Approved tools', 'Approved enterprise tools with suitable terms and a rule on client data.'],
          ['Enforced and disclosed', 'As above, unapproved tools blocked and use disclosed to clients where required.']),
        { attack: 'Client documents pasted into consumer AI tools leave the firm\'s control and may breach confidentiality obligations and client contracts.',
          verify: 'AI policy, approved tool terms and web filter reports.' })
    ]}
  ],
  detect: [
    { id: 'pro_detect', name: 'Spotting data theft', description: 'Noticing unusual access to client files.', questions: [
      q('PRO-DE-01', 'HS-MON-02', 'Would you notice bulk downloads of client files, or a user opening matters they have never worked on?',
        levels(
          ['No', 'Not monitored.'],
          ['Logged only', 'Logged but not reviewed.'],
          ['Alerted', 'Bulk downloads and unusual access raise alerts.'],
          ['Alerted and investigated', 'As above, investigated within a day.']),
        { attack: 'Departing staff and intruders take client files in bulk. The signs are visible in document system logs if anyone looks.',
          verify: 'Document system alert rules and an example investigation.' }),
      q('PRO-DE-02', 'HS-IR-03', 'Do you know which clients you would have to notify, and within what contractual deadlines, if a system or mailbox were breached?',
        levels(
          ['No', 'Not known.'],
          ['Major clients only', 'Known for a few major clients.'],
          ['Mapped', 'Client notification obligations are recorded and linked to systems.'],
          ['Rehearsed', 'As above, rehearsed in an exercise.']),
        { attack: 'Advisory firms often owe clients notification within days. Missing those deadlines damages relationships more than the breach.',
          verify: 'Register of client notification obligations.' })
    ]}
  ],
  recover: [
    { id: 'pro_recover', name: 'Meeting deadlines through an outage', description: 'Continuing client work while systems are unavailable.', questions: [
      q('PRO-RE-01', 'HS-RES-03', 'Could the firm meet court, filing, audit and regulatory deadlines if its systems were down for two weeks?',
        levels(
          ['No', 'No plan.'],
          ['Improvised', 'Partners would improvise.'],
          ['Planned', 'Critical deadlines are tracked outside the main systems, with alternative ways to work and file.'],
          ['Rehearsed', 'As above, rehearsed in the last year.']),
        { attack: 'Ransomware groups know that advisory firms face hard deadlines and that downtime harms clients directly, which increases the pressure to pay.',
          verify: 'Business continuity plan for deadline-driven work.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROFESSIONAL_DATA };
}
