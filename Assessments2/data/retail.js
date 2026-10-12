// ============================================
// HawkSight — Retail & E-commerce threat-led template
// Core question set plus the attack paths specific to retailers: helpdesk
// social engineering, checkout skimming, customer account takeover, store
// and payment terminal compromise, refund and gift-card abuse, and trading
// through a prolonged outage.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const RETAIL_DATA = composeTemplate('retail', {
  entry: [
    { id: 'ret_entry', name: 'Retail entry points', description: 'The ways in that attackers have used against retailers.', questions: [
      q('RET-IN-01', 'HS-IAM-06', 'If your IT helpdesk is outsourced, does the provider follow your identity checks before resetting passwords or MFA, and do you check that it does?',
        levels(
          ['Unknown', 'The helpdesk is outsourced and you do not know how it verifies callers.'],
          ['Policy, not checked', 'Your rules are in the contract but compliance is never checked.'],
          ['Required and sampled', 'Required contractually, and a sample of resets is checked every month.'],
          ['Privileged resets approved in-house', 'As above, resets of privileged accounts need approval from your own team, and every reset alerts your security monitoring.']),
        { context: 'Choose Not applicable if the helpdesk is run entirely in-house; the core helpdesk question covers it.',
          attack: 'In 2025 attackers breached major UK retailers through social engineering involving third parties. Marks & Spencer suspended online orders for about seven weeks, with an estimated £300 million impact on profit.',
          verify: 'Service desk contract clauses on identity verification and the last monthly sample of reset tickets.' }),
      q('RET-IN-02', 'HS-APP-01', 'Are the scripts that run on your checkout and payment pages (analytics, chat, tag managers, plugins) inventoried, authorised and monitored for changes?',
        levels(
          ['No', 'Nobody knows which scripts load on the payment page.'],
          ['Inventoried once', 'A list exists but changes are not tracked.'],
          ['Authorised and restricted', 'Every script is authorised, and a Content Security Policy restricts what can load.'],
          ['Tamper detection', 'As above, with automated detection that alerts when payment page scripts or headers change.']),
        { context: 'PCI DSS 4.0.1 requirements 6.4.3 and 11.6.1 require payment page scripts to be authorised and changes to be detected.',
          attack: 'Card-skimming groups inject a few lines of code into checkout pages, often through a third-party script. British Airways lost the card details of about 429,000 customers this way and was fined £20 million.',
          verify: 'Payment page script inventory, Content Security Policy header and change-detection alerts.' }),
      q('RET-IN-03', 'HS-PAY-01', 'How do you stop attackers using passwords leaked from other websites to take over customer accounts and steal saved cards, gift-card balances or loyalty points?',
        levels(
          ['Nothing specific', 'No specific protection against automated login attempts.'],
          ['Rate limiting', 'Login attempts are rate limited.'],
          ['Bot and breached-password protection', 'Bot protection, checks against known breached passwords and step-up verification for risky logins.'],
          ['Measured', 'As above, with account-takeover and fraud rates monitored and alerted.']),
        { attack: 'Credential stuffing is cheap and automated: attackers try millions of leaked username and password pairs until some work, then drain stored value quickly.',
          verify: 'Bot management configuration and the last month\'s account-takeover statistics.' }),
      q('RET-IN-04', 'HS-TPR-01', 'Do e-commerce platform plugins, extensions and marketplace integrations go through security review and get updated promptly?',
        levels(
          ['Installed freely', 'Anyone with admin access can install plugins.'],
          ['Reviewed at install', 'Reviewed when installed but rarely updated.'],
          ['Approved and maintained', 'Only approved plugins, updated at least monthly.'],
          ['Monitored', 'As above, monitored for new vulnerabilities and removed when no longer used.']),
        { attack: 'Vulnerable plugins on platforms such as Magento and WooCommerce are a common route for skimming code onto online stores.',
          verify: 'Plugin list with versions and last update dates.' }),
      q('RET-IN-05', 'HS-NET-03', 'How do POS, store system and building maintenance vendors (for example refrigeration or HVAC) connect to your stores remotely?',
        levels(
          ['Always on', 'Permanent connections or remote tools, sometimes with shared credentials.'],
          ['Named, always on', 'Named accounts that are permanently enabled.'],
          ['On request with MFA', 'Enabled on request, time-limited and protected with MFA.'],
          ['Restricted to their systems', 'As above, and each vendor can only reach the systems they maintain.']),
        { attack: 'In the 2013 Target breach, attackers used credentials stolen from a heating and ventilation contractor to reach point-of-sale systems and stole about 40 million cards.',
          verify: 'Vendor access list for store networks, with how each connection is enabled and what it can reach.' })
    ]}
  ],
  spread: [
    { id: 'ret_stores', name: 'Stores and payment terminals', description: 'How far an attacker can move inside a store and how exposed the payment estate is.', questions: [
      q('RET-SP-01', 'HS-NET-01', 'Can a device on a store network, such as a back-office PC, a smart device or guest Wi-Fi, reach the payment systems or head-office servers?',
        levels(
          ['Yes', 'Store networks are flat.'],
          ['Partly segmented', 'Guest Wi-Fi is separate, but other store devices can reach payment systems.'],
          ['Payment isolated', 'Payment systems are isolated in every store and store-to-head-office traffic is restricted.'],
          ['Isolated and tested', 'As above, with segmentation tested at least yearly.']),
        { attack: 'Once inside one store, attackers move to the payment network, and from there across the whole estate.',
          verify: 'Store network design and the last segmentation test results.' }),
      q('RET-SP-02', 'HS-VUL-02', 'Are POS terminals and payment applications on supported, current versions?',
        levels(
          ['Unknown', 'Versions across the estate are not known.'],
          ['Some outdated', 'Some terminals or POS applications are out of support.'],
          ['Supported and current', 'All supported and updated within 30 days of a security release.'],
          ['Centrally monitored', 'As above, with versions and tamper status monitored centrally.']),
        { attack: 'Outdated POS software is the usual target for card-stealing malware, which can run unnoticed across many stores.',
          verify: 'Estate report of terminal and POS application versions.' }),
      q('RET-SP-03', 'HS-PHY-01', 'Are payment terminals checked for tampering and skimming devices?',
        levels(
          ['Never', 'No inspections.'],
          ['Occasionally', 'Checked occasionally, with no record.'],
          ['Scheduled', 'Scheduled inspections against a checklist, recorded.'],
          ['Trained and tracked', 'As above, staff trained to spot tampering and terminals tracked by serial number.']),
        { attack: 'Skimming overlays can be fitted in seconds and are designed to be hard to spot without a checklist.',
          verify: 'Inspection records for two stores.' })
    ]}
  ],
  protect: [
    { id: 'ret_payments', name: 'Card data and stored value', description: 'Card data, refunds and gift cards that attackers and insiders can turn into money.', questions: [
      q('RET-PR-01', 'HS-PAY-01', 'Is full card data ever stored after authorisation, for example in databases, logs, spreadsheets, emails or call recordings?',
        levels(
          ['Yes or unknown', 'Card data is stored, or nobody has checked.'],
          ['Some legacy stores', 'Known legacy locations still hold card data.'],
          ['No, confirmed', 'No, payments are tokenised or use P2PE, confirmed by a data discovery scan.'],
          ['No, scope minimised', 'As above, with hosted payment pages or P2PE keeping your systems out of scope, rechecked every year.']),
        { attack: 'Stored card data is what attackers come for. Data that is not kept cannot be stolen.',
          verify: 'Card data discovery scan results and payment flow diagram.' }),
      q('RET-PR-02', 'HS-PAY-01', 'Are refunds, gift-card issuance and price overrides controlled so that a compromised account or an insider cannot abuse them?',
        levels(
          ['No limits', 'Any till user can issue refunds or gift cards.'],
          ['Manager override', 'A manager override is required, without limits or review.'],
          ['Limits and reconciliation', 'Limits, dual approval above a threshold and daily reconciliation.'],
          ['Anomaly alerts', 'As above, with alerts on unusual refund and gift-card patterns.']),
        { attack: 'Gift cards and refunds are untraceable cash. Attackers who reach a back-office account, and dishonest staff, abuse them first.',
          verify: 'Refund and gift-card control settings and the last exception report.' })
    ]}
  ],
  detect: [
    { id: 'ret_monitoring', name: 'Online store monitoring', description: 'Spotting an attack on the online store while it is happening.', questions: [
      q('RET-DE-01', 'HS-MON-02', 'Would you notice unusual activity in the e-commerce admin panel, such as a new admin user, changed payment settings or code changes?',
        levels(
          ['No', 'Admin activity is not monitored.'],
          ['Logged only', 'Logged but not reviewed.'],
          ['Alerted', 'New admins, payment configuration and code changes raise alerts.'],
          ['Alerted and watched 24x7', 'As above, reviewed by 24x7 monitoring.']),
        { attack: 'Skimming attacks often start with a new admin account or a small change to the checkout template. These are visible if anyone is looking.',
          verify: 'Alert rules for the e-commerce platform and an example alert.' })
    ]}
  ],
  recover: [
    { id: 'ret_trading', name: 'Trading through an outage', description: 'Keeping stores and online sales running while central systems are down.', questions: [
      q('RET-RE-01', 'HS-RES-03', 'If central systems (ERP, warehouse, online store) were down for several weeks, could stores keep trading and orders be fulfilled?',
        levels(
          ['No', 'No plan for trading without central systems.'],
          ['Stores only, briefly', 'Stores can trade offline for a short time.'],
          ['Planned', 'Documented procedures for store trading, stock replenishment and order handling without central systems.'],
          ['Rehearsed', 'As above, rehearsed with stores and distribution in the last year.']),
        { attack: 'Recovery from the 2025 UK retail attacks took months; online ordering was suspended for weeks and shelves went empty. A retailer\'s ability to trade manually decides how much revenue is lost.',
          verify: 'Offline trading procedures and the last rehearsal record.' }),
      q('RET-RE-02', 'HS-IR-03', 'Do you have customer communications prepared for a breach, including how to warn customers about follow-up scam calls and emails?',
        levels(
          ['No', 'Nothing prepared.'],
          ['General template', 'A general breach notice template.'],
          ['Prepared and approved', 'Prepared notices for card data, account and personal data breaches, approved by legal.'],
          ['Rehearsed', 'As above, with channels and owners tested in an exercise.']),
        { attack: 'After a retail breach, criminals use the stolen data to phone and email customers pretending to be the retailer, adding a second wave of harm.',
          verify: 'Prepared communications and approval record.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RETAIL_DATA };
}
