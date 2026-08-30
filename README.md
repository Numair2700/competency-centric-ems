# Competency-Centric EMS

An Educational Management System that maps Pearson BTEC HND Computing academic grades against the **SFIA** professional-competency framework and visualises the result as a radar chart. It has two roles: an **administrator** who manages units, SFIA skills, unit-to-skill mappings, students and grades and generates competency profiles, and a **student** who views their own units, grade progress and competency profile (read-only).

**Stack:** Laravel 13 (PHP 8.3+) · React 19 + TypeScript · Inertia.js v3 · MySQL · Chart.js · Tailwind CSS · served locally with Laravel Herd.

## Requirements

- PHP 8.3+, Composer
- Node.js and npm
- MySQL
- (Recommended) [Laravel Herd](https://herd.laravel.com/), which serves the site at `https://competency-centric-ems.test`

## Getting started

```bash
# 1. Install dependencies
composer install
npm install

# 2. Create the environment file and app key
cp .env.example .env
php artisan key:generate
# then set DB_CONNECTION=mysql and your database name / user / password in .env

# 3. Create the schema and load the seed data
php artisan migrate --seed

# 4. Start the dev servers (PHP server, queue listener, Vite)
composer run dev
```

Steps 1–3 are also wrapped in a single convenience script:

```bash
composer run setup
```

With Herd, the app is available at `https://competency-centric-ems.test`. Without Herd, run `php artisan serve` alongside `npm run dev`.

### Seeded accounts

The seeder loads one BTEC programme, six courses, 54 academic units, 24 SFIA skills with their responsibility levels, the full 54-row unit-to-skill mapping catalogue, and eight simulated students with grades.

- **Administrator:** `admin@ems.test`
- **Students:** `student1@ems.test` … `student8@ems.test`

All seeded accounts use the password **`password`**. Role is detected automatically on login, so the same screen serves both.

## Project structure (where the key logic lives)

- **Calculation engine** — [`app/Services/CalculationEngine.php`](app/Services/CalculationEngine.php): the stateless weighted-scoring service. For each SFIA skill it sums `credit × grade weight × mapping weight`, then normalises against the maximum possible score to produce the percentage plotted on the radar chart.
- **Grade weights** — [`app/Models/GradeRecord.php`](app/Models/GradeRecord.php): the `GRADE_WEIGHTS` constant (Pass = 0.5, Merit = 0.75, Distinction = 1.0).
- **Unit → SFIA mapping** — the `UnitSkillMapping` model and `unit_skill_mappings` table join an academic unit to an SFIA skill at a specific responsibility level; this is the relationship the engine reads.
- **Controllers** — `app/Http/Controllers/Admin/` (admin CRUD, grade entry, profile generation) and `app/Http/Controllers/Student/` + `DashboardController` (read-only student views).
- **Models** — `app/Models/` (User, Student, Programme, Course, AcademicUnit, GradeRecord, SfiaSkill, SfiaLevel, UnitSkillMapping, CompetencyProfile, CompetencyScore).
- **Views** — `resources/js/pages/` (Inertia + React pages, one per screen).
- **Routes** — `routes/web.php`, `routes/admin.php`, `routes/student.php` (role-based middleware protects the admin routes).
- **Database** — `database/migrations/` (schema) and `database/seeders/DatabaseSeeder.php` (the reference data and simulated students).

## Testing

The project has 76 automated tests (Pest/PHPUnit) covering the calculation engine, grade validation, admin CRUD, role-based access, and profile generation. Run them with:

```bash
php artisan test
```

Tests run against an isolated in-memory SQLite database, so they never touch your development data.

## Building for production

```bash
npm run build
```
