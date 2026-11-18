import { ArrowDownRight, ArrowUpRight, Minus, Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
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
        <EmsCard
            delay={delay}
            className="group flex flex-col gap-4 p-5 transition-transform duration-300 hover:scale-[1.02]"
        >
            <div className="w-fit rounded-xl bg-ems-primary/5 p-3 text-ems-primary transition-colors duration-300 group-hover:bg-ems-primary group-hover:text-white">
                <Icon className="size-6" strokeWidth={1.75} />
            </div>
            <div>
                <p className="mb-1 text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/60 uppercase">
                    {label}
                </p>
                <h3 className="text-4xl leading-11 font-bold text-ems-on-surface">
                    {value}
                </h3>
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
                <tbody className="divide-y divide-ems-border/40">
                    {children}
                </tbody>
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
    const style =
        gradePillStyles[grade as GradeValue] ??
        'bg-ems-secondary/10 text-ems-secondary';

    return (
        <span
            className={`rounded-md px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${style}`}
        >
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

/** Card header row: title + description on the left, actions on the right. */
export function EmsCardHeader({
    title,
    description,
    actions,
}: {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 border-b border-ems-border/60 bg-white/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 dark:bg-white/5">
            <div className="min-w-0">
                <h4 className="text-base font-semibold sm:text-lg">{title}</h4>
                {description && (
                    <p className="mt-0.5 text-[13px] text-ems-secondary">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

/** Search box with a leading icon and a clear button. */
export function SearchInput({
    value,
    onChange,
    placeholder = 'Search…',
    label = 'Search',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}) {
    return (
        <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ems-secondary/60" />
            <input
                type="search"
                aria-label={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-9 w-full rounded-lg border border-ems-border bg-ems-surface pr-8 pl-9 text-sm text-ems-on-surface outline-none placeholder:text-ems-secondary/50 focus:border-ems-primary focus:ring-2 focus:ring-ems-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {value !== '' && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange('')}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-ems-secondary/60 hover:text-ems-on-surface"
                >
                    <X className="size-3.5" />
                </button>
            )}
        </div>
    );
}

/**
 * Case-insensitive text filter over a list. `fields` returns the strings
 * each item can be matched on.
 */
export function useSearch<T>(
    items: T[],
    fields: (item: T) => (string | number | null | undefined)[],
) {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (needle === '') {
            return items;
        }

        return items.filter((item) =>
            fields(item).some((field) =>
                String(field ?? '')
                    .toLowerCase()
                    .includes(needle),
            ),
        );
        // `fields` is a stable accessor defined inline by callers.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, query]);

    return { query, setQuery, results };
}

/** Table row shown when a search or filter matches nothing. */
export function NoResultsRow({
    colSpan,
    onClear,
}: {
    colSpan: number;
    onClear?: () => void;
}) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className="px-6 py-10 text-center text-sm text-ems-secondary"
            >
                No matches.{' '}
                {onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="font-medium text-ems-primary underline-offset-4 hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </td>
        </tr>
    );
}

/** Thin horizontal progress bar. */
export function ProgressBar({
    value,
    max = 100,
    tone = 'primary',
    label,
}: {
    value: number;
    max?: number;
    tone?: 'primary' | 'emerald' | 'amber';
    label?: string;
}) {
    const percent =
        max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const toneClass = {
        primary: 'bg-ems-primary-container',
        emerald: 'bg-ems-emerald',
        amber: 'bg-ems-amber',
    }[tone];

    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
            className="h-1.5 w-full overflow-hidden rounded-full bg-ems-surface-mid"
        >
            <div
                className={`h-full rounded-full transition-[width] duration-500 ${toneClass}`}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

/** Up/down badge for a change in percentage points. */
export function ChangeBadge({ change }: { change: number | null | undefined }) {
    if (change === null || change === undefined) {
        return <span className="text-[11px] text-ems-secondary/60">new</span>;
    }

    if (Math.abs(change) < 0.005) {
        return (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-ems-secondary">
                <Minus className="size-3" />0
            </span>
        );
    }

    const up = change > 0;
    const Icon = up ? ArrowUpRight : ArrowDownRight;

    return (
        <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? 'text-ems-emerald' : 'text-ems-amber'}`}
            title={`${up ? '+' : ''}${change} points since the previous profile`}
        >
            <Icon className="size-3" />
            {up ? '+' : ''}
            {change}
        </span>
    );
}

/**
 * Per-skill score list with bars, optionally showing the change since the
 * previous profile.
 */
export function ScoreBars({
    scores,
    showChange = false,
}: {
    scores: {
        skill_code: string;
        skill_name: string;
        raw_score: number;
        normalised_score: number;
        change?: number | null;
    }[];
    showChange?: boolean;
}) {
    if (scores.length === 0) {
        return (
            <p className="py-8 text-center text-sm text-ems-secondary">
                No skills have been assessed yet.
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-4">
            {scores.map((score) => (
                <li key={score.skill_code}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <p className="min-w-0 truncate text-sm">
                            <span className="font-semibold">
                                {score.skill_code}
                            </span>{' '}
                            <span className="text-ems-secondary">
                                {score.skill_name}
                            </span>
                        </p>
                        <div className="flex shrink-0 items-baseline gap-2">
                            {showChange && (
                                <ChangeBadge change={score.change} />
                            )}
                            <span
                                className="text-sm font-semibold text-ems-primary tabular-nums"
                                title={`Raw score ${score.raw_score}`}
                            >
                                {score.normalised_score}%
                            </span>
                        </div>
                    </div>
                    <ProgressBar
                        value={score.normalised_score}
                        label={`${score.skill_code} ${score.normalised_score}%`}
                        tone={
                            score.normalised_score >= 85
                                ? 'emerald'
                                : score.normalised_score >= 65
                                  ? 'primary'
                                  : 'amber'
                        }
                    />
                </li>
            ))}
        </ul>
    );
}

/** Centered empty state with icon, message and optional action. */
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <div className="rounded-2xl bg-ems-primary/5 p-4 text-ems-primary">
                <Icon className="size-7" strokeWidth={1.75} />
            </div>
            <p className="font-semibold">{title}</p>
            {description && (
                <p className="max-w-md text-sm text-ems-secondary">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
