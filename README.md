# TeamSync

**Канбан-доска для командного трекинга задач с аналитикой спринтов и drag-and-drop.**

![Next.js](https://img.shields.io/badge/Next.js-15.5-000?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Turso](https://img.shields.io/badge/Turso-libSQL-4FC08D?logo=sqlite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![Effector](https://img.shields.io/badge/Effector-23-FF6B6B)
![License](https://img.shields.io/badge/License-MIT-green)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)

---

> **🌐 Деплой:** [teamsync-psi.vercel.app](https://teamsync-psi.vercel.app)  
> **🔑 Демо:** `admin@teamsync.dev` / `password123`

## Оглавление

- [Описание проекта](#описание-проекта)
- [Основные возможности](#основные-возможности)
- [Архитектура проекта](#архитектура-проекта)
- [Технологии](#технологии)
- [Установка и настройка](#установка-и-настройка)
- [Переменные окружения](#переменные-окружения)
- [Тестирование](#тестирование)
- [Деплой](#деплой)
- [Roadmap](#roadmap)

---

## Описание проекта

### Проблема

Командам нужен простой и наглядный инструмент для трекинга задач в формате канбан — с возможностью планировать спринты, отслеживать метрики и работать совместно. Существующие решения либо платные, либо перегружены функциями.

### Решение

TeamSync — open-source канбан-дашборд для небольших команд. Задачи перетаскиваются между колонками, спринты отслеживаются через burndown-чарт, а профили участников хранят контакты и аватарки. Всё работает на серверной SQLite (Turso), быстро и бесплатно.

---

## Основные возможности

- **🔄 Drag-and-drop** — задачи перетаскиваются между статусами: BACKLOG → IN_PROGRESS → REVIEW → DONE
- **📋 CRUD задач** — создание, редактирование, удаление с приоритетами (CRITICAL/HIGH/MEDIUM/LOW), story points и исполнителем
- **🔍 Фильтрация** — по статусу, приоритету и текстовому поиску с дебаунсом
- **📊 Спринты и аналитика** — burndown-чарт, распределение задач по статусам, общая статистика
- **👤 Профили участников** — аватар, должность, отдел, город, рабочие контакты
- **🔐 Аутентификация** — вход по email/паролю через NextAuth с JWT
- **🎨 Современный UI** — Tailwind CSS, тёмные тени, hover-эффекты, адаптивная вёрстка

---

## Архитектура проекта

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Kanban   │  │ Analytics│  │ Team     │       │
│  │ Board    │  │ Dashboard│  │ Profiles │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │
│  ┌────▼─────────────▼─────────────▼──────────┐  │
│  │          API Routes (Next.js)             │  │
│  │  /api/tasks  /api/sprints  /api/users     │  │
│  │  /api/auth/[...nextauth]                  │  │
│  └────────────────────┬──────────────────────┘  │
└───────────────────────┼─────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────┐
│              Turso (libSQL, облачная SQLite)     │
│  ┌────────────────────────────────────────────┐  │
│  │  Prisma 5 + @prisma/adapter-libsql         │  │
│  │  teamsync-lina-whm (EU West)               │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Управление состоянием

| Слой | Технология | Где используется |
|------|-----------|-----------------|
| **Серверное состояние** (запросы данных) | Farfetched 0.11 | Загрузка задач, спринтов, пользователей |
| **Клиентское состояние** (интерфейс) | Effector 23 | Фильтры, модалки, активный спринт |
| **Мутации** (drag-drop) | TanStack React Query 5 | Оптимистичное обновление позиции задачи |

### Ключевые модули

| Модуль | Путь | Описание |
|--------|------|----------|
| **Виджеты** | `widgets/` | KanbanBoard, SprintAnalytics, TaskDetail, Sidebar |
| **Фичи** | `features/` | Создание/редактирование задач, фильтрация, профиль |
| **Сущности** | `entities/` | Модели Task, Sprint, User и их API |
| **Shared** | `shared/` | UI-кит, API-клиент, утилиты, типы |
| **API Routes** | `app/api/` | REST-эндпоинты задач, спринтов, пользователей |

Feature-Sliced Design: `shared → entities → features → widgets → app`. Публичные API только через `index.ts`, обратные импорты запрещены. Server Components по умолчанию, `"use client"` только для effector-сторов и браузерных событий.

---

## Технологии

### Frontend
- **Next.js 15.5** (App Router) — фреймворк
- **React 19** — UI
- **TypeScript 5.6** — типизация
- **Tailwind CSS 3.4** — стилизация
- **Effector 23** + **effector-react** — клиентское состояние
- **Farfetched 0.11** — декларативные запросы
- **TanStack React Query 5** — мутации с оптимистичным обновлением
- **React Hook Form** + **Zod** — формы и валидация
- **Recharts 2** — графики
- **Lucide React** — иконки
- **@dnd-kit/core 6** — drag-and-drop

### Backend
- **Next.js API Routes** — серверные эндпоинты
- **Prisma 5** — ORM
- **Turso (libSQL)** — облачная SQLite (бесплатно, 9 ГБ)
- **NextAuth v5 beta** — аутентификация (Credentials)
- **bcryptjs** — хеширование паролей

### Тестирование
- **Vitest** — unit/integration-тесты
- **MSW v2** — моки API
- **Testing Library** — тестирование React-компонентов
- **Playwright** — E2E-тесты

### Инфраструктура
- **GitHub Actions** — CI/CD (lint → test → build)
- **Vercel** — деплой

---

## Установка и настройка

### 1. Клонирование

```bash
git clone https://github.com/lina-whm/teamsync.git
cd teamsync
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Переменные окружения

```bash
cp .env.example .env.local
```

Подробнее — в разделе [Переменные окружения](#переменные-окружения).

### 4. Генерация Prisma Client

```bash
npx prisma generate
```

### 5. Настройка локальной базы

Для локальной разработки используется SQLite — никакой внешней БД не нужно:

```bash
npx prisma db push
npm run db:seed
```

### 6. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# === Локальная разработка (SQLite) ===
TURSO_DATABASE_URL="file:./dev.db"

# === Vercel / Turso ===
# TURSO_DATABASE_URL="libsql://[ваша-база].turso.io"
# TURSO_AUTH_TOKEN="[ваш-токен]"

# === NextAuth ===
AUTH_SECRET="[ВАШ_SECRET_МИНИМУМ_32_СИМВОЛА]"
AUTH_URL="http://localhost:3000"
```

> **Важно:** Никогда не коммитьте `.env.local` в репозиторий. Он уже добавлен в `.gitignore`.

---

## Тестирование

### Unit и интеграционные тесты (Vitest + MSW)

```bash
# Запустить все тесты
npm test

# С покрытием
npm run test:coverage

# Режим watch
npm run test:watch
```

Все API-запросы перехватываются MSW v2. Фикстуры — в `src/tests/mocks/fixtures/`.

**Текущие тесты:**

| Модуль | Файл | Тестов |
|--------|------|--------|
| CreateTask | `src/tests/integration/create-task.test.tsx` | 3 |
| FilterTasks | `src/tests/integration/filter-tasks.test.tsx` | 3 |
| KanbanBoard | `src/tests/integration/kanban-drag.test.tsx` | 1 |
| **Всего** | | **7** |

### E2E (Playwright)

```bash
# Запустить E2E-тесты
npm run test:e2e

# С UI Playwright
npm run test:e2e:ui
```

**Сценарии:**

- `auth.spec.ts` — вход, выход, защита маршрутов
- `board.spec.ts` — отображение досок, карточек, колонок
- `create-task.spec.ts` — создание задачи через модалку

Для E2E используется фикстура `auth.fixture.ts`, которая автоматически логинится как admin.

---

## Git-workflow

### Ветки

| Ветка | Назначение |
|-------|-----------|
| `main` | Production-ready код. Деплоится на Vercel автоматически. Мёрджи только из `develop` через PR. |
| `develop` | Основная ветка разработки. Все фичи вливаются сюда. |
| `feature/*` | Ветки для новых фич. Создаются от `develop`, мерджатся обратно через PR. |

### Процесс

```bash
# 1. Создать feature-ветку от develop
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# 2. Работать, коммитить
git add -A
git commit -m "feat: добавила аналитику по статусам"

# 3. Создать PR в develop через GitHub
#    В названии PR — кратко о чём фича

# 4. После ревью и мёрджа — удалить feature-ветку
git branch -d feature/my-feature
```

### Коммиты

Формат: `type: описание в настоящем времени`

- `feat:` — новая функциональность
- `fix:` — исправление бага
- `docs:` — документация
- `refactor:` — рефакторинг без изменения поведения
- `test:` — добавление или изменение тестов
- `chore:` — обслуживание (зависимости, CI, конфиги)

Примеры:
```
feat: добавила patronum debounce для поиска
fix: исключила e2e/ из линтинга ESLint
docs: переписала README на русском
```

---

## Деплой

### Vercel (рекомендуется)

Проект задеплоен на **Vercel**: [teamsync-psi.vercel.app](https://teamsync-psi.vercel.app)

При пуше в main деплой происходит автоматически через Vercel Git Integration.

#### 1. Создайте базу Turso

```bash
npm install -g turso
turso auth login
turso db create teamsync
turso db show teamsync --url        # → TURSO_DATABASE_URL
turso db tokens create teamsync     # → TURSO_AUTH_TOKEN
```

#### 2. Залейте схему и данные

```bash
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx tsx prisma/push-turso.ts
TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx tsx prisma/seed-turso.ts
```

#### 3. Добавьте переменные в Vercel

| Переменная | Значение |
|-----------|---------|
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | ваш Turso-токен |
| `AUTH_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `AUTH_URL` | `https://your-app.vercel.app` |

#### 4. Задеплойте

```bash
npx vercel --prod
```

---

## Roadmap

- [x] Drag-and-drop задач между колонками
- [x] CRUD задач с приоритетами и исполнителем
- [x] Фильтрация и поиск
- [x] Аналитика спринта (burndown, распределение)
- [x] Профили команды с аватарами
- [x] Аутентификация (email/пароль)
- [x] Интеграционные и E2E-тесты
- [x] CI/CD и деплой на Vercel
- [ ] Уведомления об изменениях задач
- [ ] Импорт/экспорт задач (CSV)
- [ ] Комментарии к задачам
- [ ] История изменений (activity log)
- [ ] Роли и права доступа
