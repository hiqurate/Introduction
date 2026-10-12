// ============================================
// HawkSight — Education threat-led template
// Core question set plus the attack paths specific to schools, colleges and
// universities: edtech vendor breaches of student data, open campus
// networks, orphaned student accounts, fee-payment fraud against parents,
// tampering with grades and exam material, and running exams and
// admissions through an outage.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const EDUCATION_DATA = composeTemplate('education', {
  entry: [
    { id: 'edu_entry', name: 'Campus, vendors and accounts', description: 'Entry points shaped by open campuses, large user populations and many edtech vendors.', questions: [
      q('EDU-IN-01', 'HS-TPR-01', 'Do you know which edtech vendors hold student data (SIS, LMS, exam and admission platforms, apps), and have you checked how they protect it and how quickly they would tell you about a breach?',
        levels(
          ['No', 'No list of vendors holding student data.'],
          ['List only', 'Vendors are known, not assessed.'],
          ['Assessed with notification terms', 'Assessed before adoption, with breach-notification and data-deletion terms in contracts.'],
          ['Minimised and reviewed', 'As above, data shared is minimised and vendors are reviewed every year.']),
        { attack: 'In December 2024 attackers used a stolen support credential at PowerSchool, a student information system provider, and took data on tens of millions of students from its school customers.',
          verify: 'Edtech vendor register with contract terms and assessment dates.' }),
      q('EDU-IN-02', 'HS-NET-01', 'Are student and guest devices on campus Wi-Fi kept separate from staff systems, exam systems and servers?',
        levels(
          ['Same network', 'Students, guests and staff share a network.'],
          ['Separate SSID only', 'Separate Wi-Fi names, but students can reach internal systems.'],
          ['Isolated', 'Student and guest networks are isolated from staff and administrative systems.'],
          ['Isolated with access control', 'As above, with network access control for staff networks.']),
        { attack: 'Thousands of unmanaged personal devices join campus networks every day. If they can reach administrative systems, so can any malware they carry.',
          verify: 'Network design and firewall rules between student and administrative networks.' }),
      q('EDU-IN-03', 'HS-IAM-03', 'Are accounts of students and staff who have left disabled promptly, including in third-party apps?',
        levels(
          ['They stay active', 'Accounts remain active indefinitely.'],
          ['Annual clean-up', 'Removed in a yearly clean-up.'],
          ['Within 30 days', 'Disabled automatically within 30 days.'],
          ['Lifecycle automated', 'Created and removed automatically from the SIS and HR systems, including connected apps.']),
        { attack: 'Thousands of dormant student and alumni accounts are a ready supply of logins for attackers, who use them to phish staff from a trusted address.',
          verify: 'Count of active accounts for people who left more than 90 days ago.' }),
      q('EDU-IN-04', 'HS-PAY-02', 'How are parents protected from fake fee-payment requests and "changed bank details" messages?',
        levels(
          ['Nothing', 'No guidance to parents.'],
          ['Occasional warnings', 'Warnings sent after incidents.'],
          ['Single official channel', 'Fees are paid only through one published official channel, and parents are told the institution never changes bank details by email or message.'],
          ['Protected and monitored', 'As above, with DMARC enforced and lookalike domains and social media accounts monitored.']),
        { attack: 'Fraudsters send parents fake fee notices from lookalike addresses or WhatsApp numbers at admission and term time, when payments are expected.',
          verify: 'Fee payment communications and the published guidance to parents.' })
    ]}
  ],
  spread: [
    { id: 'edu_access', name: 'Academic systems and shared devices', description: 'Who can reach grades, exams and admissions, and the state of shared computers.', questions: [
      q('EDU-SP-01', 'HS-IAM-02', 'Can student or general staff accounts reach grade, exam or admission systems beyond what their role needs?',
        levels(
          ['Yes', 'Access is broad.'],
          ['Partly restricted', 'Restricted by department, not by role.'],
          ['Role-based', 'Access is role-based and changes are approved.'],
          ['Role-based and reviewed', 'As above, with access reviewed each term and changes to grades logged.']),
        { attack: 'Students and outsiders target grade and exam systems. Broad access turns one stolen staff password into changed results.',
          verify: 'Role configuration in the SIS or exam system and the last access review.' }),
      q('EDU-SP-02', 'HS-END-02', 'Are shared lab and library computers reset to a clean state between users and prevented from saving passwords?',
        levels(
          ['No', 'Shared computers keep changes between users.'],
          ['Occasionally reimaged', 'Rebuilt occasionally.'],
          ['Reset each session', 'Reset to a clean state after each session.'],
          ['Reset and locked down', 'As above, with credential saving disabled and USB restricted.']),
        { attack: 'Keyloggers and saved browser sessions on shared computers hand staff and student credentials to whoever sits down next.',
          verify: 'Configuration of lab and library machines.' })
    ]}
  ],
  protect: [
    { id: 'edu_data', name: 'Student data and exam integrity', description: 'Children\'s data and the integrity of exams and results.', questions: [
      q('EDU-PR-01', 'HS-DAT-04', 'Is children\'s data (health, guardian contacts, photos, identity documents) collected only where needed and access-restricted, with verifiable parental consent where the law requires it?',
        levels(
          ['No controls', 'Collected broadly, widely accessible.'],
          ['Partly', 'Some restrictions, consent not tracked.'],
          ['Minimised and consented', 'Collected only where needed, access-restricted, consent recorded.'],
          ['Reviewed', 'As above, reviewed yearly and deleted when no longer needed.']),
        { context: 'The DPDP Act requires verifiable consent of a parent or guardian before processing a child\'s personal data.',
          attack: 'Children\'s data is valuable to criminals because it can be used for identity fraud for years before anyone notices.',
          verify: 'Data inventory for student records and the consent mechanism.' }),
      q('EDU-PR-02', 'HS-DAT-03', 'Are exam papers, results and admission decisions protected against leaks and tampering before release, with access restricted and changes logged?',
        levels(
          ['No', 'Stored and shared like any other file.'],
          ['Restricted', 'Access restricted to named people.'],
          ['Restricted and logged', 'Restricted, with every access and change logged.'],
          ['Controlled release', 'As above, with controlled release and integrity checks on results.']),
        { attack: 'Exam paper leaks and changed results cause public harm and loss of trust. They usually start with a compromised staff account or a shared drive.',
          verify: 'Access list and logs for exam material storage.' })
    ]}
  ],
  detect: [
    { id: 'edu_detect', name: 'Spotting misuse', description: 'Noticing compromised accounts and tampering.', questions: [
      q('EDU-DE-01', 'HS-MON-02', 'Would IT notice mass email sending from a compromised staff or student account, or grade changes outside the normal process?',
        levels(
          ['No', 'Neither is monitored.'],
          ['After complaints', 'Usually found after complaints.'],
          ['Alerted', 'Both raise alerts reviewed by IT.'],
          ['Alerted and acted on', 'As above, with accounts suspended automatically for mass sending.']),
        { attack: 'Compromised education accounts are used to phish other institutions and parents because messages from a school or university are trusted.',
          verify: 'Alert rules for outbound mail volume and grade changes.' })
    ]}
  ],
  recover: [
    { id: 'edu_recover', name: 'Exams and admissions through an outage', description: 'Continuing teaching, exams and admissions while systems are down.', questions: [
      q('EDU-RE-01', 'HS-RES-03', 'If systems were down during exams or admissions season, is there a plan to run exams, publish results and accept applications?',
        levels(
          ['No', 'No plan.'],
          ['Informal', 'Ideas, nothing written.'],
          ['Documented', 'Documented contingency plans for exams, results and admissions.'],
          ['Rehearsed', 'As above, rehearsed or tested in the last year.']),
        { attack: 'Attacks on schools and universities often land at the start of term or around exams, when disruption hurts most and the pressure to pay is highest.',
          verify: 'Contingency plans for exams and admissions.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EDUCATION_DATA };
}
