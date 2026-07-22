import {
    Chart as ChartJS,
    Filler,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useAppearance } from '@/hooks/use-appearance';
import type { RadarDataPoint } from '@/types/ems';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

type Props = {
    data: RadarDataPoint[];
};

/**
 * SFIA competency radar chart (FR12). One axis per SFIA skill, scores as
 * percentages. Colours per the design system: #1e40af border, 50%-opacity
 * #3b82f6 fill, gridlines at 25% increments (WCAG 1.4.3 contrast).
 */
export default function RadarChart({ data }: Props) {
    const { resolvedAppearance } = useAppearance();
    const dark = resolvedAppearance === 'dark';
    const gridColor = dark ? '#2c3644' : '#e2e8f0';
    const labelColor = dark ? '#a3adbd' : '#475569';
    const lineColor = dark ? '#5c7cfa' : '#1e40af';

    return (
        <Radar
            data={{
                labels: data.map((point) => point.skill_code),
                datasets: [
                    {
                        label: 'Competency (%)',
                        data: data.map((point) => point.normalised_score),
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: lineColor,
                        borderWidth: 2,
                        pointBackgroundColor: lineColor,
                    },
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
                            color: labelColor,
                            font: { family: 'Inter, system-ui, sans-serif' },
                        },
                        grid: { color: gridColor },
                        angleLines: { color: gridColor },
                        pointLabels: {
                            font: {
                                family: 'Inter, system-ui, sans-serif',
                                size: 12,
                                weight: 'bold',
                            },
                            color: labelColor,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = data[context.dataIndex];
                                return `${point.skill_name}: ${point.normalised_score}%`;
                            },
                        },
                    },
                },
            }}
        />
    );
}
