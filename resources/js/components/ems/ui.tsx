import type { LucideIcon, ReactNode } from 'react';
import type { GradeValue } from '@/types/ems';

/** Glassmorphism card per the Academic Precision design. */
export function EmsCard({
    children,
    className = '',
    delay,
}: {
    children: ReactNode;
    className?: string;
    delay?: 1 | 2 | 3 | 4 | 5;
}) {
    return (
        <div
            className={`ems-glass-card ems-fade-in-up rounded-2xl ${delay ? `ems-delay-${delay}` : ''} ${className}`}
        >
            {children}
        </div>
    );
}

/** Dashboard stat card: icon tile, tiny tracked label, 36px stat value. */
export function StatCard({
    icon: Icon,
    label,
    value,
    delay,
}: {
    icon: LucideIcon;
    label: string;
    value: number | string;
    delay?: 1 | 2 | 3 | 4 | 5;
}) {
    return (
        <EmsCard delay={delay} className="group flex flex-col gap-4 p-5 transition-transform duration-300 hover:scale-[1.02]">
            <div className="w-fit rounded-xl bg-ems-primary/5 p-3 text-ems-primary transition-colors duration-300 group-hover:bg-ems-primary group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.75} />
            </div>
            <div>
                <p className="mb-1 text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/60 uppercase">
                    {label}
                </p>
                <h3 className="text-4xl leading-11 font-bold text-ems-on-surface">{value}</h3>
            </div>
        </EmsCard>
    );
}

/** Table shell matching the design: tracked uppercase headers, generous cells. */
const alignClasses = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
} as const;

export function EmsTable({
    headers,
    children,
    align = [],
}: {
    headers: string[];
    children: ReactNode;
    align?: (keyof typeof alignClasses)[];
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-ems-border/60 bg-ems-surface-low/30">
                        {headers.map((header, index) => (
                            <th
                                key={header}
                                className={`px-6 py-4 text-xs font-semibold text-ems-secondary/60 uppercase ${alignClasses[align[index] ?? 'left']}`}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-ems-border/40">{children}</tbody>
            </table>
        </div>
    );
}

const gradePillStyles: Record<GradeValue, string> = {
    Distinction: 'bg-ems-emerald/10 text-ems-emerald',
    Merit: 'bg-ems-amber/10 text-ems-amber',
    Pass: 'bg-ems-primary/10 text-ems-primary',
};

/** Coloured grade pill: Distinction emerald, Merit amber, Pass navy. */
export function GradePill({ grade }: { grade: string }) {
    const style = gradePillStyles[grade as GradeValue] ?? 'bg-ems-secondary/10 text-ems-secondary';

    return (
        <span className={`rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${style}`}>
            {grade}
        </span>
    );
}

/** Small level/status pill. */
export function EmsPill({ children }: { children: ReactNode }) {
    return (
        <span className="rounded bg-ems-primary/5 px-2 py-0.5 text-xs font-semibold text-ems-primary">
            {children}
        </span>
    );
}

/** Primary action button per the design (navy, rounded, press scale). */
export function EmsButton({
    children,
    disabled,
    onClick,
    type = 'button',
}: {
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded-xl bg-ems-primary px-6 py-3.5 text-xs font-semibold tracking-wide text-white uppercase transition-all hover:shadow-lg hover:shadow-ems-primary/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
            {children}
        </button>
    );
}
