# Academic CRUD (Next.js + Turso/SQLite + Vercel)

A full CRUD for Students and Teachers built with Next.js (App Router) and TypeScript. Data is stored in a Turso (SQLite/libSQL) database, and the app is deployable on Vercel.

## Features

- Students: create, read, update, soft-delete
- Teachers: create, read, update, soft-delete
- Clean UI components (buttons, dialogs, inputs, tables)
- Real API routes backed by Turso (no dummy data)

## Tech Stack

- Next.js 13+ (App Router) + TypeScript
- Turso (libSQL/SQLite) as the database
- `@libsql/client` for DB access
- Vercel for hosting

## Project Structure

- `app/` — Next.js entry, layout, and main page
- `app/api/estudiantes` — Students API routes (`GET/POST`, `GET/PUT/DELETE :id`)
- `app/api/maestros` — Teachers API routes (`GET/POST`, `GET/PUT/DELETE :id`)
- `components/` — Feature components (`students-list.tsx`, `teachers-list.tsx`, `dashboard.tsx`, `sidebar.tsx`)
- `components/ui/` — Reusable UI primitives (button, dialog, input, label, table, card)
- `lib/db.ts` — Turso client
- `lib/utils.ts` — helpers

## Database Schema

Use the following schema in your Turso database (via CLI shell or dashboard):

```sql
-- Students table
CREATE TABLE IF NOT EXISTS estudiantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    edad INTEGER,
    grado VARCHAR(50),
    fecha_ingreso DATE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo INTEGER DEFAULT 1
);

-- Teachers table
CREATE TABLE IF NOT EXISTS maestros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    fecha_contratacion DATE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo INTEGER DEFAULT 1
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_estudiantes_email ON estudiantes(email);
CREATE INDEX IF NOT EXISTS idx_estudiantes_grado ON estudiantes(grado);
CREATE INDEX IF NOT EXISTS idx_maestros_email ON maestros(email);
CREATE INDEX IF NOT EXISTS idx_maestros_especialidad ON maestros(especialidad);
```

## Environment Variables

Create `.env.local` in the project root:

```env
TURSO_DATABASE_URL=libsql://<your-db-url>
TURSO_AUTH_TOKEN=<your-auth-token>
```

Alternatively, the client also supports:

```env
LIBSQL_URL=libsql://<your-db-url>
LIBSQL_AUTH_TOKEN=<your-auth-token>
```

Do not commit secrets. Ensure `.env.local` is ignored by Git.

## Turso Client

`lib/db.ts` initializes the shared client:

```ts
import { createClient } from "@libsql/client"

const url = process.env.TURSO_DATABASE_URL || process.env.LIBSQL_URL
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN

if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL or LIBSQL_URL environment variable")
}

export const db = createClient({ url, authToken })
```

## API Endpoints

Students (`estudiantes`):
- `GET /api/estudiantes` — list active students
- `POST /api/estudiantes` — create student
- `GET /api/estudiantes/:id` — get student by id
- `PUT /api/estudiantes/:id` — update student
- `DELETE /api/estudiantes/:id` — soft-delete (sets `activo = 0`)

Teachers (`maestros`):
- `GET /api/maestros` — list active teachers
- `POST /api/maestros` — create teacher
- `GET /api/maestros/:id` — get teacher by id
- `PUT /api/maestros/:id` — update teacher
- `DELETE /api/maestros/:id` — soft-delete (sets `activo = 0`)

Response field mapping (for UI):
- `fecha_ingreso` → `fechaIngreso`
- `fecha_contratacion` → `fechaContratacion`
- `id` is returned as a string for UI consistency

## Frontend Integration

- `app/page.tsx` fetches data on mount from `/api/estudiantes` and `/api/maestros` and populates the lists.
- `components/students-list.tsx` and `components/teachers-list.tsx` submit forms via `POST/PUT`, and deletions via `DELETE` to the API.

## Local Development

1) Install dependencies:

```bash
npm install
```

If not present, install the Turso client:

```bash
npm install @libsql/client
```

2) Run the dev server:

```bash
npm run dev
```

Open the local URL printed in the terminal (e.g., `http://localhost:3000` or alternative port if 3000 is busy).

## Troubleshooting

- DB connection errors: verify the URL and token in `.env.local` and the Vercel project settings.
- Unique constraint errors: ensure `email` is unique for both tables.
- Empty lists: confirm tables are created and `activo = 1` rows exist.

## Notes

- UI components live under `components/ui/` and are reused across forms and tables.
- Migrations can start from the SQL above; for more complex workflows, consider adding a tool (e.g., drizzle-kit or Prisma with libSQL).

