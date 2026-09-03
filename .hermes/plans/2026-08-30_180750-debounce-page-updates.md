# Добавление debounce при обновлениях страниц Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Предотвратить запуск нескольких параллельных загрузок при быстрых повторных обновлениях страниц и нажатиях на пагинацию, добавив единый debounce-механизм для обновления данных.

**Architecture:** Вынести debounce в переиспользуемый React-хук или локально обернуть публичные функции обновления в существующих query-хуках — после проверки всех call sites выбрать минимальное решение без изменения API экранов. Последний вызов должен выполняться после заданной задержки, а таймер очищаться при размонтировании компонента; уже начатые сетевые запросы не должны порождать дополнительные вызовы из-за быстрых действий пользователя.

**Tech Stack:** React Native, React hooks, TypeScript, `@tanstack/react-query`-совместимые внутренние хуки, ESLint/XO, Bun.

---

## Current context and assumptions

- Рабочая директория: `/home/ijo42/ETIS-mobile`.
- Релевантная общая точка для pull-to-refresh: `src/components/Screen.tsx`, где `Screen` и `ListScreen` вызывают `onUpdate` из `RefreshControl`.
- Универсальная загрузка данных находится в `src/hooks/useQuery.ts`: публичные `refresh`, `update` и внутренние `loadData` запускают запросы без debounce.
- Пагинация использует `src/components/PageNavigator.tsx` и передаёт callbacks в `src/hooks/useMessagesQuery.ts`, `src/screens/etis/main/messages/Announces.tsx`, а также timetable/rating flows.
- В проекте нет тестовой команды или существующего test suite; основной gate — `bun run lint`.
- На момент подготовки плана рабочее дерево уже содержит пользовательские изменения: `app.config.js` modified и `gradle.properties` staged. Их нельзя затронуть или коммитить.
- Рабочее предположение: запрос означает debounce быстрых обновлений страниц приложения, прежде всего pagination/refresh, а не debounce текстового поиска. На этапе реализации проверить историю задачи/ожидаемый UX и при необходимости сузить scope.

## Proposed approach

1. Точно определить, какие callbacks считаются «обновлениями страниц»: pull-to-refresh, переходы по `PageNavigator`, смена недели/семестра и повторные `useQuery.update`.
2. Выбрать одну центральную точку, предпочтительно `useQuery`, если debounce должен покрывать все query-backed экраны; не debounce-ить низкоуровневый HTTP-клиент, чтобы не задерживать независимые операции и не менять семантику upload/reply.
3. Сохранить совместимость существующих callback signatures (`refresh`/`update`/`loadPage`) и корректно очищать таймеры.
4. Добавить минимальные unit-тесты только если в репозитории появится/уже существует поддерживаемая тестовая инфраструктура; иначе провести проверку через lint и статический review, не добавляя новую тестовую зависимость ради одного изменения.

## Detailed implementation tasks

### Task 1: Уточнить поведение и состав call sites

**Objective:** Зафиксировать все пользовательские пути, которые должны быть защищены debounce, и не изменить несвязанные операции.

**Files:**
- Inspect: `src/hooks/useQuery.ts`
- Inspect: `src/components/Screen.tsx`
- Inspect: `src/components/PageNavigator.tsx`
- Inspect: `src/hooks/useMessagesQuery.ts`
- Inspect: `src/hooks/useRatingQuery.ts`
- Inspect: `src/components/timetable/weekTimetable/WeekTimetable.tsx`
- Inspect: all `onUpdate`, `refresh`, `update`, `onPageChange` usages under `src/`

**Steps:**
1. Построить таблицу вызовов: источник события → callback → query method → сетевой метод.
2. Проверить, вызывается ли `refresh` несколько раз до завершения первого запроса и нужны ли отдельные debounce для refresh и page selection.
3. Определить задержку (ориентир: 300–500 ms) и семантику: trailing-only либо leading + trailing. Для переключения страниц обычно нужен trailing-only, чтобы запрос выполнялся только для последней выбранной страницы.
4. Проверить, что `onUpdate` может быть `undefined`, а некоторые callbacks возвращают `void`, тогда как загрузка асинхронна.

**Verification:** документация задачи должна явно описывать выбранный scope, задержку и поведение при unmount.

### Task 2: Добавить переиспользуемый debounce-механизм

**Objective:** Реализовать типобезопасную обёртку callback, которая отменяет предыдущий отложенный вызов и очищает timer при unmount.

**Files:**
- Create or modify: `src/hooks/useDebounce.ts` (если в проекте нет подходящего хука)
- Modify: `src/hooks/index.ts` only if hooks are barrel-exported there

**Steps:**
1. Сначала проверить существующие hooks и conventions для timer/cleanup; не создавать дубликат.
2. Реализовать API, поддерживающий callbacks с аргументами, например `useDebounce<T extends (...args: any[]) => void>(callback, delay): T` или эквивалентный проектный стиль.
3. Хранить актуальный callback в ref, чтобы не сбрасывать timer из-за изменения identity функции на каждом render.
4. Использовать `ReturnType<typeof setTimeout>` и cleanup в `useEffect`; не использовать browser-only тип `NodeJS.Timeout` в React Native-коде.
5. Если требуется отмена pending вызова при смене экрана, предусмотреть `cancel`, но не добавлять API без потребности call sites.

**Verification:** `bun run lint` на новом hook; проверить отсутствие stale closure и timer после unmount.

### Task 3: Подключить debounce к центральным обновлениям данных

**Objective:** Применить debounce к query-backed refresh/update paths с минимальным изменением экранов.

**Files:**
- Modify: `src/hooks/useQuery.ts`
- Possibly modify: `src/components/Screen.tsx` only if UX requires защиты самого refresh gesture callback
- Possibly modify: `src/hooks/useMessagesQuery.ts`, `src/hooks/useRatingQuery.ts`, timetable query hooks only if central `useQuery` cannot distinguish page changes from refresh

**Steps:**
1. Не менять прямые HTTP-вызовы вроде отправки ответа и загрузки файлов в `MessageHistory.tsx`.
2. Если scope общий для всех query updates, debounce публичного `refresh`/`update` в `useQuery` должен принимать последний payload, включая номер страницы/неделю/семестр.
3. Сохранить немедленную initial load; debounce должен применяться только к пользовательским повторным обновлениям.
4. Не допустить, чтобы старый `update` payload был прочитан из mutable ref после нового вызова; timer должен замыкать последний payload или явно хранить его в ref.
5. Не включать loading indicator до фактического выполнения trailing callback, иначе UI будет показывать загрузку на каждый отменённый клик.
6. Если `refresh` ожидается `await`-able в `Screen`, согласовать Promise semantics: либо debounce wrapper возвращает Promise, resolve/reject которого относятся к последнему вызову, либо оставить callback fire-and-forget и не создавать ложное ожидание. Проверить существующие типы и фактическое использование прежде чем выбирать вариант.
7. Для `PageNavigator` проверить, что быстрые клики по страницам не оставляют активной старую страницу навсегда и что UI отражает только реально загруженные данные.

**Verification:** вручную проследить цепочку page click/pull-to-refresh и убедиться, что за debounce window выполняется максимум один актуальный query call.

### Task 4: Добавить проверяемый regression coverage

**Objective:** Проверить trailing behavior, payload replacement, unmount cleanup и отсутствие регрессий существующих экранов.

**Files:**
- Test: existing test location if present (discover first)
- Possibly create: `src/hooks/__tests__/useDebounce.test.ts` only if test runner/dependencies already supported

**Steps:**
1. Проверить package scripts и lockfile на наличие Jest/Vitest/Expo test runner; не добавлять новый runner только для этого.
2. Если runner существует, добавить тесты: несколько вызовов подряд → один вызов с последними аргументами; вызов после delay; cleanup при unmount; актуальный callback.
3. Если runner отсутствует, добавить no test dependency и выполнить lint плюс targeted source inspection; при необходимости описать manual verification steps для Android/Expo.
4. Проверить, что TypeScript-типы callbacks совместимы с текущими `ScreenProps`, query hooks и page navigation.

**Expected:** существующий test runner проходит; либо явно зафиксировано, что automated tests отсутствуют и выполнены доступные проверки.

### Task 5: Финальная верификация и review diff

**Objective:** Убедиться, что изменение ограничено debounce поведения и не затрагивает пользовательские незакоммиченные изменения.

**Files:**
- Inspect all changed files

**Steps:**
1. Запустить `bun run lint`.
2. Запустить `bun run format` только если это принято для проверки и затем проверить diff; не позволить formatter затронуть unrelated files.
3. Выполнить `git diff --check` и `git status --short`.
4. Просмотреть `git diff -- src/hooks src/components` и проверить, что `app.config.js` и staged `gradle.properties` не изменены реализацией.
5. Если доступен Android/dev client, вручную проверить: быстрые переходы по страницам, pull-to-refresh, смену недели/семестра и уход со screen во время задержки.
6. Не делать commit/push без отдельной просьбы пользователя.

## Files likely to change

- `src/hooks/useQuery.ts` — наиболее вероятная центральная интеграция.
- `src/hooks/useDebounce.ts` или существующий timer hook — reusable implementation, только если действительно нужен.
- `src/components/Screen.tsx` — только если debounce должен находиться на уровне refresh control.
- `src/hooks/useMessagesQuery.ts` and/or page-specific hooks — только при необходимости различить pagination и refresh.
- Existing tests under `src/` — только если test infrastructure уже есть.

## Risks, tradeoffs, and open questions

- Слишком общий debounce в `useQuery` может задержать ожидаемые действия, например смену страницы или восстановление после auth; initial load и auth-triggered loads должны остаться немедленными.
- Debounce не отменяет уже выполняющийся HTTP-запрос. Если нужна именно дедупликация/in-flight cancellation, это отдельная задача с AbortController/request identity.
- `Screen` сейчас делает `await onUpdate()`, хотя тип `onUpdate` допускает `unknown`; изменение Promise semantics может повлиять на индикатор refresh.
- `PageNavigator` использует локальное состояние `pages` и эффекты с неполными dependency arrays; не смешивать исправления пагинации с debounce без отдельного требования.
- Неясно, относится ли «обновления страниц» только к кнопкам `PageNavigator` или ко всем refresh/update callbacks. Перед реализацией нужно подтвердить по ожидаемому сценарию или выбрать общий query refresh scope с минимальным UX-риском.

## Validation checklist

- [ ] Быстрые повторные refresh приводят максимум к одному запросу после debounce delay.
- [ ] Быстрые page changes загружают только последнюю выбранную страницу.
- [ ] Initial load не задержан.
- [ ] Timer очищается при unmount.
- [ ] Несвязанные HTTP operations не debounce-ятся.
- [ ] `bun run lint` проходит.
- [ ] `git diff --check` проходит.
- [ ] Предсуществующие изменения в `app.config.js` и `gradle.properties` сохранены.
