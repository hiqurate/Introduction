// ============================================
// HawkSight — IT Services & SaaS threat-led template
// Core question set plus the attack paths specific to IT services firms,
// managed service providers and SaaS companies: leaked secrets, stolen
// developer sessions, poisoned dependencies, access into client
// environments, pipeline takeover, client data in non-production tools and
// rebuilding after a cloud account is destroyed.
// ============================================

const { levels, q, composeTemplate } = require('./core.js');

const ITSERVICES_DATA = composeTemplate('itservices', {
  entry: [
    { id: 'its_entry', name: 'Code, developers and client access', description: 'Routes into your environment, and through you into your clients.', questions: [
      q('ITS-IN-01', 'HS-APP-01', 'Are secrets such as API keys, cloud credentials and tokens kept out of code, with every repository scanned for leaked secrets, including its history?',
        levels(
          ['No', 'Secrets are often stored in code or configuration files.'],
          ['Manual checks', 'Occasional manual checks.'],
          ['Automated scanning', 'Automated scanning blocks secrets on push, and secrets are kept in a vault.'],
          ['Scanned and auto-revoked', 'As above, history scanned, public repositories monitored for your organisation, and leaked secrets revoked automatically.']),
        { attack: 'Attackers continuously scan public code platforms for leaked keys and use them within minutes, often to reach cloud accounts directly.',
          verify: 'Secret scanning configuration and the last detected secret with its revocation time.' }),
      q('ITS-IN-02', 'HS-IAM-01', 'Are developer and administrator sessions protected against token theft, for example by allowing production access only from managed devices and using short-lived credentials?',
        levels(
          ['No', 'Production and consoles are reachable from any device with a password.'],
          ['MFA only', 'MFA is required, but from any device, with long sessions.'],
          ['Managed devices only', 'Production and cloud console access is only allowed from managed devices with EDR.'],
          ['Short-lived and bound', 'As above, with phishing-resistant MFA, short-lived credentials and session binding.']),
        { attack: 'In 2023 malware on a CircleCI engineer\'s laptop stole a valid session token that bypassed MFA. Every customer had to rotate all their stored secrets.',
          verify: 'Conditional access policies for production and cloud consoles, and session lifetime settings.' }),
      q('ITS-IN-03', 'HS-APP-01', 'Are open-source dependencies and build tools monitored for known vulnerabilities and malicious packages?',
        levels(
          ['No', 'Dependencies are not monitored.'],
          ['Occasional audits', 'Checked occasionally.'],
          ['Automated SCA', 'Software composition analysis runs on every build and blocks critical issues.'],
          ['Plus provenance', 'As above, with dependency pinning, an internal registry or allowlist, and checks for malicious packages.']),
        { attack: 'Attackers publish malicious packages with names close to popular ones, or compromise genuine ones, so that your build pulls their code in.',
          verify: 'SCA tool configuration and the last blocked build.' }),
      q('ITS-IN-04', 'HS-IAM-04', 'How do your staff access client environments, and is that access separated per client?',
        levels(
          ['Shared credentials', 'Client credentials kept in spreadsheets, chats or shared accounts.'],
          ['Named, always on', 'Named accounts with standing access to many clients.'],
          ['Vaulted and separated', 'A privileged access vault with MFA, separated per client.'],
          ['Just-in-time and reviewed', 'As above, granted just in time, sessions recorded, and access reviewed with each client.']),
        { attack: 'Attackers target IT providers to reach all their clients at once. In 2021 ransomware was pushed through Kaseya, an IT management tool, to up to about 1,500 businesses.',
          verify: 'How client credentials are stored, and the access list for one client.' })
    ]}
  ],
  spread: [
    { id: 'its_pipeline', name: 'Pipelines and cloud', description: 'What an attacker could do once inside your engineering environment.', questions: [
      q('ITS-SP-01', 'HS-APP-01', 'Can a single developer push code to production without review?',
        levels(
          ['Yes', 'No branch protection or required reviews.'],
          ['Sometimes', 'Review is expected but can be bypassed.'],
          ['Enforced review', 'Branch protection and required reviews are enforced.'],
          ['Signed and pipeline-only', 'As above, builds are signed, provenance is recorded and production deploys only through the pipeline.']),
        { attack: 'An attacker with one developer\'s access can ship malicious code to production, and from there to every customer.',
          verify: 'Branch protection settings for the main repositories.' }),
      q('ITS-SP-02', 'HS-IAM-04', 'Who can change CI/CD pipelines and their secrets, and are pipeline credentials scoped to each environment?',
        levels(
          ['Anyone with repo access', 'Pipeline configuration and secrets are broadly editable.'],
          ['Restricted, broad credentials', 'Changes are restricted, but pipeline credentials have wide access.'],
          ['Restricted and scoped', 'Changes are restricted and credentials are scoped per environment.'],
          ['Short-lived', 'As above, using short-lived federated credentials instead of stored keys.']),
        { attack: 'Pipelines hold the keys to production. A compromised pipeline is a compromised production environment.',
          verify: 'Pipeline permissions and credential configuration.' }),
      q('ITS-SP-03', 'HS-CLD-01', 'Are production cloud accounts separated from development, with guardrails that prevent public storage and over-privileged roles?',
        levels(
          ['Shared accounts', 'Development and production share cloud accounts.'],
          ['Separated, no guardrails', 'Separate accounts, no preventive guardrails.'],
          ['Separated with guardrails', 'Separate accounts with policies preventing public exposure and wildcard permissions.'],
          ['Guardrails as code', 'As above, enforced as code and monitored continuously.']),
        { attack: 'A test resource with broad permissions in the production account is a common stepping stone from a minor breach to client data.',
          verify: 'Cloud organisation structure and preventive policies.' })
    ]}
  ],
  protect: [
    { id: 'its_client_data', name: 'Client data', description: 'Protecting client data wherever your teams handle it.', questions: [
      q('ITS-PR-01', 'HS-DAT-03', 'Is client production data kept out of development, testing and support tools such as tickets, chat and logs?',
        levels(
          ['No', 'Client data is copied wherever needed.'],
          ['Sometimes', 'Avoided by habit, not by rule.'],
          ['Masked by rule', 'Masked or synthetic data is required outside production.'],
          ['Enforced', 'As above, enforced technically and checked.']),
        { attack: 'Copies of client data in tickets, chats and test systems are far less protected than production, and are often what is stolen.',
          verify: 'Masking procedure and a check of one test environment and support queue.' }),
      q('ITS-PR-02', 'HS-DAT-01', 'Is client data separated by tenant and encrypted with keys you manage and rotate, with tenant isolation tested?',
        levels(
          ['No', 'No tenant separation or encryption controls.'],
          ['Encrypted only', 'Encrypted with provider defaults, isolation untested.'],
          ['Isolated and managed keys', 'Tenant isolation designed in and keys managed and rotated.'],
          ['Isolation tested', 'As above, with tenant isolation included in penetration tests.']),
        { attack: 'A flaw in tenant isolation can expose every client\'s data through a single account.',
          verify: 'Architecture documentation and the last penetration test covering tenant isolation.' })
    ]}
  ],
  detect: [
    { id: 'its_detect', name: 'Engineering and client response', description: 'Spotting attacks on engineering systems and telling clients in time.', questions: [
      q('ITS-DE-01', 'HS-MON-02', 'Would you detect unusual activity in your code platform and cloud control plane, such as mass repository cloning, new access keys or logging being switched off?',
        levels(
          ['No', 'Not monitored.'],
          ['Logged only', 'Audit logs exist but are not reviewed.'],
          ['Alerted', 'These events raise alerts reviewed by a named team.'],
          ['24x7', 'Reviewed 24x7 with automated response for high-risk events.']),
        { attack: 'Source code theft and cloud key creation are early signs of a serious breach, and both are visible in audit logs.',
          verify: 'Alert rules for the code platform and cloud audit logs.' }),
      q('ITS-DE-02', 'HS-IR-03', 'Could you notify affected clients within contractual deadlines, and do you know which clients each system serves?',
        levels(
          ['No', 'No mapping of clients to systems; deadlines unknown.'],
          ['Partly', 'Deadlines known for major clients only.'],
          ['Mapped with procedure', 'Clients mapped to systems, with a notification procedure and contract deadlines.'],
          ['Rehearsed', 'As above, rehearsed in an exercise.']),
        { attack: 'For a service provider, a late or vague notification to clients often does more lasting damage than the breach itself.',
          verify: 'Client-to-system map and notification procedure.' })
    ]}
  ],
  recover: [
    { id: 'its_recover', name: 'Rebuilding after a cloud compromise', description: 'Recovering when the attacker controls or destroys your cloud account.', questions: [
      q('ITS-RE-01', 'HS-RES-01', 'If your main cloud account were taken over and its resources deleted, could you rebuild production from code and backups?',
        levels(
          ['No', 'Backups are in the same account, or there are none.'],
          ['Same provider, same credentials', 'Backups in another account reachable with the same credentials.'],
          ['Separate account and credentials', 'Backups in a separate account with separate credentials and immutability.'],
          ['Rebuild tested', 'As above, and a full rebuild from infrastructure as code has been tested.']),
        { attack: 'In 2014 an attacker who took over the cloud console of Code Spaces deleted its servers and backups. The company closed within days.',
          verify: 'Backup account structure and the last rebuild test.' })
    ]}
  ]
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ITSERVICES_DATA };
}
