# MusicUI — Storybook and component automation plan

> Status: Proposed implementation contract (documentation only; not shipped)
> Owner: CEDD / Music Label UI Library project
> Date: 2026-10-27
> Canonical CEDD planning: [Music Label UI Library in Notion](https://app.notion.com/p/2003000443d38031969fffac67ca9a40)
> Source: [MusicComponentLibrary](https://github.com/Customer-Experience-Design-Development/MusicComponentLibrary)
> Upstream proving ground: [Music Label OS](https://github.com/Customer-Experience-Design-Development/my-music-label-app)

## Outcome, not output volume

Prove one **production-quality, independently reusable music UI component** (Waveform pilot) that someone outside CEDD can run, customize, test, and understand. Then make the promotion workflow repeatable. This is **one bounded outcome**, not permission to generate hundreds of components or automatically publish AI output.

Primary intended audience: React developers building music-creation, music-management, collaboration, and education products. A published asset must answer a music-specific user job, not merely look like a music interface.

### Definition of success for the pilot

- A developer unfamiliar with Music Label OS can clone the public repo, install dependencies, start Storybook, locate the Waveform story, use its controls, and build Storybook without private credentials.
- The Waveform is deterministic for fixed samples, is keyboard-usable when interactive, handles empty/zero-duration/overflow inputs, adapts to narrow viewports and themes, and has automated interaction/accessibility tests.
- All claims and installation commands in the documentation are verified; unshipped npm, React Native, iOS, or Android support is not presented as available.
- A reviewer can trace the component's origin, permission/licensing audit, tests, and PR to its public release.
- At least one outside developer can complete the documented quick-start (direct observation or issue/PR feedback); a successful CI run alone is **output evidence**, not adoption evidence.

## Current baseline — inspected 2026-10-27

| Surface | Observed | Implication |
| --- | --- | --- |
| Public MusicComponentLibrary | React 18, TypeScript, Vite 5, Tailwind, Radix, Express backend, npm lockfile; many components under `client/src/components/music-ui/` | Extend this repository; don't replace the existing public site |
| Public Storybook | No `.storybook/`, Storybook package, or Storybook script found on `main` | Add a separate React/Vite Storybook |
| Public package | `package.json` is named `rest-express`; no verified publishable component build | Do **not** claim `@musicui/react` can be installed until distribution is validated |
| Public tests | README references `npm run test`, but no test script exists | Establish test commands before promising coverage |
| Waveform | Generates random demo bars when `data` is missing; pointer-only seek handling in a clickable container | Introduce stable fixtures, keyboard controls, nonzero duration guards, and explicit semantics |
| Music Label OS | Existing Next.js Storybook with `Foundations / Patterns / Workflows / Showcase`, mocks, provenance, coverage, title validation, screenshot scripts | Preserve its internal architecture; reuse insights and patterns, not app-specific code automatically |

## Boundary and ownership

**Music Label OS Storybook** remains canonical for the application's actual product states, journey contracts and Golden scenarios. Its existing CEDD hardening tasks continue independently.

**MusicUI Storybook** is canonical for **public, framework-neutral React components**. It should not import Firebase, NextAuth, private routes, proprietary fixtures, secrets, backend services, or app-specific feature flags. A pattern becomes eligible when it can be demonstrated with typed props, synthetic fixtures, and an understandable standalone contract.

**Public website** at `ui.musiclabelos.com` remains the discovery front door. Storybook can be a separately deployed workbench or embedded/linkable preview; don't break the existing Vite/Express site to launch it.

**Notion CEDD Tasks** remains the commitment system. GitHub issues, PRs, CI, usage, and release notes are implementation/evidence streams, not a second priority list.

## Delivery sequence

### 0 — Audit and truthfulness (prerequisite)

- Inventory components and routes, classify `reusable`, `demo`, `coupled`, or `needs repair`.
- Run the existing install/typecheck/build where possible; record actual failures.
- Identify missing tests, dependencies, CSS assumptions, possible broken links, unsupported platform/package claims, and sample audio licensing.
- Keep a short baseline report with links and open risks. Avoid treating exported component names as proof of functional completeness.

### 1 — Public Storybook scaffold

- Add **React + Vite** Storybook in this repository (not `@storybook/nextjs`), with a compatible pinned version following dependency compatibility checks.
- Reuse existing `client/src/index.css`, Tailwind theme, TypeScript aliases, and Radix providers where needed.
- Use deterministic synthetic `stories/fixtures/` and domain-based navigation such as `Audio`, `Catalog`, `Lyrics`, `Analysis`, and `Collaboration`; avoid mirroring Music Label OS's private workflow taxonomy.
- Document npm scripts for `storybook`, `build-storybook`, `check`, and tested commands.
- Storybook builds without auth, secrets, network-dependent backends, live APIs, or a running Express server.

### 2 — Waveform reference component (first vertical slice)

- Create typed props, stable amplitude input/sample, seekable and display-only variants, light/dark, narrow viewport, empty/loading/invalid data, and accessible labels.
- Fix random rendering and duration=0; test click and keyboard seek behavior with meaningful percent/time output.
- Run targeted accessibility, interaction, TypeScript, Storybook build, and visual snapshot checks. Document limitations and browser behavior.
- Provide implementation and copy/paste examples without app services; use synthetic fixture audio or no audio where possible.

### 3 — CI and PR review gate

- On public library PRs: install reproducibly from lockfile, typecheck, build the public app, build Storybook, run relevant component/interaction/accessibility tests.
- Upload or expose preview assets; compare intentional changes rather than accepting every visual diff automatically.
- Require human approval for public component APIs, semantics, accessibility, licensing, and musical accuracy.
- Do not commit Storybook's generated static output unless deployment requires it; prefer CI artifacts.
- Keep source citations and links for any upstream extraction.

### 4 — Candidate discovery and promotion automation (after pilot passes)

- Proposed weekly job and/or upstream PR analysis **reads** changes from Music Label OS and the public library.
- Deterministic analyzer proposes candidates from changed exports, associated stories, API diffs, and source usage; distinguish *suggestion* from evidence of cross-app portability.
- An optional coding agent can draft extraction, standalone types, fixtures, stories, tests, docs, and a PR **on a branch**.
- Candidate PR links original path and motivating music job; reports app dependencies, provenance/licensing, test results, and design-review status.
- The pipeline **never auto-merges, auto-publishes, exposes private files, or assumes generated code is safe**.
- If automation cannot authenticate to upstream, use an explicit, manual candidate list instead of demanding tokens in a public repository.

### 5 — Distribution and learning (gated)

- Validate one source-copy install path first, then evaluate a shadcn-compatible registry; npm publishing is optional and later.
- Verify installation in a clean consumer React/Vite app; document peer dependencies, tokens/CSS, bundling, attribution, licenses, browser support, and examples.
- Link public site entries to live stories, copyable source, accessibility notes, and changelog.
- Track external quick-start completions, issues, forks, source installs where measurable, contributions, and maintenance cost. Do not infer adoption from GitHub stars or component counts alone.

## Architecture sketch

```text
Music Label OS source + internal Storybook
      | (candidate discovery; no automatic export)
      v
Portability and rights/licensing review
      | rejected / deferred / approved
      v
MusicComponentLibrary source -> Public Storybook -> CI + screenshots
      | (human-reviewed PR)
      v
Published public library + optional registry + existing site
      |
      v
Usage, issues, contributions and maintenance evidence -> CEDD weekly review
```

## Evidence and stop/expand gate

Track four separate dimensions rather than one vanity score:

1. **Technical readiness:** clean install, typecheck/build, accessibility/interaction tests and regression baseline.
2. **Developer usability:** independent quick-start success and any friction.
3. **Public reuse:** first confirmed external adoption or useful contribution; absence of adoption remains explicit.
4. **Operating cost:** review time, generated PR rejection rate, and recurring infrastructure expense.

**Gate after Waveform:** expand to Playlist or VolumeControl only if a clean consumer app can use it without Music Label OS dependencies, meaningful tests pass, and the documentation works. Keep scheduled AI generation and registry publishing **parked** until this gate; do not let them displace current Music Label OS validation commitments.

## Out of scope for this first initiative

- Rebuilding the entire public site, bulk automatic extraction, a native iOS/Android/Flutter release, a new Figma synchronization backend, npm registry promises, real user data, unlicensed sample audio, automated semantic approval, and redesign of Music Label OS Storybook.
- New duplicate Notion databases or a separate planning/issue hierarchy.

## Source references

- [Public library repository](https://github.com/Customer-Experience-Design-Development/MusicComponentLibrary)
- [Music Label OS Storybook strategy](https://github.com/Customer-Experience-Design-Development/my-music-label-app/blob/main/stories/STORYBOOK_STRATEGY.md)
- [CEDD Operating Model](https://app.notion.com/p/3ec3000443d381778d72e80e00d02012)
- [Music Label UI Library project](https://app.notion.com/p/2003000443d38031969fffac67ca9a40)
