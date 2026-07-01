# TeamSync

Канбан-доска для управления задачами команды с аналитикой спринтов, drag-and-drop и командным профилем.

Деплой: https://teamsync-psi.vercel.app

## Стек

Next.js 15, TypeScript, Effector 23 + Farfetched 0.11 + TanStack React Query 5, NextAuth v5, Prisma 5 + Turso (SQLite), Tailwind CSS 3, @dnd-kit/core 6, Recharts 2, React Hook Form + Zod, Vitest + Testing Library + Playwright + MSW

## О проекте

### Проблема

Командам нужен простой и наглядный инструмент для трекинга задач в формате канбан, с возможностью планировать спринты и отслеживать метрики. Существующие решения либо платные, либо перегружены функциями.

### Решение

TeamSync — open-source канбан-дашборд с минимальным набором необходимых функций: создание и редактирование задач, перетаскивание между статусами, фильтрация, профили участников и аналитика спринта (burndown chart, распределение по статусам).

## Функциональность

- Drag-and-drop задач между колонками (BACKLOG → IN_PROGRESS → REVIEW → DONE)
- CRUD задач с приоритетами, story points, исполнителем
- Фильтрация по статусу, приоритету и текстовому поиску
- Управление спринтами и аналитика (burndown, распределение задач)
- Профили участников с аватаром, должностью, контактами
- Аутентификация (email/пароль) через NextAuth с JWT
- Адаптивная вёрстка (Tailwind CSS)

## Архитектура

Feature-Sliced Design (FSD): `shared → entities → features → widgets → app`. Публичные API моделей и компонентов — только через `index.ts`, обратные импорты запрещены.

Серверное состояние (мутации drag-drop) — TanStack React Query с оптимистичным обновлением. Клиентское состояние (фильтры, модалки, спринт) — Effector. Запросы данных — Farfetched с ручным обходом кэша через `__.lowLevelAPI.pushData` для мгновенного обновления доски после мутаций.

```
src/
├── app/            # Страницы Next.js и API-роуты
├── entities/       # Бизнес-сущности (task, sprint, user)
├── features/       # Пользовательские сценарии
├── shared/         # Общие утилиты, API-клиент, типы
├── widgets/        # Сложные UI-компоненты
└── tests/          # Интеграционные тесты
```

## Установка и запуск

```bash
git clone https://github.com/lina-whm/teamsync.git
cd teamsync
npm install
cp .env.example .env.local
npx prisma db push
npx prisma db seed
npm run dev
```

Демо-логин: `admin@teamsync.dev` / `password123`
