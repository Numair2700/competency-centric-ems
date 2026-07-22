import { Head } from '@inertiajs/react';
import { GraduationCap, Users } from 'lucide-react';
import { EmsCard, EmsPill } from '@/components/ems/ui';

type CourseUnit = {
    id: number;
    unit_code: string;
    unit_title: string;
    credit_value: number;
    level: '4' | '5';
    unit_type: 'core' | 'specialist' | 'optional';
};

type CourseRow = {
    id: number;
    name: string;
    level: string;
    students_count: number;
    units: CourseUnit[];
};

type Props = {
    programmes: {
        id: number;
        name: string;
        courses: CourseRow[];
    }[];
};

const unitTypeStyles: Record<CourseUnit['unit_type'], string> = {
    core: 'bg-ems-primary/10 text-ems-primary',
    specialist: 'bg-ems-emerald/10 text-ems-emerald',
    optional: 'bg-ems-secondary/10 text-ems-secondary',
};

const unitTypeOrder: CourseUnit['unit_type'][] = ['core', 'specialist', 'optional'];

export default function Courses({ programmes }: Props) {
    return (
        <>
            <Head title="Programmes & Courses" />
            <div className="flex flex-col gap-8">
                {programmes.map((programme) => (
                    <div key={programme.id} className="flex flex-col gap-6">
                        <EmsCard delay={1} className="flex items-center gap-4 p-5">
                            <div className="rounded-xl bg-ems-primary/5 p-3 text-ems-primary">
                                <GraduationCap className="size-6" strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/60 uppercase">
                                    Programme
                                </p>
                                <h2 className="text-xl font-bold text-ems-on-surface">
                                    {programme.name}
                                </h2>
                                <p className="text-[13px] text-ems-secondary">
                                    {programme.courses.length} courses — each student is
                                    enrolled on one course and graded only on its units
                                </p>
                            </div>
                        </EmsCard>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                            {programme.courses.map((course, index) => (
                                <EmsCard
                                    key={course.id}
                                    delay={Math.min(index + 1, 5) as 1 | 2 | 3 | 4 | 5}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center justify-between border-b border-ems-border/60 bg-white/30 px-6 py-4 dark:bg-white/5">
                                        <div>
                                            <h3 className="font-semibold text-ems-on-surface">
                                                {course.name}
                                            </h3>
                                            <p className="text-xs text-ems-secondary">
                                                {course.units.length} units ·{' '}
                                                {course.units.reduce(
                                                    (sum, unit) => sum + unit.credit_value,
                                                    0,
                                                )}{' '}
                                                credits available
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <EmsPill>{course.level}</EmsPill>
                                            <span className="flex items-center gap-1 rounded bg-ems-surface-mid px-2 py-0.5 text-xs font-semibold text-ems-secondary">
                                                <Users className="size-3.5" />
                                                {course.students_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 p-5">
                                        {unitTypeOrder.map((type) => {
                                            const units = course.units.filter(
                                                (unit) => unit.unit_type === type,
                                            );

                                            if (units.length === 0) {
                                                return null;
                                            }

                                            return (
                                                <div key={type}>
                                                    <p className="mb-1.5 text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/60 uppercase">
                                                        {type} ({units.length})
                                                    </p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {units.map((unit) => (
                                                            <span
                                                                key={unit.id}
                                                                title={`${unit.unit_title} · ${unit.credit_value} credits · RQF Level ${unit.level}`}
                                                                className={`rounded px-2 py-1 text-xs font-medium ${unitTypeStyles[type]}`}
                                                            >
                                                                <span className="font-bold">
                                                                    {unit.unit_code}
                                                                </span>{' '}
                                                                {unit.unit_title}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </EmsCard>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

Courses.emsTitle = 'Programmes & Courses';
