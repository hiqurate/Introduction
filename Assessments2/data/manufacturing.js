// ============================================
// HawkSight — Manufacturing & OT threat-led template
// Core question set plus the attack paths specific to manufacturers and
// industrial operators: vendor remote access to equipment, IT-to-OT
// spread, dependence of production on corporate IT, engineering
// workstations, safety systems, theft of design IP and running production
// manually.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const MANUFACTURING_DATA = composeTemplate('manufacturing', {
  entry: [
    { id: 'mfg_entry', name: 'Ways into production', description: 'Routes attackers and malware use to reach the plant floor.', questions: [
      q('MFG-IN-01', 'HS-NET-03', 'How do machine and control-system vendors connect for remote support to PLCs, SCADA, robots or other equipment?',
        levels(
          ['Always on', 'Permanent modems, VPNs or remote tools on equipment.'],
          ['VPN always on', 'A vendor VPN that is always available.'],
          ['On request via jump host', 'Enabled on request through a jump host with MFA.'],
          ['Approved, recorded, disconnected', 'As above, approved by operations for each session, recorded, and disconnected when idle.']),
        { attack: 'Remote vendor access straight to equipment bypasses every other control. Attackers who compromise a vendor, or find its always-on connection, can reach the plant floor directly.',
          verify: 'List of vendor remote connections to OT, how each is enabled, and session logs.' }),
      q('MFG-IN-02', 'HS-OT-01', 'Can OT devices such as PLCs, HMIs and SCADA servers reach the internet, or be reached from it?',
        levels(
          ['Yes or unknown', 'Some OT devices have internet access or are exposed.'],
          ['Some', 'Some outbound access is allowed for updates or remote monitoring.'],
          ['None', 'Outbound and inbound internet access is blocked for OT.'],
          ['None, verified', 'As above, verified by external scans and monitoring.']),
        { attack: 'Internet-exposed industrial controllers are found within hours by attackers using search engines such as Shodan, and some have been manipulated remotely.',
          verify: 'Firewall rules at the OT boundary and an external scan for industrial protocols.' }),
      q('MFG-IN-03', 'HS-OT-01', 'How are USB drives and laptops brought onto the plant floor by engineers and contractors controlled?',
        levels(
          ['Freely', 'Any USB drive or laptop can be connected.'],
          ['Policy only', 'A written rule, not enforced.'],
          ['Scanned or dedicated', 'Media is scanned at a kiosk or only dedicated media is allowed.'],
          ['Blocked by default', 'USB ports on OT assets are blocked except for approved, scanned media, and contractor laptops are checked before connection.']),
        { attack: 'Air-gapped and isolated OT networks are often infected through USB drives and contractor laptops, which carry malware past the network defences.',
          verify: 'Removable media procedure and device control settings on HMIs.' })
    ]}
  ],
  spread: [
    { id: 'mfg_ot', name: 'IT and OT separation', description: 'Whether an attack on the office network can stop production.', questions: [
      q('MFG-SP-01', 'HS-OT-01', 'What separates the office (IT) network from the production (OT) network?',
        levels(
          ['Nothing', 'IT and OT share the network.'],
          ['Firewall, broad rules', 'A firewall with broad rules allowing direct IT to OT traffic.'],
          ['DMZ', 'A DMZ for data exchange with no direct IT to OT connections.'],
          ['Zones and conduits', 'Zones and conduits designed to ISA/IEC 62443, with rules reviewed.']),
        { attack: 'Ransomware that reaches OT stops production directly. Even without reaching it, a weak boundary forces you to shut production down because you cannot be sure.',
          verify: 'IT/OT boundary design and firewall rules.' }),
      q('MFG-SP-02', 'HS-OT-01', 'Do production systems depend on corporate IT services such as Active Directory, ERP or file shares in order to run?',
        levels(
          ['Heavily', 'Production cannot run without corporate IT.'],
          ['Some dependencies', 'Some production systems depend on corporate services.'],
          ['Separate', 'OT uses its own identity and services, separate from corporate IT.'],
          ['Proven', 'As above, and it has been tested that production runs with IT disconnected.']),
        { attack: 'Most attacks that stop production never touch the machines. Colonial Pipeline shut down its pipeline because business IT systems were hit, not the pipeline controls.',
          verify: 'Dependency map of OT on IT services and the record of a disconnection test.' }),
      q('MFG-SP-03', 'HS-OT-01', 'Do you have an inventory of OT assets with firmware versions, network connections and vendor support status?',
        levels(
          ['No', 'No OT inventory.'],
          ['Maintenance list', 'An engineering or maintenance list without network or firmware details.'],
          ['Complete', 'Complete with firmware, connections and support status.'],
          ['Discovered passively', 'Kept current by passive OT network discovery.']),
        { attack: 'When an industrial vulnerability is published, plants without an inventory cannot tell whether they are exposed.',
          verify: 'OT inventory extract for one production line.' }),
      q('MFG-SP-04', 'HS-IAM-04', 'Are engineering workstations used to program PLCs restricted to authorised engineers, hardened and kept off email and the internet?',
        levels(
          ['Shared, general use', 'Shared machines also used for email and browsing.'],
          ['Dedicated, shared login', 'Dedicated machines with a shared login.'],
          ['Named and isolated', 'Named accounts, no email or internet access.'],
          ['Allowlisted and logged', 'As above, with application allowlisting and logging of changes to controller logic.']),
        { attack: 'An engineering workstation can change what machines do. It is the most valuable target in OT, and often the least protected.',
          verify: 'Engineering workstation configuration and access list.' }),
      q('MFG-SP-05', 'HS-OT-01', 'Are safety instrumented systems separated from the control network so that a cyber attack cannot disable safety functions?',
        levels(
          ['No or unknown', 'Safety systems share the control network.'],
          ['Partly', 'Some separation, not verified.'],
          ['Separated', 'Separated, with a physical key switch for programming mode.'],
          ['Separated and reviewed', 'As above, verified in a combined safety and cyber review.']),
        { context: 'Choose Not applicable if you have no safety instrumented systems.',
          attack: 'The Triton malware discovered in 2017 targeted the safety controllers of a petrochemical plant, the systems that exist to prevent explosions and loss of life.',
          verify: 'Safety system network design and key switch position records.' })
    ]}
  ],
  protect: [
    { id: 'mfg_ip', name: 'Design IP and controller logic', description: 'The know-how and configurations that make production possible.', questions: [
      q('MFG-PR-01', 'HS-DAT-03', 'Is design and process IP (CAD files, recipes, formulations) restricted to those who need it, with large downloads or transfers flagged?',
        levels(
          ['Open shares', 'Stored on broadly accessible shares.'],
          ['Restricted folders', 'Access is restricted to departments.'],
          ['Need-to-know and controlled', 'Need-to-know access with controls on external transfer.'],
          ['Alerted', 'As above, with alerts on bulk downloads reviewed.']),
        { attack: 'Industrial espionage targets design and process data. It is usually taken quietly, often by insiders or long-term intruders.',
          verify: 'Access list for the main design repository and transfer alert rules.' }),
      q('MFG-PR-02', 'HS-RES-01', 'Are PLC and HMI programs and configurations backed up offline, version-controlled and compared with what is actually running?',
        levels(
          ['No', 'No backups of controller logic.'],
          ['On engineers\' laptops', 'Copies exist on individual engineers\' laptops.'],
          ['Central and offline', 'Central, versioned backups kept offline.'],
          ['Change detection', 'As above, with automated comparison of running logic against the approved baseline.']),
        { attack: 'Without a trusted copy of controller logic, recovery means re-engineering from scratch, and unauthorised changes go unnoticed.',
          verify: 'Backup repository for controller logic and the last comparison report.' })
    ]}
  ],
  detect: [
    { id: 'mfg_detect', name: 'OT monitoring and response', description: 'Seeing and responding to attacks in the production environment.', questions: [
      q('MFG-DE-01', 'HS-MON-02', 'Is OT network traffic monitored for unusual commands, new devices and new connections?',
        levels(
          ['No', 'No monitoring of OT traffic.'],
          ['Firewall logs', 'Only firewall logs at the boundary.'],
          ['OT-aware monitoring', 'An OT-aware monitoring tool covers key segments.'],
          ['Full coverage, 24x7', 'Full coverage reviewed 24x7.']),
        { attack: 'Attackers can stay in OT networks for months because nobody watches industrial traffic.',
          verify: 'OT monitoring coverage and recent alerts.' }),
      q('MFG-DE-02', 'HS-IR-01', 'Does your incident plan say who decides to stop or continue production, and has it been exercised with plant operations?',
        levels(
          ['No', 'No OT incident plan.'],
          ['IT plan only', 'The IT plan does not cover production decisions.'],
          ['OT playbook', 'An OT playbook names plant decision makers.'],
          ['Exercised', 'Exercised with plant operations in the last year.']),
        { attack: 'The decision to stop production is expensive and has to be made fast. Without agreed authority, it is made late or too broadly.',
          verify: 'OT incident playbook and exercise record.' })
    ]}
  ],
  recover: [
    { id: 'mfg_recover', name: 'Producing through an outage', description: 'Continuing and restoring production after an attack.', questions: [
      q('MFG-RE-01', 'HS-RES-03', 'If IT systems such as ERP, MES and email were encrypted, could production, shipping and invoicing continue manually?',
        levels(
          ['No', 'Production would stop.'],
          ['For a day or two', 'Could continue briefly on improvised processes.'],
          ['Documented manual procedures', 'Manual procedures are documented for production, shipping and invoicing.'],
          ['Rehearsed', 'As above, rehearsed in the last year.']),
        { attack: 'When Norsk Hydro was hit by ransomware in 2019, plants switched to manual operation. Manufacturers that can do this lose far less and are under far less pressure to pay.',
          verify: 'Manual operation procedures and rehearsal record.' }),
      q('MFG-RE-02', 'HS-RES-02', 'Have you tested rebuilding an HMI or SCADA server and restoring controller logic from backup, and timed it?',
        levels(
          ['Never', 'Never tested.'],
          ['Partly', 'Some components restored.'],
          ['Tested and timed', 'Rebuild tested in the last year, with the time recorded.'],
          ['Twice yearly, within target', 'Tested at least twice a year within the agreed recovery time.']),
        { attack: 'OT systems are often rebuilt by a single specialist or vendor. Without a tested process, recovery time is unknown until it is needed.',
          verify: 'Rebuild test records.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MANUFACTURING_DATA };
}
