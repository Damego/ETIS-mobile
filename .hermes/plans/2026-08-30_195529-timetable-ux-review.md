# Timetable Screen UX Review & Improvement Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Fix the correctness and UX defects found in a deep review of the main timetable screen (`src/screens/etis/main/timetable/Timetable.tsx`) and all components under `src/components/timetable/`, making the screen predictable, theme-safe, accessible, and recoverable from failure.

**Architecture:** The timetable screen composes `useTimetable` (date/week selection state) + `useTimeTableQuery` (data loading) and delegates rendering to `TimetableContainer`, which switches between `DayTimetable` (day pager + calendar) and `WeekTimetable` (week list) based on the `timetableMode` setting. All changes are in-place edits to existing components; no new screens, no new dependencies, no navigation changes.

**Tech Stack:** React Native 0.86 / Expo SDK 57, TypeScript, Redux Toolkit (`settingsSlice`), dayjs with global `ru` locale (set in `src/App.tsx:25`), `@expo/ui` PagerView, `react-native-ui-datepicker`.

---

## Review findings (what this plan fixes)

Found during the deep review, in priority order:

| # | Finding | Where | Severity |
|---|---------|-------|----------|
| 1 | Module-level mutable `preSelectedDate` shared across every screen using `useTimetable` (student, teacher, unauthorized, cathedra) — cross-screen state bleed | `src/hooks/useTimetable.ts:27` | Bug |
| 2 | Context memo has stale deps `[teachers, selectedDate]`, omitting `currentDate`, `currentWeek`, `selectedWeek` — stale context values in edge cases | `src/components/timetable/dayTimetable/DayTimetable.tsx:47-56` | Bug |
| 3 | Week arrows are bounded by hard-coded `selectedWeek !== 1`; "next" is never bounded — user can navigate past `weekInfo.last` into empty weeks | `src/components/timetable/dayTimetable/components/timetableCalendar/WeekNavigation.tsx:27-42` | UX bug |
| 4 | Hard-coded colors break dark themes: `#fbf0f1` badge, `#808080`, `#FFFFFF` | `dayTimetable/components/Pair.tsx:26,79`, `timetableCalendar/DayButton.tsx:99` | Visual bug |
| 5 | "Tap month title to return to today" is completely undiscoverable; no visible today control | `WeekNavigation.tsx:36-39` | UX |
| 6 | Empty states ("Расписания нет" / "Нет расписания") offer no retry action | `DayTimetable.tsx:101`, `WeekTimetable.tsx:103` | UX |
| 7 | Header icon buttons have no accessibility labels and sub-44pt hit areas | `timetable/buttons/*.tsx` | Accessibility |
| 8 | `localShowPastWeekDays` initialized once from props; changing the setting later has no effect until remount | `weekTimetable/components/DayArray.tsx:21-22` | Bug |
| 9 | Switching weeks flashes a full-screen skeleton over existing content (stale-content swap would be smoother) | `src/screens/etis/main/timetable/Timetable.tsx:55` | UX polish |
| 10 | Dead `{ }` JSX fragments left in code | `DayTimetable.tsx:86`, `WeekTimetable.tsx:81` | Cleanup |

**Out of scope (do NOT do):** restructuring navigation, adding a test framework, changing parsers/API, redesigning visuals beyond the fixes above.

## Verification approach (READ FIRST — no test suite in this repo)

This repo has **no tests** (see AGENTS.md). The review gates are:

```bash
bun run lint           # expected: exit 0, no output
bunx tsc --noEmit      # expected: exit 0, no output
bunx expo-doctor       # expected: 21/21 checks pass
```

Run `bun run lint` and `bunx tsc --noEmit` after **every** task; run `bunx expo-doctor` once at the end (Task 11). Where a task changes visible behavior, a manual QA step on device/emulator is specified (`bun run android` or `bun run start` + Expo Go). Never push code that fails lint (CI auto-commits fixes and that pollutes history).

Commit message prefixes follow repo convention: `fix:`, `refactor:`, `chore:`.

---

### Task 1: Remove dead `{ }` JSX fragments

**Objective:** Delete leftover empty JSX expressions.

**Files:**
- Modify: `src/components/timetable/dayTimetable/DayTimetable.tsx:86`
- Modify: `src/components/timetable/weekTimetable/WeekTimetable.tsx:81`

**Steps:**

1. In `src/components/timetable/dayTimetable/DayTimetable.tsx`, delete the standalone line `{ }` between the closing `/>` of `<TimetableCalendar ...>` and the `{loadingComponent !== undefined && isLoading ? (` ternary.
2. In `src/components/timetable/weekTimetable/WeekTimetable.tsx`, delete the standalone line `{ }` between the `PageNavigator` block and the `{loadingComponent !== undefined && isLoading` ternary.
3. Verify: `bun run lint && bunx tsc --noEmit` → both exit 0.
4. Commit: `git add -A && git commit -m "chore: remove dead JSX fragments in timetable components"`

### Task 2: Fix module-level `preSelectedDate` state bleed

**Objective:** `useTimetable` is used by several screens (`src/screens/etis/main/timetable/Timetable.tsx`, `src/screens/unauthorizedStudent/timetable/Timetable.tsx`, `src/screens/unauthorizedTeacher/timetable/Timetable.tsx`, `src/screens/etis/cathedraTimetable/CathedraTimetable.tsx`). The module-scoped `let preSelectedDate` is shared by all of them — a pending selection on one screen mutates another screen's next data update. Move it into the hook instance via `useRef`.

**Files:**
- Modify: `src/hooks/useTimetable.ts`

**Steps:**

1. Replace line 27 (`let preSelectedDate: dayjs.Dayjs = null;`) — delete it.
2. Add `useRef` to the React import (line 2): `import { useRef, useState } from 'react';`
3. Inside the hook body (after the `useState` call), add:
   ```ts
   const preSelectedDate = useRef<dayjs.Dayjs>(null);
   ```
4. In `updateData` (currently lines 53-71), replace the two `preSelectedDate` references:
   ```ts
   const updateData = (weekInfo: WeekInfo) => {
     if (preSelectedDate.current) {
       setTimetable({
         currentDate,
         currentWeek,
         selectedDate: preSelectedDate.current.clone(),
         selectedWeek: weekInfo.selected ?? selectedWeek,
       });
       preSelectedDate.current = null;
     } else if (weekInfo.selected !== null && weekInfo.dates !== null) {
       // ... unchanged else-branch
   ```
5. In `onDatePress` (currently lines 73-87), change the last statement from `preSelectedDate = date;` to `preSelectedDate.current = date;`.
6. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
7. Manual QA: open the main timetable, swipe the day pager across a week boundary (triggers `preSelectedDate`), then navigate to the teacher/cathedra timetable screen — its selected date must not jump.
8. Commit: `git add -A && git commit -m "fix: scope timetable pre-selected date to hook instance"`

### Task 3: Fix stale context memo dependencies in DayTimetable

**Objective:** The `contextData` `useMemo` lists `[teachers, selectedDate]` but the object also contains `currentDate`, `currentWeek`, `selectedWeek` — when those change without `teachers`/`selectedDate` changing, consumers (`TimetableCalendar`, `Pair`, `Lesson`) read stale values.

**Files:**
- Modify: `src/components/timetable/dayTimetable/DayTimetable.tsx:47-56`

**Steps:**

1. Change the memo dependency array:
   ```ts
   const contextData = useMemo(
     () => ({
       teachers,
       selectedDate,
       currentDate,
       selectedWeek,
       currentWeek,
     }),
     [teachers, selectedDate, currentDate, selectedWeek, currentWeek]
   );
   ```
2. Verify: `bun run lint && bunx tsc --noEmit` → exit 0. (ESLint `react-hooks/exhaustive-deps` may previously have been silent here — if it now fires elsewhere, fix only what this change introduced.)
3. Commit: `git add -A && git commit -m "fix: include all timetable context values in memo deps"`

### Task 4: Clamp week navigation to actual week bounds

**Objective:** The prev arrow disappears only at hard-coded week 1 and the next arrow never disables, letting users page into weeks outside `weekInfo.first..last`. Bound both arrows by the real education-period range.

**Files:**
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/WeekNavigation.tsx`
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/WeekCalendar.tsx`
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/TimetableCalendar.tsx`
- Modify: `src/components/timetable/dayTimetable/DayTimetable.tsx`

**Steps:**

1. `WeekNavigation.tsx` — add `firstWeek`/`lastWeek` props and bound both arrows (mirrors the existing "hide prev" pattern for symmetry):
   ```tsx
   const WeekNavigation = ({
     selectedDate,
     selectedWeek,
     firstWeek = 1,
     lastWeek = Number.POSITIVE_INFINITY,
     onPrevPress,
     onNextPress,
     onMainPress,
   }: {
     selectedDate: dayjs.Dayjs;
     selectedWeek: number;
     firstWeek?: number;
     lastWeek?: number;
     onPrevPress: () => void;
     onNextPress: () => void;
     onMainPress: () => void;
   }) => {
     const theme = useAppTheme();
     const canPrev = selectedWeek > firstWeek;
     const canNext = selectedWeek < lastWeek;
     ```
   Then in the JSX replace `{selectedWeek !== 1 ? (...) : (<View style={{ width: 20 }} />)}` with `{canPrev ? (...) : (<View style={{ width: 20 }} />)}`, and wrap the next-arrow `TouchableOpacity` the same way:
   ```tsx
   {canNext ? (
     <TouchableOpacity onPress={onNextPress}>
       <AntDesign name={'right'} size={18} color={theme.colors.text} />
     </TouchableOpacity>
   ) : (
     <View style={{ width: 20 }} />
   )}
   ```
2. `WeekCalendar.tsx` — accept `firstWeek`/`lastWeek` props and pass them through to `<WeekNavigation ...>`. Add to the props type: `firstWeek?: number; lastWeek?: number;`.
3. `TimetableCalendar.tsx` — accept `firstWeek`/`lastWeek` props and pass them to `<WeekCalendar ...>`.
4. `DayTimetable.tsx` — pass the bounds from data (it already computes `$startDate`/`$endDate` from `data.weekInfo.first/last`):
   ```tsx
   <TimetableCalendar
     periodStartDate={startDate ?? $startDate}
     periodEndDate={endDate ?? $endDate}
     firstWeek={data?.weekInfo.first}
     lastWeek={data?.weekInfo.last}
     onDatePress={handleDatePress}
   />
   ```
5. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
6. Manual QA: on the timetable screen in day mode, arrow back to the first week of the period — the left arrow disappears; arrow forward to the last week — the right arrow disappears. Never can you reach a week number outside `weekInfo.first..last`.
7. Commit: `git add -A && git commit -m "fix: clamp timetable week navigation to education period bounds"`

### Task 5: Add a visible "Сегодня" (today) control

**Objective:** Tapping the month/week title jumps to today, but nothing indicates that. Render an explicit "Сегодня" pill next to the title whenever the selected week is not the current week.

**Files:**
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/WeekNavigation.tsx`
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/WeekCalendar.tsx`
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/TimetableCalendar.tsx`

**Steps:**

1. `TimetableCalendar.tsx` — `currentWeek` is already in the timetable context (`src/context/timetableContext.ts`). Destructure it: `const { selectedDate, currentDate, selectedWeek, currentWeek } = useTimetableContext();` and pass `currentWeek={currentWeek}` to `<WeekCalendar ...>`.
2. `WeekCalendar.tsx` — accept `currentWeek?: number` and pass it to `<WeekNavigation ...>`.
3. `WeekNavigation.tsx` — accept `currentWeek?: number`. Change the middle title element from a bare `Text` to a row containing the existing title plus the today pill:
   ```tsx
   <View style={styles.titleRow}>
     <Text style={styles.infoText} onPress={onMainPress}>
       {capitalizeWord(selectedDate.format('MMMM'))}
       {selectedWeek ? ` • ${selectedWeek} неделя` : ''}
     </Text>
     {currentWeek !== undefined && selectedWeek !== currentWeek && (
       <TouchableOpacity
         onPress={onMainPress}
         accessibilityRole='button'
         accessibilityLabel='Вернуться к текущей неделе'
         hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
       >
         <Text style={styles.todayText}>Сегодня</Text>
       </TouchableOpacity>
     )}
   </View>
   ```
   Add styles:
   ```ts
   titleRow: {
     flexDirection: 'row',
     alignItems: 'flex-end',
     gap: 8,
   },
   todayText: {
     fontWeight: '500',
     fontSize: 14,
     color: theme.colors.primary,
   },
   ```
   Note: `styles.todayText` references `theme`, so either inline the color (`{ color: theme.colors.primary }` in the JSX, like `WeekNavigation` already does for icons) or keep the style static and inline the color — follow the file's existing pattern (inline color in JSX is used for icons; do the same here).
4. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
5. Manual QA: navigate to a non-current week — a "Сегодня" pill appears next to "Сентябрь • 3 неделя"; tapping it (or the title) returns to the current week and the pill disappears.
6. Commit: `git add -A && git commit -m "feat: add visible today control to timetable week navigation"`

### Task 6: Replace hard-coded colors with theme tokens

**Objective:** Three hard-coded colors render wrong (or unreadable) in dark themes.

**Files:**
- Modify: `src/components/timetable/dayTimetable/components/Pair.tsx:26-30` (badge `backgroundColor: '#fbf0f1'`) and `:79` (`color: '#808080'`)
- Modify: `src/components/timetable/dayTimetable/components/timetableCalendar/DayButton.tsx:99` (`color: '#FFFFFF'`)

**Steps:**

1. `Pair.tsx` — the component already calls `useGlobalStyles()`; the theme object is not imported. Change the badge background to the theme card color and the end-time color to the secondary text color:
   ```tsx
   <View
     style={{
       backgroundColor: globalStyles.card.backgroundColor,
       paddingVertical: 2,
       paddingHorizontal: 4,
       borderRadius: 4,
     }}
   >
   ```
   and
   ```ts
   timeEndText: {
     fontSize: 16,
     color: globalStyles.text2.color,
   },
   ```
   Since `styles` is module-level, move the color inline instead: `<Text style={[styles.timeEndText, { color: globalStyles.text2.color }]}>` and remove `color: '#808080'` from the stylesheet. (`text2` and `card` exist in `src/styles/styles.ts`.)
2. `DayButton.tsx` — `selectedDayNumberText` hard-codes `color: '#FFFFFF'`. The component already has `globalStyles`; the selected day uses `globalStyles.primaryBackgroundColor` for the background, so the matching contrast text token is `globalStyles.primaryContrastText`. In the JSX change:
   ```tsx
   <Text
     style={
       isSelectedDay
         ? [globalStyles.primaryContrastText, styles.selectedDayNumberText]
         : styles.dayNumberText
     }
   >
   ```
   and delete `color: '#FFFFFF'` from `selectedDayNumberText`.
3. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
4. Manual QA: toggle the app to a dark theme (Settings → theme) and open the day timetable — the "1 пара" badge, end time, and selected day number must all be readable.
5. Commit: `git add -A && git commit -m "fix: use theme tokens instead of hardcoded colors in timetable"`

### Task 7: Add retry to timetable empty states

**Objective:** When the timetable fails to load (portal down, no cache), the screen shows only "Расписания нет" with no action. Add an "Обновить" button.

**Files:**
- Modify: `src/screens/etis/main/timetable/Timetable.tsx`
- Modify: `src/components/timetable/TimetableContainer.tsx`
- Modify: `src/components/timetable/dayTimetable/DayTimetable.tsx`
- Modify: `src/components/timetable/weekTimetable/WeekTimetable.tsx`

**Steps:**

1. `Timetable.tsx` — pass the existing `refresh` from `useTimeTableQuery` down:
   ```tsx
   <TimetableContainer
     data={data}
     timetable={timetable}
     teachers={teachersData}
     isLoading={isLoading || teachersIsLoading || !data}
     loadingComponent={() => <LoadingContainer />}
     onRetry={refresh}
   />
   ```
2. `TimetableContainer.tsx` — add `onRetry?: () => void;` to the props type, destructure it, and pass `onRetry={onRetry}` to **both** `<WeekTimetable ...>` and `<DayTimetable ...>`.
3. `DayTimetable.tsx` — add `onRetry?: () => void;` to the props type and replace the final fallback:
   ```tsx
   ) : (
     <View style={{ alignItems: 'center', gap: 8 }}>
       <CenteredText>Расписания нет</CenteredText>
       {onRetry && (
         <Button text='Обновить' onPress={onRetry} variant='card' />
       )}
     </View>
   )}
   ```
   Add imports: `import { Button } from '~/components/Button';` and `View` is already imported from `react-native`.
4. `WeekTimetable.tsx` — same change for its `<CenteredText>Нет расписания</CenteredText>` fallback (Button import: `~/components/Button`; `View` already imported).
5. Note: other screens using `TimetableContainer` (`unauthorizedStudent`, `unauthorizedTeacher`, `cathedraTimetable`, `audienceTimetable`) don't pass `onRetry` — the prop is optional, so they are unaffected.
6. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
7. Manual QA: enable airplane mode with an empty cache, open the timetable — "Расписания нет" plus an "Обновить" button appears; disabling airplane mode and pressing the button loads the timetable.
8. Commit: `git add -A && git commit -m "feat: add retry button to timetable empty states"`

### Task 8: Accessibility labels and hit areas for header buttons

**Objective:** The three header icon buttons are unlabeled and have ~24pt touch targets (Android guideline is 48dp).

**Files:**
- Modify: `src/components/timetable/buttons/ToggleModeButton.tsx`
- Modify: `src/components/timetable/buttons/BellScheduleButton.tsx`
- Modify: `src/components/timetable/buttons/DisciplineTasksButton.tsx`

**Steps:**

1. For each of the three `TouchableOpacity` wrappers add `accessibilityRole='button'`, an `accessibilityLabel`, and a `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`:
   - `ToggleModeButton.tsx`: label `Переключить вид расписания` (the icon already communicates state: menu = week view available, pause = day view).
   - `BellScheduleButton.tsx`: label `Расписание звонков`.
   - `DisciplineTasksButton.tsx`: label `Задания по дисциплинам`; when `tasks.length > 0` also add `accessibilityLabel={`Задания по дисциплинам, непрочитанных: ${tasks.length}`}`.
2. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
3. Manual QA: enable TalkBack, focus each header button — it announces the label and role.
4. Commit: `git add -A && git commit -m "feat: add accessibility labels and hit areas to timetable header buttons"`

### Task 9: Sync DayArray past-days visibility with the setting

**Objective:** `localShowPastWeekDays` is initialized once from the Redux setting; toggling the setting in Settings later has no effect until the component remounts.

**Files:**
- Modify: `src/components/timetable/weekTimetable/components/DayArray.tsx:21-22`

**Steps:**

1. Add `useEffect` to the React import (line 2): `import React, { useContext, useEffect, useState } from 'react';`
2. After the `useState` line add:
   ```ts
   useEffect(() => {
     setShowPastWeekDays(showPastWeekDays);
   }, [showPastWeekDays]);
   ```
3. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
4. Manual QA: in week view, turn Settings → "Показывать прошедшие дни" off and on, return to the timetable — past days hide/show without remount tricks.
5. Commit: `git add -A && git commit -m "fix: react to showPastWeekDays setting changes in week timetable"`

### Task 10: Keep content visible during week switches

**Objective:** Currently `isLoading` is true while a new week loads, so `DayTimetable`/`WeekTimetable` replace the whole timetable with the skeleton — a jarring flash on every week change. Show the full skeleton only when there is no data at all; otherwise keep showing the previous week until the new one arrives.

**Files:**
- Modify: `src/screens/etis/main/timetable/Timetable.tsx:55`

**Steps:**

1. Change the `isLoading` prop:
   ```tsx
   isLoading={!data && (isLoading || teachersIsLoading)}
   ```
2. Verify: `bun run lint && bunx tsc --noEmit` → exit 0.
3. Manual QA: on the timetable, tap the week-forward arrow repeatedly — the layout stays stable (old week remains until new data lands) instead of flashing the skeleton. First-ever load still shows the skeleton.
4. Commit: `git add -A && git commit -m "fix: avoid full skeleton flash when switching timetable weeks"`

### Task 11: Final review gates

**Objective:** Run the complete review checklist from AGENTS.md.

**Steps:**

1. `bun run lint` → exit 0, no output.
2. `bunx tsc --noEmit` → exit 0, no output.
3. `bunx expo-doctor` → expected: all checks pass (21/21). If any check fails, stop and report — do not hand off with unexplained failures.
4. `git status` → confirm only intended files changed; no stray files.
5. Commit if anything remains: `git add -A && git commit -m "chore: timetable ux pass"` (only if there are uncommitted changes).

---

## Risks, tradeoffs, and open questions

- **No test suite.** All verification is lint + tsc + manual QA on device. The manual QA steps above are the only behavioral checks — do not skip them if you can run a device/emulator.
- **Shared components.** `TimetableContainer`, `DayTimetable`, `WeekTimetable`, `useTimetable` are also used by the unauthorized-student, unauthorized-teacher, cathedra, and audience timetable screens. All new props are optional with backward-compatible defaults, but QA the teacher/cathedra timetable screens after Tasks 2, 4, and 7.
- **Task 4 default bounds.** `firstWeek = 1` / `lastWeek = Infinity` defaults preserve today's behavior for callers that don't pass bounds; only the day-mode calendar gets clamped. If `weekInfo.last` is ever `undefined` from the parser, `data?.weekInfo.last` passes `undefined` → falls back to `Infinity` → next arrow always shown (same as today, no regression).
- **Task 10 tradeoff.** Keeping stale content during a week switch means the user briefly sees the *previous* week labeled with the *new* week number in `WeekNavigation` (title comes from `selectedDate`, which updates immediately). This is the standard keep-previous-data pattern and was judged better than a skeleton flash. If it feels wrong in QA, revert just this task.
- **Open question — pair end time.** `Pair.tsx` hard-codes the end time as start + 1h35m, which is wrong for lyceum lessons (45 min) and ignores the actual bell schedule the app already has a screen for. Fixing it properly needs the bell-schedule data source wired into the parser/models — left out of this pass (YAGNI until requested).
- **Open question — `TimetablePages` swipe direction math.** `onPagePress(event.nativeEvent.position - dayNumber)` derives direction from pager position vs. the *current* day number; swiping quickly back and forth can race with the pending week load. Not observed failing in QA, but if reports of "wrong day after swipe" appear, that expression is the suspect.
