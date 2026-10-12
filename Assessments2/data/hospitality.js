// ============================================
// HawkSight — Hospitality threat-led template
// Core question set plus the attack paths specific to hotels, resorts and
// restaurant groups: booking-platform phishing, front-desk social
// engineering, guest and smart-room networks, vendor access, payment
// terminals, key-card systems, guest identity documents and running the
// property when the PMS is down.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const HOSPITALITY_DATA = composeTemplate('hospitality', {
  entry: [
    { id: 'hos_entry', name: 'Guests, bookings and vendors', description: 'Entry points created by guest-facing operations and property systems.', questions: [
      q('HOS-IN-01', 'HS-PPL-01', 'Are reservations and front-desk staff prepared for phishing through booking platforms, such as a "guest" message with a malicious link or attachment sent through an OTA inbox?',
        levels(
          ['No', 'Not covered in any training.'],
          ['General awareness', 'General phishing awareness only.'],
          ['Specific guidance', 'Staff are trained on booking-platform phishing and how to check suspicious guest messages.'],
          ['Reinforced and reported', 'As above, reinforced with simulations and a quick way to report and block.']),
        { attack: 'Since 2023, criminals have sent hotels fake guest complaints with malware through booking platforms, then used the hotel\'s booking account to message real guests asking them to "re-confirm" their card details.',
          verify: 'Training material for reservations staff and recent reported messages.' }),
      q('HOS-IN-02', 'HS-PPL-01', 'How does your front desk verify callers or visitors who ask for guest details, room numbers or a replacement key card?',
        levels(
          ['No checks', 'Information or keys are given on request.'],
          ['Informal checks', 'Staff use their judgement.'],
          ['Defined verification', 'Identity is verified against the booking before any detail or key is given.'],
          ['Verified and tested', 'As above, with periodic testing and logging of key reissues.']),
        { attack: 'Social engineering of hotel staff is used to locate guests, take over loyalty accounts and gain access to rooms.',
          verify: 'Front-desk verification procedure and key reissue log.' }),
      q('HOS-IN-03', 'HS-NET-03', 'How do PMS, POS, door-lock and Wi-Fi vendors connect remotely to your properties?',
        levels(
          ['Always on', 'Permanent remote tools or shared credentials.'],
          ['Named, always on', 'Named accounts permanently enabled.'],
          ['On request with MFA', 'Enabled on request with MFA and time limits.'],
          ['Restricted and recorded', 'As above, limited to the vendor\'s own systems and recorded.']),
        { attack: 'Hospitality systems are run by many vendors. Their remote access is a common way into property networks and payment systems.',
          verify: 'Vendor access list with how each connection is enabled.' })
    ]}
  ],
  spread: [
    { id: 'hos_networks', name: 'Guest, room and property networks', description: 'Keeping guest and smart-room devices away from business systems.', questions: [
      q('HOS-SP-01', 'HS-NET-01', 'Can a device on guest Wi-Fi reach any hotel system, such as the PMS, POS or room controls?',
        levels(
          ['Yes', 'Guest Wi-Fi shares the hotel network.'],
          ['Partly isolated', 'Separate network, but some internal systems are reachable.'],
          ['Fully isolated', 'Guest Wi-Fi reaches only the internet, and guests cannot reach each other.'],
          ['Isolated and tested', 'As above, verified by testing.']),
        { attack: 'Guest networks are open to anyone. If they reach hotel systems, every guest is a potential intruder.',
          verify: 'Guest network design and a test from a guest device.' }),
      q('HOS-SP-02', 'HS-NET-01', 'Are smart room devices (locks, TVs, thermostats) and building systems on networks separated from business systems?',
        levels(
          ['No', 'They share the business network.'],
          ['Some', 'Some are separated.'],
          ['Separated', 'All are on dedicated, restricted networks.'],
          ['Separated and monitored', 'As above, with default passwords changed and traffic monitored.']),
        { attack: 'Smart devices are rarely patched and often keep default passwords. On a shared network they become a foothold into hotel systems.',
          verify: 'Network design for room and building systems.' }),
      q('HOS-SP-03', 'HS-IAM-05', 'Do staff share logins on the PMS, POS or booking-platform extranets?',
        levels(
          ['Widely', 'Shared logins are normal.'],
          ['Some', 'Some systems or shifts share logins.'],
          ['Individual', 'Everyone has individual logins.'],
          ['Individual with MFA', 'Individual logins, with MFA on extranets and admin functions.']),
        { attack: 'Shared logins are never changed when seasonal staff leave and make it impossible to trace fraud to a person.',
          verify: 'User lists for the PMS and OTA extranets.' }),
      q('HOS-SP-04', 'HS-PHY-01', 'Are electronic door-lock and key-card systems on current firmware, given publicly known key-card cloning flaws?',
        levels(
          ['Unknown', 'Firmware status unknown.'],
          ['Outdated', 'Known to be outdated.'],
          ['Current', 'Updated to the vendor\'s current secure version.'],
          ['Current and monitored', 'As above, with lock audit trails reviewed after incidents.']),
        { attack: 'In 2024 researchers showed that flaws in a widely used hotel lock system let an attacker forge a key that opens every door, affecting millions of locks worldwide.',
          verify: 'Lock system version and vendor advisory status.' })
    ]}
  ],
  protect: [
    { id: 'hos_guest_data', name: 'Guest data and payments', description: 'Card details and identity documents that criminals want.', questions: [
      q('HOS-PR-01', 'HS-PAY-01', 'Is card data captured by phone or email for bookings stored anywhere, such as PMS notes, mailboxes or paper?',
        levels(
          ['Yes', 'Card details are kept in notes, emails or paper.'],
          ['Sometimes', 'Discouraged, but it happens.'],
          ['No', 'Card details are only captured through a secure payment link or terminal.'],
          ['No, checked', 'As above, checked regularly by searching notes and mailboxes.']),
        { attack: 'Card numbers left in reservation notes and mailboxes are an easy prize for anyone who gets into the PMS or an email account.',
          verify: 'Search of PMS notes and the reservations mailbox for card numbers.' }),
      q('HOS-PR-02', 'HS-DAT-03', 'Are copies of guest identity documents (passports, Aadhaar, visas) kept only as long as required and access-restricted?',
        levels(
          ['Kept indefinitely', 'Stored indefinitely in shared folders or email.'],
          ['Restricted', 'Access restricted, no retention limit.'],
          ['Restricted and limited', 'Restricted, with a retention period enforced.'],
          ['Minimised', 'As above, only required fields collected and deletion automated.']),
        { attack: 'Identity documents are used for fraud and account opening. A hotel holding years of them is a high-value target.',
          verify: 'Storage location and retention setting for guest identity documents.' }),
      q('HOS-PR-03', 'HS-TPR-01', 'Are channel managers, OTAs, PMS and booking engine providers assessed for security, with breach-notification terms in contracts?',
        levels(
          ['No', 'Not assessed.'],
          ['Contract terms only', 'Some security terms, not assessed.'],
          ['Assessed', 'Assessed before onboarding with notification terms.'],
          ['Reviewed yearly', 'As above, reviewed yearly.']),
        { attack: 'Guest data is spread across many platforms. A breach at any one of them exposes your guests and your brand.',
          verify: 'Supplier register for booking and property systems.' })
    ]}
  ],
  detect: [
    { id: 'hos_detect', name: 'Account and booking monitoring', description: 'Spotting takeover of booking and property accounts.', questions: [
      q('HOS-DE-01', 'HS-MON-02', 'Would you notice someone signing into the PMS or a booking-platform extranet from an unusual location or at an unusual time?',
        levels(
          ['No', 'Not monitored.'],
          ['Platform emails only', 'Relies on emails from the platform.'],
          ['Alerted', 'Unusual sign-ins raise alerts reviewed by a named person.'],
          ['Alerted 24x7', 'Reviewed around the clock.']),
        { attack: 'A taken-over booking account lets criminals message real guests with convincing payment requests about real reservations.',
          verify: 'Sign-in alert configuration for the PMS and extranets.' })
    ]}
  ],
  recover: [
    { id: 'hos_recover', name: 'Running the property without systems', description: 'Serving guests while systems are down.', questions: [
      q('HOS-RE-01', 'HS-RES-03', 'If the PMS were down, could you check guests in and out, issue keys and take payments?',
        levels(
          ['No', 'No fallback.'],
          ['Improvised', 'Staff would improvise.'],
          ['Documented', 'Documented manual procedures with daily offline arrival and in-house lists.'],
          ['Rehearsed', 'As above, rehearsed in the last year.']),
        { attack: 'During the 2023 MGM Resorts attack, digital room keys, slot machines and reservation systems were disrupted for days and guests queued for hours.',
          verify: 'Manual procedures and the latest offline guest lists.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOSPITALITY_DATA };
}
