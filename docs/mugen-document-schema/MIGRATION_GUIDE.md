# MUGEN documentation schema migration guide

## Purpose

This document defines how an AI coding agent or human maintainer should migrate the existing MUGEN documentation JSON/Astro pipeline toward schema v2 without destroying historical behavior, undocumented specifications, or copy/paste usability.

`SCHEMA_V2_DRAFT.md` is a design proposal. This file controls **how to introduce it safely**.

## 1. Do not start with a bulk rewrite

The repository contains many State Controller and Trigger JSON files with irregular historical data. A mechanical all-file migration can silently normalize away information that matters in MUGEN, especially bugs, undocumented behavior, compatibility quirks, and evaluation-order research.

Add schema capability first, keep old data readable, and migrate representative pages one at a time.

## 2. Files to inspect before implementation

Confirm the actual repository tree first, then inspect at minimum:

- `src/data/about_mugen-template-all.md`
- `src/data/mugen-template-all.json`
- `src/content/config.ts` or the current content-schema entry point
- `src/components/content/Parameter.astro`
- `src/components/content/DefaultParameter.astro`
- `src/components/content/LoadParameter.astro`
- `src/components/content/Version.astro`
- `src/components/content/Quote.astro`
- State Controller and Trigger dynamic page renderers
- `src/data/common/IgnoreHitPause.json`
- `src/data/common/Persistent.json`

The repository-root `.astro/` directory is generated/cache output. Do not edit its generated schema artifacts as the source of truth.

## 3. Representative fixture set

Do not migrate the full collection until this set can be represented without losing information.

### State Controllers

- `Helper.json` — inheritance, undocumented values, cross-version differences, load priority
- `HitDef.json` — many parameters, derived defaults, warnings and bugs
- `VarSet.json` — alternative syntax forms
- `HitBy.json` — mutually alternative parameter forms
- `Explod.json` — substantial 1.0/1.1 differences and special behavior
- `Zoom.json` — incomplete/experimental 1.1-era behavior

### Triggers

- `MoveContact.json` — semantics that differ across MUGEN generations
- `AnimElem.json` — old-style/irregular trigger syntax
- `IfElse.json` and `Cond.json` — evaluation differences
- `AILevel.json` — RC-era introduction/fixes

### Secondary checks

- `TagIn.json`
- `TagOut.json`
- `StandBy.json`
- `Const.json`
- `TargetLifeAdd.json`

## 4. Version handling

Follow `VERSION_MODEL.md`.

Do not collapse all version information into a single label. Keep separate concepts for:

- engine family
- runtime build/executable
- compatibility profile such as character `mugenversion` behavior
- build date versus public/distribution date when those differ

Unknown dates or first-supported versions remain unknown until evidence is found.

## 5. Evidence and conflicting documentation

Official Elecbyte documents are important primary sources, but they are not assumed to be a perfect description of runtime behavior.

When sources disagree:

- do not silently choose one and delete the other;
- record the environment where runtime behavior was verified;
- distinguish source type from confidence/verification status;
- preserve useful community research, especially detailed MUGEN CNS Wiki CHAOS findings and reproducible runtime tests;
- keep citations/source references where possible.

Do not turn `unverified` into `confirmed` merely because several pages repeat the same claim.

## 6. `load_priority`

`load_priority` is a first-class part of this documentation project.

Do not confuse these three concepts:

1. textual order of parameter lines in CNS;
2. left-to-right evaluation inside comma-separated expressions;
3. internal parameter evaluation/loading priority inside a State Controller.

The existing `load_priority` field primarily records item 3. Keep `?` where the order is unknown. Add tested environment/evidence when known rather than demoting or deleting the field.

## 7. Defaults and copy/paste output

The parameter-list output is an editing aid and must remain usable as CNS text.

Do not output invented MUGEN syntax such as `Parent.Size.XScale` merely to express inheritance.

For inherited, derived, required-without-default, or unknown values, prefer a fully commented template line such as:

```cns
; Size.XScale =        ; 省略時: 親から継承
```

For literal defaults, an active line may be emitted:

```cns
ID = 0
Pos = 0, 0
```

Generate parameter documentation and copy/default output from the same effective parameter list so common State Controller parameters such as `IgnoreHitPause` and `Persistent` cannot appear in one section and disappear from another.

## 8. Notes/history migration

Do not mechanically rename every legacy `version` entry to `version_change`.

Classify the meaning, for example:

- normal behavior → `behavior`
- added/changed/fixed in a version → `version_change`
- engine bug → `bug`
- warning message → `warning`
- load/runtime failure → `error`
- compatibility-profile difference → `compatibility`
- undocumented behavior → `undocumented`
- internal/runtime experiment → `research`
- deprecated behavior → `deprecated`
- implementation limitation → `limitation`

The renderer may still present these under a compact combined human-facing section.

The publication policy in `ADOPTION.md` now keeps `research` and `visibility: internal` notes out of HTML, independent of evidence status. Evidence metadata stays in JSON. Retention checks must distinguish an explicitly internal note from an accidental loss of public documentation.

## 9. Trigger-specific stress tests

Schema v2 should be able to represent at least:

- return type
- syntax kind / irregular syntax
- arguments
- version/environment variants

Do not add every conceivable semantic field globally before the fixture set proves it is needed. Prefer structured notes for uncommon one-off behavior until repetition justifies a first-class field.

## 10. Implementation sequence

1. Confirm the current build and relevant package scripts.
2. Preserve representative current HTML/output for comparison.
3. Add new schema fields as optional fields.
4. Make renderers accept both legacy and v2 forms.
5. Introduce the version registry only after its identifiers are reviewed.
6. Migrate `Helper` first.
7. Build and compare rendered output.
8. Migrate the remaining fixtures individually.
9. Review whether any fixture still requires unstructured escape hatches.
10. Only then design a bulk conversion script.
11. Remove legacy fields only in a separate, explicitly authorized cleanup phase.

## 11. Validation

Use commands that exist in the repository's `package.json`.

At minimum validate, where applicable:

- JSON parsing and content-schema validation
- Astro build
- State Controller index
- Trigger index
- all representative fixture pages
- parameter rendering
- notes/history rendering
- default/copy template rendering
- `load_priority`
- source/quote links
- common `IgnoreHitPause` / `Persistent` integration

## 12. Completion report

At the end of a migration task, report:

- schema fields added or changed;
- renderer/components changed;
- JSON documents migrated;
- backward-compatibility behavior;
- build/test results;
- unresolved `unknown`, `unverified`, or conflicting specifications;
- whether bulk migration was intentionally not performed.
