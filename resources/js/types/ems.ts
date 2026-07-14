export type RadarDataPoint = {
    skill_code: string;
    skill_name: string;
    normalised_score: number;
};

export type CompetencyScoreRow = {
    skill_code: string;
    skill_name: string;
    raw_score: number;
    normalised_score: number;
};

export type AcademicUnit = {
    id: number;
    unit_code: string;
    unit_title: string;
    credit_value: number;
    level: '4' | '5';
    unit_skill_mappings_count?: number;
};

export type SfiaLevel = {
    id: number;
    skill_id: number;
    responsibility_level: number;
    description: string | null;
};

export type SfiaSkill = {
    id: number;
    skill_code: string;
    skill_name: string;
    description: string | null;
    levels?: SfiaLevel[];
    unit_skill_mappings_count?: number;
};

export type UnitSkillMapping = {
    id: number;
    unit_id: number;
    sfia_skill_id: number;
    sfia_level_id: number;
    mapping_weight: number;
    unit?: AcademicUnit;
    sfia_skill?: SfiaSkill;
    sfia_level?: SfiaLevel;
};

export type Course = {
    id: number;
    programme_id: number;
    name: string;
    level: 'HNC' | 'HND';
};

export type StudentRow = {
    id: number;
    user_id: number;
    course_id: number;
    student_number: string;
    grade_records_count?: number;
    user?: { id: number; name: string; email: string };
    course?: Course;
};

export type GradeValue = 'Pass' | 'Merit' | 'Distinction';

export const GRADE_VALUES: GradeValue[] = ['Pass', 'Merit', 'Distinction'];

export const GRADE_WEIGHTS: Record<GradeValue, number> = {
    Pass: 0.5,
    Merit: 0.75,
    Distinction: 1.0,
};
