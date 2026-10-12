// ============================================
// HawkSight — Logistics & Transport threat-led template
// Core question set plus the attack paths specific to logistics, freight
// and transport operators: invoice and payment fraud, partner connections,
// telematics and IoT, warehouse automation, cyber-enabled cargo theft, and
// moving goods while core systems are down.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const LOGISTICS_DATA = composeTemplate('logistics', {
  entry: [
    { id: 'log_entry', name: 'Partners, devices and payments', description: 'The many external connections that make logistics work, and that attackers use.', questions: [
      q('LOG-IN-01', 'HS-PAY-02', 'How are changes to carrier, subcontractor and supplier bank details, and unusual freight invoices, verified before payment?',
        levels(
          ['Not verified', 'Changes are made from the email or invoice.'],
          ['Sometimes checked', 'Checked occasionally, with no record.'],
          ['Call-back and approval', 'A call-back to a number on file and a second approver are required.'],
          ['Plus anomaly checks', 'As above, with checks for duplicate or unusual invoices before payment.']),
        { attack: 'High volumes of invoices from many small carriers make logistics a favourite target for invoice fraud and payment diversion.',
          verify: 'Supplier master-data change log with call-back records.' }),
      q('LOG-IN-02', 'HS-NET-03', 'How do partners such as carriers, customs brokers and 3PLs connect to your TMS and WMS?',
        levels(
          ['Shared logins', 'Partners share logins.'],
          ['Individual, always on', 'Named partner accounts, always enabled, without MFA.'],
          ['Individual with MFA or APIs', 'Individual accounts with MFA, or authenticated APIs and EDI, limited to their own shipments.'],
          ['Reviewed', 'As above, with partner access reviewed and removed when contracts end.']),
        { attack: 'Partner accounts with shared or weak logins let attackers view and change shipments without breaching you directly.',
          verify: 'Partner account list and authentication settings.' }),
      q('LOG-IN-03', 'HS-IAM-05', 'Are telematics, GPS trackers, handheld scanners and their cloud portals free of default passwords and kept updated?',
        levels(
          ['Unknown', 'Not checked.'],
          ['Some defaults remain', 'Some devices or portals keep default credentials.'],
          ['Unique and updated', 'Unique credentials, and firmware is updated on a schedule.'],
          ['Managed centrally', 'As above, devices managed centrally with alerts for unauthorised devices.']),
        { attack: 'Default passwords on trackers and their portals let attackers locate high-value loads or disable tracking.',
          verify: 'Device management console and portal user list.' })
    ]}
  ],
  spread: [
    { id: 'log_ops', name: 'Warehouses and operational systems', description: 'How far an attack can reach into operations.', questions: [
      q('LOG-SP-01', 'HS-NET-01', 'Are warehouse automation, scanners and IoT devices on networks separated from the corporate network?',
        levels(
          ['No', 'They share the corporate network.'],
          ['Partly', 'Some separation.'],
          ['Separated', 'Dedicated networks with restricted traffic.'],
          ['Separated and tested', 'As above, tested regularly.']),
        { attack: 'On a shared network, ransomware that starts in the office stops sortation, scanning and dispatch as well.',
          verify: 'Network design for warehouse sites.' }),
      q('LOG-SP-02', 'HS-OT-01', 'Do you know which operational systems (WMS, sortation, yard and terminal systems) depend on corporate IT services such as Active Directory to run?',
        levels(
          ['No', 'Dependencies are unknown.'],
          ['Partly', 'Known for some systems.'],
          ['Mapped', 'Dependencies are mapped and documented.'],
          ['Mapped and reduced', 'As above, critical operations can run without corporate IT, and this has been tested.']),
        { attack: 'In the 2017 NotPetya attack Maersk had to reinstall thousands of servers and PCs. Recovery depended on a single surviving domain controller in Ghana that happened to be offline.',
          verify: 'Dependency map for operational systems.' })
    ]}
  ],
  protect: [
    { id: 'log_data', name: 'Shipments and customer data', description: 'Protecting shipment information that criminals can turn into stolen goods.', questions: [
      q('LOG-PR-01', 'HS-IAM-02', 'Is access to shipment details, consignee data and delivery addresses limited to those who need them, including in driver apps?',
        levels(
          ['Broad', 'Most users and devices can see all shipments.'],
          ['Partly', 'Some restrictions.'],
          ['Need-to-know', 'Access is limited by role, region and assignment.'],
          ['Need-to-know and logged', 'As above, with access logged and reviewed.']),
        { attack: 'Shipment data reveals what high-value goods are moving, where and when. It is used to plan cargo theft.',
          verify: 'Role configuration in the TMS and driver app.' }),
      q('LOG-PR-02', 'HS-TPR-01', 'Do you know which partners and platforms would stop your operations if they were breached or went offline?',
        levels(
          ['No', 'Not identified.'],
          ['Known informally', 'Known but not documented.'],
          ['Identified and assessed', 'Critical partners identified and assessed, with contingency options.'],
          ['Planned', 'As above, with alternatives tested.']),
        { attack: 'In November 2023 a cyber incident at DP World Australia halted container movements at major ports for several days.',
          verify: 'Critical partner list with contingency arrangements.' })
    ]}
  ],
  detect: [
    { id: 'log_detect', name: 'Spotting cargo fraud', description: 'Noticing manipulation of shipments and bookings.', questions: [
      q('LOG-DE-01', 'HS-MON-02', 'Would you detect fraudulent changes to consignee details, delivery addresses or carrier assignments?',
        levels(
          ['No', 'Changes are not monitored.'],
          ['After a loss', 'Found after a missed delivery.'],
          ['Alerted', 'Changes to high-value shipments raise alerts and need confirmation.'],
          ['Alerted and verified', 'As above, with out-of-band confirmation for every change.']),
        { attack: 'Criminals use compromised accounts and fake carrier identities to redirect loads. US authorities have warned of cyber-enabled cargo theft through hijacked freight accounts.',
          verify: 'Change alert rules in the TMS.' })
    ]}
  ],
  recover: [
    { id: 'log_recover', name: 'Moving goods through an outage', description: 'Continuing deliveries when systems are unavailable.', questions: [
      q('LOG-RE-01', 'HS-RES-03', 'If the TMS or WMS were down for a week, could you dispatch, track and deliver manually?',
        levels(
          ['No', 'Operations would stop.'],
          ['Briefly', 'Improvised for a day or two.'],
          ['Documented', 'Documented manual dispatch, picking and tracking procedures.'],
          ['Rehearsed', 'As above, rehearsed in the last year.']),
        { attack: 'Logistics attacks cause immediate, visible disruption, which makes logistics companies attractive ransomware targets.',
          verify: 'Manual operation procedures and rehearsal record.' }),
      q('LOG-RE-02', 'HS-RES-02', 'Have you tested restoring your identity infrastructure (for example Active Directory) from backup in a clean environment?',
        levels(
          ['Never', 'Never tested.'],
          ['Assumed', 'Backups exist but restoration is untested.'],
          ['Tested', 'Tested in the last year.'],
          ['Tested and timed', 'Tested regularly, with time recorded against target.']),
        { attack: 'Nothing else can be restored until identity services work. Without a tested plan this step alone can take weeks.',
          verify: 'Identity restore test record.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOGISTICS_DATA };
}
