# MUGEN version and compatibility model — draft

> **Status: design draft.** Use this when implementing or reviewing version-dependent MUGEN specifications. The canonical IDs are not production identifiers until explicitly adopted.

## Core rule

A MUGEN specification cannot always be described correctly by one `version` string.

Keep these concepts separate:

1. **engine** — `mugen` versus a separate implementation such as `ikemen-go`;
2. **runtime build** — the executable/build actually running the content;
3. **compatibility profile** — compatibility behavior selected by character/content metadata such as `mugenversion`;
4. **build date** — when a build identifies itself as built;
5. **public/distribution date** — when it was publicly released or later circulated, if known.

## Runtime build versus compatibility profile

A newer MUGEN executable can intentionally preserve old-character behavior. Therefore:

```json
"environment": {
  "engine": "mugen",
  "runtime": ["mugen-1.0-final"],
  "compatibility_profile": ["mugen-compat-2002"]
}
```

must be representable independently of:

```json
"environment": {
  "engine": "mugen",
  "runtime": ["mugen-1.0-final"],
  "compatibility_profile": ["mugen-compat-1.0"]
}
```

The internal compatibility-profile ID is a database identifier, not necessarily a literal string copied from a DEF file.

## Canonical IDs

Use one registry rather than inventing labels in every State Controller or Trigger document.

Proposed registry after adoption:

```text
src/data/engine-versions.json
```

During design review, use the example under:

```text
docs/mugen-document-schema/examples/engine-versions-v2-draft.json
```

Do not reference a draft ID from production JSON until the registry has been approved and installed.

## Unknown or undocumented introductions

Do not force an `introduced_in` value merely because a feature exists in an old build.

If the first implementation is not established, keep it null/omitted and record positive observations such as "confirmed in WinMUGEN" with evidence.

Distinguish:

- first known/verified occurrence;
- earliest official documentation;
- actual introduction version.

They may not be the same.

## MUGEN versus IKEMEN GO

Do not put IKEMEN GO releases into the MUGEN version sequence.

MUGEN migration work currently targets Elecbyte MUGEN. If IKEMEN GO support is added later, use a separate engine family and stable identifiers such as release tags or immutable commit SHAs for development builds.

A mutable label such as only `nightly` is insufficient for a reproducible runtime test.

## Dates

When a build date and public/distribution date differ, store both. If a date cannot be supported, store `null` rather than an inferred date.
