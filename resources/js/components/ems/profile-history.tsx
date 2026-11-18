import { Link } from '@inertiajs/react';
import { History } from 'lucide-react';
import type { ProfileHistoryItem } from '@/types/ems';

/** Timeline of a student's generated profiles, newest first. */
export function ProfileHistory({
    history,
    href,
}: {
    history: ProfileHistoryItem[];
    href: (id: number) => string;
}) {
    if (history.length === 0) {
        return null;
    }

    return (
        <ol className="flex flex-col p-2">
            {history.map((item, index) => (
                <li key={item.id}>
                    <Link
                        href={href(item.id)}
                        preserveScroll
                        aria-current={item.is_current ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                            item.is_current
                                ? 'bg-ems-active font-semibold text-ems-primary'
                                : 'hover:bg-ems-surface-mid/60'
                        }`}
                    >
                        <History
                            className={`size-4 shrink-0 ${item.is_current ? 'text-ems-primary' : 'text-ems-secondary/60'}`}
                        />
                        <span className="min-w-0 flex-1 truncate">
                            {item.generated_at}
                        </span>
                        <span className="shrink-0 text-xs font-normal text-ems-secondary">
                            {index === 0 ? 'Latest' : item.generated_ago}
                        </span>
                    </Link>
                </li>
            ))}
        </ol>
    );
}
