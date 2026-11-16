# MusicUI — public component promotion contract

> Status: Proposed quality gate — enforce through PR review; automated checks are not implemented by this document.
> Companion: [Automation plan](./MUSICUI_AUTOMATION_PLAN.md).

## A component's admission path

`Candidate → Reviewed → Portable → Verified → Released → Observed`.

A candidate is an idea until it meets its gate. An existing Music Label OS story is not automatically a public component, and an existing public component is not automatically supported.

### Candidate record (required before extraction)

| Field | Required answer |
| --- | --- |
| Name / user job | What does it help a musician, creator, producer, educator, or developer accomplish? |
| Source | File/commit or existing public component; links to relevant internal Storybook state |
| Ownership | Who owns the code and sample assets? Are licenses and dependencies compatible with public MIT distribution? |
| Type and API | Props, controlled vs uncontrolled behavior, callbacks, data model, extensibility |
| Coupling | Browser, React, CSS, UI primitives, audio APIs, backend, database, auth, Next.js dependencies |
| Interaction | Keyboard/mouse/touch, focus, motion, playback and time handling |
| State matrix | Default, loading, empty, invalid/error, disabled, narrow viewport, dark/light as applicable |
| Tests | Typecheck, interaction, accessibility, Storybook build, visual changes |
| Evidence | Real product usage, prototype observation, feedback, or explicit assumption; distinguish each |
| Decision | Promote / revise / defer / reject; reviewer and rationale |

## Required public story behavior

- **Real component**, not a separately simulated lookalike.
- **Deterministic fixture**: no `Math.random()`, clock-dependent output, API calls, or real account data in screenshots.
- **Interoperable contract**: public props and callback types; no private `@/app/` or context dependency.
- **Useful controls**: range/slider, value labels, theme/responsive states, and examples that show what changes.
- **Accessibility**: semantic controls, accessible names, keyboard and focus path, meaningful time/volume readouts, reduced-motion behavior when relevant, noncolor differentiation.
- **Audio integrity**: document audio availability and gesture requirements; release all AudioContext/AudioNodes on cleanup; guard no-source and playback errors.
- **Visual integrity**: regression images at at least wide and narrow widths; light/dark when supported.
- **Documentation**: why/when to use, props, examples, accessibility caveats, known limits, peer dependencies, license/credits.

## Waveform pilot: acceptance examples

| Scenario | Expected result |
| --- | --- |
| Fixed `data` | Screenshot is stable on repeated runs |
| No `data` | Purposeful placeholder/empty state, not fabricated random waveform |
| `duration = 0` or missing | No NaN widths, divide-by-zero, or misleading playback |
| 0% and 100% seek | Correct clamped output and visible position |
| Keyboard interaction | Focusable semantic control, arrow/home/end when interactive; display-only variant not falsely interactive |
| Pointer/touch interaction | Seek uses bounded positions and does not trigger page scroll unexpectedly |
| Screen reader | Accessible purpose/value information; display-only graphics have appropriate text alternative |
| Narrow viewport and themes | Visible, usable and high contrast |
| Clean consumer | No private imports; app imports and renders without project-specific providers |

The existing `client/src/components/music-ui/Waveform.tsx` is the starting point, not an approved release. Preserve what works; don't invent audio playback in a component that merely visualizes data.

## Pull request checklist

- [ ] Links to CEDD Task, source component and decision record
- [ ] Component serves a stated music-domain user job
- [ ] All nonpublic dependencies and data removed
- [ ] Public interface exported and typed
- [ ] Stories render without auth/server/API keys
- [ ] Deterministic fixtures and state coverage included
- [ ] Keyboard, screen-reader, touch and responsive cases reviewed
- [ ] Typecheck, library app build, Storybook build, and tests pass
- [ ] Documentation and install example verified in a fresh consumer app
- [ ] Attribution/license, sample content and release impact reviewed
- [ ] Design + engineering approval recorded
- [ ] Evidence and next decision recorded in CEDD project

## Release criteria and documentation truthfulness

- `Available in the website` means a public demo route renders and is useful. It does **not** mean the component is independently installable.
- `Available in Storybook` means a public isolated example exists and its build passes.
- `Copy source` means the clean consumer import and style/dependency requirements have been tested.
- `Registry` means a real registry endpoint and its install command have been verified.
- `npm package` means the package actually exists and imports successfully by its documented name/version.
- Do not advertise web code as React Native, iOS, Android, or Flutter unless those implementations are actually shipped and tested.
- Every failed verification keeps the capability *planned*, not *available*.

## Promotion guardrail

The public code can be MIT-licensed while a dependency or fixture is not. Review source rights and all included sample media; only publish assets permitted for redistribution. For upstream application code, create an independent public API after reviewing domain/ownership boundaries, rather than bulk copying.
