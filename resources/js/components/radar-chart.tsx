import {
    Chart as ChartJS,
    Filler,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
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
    return (
        <Radar
            data={{
                labels: data.map((point) => point.skill_code),
                datasets: [
                    {
                        label: 'Competency (%)',
                        data: data.map((point) => point.normalised_score),
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: '#1e40af',
                        borderWidth: 2,
                        pointBackgroundColor: '#1e40af',
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
                            font: { family: 'Inter, system-ui, sans-serif' },
                        },
                        grid: { color: '#e2e8f0' },
                        angleLines: { color: '#e2e8f0' },
                        pointLabels: {
                            font: {
                                family: 'Inter, system-ui, sans-serif',
                                size: 12,
                                weight: 'bold',
                            },
                            color: '#475569',
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
