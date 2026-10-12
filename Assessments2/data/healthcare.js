// ============================================
// HawkSight — Healthcare & Pharma threat-led template
// Core question set plus the attack paths specific to hospitals, clinics,
// diagnostics and pharmaceutical organisations: clinical remote access,
// medical devices, patient-record misuse, clinical vendors and running
// care safely while systems are down.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const HEALTHCARE_DATA = composeTemplate('healthcare', {
  entry: [
    { id: 'hc_access', name: 'Clinical remote access and exposure', description: 'The ways into clinical systems that attackers target in healthcare.', questions: [
      q('HC-IN-01', 'HS-NET-03', 'Do all remote-access routes into clinical systems require MFA, including those used by visiting doctors, radiologists reporting from home, billing staff and vendors?',
        levels(
          ['None or few', 'Most clinical remote-access routes rely on a password alone.'],
          ['Staff only', 'Employed staff use MFA; visiting clinicians, vendors or legacy portals do not.'],
          ['All but legacy', 'All routes require MFA except documented legacy systems with compensating controls.'],
          ['All, monitored', 'Every route requires MFA and remote sessions are logged and reviewed.']),
        { context: 'Include Citrix or remote desktop gateways, VPNs, teleradiology and PACS viewers, web access to the EMR or HIS, and vendor support connections.',
          attack: 'In the 2024 Change Healthcare attack, criminals used stolen credentials on a remote-access portal that had no MFA. Claims and pharmacy payments across the US were disrupted for weeks.',
          verify: 'List of clinical remote-access routes with the authentication policy applied to each.' }),
      q('HC-IN-02', 'HS-VUL-03', 'Are any imaging (PACS or DICOM), laboratory or EMR servers reachable directly from the internet?',
        levels(
          ['Yes', 'One or more are directly reachable from the internet.'],
          ['Protected by password', 'Some are reachable but require a login.'],
          ['None, except portals', 'None are directly exposed; patient-facing portals sit behind a web application firewall.'],
          ['None, verified', 'As above, confirmed by regular external scans.']),
        { attack: 'Security researchers repeatedly find thousands of imaging servers worldwide exposing patient scans and personal details to anyone on the internet.',
          verify: 'External scan of your IP ranges for DICOM (ports 104 and 11112), PACS web viewers and database ports.' }),
      q('HC-IN-03', 'HS-IAM-05', 'Are shared logins used on clinical workstations, such as a ward or nursing-station account?',
        levels(
          ['Widely', 'Shared accounts and passwords are common on wards and in departments.'],
          ['Some areas', 'Some departments still share logins.'],
          ['Individual with fast switching', 'Individual logins everywhere, with tap-badge or fast user switching.'],
          ['Individual, shared accounts removed', 'Individual logins everywhere and shared accounts are removed or locked to a single kiosk function.']),
        { attack: 'Shared clinical logins are rarely changed when staff leave, make it impossible to tell who viewed a record, and give attackers a password that works across a whole department.',
          verify: 'Directory list of generic or shared accounts and where each is used.' }),
      q('HC-IN-04', 'HS-PPL-01', 'Are clinical, front-desk and billing staff trained on the scams aimed at healthcare, such as fake IT support calls, fake requests for patient records and QR-code phishing?',
        levels(
          ['No', 'No security training for these groups.'],
          ['Generic only', 'Generic annual training not tailored to healthcare.'],
          ['Role-specific', 'Role-specific training at induction and every year.'],
          ['Reinforced', 'Role-specific training reinforced with simulations and a quick way to report suspicious contact.']),
        { attack: 'Busy clinical and front-desk staff are targeted because they are helpful under time pressure. A convincing call from "IT" or a "doctor" is often all an attacker needs.',
          verify: 'Training content and completion records for clinical and front-desk roles.' })
    ]}
  ],
  spread: [
    { id: 'hc_devices', name: 'Medical devices and clinical systems', description: 'Connected devices that often run outdated software and cannot be patched quickly.', questions: [
      q('HC-SP-01', 'HS-OT-01', 'Can connected medical devices such as infusion pumps, imaging modalities, monitors and lab analysers be reached from the general hospital network?',
        levels(
          ['Yes', 'Medical devices share the general network.'],
          ['Partly separated', 'Some devices are on separate VLANs; others are not.'],
          ['Separated', 'All connected devices are in dedicated segments that allow only the traffic they need.'],
          ['Separated and monitored', 'As above, with monitoring that understands medical device traffic.']),
        { attack: 'Many medical devices run old versions of Windows that cannot be updated. On a shared network, ransomware reaches them and can stop treatment and diagnostics.',
          verify: 'Network diagram and firewall rules for medical device segments.' }),
      q('HC-SP-02', 'HS-OT-01', 'Do you have an inventory of connected medical devices showing operating system, software version, network location and who maintains each?',
        levels(
          ['No', 'No inventory of connected devices.'],
          ['Biomedical asset list', 'A maintenance list without software or network details.'],
          ['Complete', 'Complete, including operating system, firmware and vendor support status.'],
          ['Automated', 'Automatically discovered and linked to vulnerability advisories.']),
        { attack: 'When a flaw in a device model is announced, hospitals without an inventory cannot tell whether they are affected, or where the devices are.',
          verify: 'Inventory extract for one clinical department compared with what is on the network.' }),
      q('HC-SP-03', 'HS-OT-01', 'Before buying a connected medical device, do you require security information from the manufacturer, such as an MDS2 form, a software bill of materials and the patch support period?',
        levels(
          ['No', 'Security is not part of procurement.'],
          ['Sometimes', 'Asked for informally on some purchases.'],
          ['Always required', 'Required for every connected device before purchase.'],
          ['Contractual', 'Required, with contract terms for patch timelines and vulnerability disclosure.']),
        { attack: 'Devices bought without security commitments stay in service for ten years or more, long after their software stops being supported.',
          verify: 'Procurement checklist and the security documents for the last connected device purchased.' }),
      q('HC-SP-04', 'HS-IAM-02', 'Is access to patient records limited by role and by relationship to the patient, with emergency ("break-glass") access logged and reviewed?',
        levels(
          ['Broad access', 'Most users can open most patient records.'],
          ['Role-based only', 'Access is role-based, without break-glass controls.'],
          ['Role-based with break-glass', 'Role-based access with break-glass use logged.'],
          ['Break-glass reviewed', 'As above, with every break-glass use reviewed within days.']),
        { attack: 'Broad access lets a single compromised account, or a curious employee, read thousands of patient records without any barrier.',
          verify: 'EMR role configuration and the last break-glass review.' })
    ]}
  ],
  protect: [
    { id: 'hc_vendors', name: 'Clinical vendors and patient data', description: 'Organisations that hold or process patient data on your behalf.', questions: [
      q('HC-PR-01', 'HS-TPR-01', 'Do vendors that host or process patient data (labs, billing, telemedicine, transcription, cloud EMR) have security and breach-notification obligations, and have you checked their security?',
        levels(
          ['No', 'Contracts are silent on security and breach notification.'],
          ['Contract terms only', 'Contracts include security terms, but vendors are not assessed.'],
          ['Assessed', 'Critical vendors are assessed and contracts require prompt breach notification.'],
          ['Assessed and rehearsed', 'Reassessed yearly and included in incident exercises.']),
        { attack: 'Healthcare breaches increasingly start at a vendor holding patient data. Their breach becomes your notification, and their outage stops your services.',
          verify: 'Vendor register for patient-data processors with contract terms and assessment dates.' })
    ]}
  ],
  detect: [
    { id: 'hc_monitoring', name: 'Patient-record misuse and clinical response', description: 'Spotting misuse of patient data and responding safely.', questions: [
      q('HC-DE-01', 'HS-MON-02', 'Would you notice if an account viewed or exported an unusual number of patient records, or records of a public figure or a colleague?',
        levels(
          ['No', 'Record access is not reviewed.'],
          ['Logged only', 'Access is logged but nobody reviews it.'],
          ['Periodic audit', 'Record access is audited proactively at regular intervals.'],
          ['Automated alerts', 'Unusual access patterns raise alerts that are investigated.']),
        { attack: 'Attackers and insiders who reach the EMR export records in bulk. Without monitoring, the first sign is the data appearing for sale.',
          verify: 'Access monitoring rules and the last investigation they triggered.' }),
      q('HC-DE-02', 'HS-IR-01', 'Does your incident plan cover clinical safety decisions during a cyber incident, such as diverting patients or ambulances, with clinical leaders involved?',
        levels(
          ['No', 'The incident plan, if any, is IT-only.'],
          ['IT-focused', 'Clinical impact is mentioned but not planned for.'],
          ['Clinically owned', 'Clinical decision makers and diversion criteria are part of the plan.'],
          ['Exercised', 'As above, exercised with clinical teams in the last 12 months.']),
        { attack: 'Ransomware in hospitals forces clinical decisions within hours. Without a plan, those decisions are made in confusion.',
          verify: 'Incident plan sections covering clinical escalation and diversion.' })
    ]}
  ],
  recover: [
    { id: 'hc_downtime', name: 'Clinical downtime', description: 'Keeping care safe while clinical systems are unavailable.', questions: [
      q('HC-RE-01', 'HS-RES-03', 'If the EMR or HIS, laboratory and imaging systems were down for two weeks, could wards, outpatient clinics, pharmacy and the laboratory keep operating safely?',
        levels(
          ['No', 'No downtime procedures.'],
          ['Some departments', 'Some departments have paper forms.'],
          ['All critical departments', 'Documented downtime procedures for all critical departments, with printed forms and current patient lists ready.'],
          ['Drilled', 'As above, with a downtime drill in the last 12 months.']),
        { attack: 'When AIIMS New Delhi was hit by ransomware in 2022, hospital services ran manually for about two weeks. Downtime procedures decide whether that is safe.',
          verify: 'Downtime procedures and kit for one ward and the laboratory, and the last drill record.' }),
      q('HC-RE-02', 'HS-RES-02', 'Have you tested restoring the EMR or HIS and the imaging archive from backup, and measured how long it takes?',
        levels(
          ['Never', 'Never tested.'],
          ['Partly', 'Parts of the data have been restored.'],
          ['Full, timed', 'A full restore tested in the last 12 months with the time recorded.'],
          ['Twice yearly, within target', 'Tested at least twice a year and completed within the agreed recovery time.']),
        { attack: 'Imaging archives are huge. Restoring them can take far longer than the business expects, which matters most when attackers have destroyed the live copy.',
          verify: 'Restore test reports for the EMR or HIS and the PACS archive.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HEALTHCARE_DATA };
}
