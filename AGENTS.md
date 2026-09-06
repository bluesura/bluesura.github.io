# Repository instructions

This file is the persistent instruction entry point for coding agents working in this repository.
Keep it short. Detailed MUGEN documentation rules live under `docs/mugen-document-schema/`.

## MUGEN documentation work

These instructions apply when a task touches MUGEN State Controller / Trigger documentation, its JSON data, schema, renderer, or related generation logic.

Before editing, read:

1. `docs/mugen-document-schema/README.md`
2. `src/data/about_mugen-template-all.md` — current active JSON-format reference
3. `docs/mugen-document-schema/MIGRATION_GUIDE.md` — migration and validation rules
4. `docs/mugen-document-schema/SCHEMA_V2_DRAFT.md` — proposed v2 model; **draft, not automatically active**
5. `docs/mugen-document-schema/VERSION_MODEL.md` when changing version-dependent behavior

## Required behavior

- Do not treat Elecbyte documentation as the sole source of truth when verified runtime behavior or well-documented community research conflicts with it. Preserve the conflict and its evidence.
- Do not delete undocumented behavior, bugs, compatibility quirks, or `load_priority` merely because they are absent from official documentation.
- Do not guess unknown values. Preserve `unknown`, `unverified`, `?`, or equivalent states until evidence exists.
- Preserve the copy/paste-oriented CNS parameter output. Do not generate pseudo-parameters that do not exist in MUGEN.
- Keep MUGEN and IKEMEN GO as separate engine families. The current documentation migration targets Elecbyte MUGEN unless the task explicitly says otherwise.
- Do not bulk-migrate all State Controller / Trigger JSON files before the representative fixture set in `MIGRATION_GUIDE.md` has been migrated and validated.
- Prefer backward-compatible schema additions and renderer support before removing legacy fields.
- Do not edit the repository-root `.astro/` generated cache/output directly. Edit source files under `src/` and regenerate through the project build process.
- Before running commands, inspect `package.json` and use scripts that actually exist. Do not invent script names.
- After changes, run checks appropriate to the files touched and report failures or unresolved uncertainty.

## Instruction scope

This root `AGENTS.md` applies to the whole repository. If a deeper directory later needs different rules, add a nested `AGENTS.md` there; the more specific file should contain only the local differences rather than duplicating this document.
