# ETIS-mobile

Unofficial React Native (Expo) Android app for ETIS, the student/teacher portal of Perm State University (PSU). It scrapes HTML from `student.psu.ru` and `psutech.ru` with cheerio, caches data for offline mode (the portal is often down), and parses schedules, grades, messages, certificates, etc. UI is in Russian. Published on Google Play / RuStore (no iOS).

## Dev environment

- Package manager is **Bun** (CI uses `bun install --frozen-lockfile`; lockfile is `bun.lock`).
- Expo SDK 57 (`expo ^57.0.0`), React Native 0.86, React 19.2, TypeScript, new architecture enabled, React Compiler
  experiment on.
- UI primitives come from `@expo/ui` (~57): RN core Switch/Checkbox are replaced by themed wrappers (
  `src/components/ThemedSwitch.tsx`, `ThemedCheckbox.tsx` using Host `matchContents`/`seedColor`); bottom sheets use
  `@expo/ui/community/bottom-sheet`; pagers use `@expo/ui/community/pager-view`.
- Install: `bun install`
- Dev server: `bun run start` (Expo Go); `bun run android` builds/runs on a device with `expo-dev-client`.

## Commands

- `bun run lint` — ESLint over the whole repo (there is no test suite).
- `bunx tsc --noEmit` — TypeScript check. Not wired as a script and not run in CI, so run it manually.
- `bunx expo-doctor` — validates Expo SDK dependency versions and native peer dependencies (Expo Go bundles some native modules that dev/EAS builds don't — doctor catches those). If it reports duplicate package copies in node_modules after an in-place bump, `rm -rf node_modules && bun install` fixes it.
- `bun run lint:fix` — auto-fix; also used as `format`.
- CI (`.github/workflows/lint.yml`) runs `bun run lint` on PRs and pushes to `development`; on failure it commits auto-fixes as "ci: fix linting issues" — so never push code that fails lint.

## Review checklist

Before handing work off, run and pass all three:

1. `bun run lint` — must be clean.
2. `bunx tsc --noEmit` — must be clean.
3. `bunx expo-doctor` — must pass 21/21 (or have every failure explained).

## Layout & conventions

- All app code is in `src/`:
  - `src/api/psu` and `src/api/psutech` — HTTP + parsers per portal. Each has `api.ts`, `parser.ts`, `models.ts`.
  - `src/parser/` — cheerio HTML parsers, one file per portal page (e.g. `timeTable.ts`, `rating.ts`). Heavy use of hand-written regexes; `regex.ts` holds shared ones and `utils.ts` shared helpers.
  - `src/models/` — TypeScript interfaces/enums (`ITimeTable`, `ILesson`, `WeekTypes`, ...), prefix interfaces with `I`.
  - `src/redux/` — Redux Toolkit store; reducers live in `src/redux/reducers/*Slice.ts` (camelCase + `Slice` suffix).
  - `src/screens/<feature>/` — screens grouped by feature folder; `src/components/`, `src/hooks/`, `src/utils/`, `src/navigation/`, `src/cache/`, `src/plugins/`.
- Path alias `~/` maps to `src/` (tsconfig `paths` with a relative anchor — no `baseUrl`, which is deprecated in TS 6). Use `~/...` for cross-folder imports.
- ESLint is XO-based (xo-typescript + xo-react) with many rules relaxed — see `eslint.config.mjs` before assuming a rule fires. Enforced style: 2-space indent, semicolons, always parenthesized arrow params, `simple-import-sort` ordering (imports must be sorted).
- Commit messages follow conventional prefixes: `fix:`, `chore:`, `deps:`, `refactor:`, `ci:` (see `git log`).

## TypeScript strict mode

`tsconfig.json` has `strict: true` (migrated from `strict: false` in Sept 2026; 861 errors were fixed, zero `any`-escapes). Rules for new code:

- **No `any` escapes and no unjustified `!` assertions.** Prefer null-guards matching runtime behavior; non-null `!` only when trivially provable (e.g. right after a truthiness check, or an invariant guaranteed by the caller).
- **Widen the model instead of asserting** when a value is genuinely absent at runtime (add `?` / `| null` to the interface). Example: `useQuery`'s `data: R | undefined`, cache `get(): T | null` before init.
- **Honest signatures**: a function that can fail to produce a value declares it (`Promise<X | null>`, `RegExpExecArray | null`). Callers then handle the miss — see `executeRegex` consumers.
- **Contexts throw on missing provider** (`useTimetableContext`, `useTaskContext` return the value or throw — no silent `undefined` default).
- **`useRef` for bottom sheets**: `useRef<BottomSheetModal | null>(null)` + `ref.current?.present()`. Never `useRef<X | undefined>(undefined)`.
- **State narrowing**: don't destructure state you need to narrow in the same expression; early returns must come AFTER all hooks (react-hooks/rules-of-hooks fires otherwise).
- **React Compiler purity**: `Math.random()` and friends must live inside `useMemo`/handlers, never in the render body (lint rule `react-hooks/purity`).
- **Generic result variance**: shared sentinel objects (`errorResult as IGetResult<T>`) need an explicit cast — TS won't coerce `IGetResult<null>` to `IGetResult<T>` for an unconstrained `T`.
- `tsc --noEmit` must stay at **0 errors**; it is the strongest gate (CI only runs lint).


## Pitfalls

- **No tests** — `bun run lint`, `bunx tsc --noEmit`, and `bunx expo-doctor` are the review gates (see Review checklist); CI only runs lint, so type errors otherwise surface at build time on EAS.
- **Releases need a version bump in two places** in `app.config.js`: `expo.version` and `android.versionCode` (e.g. 1.4.4 → 10404000).
- `app.config.js` reads `APP_VARIANT=development` to switch the Android package to `dev.damego.etismobile` (dev builds don't clobber the Play Store install).
- `babel.config.js` aliases `react-native-device-info` to a local stub `src/plugins/react-native-device-info.js` — that package is NOT actually installed.
- Student portal SSL certs are pinned via a config-plugin (`withCustomNetworkSecurityConfig`, certs in `assets/certs`); when `student.psu.ru` rotates its intermediate cert the app breaks until `.github/scripts/update_ssl_cert.py` is run and the cert committed.
- `@notifee/react-native` needs the `extraMavenRepos` entry in `app.config.js` (expo-build-properties) — removing it crashes Android builds.
- Builds happen on EAS (`eas build -p android --profile production|production_apk`), triggered by the `eas_create_build.yml` workflow on GitHub release publish. Platform is Android-only (`platforms: ['android']`).

## Skills & MCP (recommended)

- The repo vendors 26 Expo/EAS agent skills in `.agents/skills/` (sourced from `expo/skills` GitHub, pinned by `skills-lock.json`). For any Expo/EAS task, load `expo-overview` first — it routes to the right leaf skill:
  - `eas-workflows` — writing/editing EAS workflow YAML (`.eas/workflows/`), CI/CD pipelines.
  - `eas-app-stores` — Play Store / TestFlight submissions, review replies, release metadata.
  - `expo-dev-client` — dev builds (`dev.damego.etismobile` variant, `expo-dev-client`).
  - `expo-module` / `expo-migrate-module` — native module work (rarely needed here).
  - The `update_ssl_cert.yml` workflow runs monthly and auto-opens a PR when the student.psu.ru intermediate cert rotates — check open PRs before manually running `update_ssl_cert.py`.
- If Expo MCP tools are available to the agent (`mcp__expo__*`: `build_list`/`build_info`/`build_logs`, `appstore_reviews`, `playstore_reviews`, ...), prefer them for EAS build status and store review handling over scraping the web.
- Expo CLI's own MCP server is **not enabled** here: it requires the `expo-mcp` package (not in `package.json`) plus the
  `EXPO_UNSTABLE_MCP_SERVER` env var. Don't add it without asking — it's experimental.
