// ============================================
// HawkSight — BFSI & FinTech threat-led template
// Core question set plus the attack paths specific to banks, NBFCs,
// insurers, payment and FinTech companies: customer account takeover, API
// abuse, partner and outsourcer access, payment-system compromise, payment
// file tampering, mule-driven fraud and recovery of payment services.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const FINTECH_DATA = composeTemplate('fintech', {
  entry: [
    { id: 'ft_entry', name: 'Customer channels, APIs and partners', description: 'The routes attackers use to reach customer money and data.', questions: [
      q('FT-IN-01', 'HS-PAY-01', 'How are customers protected against account takeover through SIM swap, phished one-time passwords and screen-sharing or remote-access app scams?',
        levels(
          ['SMS OTP only', 'One-time passwords by SMS are the only protection.'],
          ['OTP with limits', 'SMS OTP plus basic transaction limits.'],
          ['Device binding and step-up', 'Device binding, step-up checks for new devices and payees, and a cooling-off period for new beneficiaries.'],
          ['Real-time risk', 'As above, with real-time behavioural risk scoring that detects remote-access and screen-sharing apps.']),
        { attack: 'Fraudsters call customers posing as the bank, persuade them to install a screen-sharing app or read out an OTP, and empty the account in minutes. SIM swaps let them receive the OTP themselves.',
          verify: 'Customer authentication design and fraud loss figures for account takeover.' }),
      q('FT-IN-02', 'HS-APP-01', 'Are customer-facing and partner APIs inventoried, authenticated and tested for broken object-level authorisation, where one customer can read another\'s data by changing an ID?',
        levels(
          ['No inventory', 'APIs are not inventoried.'],
          ['Inventoried, not tested', 'APIs are known but not security tested.'],
          ['Tested yearly', 'All APIs are authenticated and tested against the OWASP API Security Top 10 at least yearly.'],
          ['Gateway and pre-release testing', 'As above, an API gateway enforces authentication and rate limits, and new APIs are tested before release.']),
        { attack: 'Broken object-level authorisation is the most common serious API flaw. It lets an attacker download every customer\'s data by simply counting through account numbers.',
          verify: 'API inventory and the most recent API security test report.' }),
      q('FT-IN-03', 'HS-TPR-01', 'Are partners with access to your systems or customer data (FinTech partners, payment aggregators, business correspondents, collection agencies, IT outsourcers) risk-tiered, assessed and monitored?',
        levels(
          ['No', 'Partners are not assessed for security.'],
          ['At onboarding', 'Assessed once at onboarding.'],
          ['Risk-tiered, yearly', 'Risk-tiered, reassessed yearly, with audit rights in contracts.'],
          ['Monitored', 'As above, monitored continuously and included in incident drills.']),
        { context: 'RBI\'s Master Direction on Outsourcing of IT Services (2023) requires regulated entities to manage risks from IT service providers.',
          attack: 'Partners and outsourcers often hold broad access to customer data or payment flows with far weaker security than the regulated entity.',
          verify: 'Partner register with risk tiers and the last assessments for the top three partners.' })
    ]}
  ],
  spread: [
    { id: 'ft_payment_systems', name: 'Payment systems and privileged access', description: 'Systems that move money, and the people who can control them.', questions: [
      q('FT-SP-01', 'HS-NET-01', 'Are payment systems such as SWIFT, UPI or IMPS switches, card switches and treasury platforms isolated from the general corporate network?',
        levels(
          ['No', 'They are reachable from the corporate network.'],
          ['Partly', 'Partly separated with broad rules.'],
          ['Dedicated zone', 'Dedicated zone reachable only through a jump host with MFA.'],
          ['Dedicated and tested', 'As above, aligned to SWIFT CSP-style controls and tested regularly.']),
        { attack: 'In the 2016 Bangladesh Bank heist and the 2018 Cosmos Bank attack in Pune, attackers moved from the corporate network to payment systems and sent fraudulent transfers worth tens of millions of dollars.',
          verify: 'Network diagram for payment zones and jump host access policy.' }),
      q('FT-SP-02', 'HS-IAM-02', 'Can any single person both create a beneficiary or payee and approve a payment to it, in treasury, operations or customer systems?',
        levels(
          ['Yes', 'One person can do both.'],
          ['On paper only', 'Separation is in policy but not enforced by the system.'],
          ['System-enforced', 'Maker-checker is enforced by the system.'],
          ['Enforced and reviewed', 'As above, with segregation-of-duties conflicts and overrides reviewed periodically.']),
        { attack: 'Attackers who take over one employee account, and dishonest insiders, look for exactly this gap to move money without a second pair of eyes.',
          verify: 'Role configuration in the payment system and the last SoD conflict review.' }),
      q('FT-SP-03', 'HS-IAM-04', 'How is privileged access to core banking, payment switches and production databases controlled?',
        levels(
          ['Shared admin accounts', 'Shared administrator credentials are in use.'],
          ['Named, uncontrolled', 'Named admin accounts without session control.'],
          ['Vaulted and recorded', 'Privileged access through a vault with MFA and session recording.'],
          ['Just-in-time, dual control', 'As above, granted just in time, dual control for production changes, recordings reviewed.']),
        { attack: 'Privileged access to payment systems turns an intrusion into direct theft: attackers alter limits, create accounts or insert transactions.',
          verify: 'PAM coverage report for core systems and a sample of reviewed session recordings.' })
    ]}
  ],
  protect: [
    { id: 'ft_transactions', name: 'Transactions and customer data', description: 'Protecting payment flows and customer data from tampering and misuse.', questions: [
      q('FT-PR-01', 'HS-PAY-01', 'Are payment files and messages protected against tampering between systems, for example files placed in a folder before upload to a payment system?',
        levels(
          ['Plain files on shares', 'Files sit unprotected on shared folders.'],
          ['Restricted folder', 'Folder access is restricted.'],
          ['Integrity checked', 'Files are signed or integrity-checked, with reconciliation.'],
          ['End-to-end reconciled', 'Automated end-to-end reconciliation with alerts on mismatches.']),
        { attack: 'Attackers who reach a file share can change beneficiary details in a payment batch minutes before it is uploaded.',
          verify: 'Payment file flow with integrity controls and the last reconciliation exception.' }),
      q('FT-PR-02', 'HS-DAT-03', 'Is real customer data used in development and testing, or shared with vendors for analytics?',
        levels(
          ['Yes, freely', 'Production data is copied to test and vendors as needed.'],
          ['With ad hoc approval', 'Sometimes, with informal approval.'],
          ['Masked or tokenised', 'Only masked or tokenised data leaves production.'],
          ['Enforced and audited', 'As above, enforced technically and audited.']),
        { attack: 'Test environments and vendor copies are rarely protected like production, so they are an easy place to steal the same data.',
          verify: 'Data masking procedure and a check of one test database.' })
    ]}
  ],
  detect: [
    { id: 'ft_fraud', name: 'Fraud detection and response', description: 'Stopping fraudulent payments while there is still time.', questions: [
      q('FT-DE-01', 'HS-PAY-01', 'Are transactions monitored in real time for fraud patterns such as velocity, new device, new payee and mule-account indicators, with the ability to stop a payment?',
        levels(
          ['No', 'No transaction monitoring.'],
          ['After the event', 'Reviewed after transactions are completed.'],
          ['Real-time rules', 'Real-time rules can hold suspicious payments.'],
          ['Tuned and mule-aware', 'As above, tuned with fraud feedback and detecting mule accounts.']),
        { attack: 'Stolen funds move through chains of mule accounts within minutes. Only real-time monitoring can stop the money before it is gone.',
          verify: 'Fraud rules in production and the hold rate for the last month.' }),
      q('FT-DE-02', 'HS-IR-01', 'Is there a playbook for fraudulent transfers in progress, including contacting correspondent banks, NPCI or card networks to recall funds within hours?',
        levels(
          ['No', 'No playbook.'],
          ['Informal contacts', 'Staff know whom to call, informally.'],
          ['Documented playbook', 'Documented with contacts, authority and timelines.'],
          ['Exercised', 'As above, exercised in the last 12 months.']),
        { attack: 'The chance of recalling fraudulent funds falls sharply after the first few hours.',
          verify: 'Fraud response playbook and contact list.' })
    ]}
  ],
  recover: [
    { id: 'ft_recovery', name: 'Payment service recovery', description: 'Restoring payment services after a cyber attack, not just a hardware failure.', questions: [
      q('FT-RE-01', 'HS-RES-02', 'Have you tested switching critical payment services to disaster recovery and back within your RTO, using a cyber-attack scenario rather than a hardware failure?',
        levels(
          ['No', 'No DR drill.'],
          ['Infrastructure failure only', 'DR drills test hardware or site failure only.'],
          ['Yearly within RTO', 'DR drilled at least yearly within the agreed RTO.'],
          ['Cyber scenario', 'As above, including restoring from clean backups and rebuilding identity services after an attack.']),
        { attack: 'Replicated DR sites copy the attacker\'s encryption too. Recovery from ransomware depends on clean backups and rebuilt identity, which ordinary DR drills do not test.',
          verify: 'DR drill reports with the scenario used and time achieved.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FINTECH_DATA };
}
