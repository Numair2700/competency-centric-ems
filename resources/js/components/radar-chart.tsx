import {
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { useAppearance } from '@/hooks/use-appearance';
import type { RadarDataPoint } from '@/types/ems';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
);

type Props = {
    data: RadarDataPoint[];
    /** Optional earlier profile drawn underneath as a dashed outline. */
    previous?: RadarDataPoint[] | null;
    previousLabel?: string;
};

/** Read a design token from :root (follows the .dark class). */
function token(name: string, fallback: string): string {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();

    return value || fallback;
}

function withAlpha(hex: string, alpha: number): string {
    const match = /^#([0-9a-f]{6})$/i.exec(hex);

    if (!match) {
        return hex;
    }

    const int = parseInt(match[1], 16);

    return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

/**
 * SFIA competency radar chart (FR12). One axis per SFIA skill on the
 * student's course, scores as percentages, gridlines at 25% steps. Skills
 * with no graded unit yet are labelled "(n/a)" and plotted at 0. Colours
 * come from the EMS design tokens so light and dark mode both match.
 */
export default function RadarChart({
    data,
    previous = null,
    previousLabel = 'Previous profile',
}: Props) {
    const { resolvedAppearance } = useAppearance();

    const colors = useMemo(() => {
        const dark = resolvedAppearance === 'dark';

        return {
            line: token(
                '--color-ems-primary-container',
                dark ? '#5c7cfa' : '#1e40af',
            ),
            grid: token('--color-ems-border', dark ? '#2c3644' : '#e2e8f0'),
            label: token('--color-ems-secondary', dark ? '#a3adbd' : '#515f74'),
            muted: token('--color-ems-outline', dark ? '#8b93a5' : '#757684'),
        };
    }, [resolvedAppearance]);

    const previousByCode = new Map(
        (previous ?? []).map((point) => [point.skill_code, point]),
    );
    const showPrevious = previous !== null && previous.length > 0;
    const font = { family: 'Inter, system-ui, sans-serif' };

    return (
        <Radar
            aria-label="Competency radar chart"
            role="img"
            data={{
                labels: data.map((point) =>
                    point.assessed === false
                        ? `${point.skill_code} (n/a)`
                        : point.skill_code,
                ),
                datasets: [
                    {
                        label: 'This profile',
                        data: data.map((point) => point.normalised_score),
                        backgroundColor: withAlpha(colors.line, 0.25),
                        borderColor: colors.line,
                        borderWidth: 2,
                        pointBackgroundColor: data.map((point) =>
                            point.assessed === false
                                ? colors.muted
                                : colors.line,
                        ),
                        pointRadius: 3,
                    },
                    ...(showPrevious
                        ? [
                              {
                                  label: previousLabel,
                                  data: data.map(
                                      (point) =>
                                          previousByCode.get(point.skill_code)
                                              ?.normalised_score ?? 0,
                                  ),
                                  backgroundColor: 'transparent',
                                  borderColor: colors.muted,
                                  borderWidth: 1.5,
                                  borderDash: [5, 4],
                                  pointRadius: 0,
                              },
                          ]
                        : []),
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 25,
                            backdropColor: 'transparent',
                            color: colors.label,
                            font,
                        },
                        grid: { color: colors.grid },
                        angleLines: { color: colors.grid },
                        pointLabels: {
                            font: { ...font, size: 12, weight: 'bold' },
                            color: (context) =>
                                data[context.index]?.assessed === false
                                    ? colors.muted
                                    : colors.label,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: showPrevious,
                        position: 'bottom',
                        labels: { color: colors.label, font, boxWidth: 12 },
                    },
                    tooltip: {
                        callbacks: {
                            title: (items) => {
                                const point = data[items[0]?.dataIndex ?? 0];

                                return point
                                    ? `${point.skill_code} — ${point.skill_name}`
                                    : '';
                            },
                            label: (context) => {
                                const point = data[context.dataIndex];

                                if (
                                    context.datasetIndex === 0 &&
                                    point?.assessed === false
                                ) {
                                    return 'Not yet assessed';
                                }

                                return `${context.dataset.label}: ${context.parsed.r}%`;
                            },
                        },
                    },
                },
            }}
        />
    );
}
