# HawkSight scoring methodology

Scoring model version 2.1. Version 2.1 adds attack path analysis (section 8a); health, risk and confidence calculations are unchanged from 2.0. This document is version-controlled with the code in `js/engine/scoring.js`, `js/engine/control-library.js` and `js/engine/threat-library.js`. Any change to the calculations below must update this document, bump `SCORING_MODEL_VERSION`, and update the regression fixtures in `tests/scoring.test.js`.

The same engine runs in the browser (for live, provisional results) and on the server. Issued reports are always recalculated on the server from stored answers and frozen with the scoring model version, the configuration version and a SHA-256 fingerprint.

## 1. Control library

Every question in every template maps to one canonical HawkSight control (50 controls across 18 domains). A control carries:

- objective and expected state (shown as question guidance)
- criticality tier
- whether evidence is required
- typical evidence
- references to NIST CSF 2.0, ISO/IEC 27001:2022, CIS Controls v8.1, SOC 2 TSC, PCI DSS 4.0.1, HIPAA Security Rule, DPDP Act 2023 and GDPR
- remediation guidance (quick win, 1–3 months, longer term), suggested owner and reference

Mapping order: published template override, the question's own `control` field, explicit mapping table, category mapping (SOC capability template), keyword matching on word boundaries, category fallback. Every question in the NIST CSF 2.0 and industry templates names its control explicitly; keyword matching remains only as a fallback for content added outside the data files. The test suite fails if any question is unmapped, or if a shipped industry or NIST question relies on anything other than its explicit control.

Framework references are indicative crosswalks for gap analysis. They do not establish compliance or certification.

## 2. Answers

Each answer is converted to a fraction of full implementation:

    fraction = (answer − lowest option) ÷ (highest option − lowest option)

| Answer state | Score effect | Confidence effect |
|---|---|---|
| Scale answer | fraction | depends on support level |
| Not applicable | excluded from numerator and denominator | none |
| Unknown | scored as 0 | lowers confidence |
| Planned | scored as 0; listed on the roadmap | none |

## 3. Weights

Default tier weights (configurable, versioned):

| Tier | Weight |
|---|---|
| Critical | 4 |
| High | 3 |
| Medium | 2 |
| Foundational | 1 |

Points earned = fraction × weight. Points possible = weight, for answered applicable questions.

## 4. Domain and overall scores

- Domain score = earned ÷ possible × 100 for answered, applicable questions in the domain.
- Overall (raw) score = weighted average of domain scores. Domains are weighted equally unless a configured weighting, which must total 100, is published for the template.
- Unanswered questions do not affect the score; they reduce completion and confidence.

## 5. Critical-control gating

A critical-tier control answered below one third of full implementation, or answered Unknown or Planned, is a critical failure.

- 1–2 failures: Cyber Health Score capped at 75
- 3 or more failures: capped at 60

The uncapped score is reported alongside. Caps and thresholds are configurable.

## 6. Maturity levels

| Level | Range | Meaning |
|---|---|---|
| 1 Initial | 0–34 | Controls absent or ad hoc |
| 2 Developing | 35–54 | Some controls, inconsistent and largely undocumented |
| 3 Defined | 55–74 | Documented and applied across most of the environment |
| 4 Managed | 75–89 | Consistently applied, measured and reviewed |
| 5 Optimized | 90–100 | Comprehensive, automated where practical, continuously improved |

## 7. Findings and severity

Every answered control below full implementation is a finding. Gap size: fraction < 0.33 major; 0.33–0.66 partial; ≥ 0.66 minor. Unknown and Planned count as major.

| Tier | Major | Partial | Minor |
|---|---|---|---|
| Critical | Critical | High | Medium |
| High | High | Medium | Low |
| Medium | Medium | Low | Informational |
| Foundational | Low | Informational | Informational |

If the risk context multiplier is 1.25 or more, findings on critical controls are raised one level, but never to Critical (reserved for critical controls that are essentially absent).

Timeframes: Critical and High 0–30 days; Medium 31–90 days; Low 91–180 days; Informational backlog.

## 8. Risk context and risk exposure

Context multiplier starts at 1.0 and is capped at 1.5:

| Factor | Adjustment |
|---|---|
| Sensitive data (health, payment, financial, children, biometric) | +0.07 each, max +0.2 |
| Three or more regulatory regimes | +0.05 |
| Incident in last 24 months | +0.1 |
| 1000+ employees / 250–1000 employees | +0.1 / +0.05 |
| OT, medical or IoT devices | +0.05 |
| Customer-facing internet services | +0.05 |
| Low tolerance for downtime | +0.1 |

Risk exposure is reported separately from health:

    pressure = min(1, (critical findings + 0.5 × high findings) ÷ max(10, 0.25 × applicable questions)) × 15
    risk = ((100 − health) × 0.85 + pressure) × (1 + (multiplier − 1) × 0.5)

Bands: Low < 25, Moderate < 50, High < 75, Severe ≥ 75.

## 8a. Attack path analysis

Health tells you how complete your controls are. Attack path analysis tells you which real attacks would get through them. Each assessment is evaluated against a library of threat scenarios (`js/engine/threat-library.js`): the attack paths organisations are actually breached through, such as ransomware through an internet-facing device, impersonation of staff to the IT helpdesk, payment diversion, compromise through a supplier and data theft for extortion. Each scenario cites public incidents.

**Relevance.** Each scenario has a relevance per industry (high, medium, low). Industry comes from the template, or from the organisation profile for framework templates. Some scenarios apply only to certain industries or profiles (for example website card skimming applies to retail and hospitality, or to any organisation that handles payment cards); a scenario triggered only by the profile is at least medium relevance.

**Stages.** A scenario is a chain of stages. Prevent and detect stages are chances to stop the attack; recover stages limit harm once it succeeds. Each stage lists the HawkSight controls that can break it, and a mode:

- `all`: the controls are alternative doors or joint requirements, so the weakest assessed control sets the stage strength.
- `any`: the controls are independent barriers, so the strongest assessed control sets the stage strength.

Control implementation is the weighted average of that control's answered questions (Unknown and Planned count as zero, as in the health score). Controls not covered by the template are ignored; a stage with none is not assessed.

**Readiness.** Each prevent or detect stage stops the attack with probability 0.7 × strength², so partial controls count for much less than complete ones. The chance the attack passes every stage is normalised to a three-stage chain so that scenarios are not rated better simply because they have more stages:

    pass = Π (1 − 0.7 × strength²)
    readiness = 100 × (1 − pass^(3 ÷ assessed stages))

A scenario is evaluated only when at least half of its prevent and detect stages are assessed. Bands: Open < 45, Partly defended 45–74, Defended ≥ 75. Recovery strength (the weakest assessed recover stage) is reported separately as the expected harm if the attack succeeds.

**Fixes.** For each scenario, the best single fix is the control whose full implementation raises readiness the most. Chain breakers rank controls by the relevance-weighted readiness gain they bring across all paths that are not yet defended (high 1, medium 0.6, low 0.3).

Readiness is a directional measure for prioritisation and explanation. It is not a probability of being attacked or breached.

## 9. Confidence

Support levels: self-attested 0.3, evidence-supported 0.7, assessor-validated 0.9, externally verified 1.0. A self-attested answer with attached evidence counts as evidence-supported. Only assessors can record assessor-validated or externally verified.

    confidence = 100 × (0.35 × completion + 0.50 × evidence quality of critical/high controls + 0.15 × (1 − unknown ratio))

High requires a score of 75+ and evidence quality of 60%+. Below 50% completion is always Low.

## 9a. Remediation estimates

Each finding's recommendation has three steps: a quick win, a 1-3 month project and a long-term investment. The report estimates what each step is worth by re-scoring the assessment as if the work were done, using the same weights, gating, severity and risk rules as the score itself.

- Each step is assumed to close a share of the remaining gap on the control: the quick win one third, the 1-3 month project two thirds, the long-term investment all of it. From "Not implemented" this is Partially, then Largely, then Fully implemented.
- Stage totals apply the step to every control with a gap, cumulatively: today, after quick wins, after 1-3 month projects, all work complete.
- An individual action's effect is measured from the position before its stage. Individual effects do not add up exactly to the stage total because of gating caps and rounding.
- Estimates are directional. The actual change is measured when the organisation is reassessed.

## 10. Evidence requirements

Critical and high controls whose library entry requires evidence must have evidence attached, or be assessor-validated, when they are answered as two-thirds implemented or better. Submission is blocked until this is resolved.

## 11. Applicability

Rules are data held in the scoring configuration. Each rule has a scope (templates, questions, controls, domains or keywords), conditions on profile fields or previous answers, and an effect (`hide` or `suggest_na`). Hidden questions are excluded from scoring and completion; suggested ones show a one-click Not applicable option.

## 12. Benchmarks

Benchmarks use the latest issued report per organisation, exclude demonstration data, and are shown only when at least the configured minimum number of organisations (default 10) contribute. Population size and date range are shown with every benchmark.

## 13. AI

AI assistance never changes answers, scores or findings. Question explanations send only the question text and template guidance. Executive summary drafts are built from aggregated results and must be approved before they appear in a report, where they are labelled as AI-assisted.

## 14. Limitations

Results reflect the answers and evidence provided at a point in time. Self-attested answers are not verified unless validated by an assessor. HawkSight is not a certification or audit opinion.
