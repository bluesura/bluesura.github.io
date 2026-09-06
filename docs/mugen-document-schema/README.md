# MUGEN document schema — documentation map

This directory is the design and migration knowledge base for the MUGEN documentation system.

## Status and authority

The **currently active** JSON-format reference remains:

- `src/data/about_mugen-template-all.md`

The files in this directory describe the proposed v2 structure and the procedure for adopting it. They are not active runtime/schema rules merely because they exist here.

When implementation begins, update the active source, schema, renderer, and these documents together so that they do not drift.

## Files

- `SCHEMA_V2_DRAFT.md` — proposed data model for State Controller / Trigger documents.
- `VERSION_MODEL.md` — rules for MUGEN runtime-build and compatibility-profile versioning.
- `MIGRATION_GUIDE.md` — safe implementation order, fixture set, and validation requirements.
- `examples/engine-versions-v2-draft.json` — draft canonical version registry example. It is not production data until explicitly adopted.

## Why these files are not under `.github/`

They describe project/domain architecture, not GitHub repository features. Coding agents are directed here from the root `AGENTS.md`.

`.github/` should remain for GitHub-specific configuration such as Actions workflows, issue templates, pull-request templates, CODEOWNERS, and similar repository-hosting configuration.

## Source-of-truth rule

For an implementation task, use this order:

1. Explicit task instructions from the user/maintainer.
2. Active repository code/schema and `src/data/about_mugen-template-all.md`.
3. These design/migration documents.
4. Historical pages and research sources used as evidence.

If the draft conflicts with active behavior and the task does not explicitly authorize migration, preserve the active behavior and report the conflict rather than silently applying the draft.
