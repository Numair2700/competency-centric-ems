<?php

namespace Database\Seeders;

use App\Models\AcademicUnit;
use App\Models\GradeRecord;
use App\Models\Pathway;
use App\Models\Programme;
use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use App\Models\Student;
use App\Models\UnitSkillMapping;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * SFIA 9 skills used by the mapping catalogue (master context §23.1,
     * codes verified against the live SFIA 9 directory on 3 July 2026).
     *
     * @var array<string, string>
     */
    private const SFIA_SKILLS = [
        'PROG' => 'Programming/software development',
        'NTDS' => 'Network design',
        'PDSV' => 'Professional development',
        'DBDS' => 'Database design',
        'SCTY' => 'Information security',
        'PRMG' => 'Project management',
        'SLEN' => 'Systems and software life cycle engineering',
        'DAAN' => 'Data analytics',
        'DESN' => 'Systems design',
        'STPL' => 'Enterprise and business architecture',
        'BUSA' => 'Business situation analysis',
        'MLNG' => 'Machine learning',
        'BPRE' => 'Business process improvement',
        'TEST' => 'Testing',
        'DTAN' => 'Data modelling and design',
        'HCEV' => 'User experience design',
        'ARCH' => 'Solution architecture',
        'NTAS' => 'Network support',
        'DBAD' => 'Database administration',
        'EMRG' => 'Emerging technology monitoring',
        'SINT' => 'Systems integration and build',
        'SUST' => 'Sustainability',
        'CIPM' => 'Organisational change management',
        'DGFS' => 'Digital forensics',
    ];

    /**
     * SFIA levels of responsibility (SFIA Foundation, 2024).
     *
     * @var array<int, string>
     */
    private const SFIA_LEVEL_DESCRIPTIONS = [
        1 => 'Follow — routine tasks under close supervision',
        2 => 'Assist — routine supervision, discretion on routine problems',
        3 => 'Apply — general direction, discretion on complex issues',
        4 => 'Enable — broad direction, autonomy, supervises others',
        5 => 'Ensure, advise — authoritative guidance, accountable for significant outcomes',
        6 => 'Initiate, influence — significant organisational influence, shapes policy',
        7 => 'Set strategy, inspire, mobilise — highest organisational level',
    ];

    /**
     * The unit-to-SFIA mapping catalogue (master context §23.1): every Pearson
     * BTEC HN Computing unit (Pearson, 2023, Issue 4) with its SFIA mapping.
     * Unit 16 carries no mapping — documented scoping decision (research
     * methodology, not a technical SFIA skill).
     *
     * Format: unit number => [title, credits, RQF level, [[skill code, SFIA level], ...]]
     *
     * @var array<int, array{0: string, 1: int, 2: string, 3: array<int, array{0: string, 1: int}>}>
     */
    private const UNIT_CATALOGUE = [
        1 => ['Programming', 15, '4', [['PROG', 2]]],
        2 => ['Networking', 15, '4', [['NTDS', 3]]],
        3 => ['Professional Practice', 15, '4', [['PDSV', 3]]],
        4 => ['Database Design & Development', 15, '4', [['DBDS', 3]]],
        5 => ['Security', 15, '4', [['SCTY', 3]]],
        6 => ['Planning a Computing Project', 15, '4', [['PRMG', 4]]],
        7 => ['Software Development Lifecycles', 15, '4', [['SLEN', 4]]],
        8 => ['Data Analytics', 15, '4', [['DAAN', 3]]],
        9 => ['Computer Systems Architecture', 15, '4', [['DESN', 3]]],
        10 => ['Cyber Security', 15, '4', [['SCTY', 3]]],
        11 => ['Strategic Information Systems', 15, '4', [['STPL', 3]]],
        12 => ['Management in the Digital Economy', 15, '4', [['BUSA', 3]]],
        13 => ['Website Design & Development', 15, '4', [['PROG', 3]]],
        14 => ['Maths for Computing', 15, '4', [['PROG', 2]]],
        15 => ['Fundamentals of AI & Intelligent Systems', 15, '4', [['MLNG', 3]]],
        16 => ['Computing Research Project', 30, '5', []],
        17 => ['Business Process Support', 15, '5', [['BPRE', 4]]],
        18 => ['Discrete Maths', 15, '5', [['PROG', 3]]],
        19 => ['Data Structures & Algorithms', 15, '5', [['PROG', 4]]],
        20 => ['Applied Programming and Design Principles', 15, '5', [['PROG', 4]]],
        21 => ['Application Program Interfaces', 15, '5', [['PROG', 4]]],
        22 => ['Application Development', 15, '5', [['PROG', 4]]],
        23 => ['Risk Analysis & Systems Testing', 15, '5', [['TEST', 4]]],
        24 => ['Advanced Programming for Data Analysis', 15, '5', [['PROG', 4]]],
        25 => ['Machine Learning', 15, '5', [['MLNG', 4]]],
        26 => ['Big Data Analytics and Visualisation', 15, '5', [['DAAN', 4]]],
        27 => ['Transport Network Design', 15, '5', [['NTDS', 4]]],
        28 => ['Cloud Computing', 15, '5', [['DESN', 4], ['SCTY', 4]]],
        29 => ['Network Security', 15, '5', [['SCTY', 4]]],
        30 => ['Applied Cryptography in the Cloud', 15, '5', [['SCTY', 4]]],
        31 => ['Forensics', 15, '5', [['DGFS', 4]]],
        32 => ['Information Security Management', 15, '5', [['SCTY', 5]]],
        33 => ['Applied Analytical Models', 15, '5', [['DTAN', 4]]],
        34 => ['Analytical Methods', 15, '5', [['DTAN', 3]]],
        35 => ['Systems Analysis & Design', 15, '5', [['DESN', 4]]],
        36 => ['User Experience and Interface Design', 15, '5', [['HCEV', 4]]],
        37 => ['Architecture', 15, '5', [['ARCH', 4]]],
        38 => ['Analytic Architecture Design', 15, '5', [['ARCH', 4]]],
        39 => ['Network Management', 15, '5', [['NTAS', 4]]],
        40 => ['Client/Server Computing Systems', 15, '5', [['DESN', 4]]],
        41 => ['Database Management Systems', 15, '5', [['DBAD', 4]]],
        42 => ['Game Design Theory', 15, '5', [['PROG', 3]]],
        43 => ['Games Development', 15, '5', [['PROG', 4]]],
        44 => ['Games Engine & Scripting', 15, '5', [['PROG', 4]]],
        45 => ['Internet of Things', 15, '5', [['DESN', 4]]],
        46 => ['Robotics', 15, '5', [['DESN', 4]]],
        47 => ['Emerging Technologies', 15, '5', [['EMRG', 4]]],
        48 => ['Virtual & Augmented Reality Development', 15, '5', [['PROG', 4]]],
        49 => ['Systems Integration', 15, '5', [['SINT', 4]]],
        50 => ['Operating Systems', 15, '5', [['DESN', 4]]],
        51 => ['E-Commerce & Strategy', 15, '5', [['BUSA', 4]]],
        52 => ['Digital Sustainability', 15, '5', [['SUST', 4]]],
        53 => ['Digital Technology as a Catalyst for Change', 15, '5', [['CIPM', 4]]],
        54 => ['Prototyping', 15, '5', [['PROG', 3]]],
    ];

    /**
     * Units shared by every pathway (master context §22.1a): Units 1-6 are
     * core at Level 4 across all pathways, Units 16-17 are core at Level 5.
     *
     * @var array<int, int>
     */
    private const CORE_UNITS = [1, 2, 3, 4, 5, 6, 16, 17];

    /**
     * Pathway definitions (Pearson, 2023, Issue 4, §22.1a): each pathway's
     * mandatory Level 4 specialist unit, mandatory Level 5 specialist group,
     * and the optional-bank units offered on that pathway. Core units
     * (self::CORE_UNITS) are attached to every pathway automatically.
     *
     * @var array<string, array{specialist_l4: int, specialist_l5: array<int, int>, optional: array<int, int>}>
     */
    private const PATHWAYS = [
        'General' => ['specialist_l4' => 7, 'specialist_l5' => [], 'optional' => [35, 37, 40, 50]],
        'Software Engineering' => ['specialist_l4' => 7, 'specialist_l5' => [18, 19, 20], 'optional' => [13, 14, 15, 35, 36, 37, 49, 50, 54]],
        'Application Development & Testing' => ['specialist_l4' => 7, 'specialist_l5' => [21, 22, 23], 'optional' => [13]],
        'Data Analytics' => ['specialist_l4' => 8, 'specialist_l5' => [24, 25, 26], 'optional' => [14, 33, 34]],
        'Network Engineering' => ['specialist_l4' => 9, 'specialist_l5' => [27, 28, 29], 'optional' => [39]],
        'Cyber Security' => ['specialist_l4' => 10, 'specialist_l5' => [30, 31, 32], 'optional' => [15, 39, 47]],
    ];

    /**
     * Simulated students (FR19): unit sets follow real Pearson pathway rules
     * and stay within their pathway's available units. Students 5 and 6 are
     * deliberately incomplete to exercise the incomplete-grade warning.
     *
     * @var array<int, array{name: string, pathway: string, units: array<int, int>, skip_last: int}>
     */
    private const SIMULATED_STUDENTS = [
        ['name' => 'Aisha Rahman', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 13, 16, 17, 18, 19, 20, 35, 36], 'skip_last' => 0],
        ['name' => 'Omar Haddad', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 14, 16, 17, 18, 19, 20, 35, 49], 'skip_last' => 0],
        ['name' => 'Layla Nasser', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 13, 16, 17, 18, 19, 20, 36, 54], 'skip_last' => 0],
        ['name' => 'Yousef Karim', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18, 19, 20, 37, 50], 'skip_last' => 0],
        ['name' => 'Fatima Zahra', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 13, 16, 17, 18, 19, 20, 35, 36], 'skip_last' => 4],
        ['name' => 'Hassan Ali', 'pathway' => 'Software Engineering', 'units' => [1, 2, 3, 4, 5, 6, 7, 14, 16, 17, 18, 19, 20, 35, 49], 'skip_last' => 3],
        ['name' => 'Noor Saleh', 'pathway' => 'Cyber Security', 'units' => [1, 2, 3, 4, 5, 6, 10, 15, 16, 17, 30, 31, 32, 39, 47], 'skip_last' => 0],
        ['name' => 'Zainab Idris', 'pathway' => 'Data Analytics', 'units' => [1, 2, 3, 4, 5, 6, 8, 14, 16, 17, 24, 25, 26, 33, 34], 'skip_last' => 0],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $skills = $this->seedSfiaSkills();
        $units = $this->seedUnitsAndMappings($skills);
        $pathways = $this->seedProgrammeAndPathways($units);
        $this->seedAdmin();
        $this->seedStudentsWithGrades($units, $pathways);
    }

    /**
     * @return array<string, SfiaSkill>
     */
    private function seedSfiaSkills(): array
    {
        $skills = [];

        foreach (self::SFIA_SKILLS as $code => $name) {
            $skills[$code] = SfiaSkill::create([
                'skill_code' => $code,
                'skill_name' => $name,
            ]);
        }

        return $skills;
    }

    /**
     * @param  array<string, SfiaSkill>  $skills
     * @return array<int, AcademicUnit>
     */
    private function seedUnitsAndMappings(array $skills): array
    {
        $units = [];

        foreach (self::UNIT_CATALOGUE as $number => [$title, $credits, $rqfLevel, $mappings]) {
            $unit = AcademicUnit::create([
                'unit_code' => sprintf('U%02d', $number),
                'unit_title' => $title,
                'credit_value' => $credits,
                'level' => $rqfLevel,
            ]);
            $units[$number] = $unit;

            foreach ($mappings as [$skillCode, $sfiaLevel]) {
                $level = SfiaLevel::firstOrCreate(
                    ['skill_id' => $skills[$skillCode]->id, 'responsibility_level' => $sfiaLevel],
                    ['description' => self::SFIA_LEVEL_DESCRIPTIONS[$sfiaLevel]],
                );

                UnitSkillMapping::create([
                    'unit_id' => $unit->id,
                    'sfia_skill_id' => $skills[$skillCode]->id,
                    'sfia_level_id' => $level->id,
                    'mapping_weight' => 1.0,
                ]);
            }
        }

        return $units;
    }

    /**
     * Build the real Programme → Pathway → Unit structure (master context
     * §22.1a) so each pathway only offers the units it actually teaches.
     *
     * @param  array<int, AcademicUnit>  $units
     * @return array<string, Pathway>
     */
    private function seedProgrammeAndPathways(array $units): array
    {
        $programme = Programme::create([
            'name' => 'Pearson BTEC Higher Nationals in Computing',
        ]);

        $pathways = [];

        foreach (self::PATHWAYS as $name => $definition) {
            $pathway = Pathway::create([
                'programme_id' => $programme->id,
                'name' => $name,
                'level' => 'HND',
            ]);
            $pathways[$name] = $pathway;

            foreach (self::CORE_UNITS as $unitNumber) {
                $pathway->academicUnits()->attach($units[$unitNumber]->id, ['unit_type' => 'core']);
            }

            $pathway->academicUnits()->attach($units[$definition['specialist_l4']]->id, ['unit_type' => 'specialist']);

            foreach ($definition['specialist_l5'] as $unitNumber) {
                $pathway->academicUnits()->attach($units[$unitNumber]->id, ['unit_type' => 'specialist']);
            }

            foreach ($definition['optional'] as $unitNumber) {
                $pathway->academicUnits()->attach($units[$unitNumber]->id, ['unit_type' => 'optional']);
            }
        }

        return $pathways;
    }

    private function seedAdmin(): void
    {
        User::factory()->admin()->create([
            'name' => 'System Administrator',
            'email' => 'admin@ems.test',
        ]);
    }

    /**
     * @param  array<int, AcademicUnit>  $units
     * @param  array<string, Pathway>  $pathways
     */
    private function seedStudentsWithGrades(array $units, array $pathways): void
    {
        $grades = ['Pass', 'Merit', 'Distinction'];

        foreach (self::SIMULATED_STUDENTS as $index => $definition) {
            $user = User::factory()->create([
                'name' => $definition['name'],
                'email' => 'student'.($index + 1).'@ems.test',
            ]);

            $student = Student::factory()->create([
                'user_id' => $user->id,
                'pathway_id' => $pathways[$definition['pathway']]->id,
                'student_number' => sprintf('S%07d', 2529001 + $index),
            ]);

            $gradedUnits = $definition['skip_last'] > 0
                ? array_slice($definition['units'], 0, -$definition['skip_last'])
                : $definition['units'];

            foreach ($gradedUnits as $position => $unitNumber) {
                $grade = $grades[($index + $position) % 3];

                GradeRecord::create([
                    'student_id' => $student->id,
                    'unit_id' => $units[$unitNumber]->id,
                    'grade' => $grade,
                    'weight' => GradeRecord::GRADE_WEIGHTS[$grade],
                ]);
            }
        }
    }
}
