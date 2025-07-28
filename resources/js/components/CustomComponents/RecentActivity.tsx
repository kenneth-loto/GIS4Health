import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityLogs } from '@/hooks/use-activity-logs';

export default function RecentActivity() {
    const { activities, loading } = useActivityLogs();

    return (
        <div className="absolute right-4 bottom-4 w-full max-w-sm">
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-base text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[250px] overflow-y-auto text-sm text-white">
                    {loading ? (
                        <p className="text-muted-foreground">Loading...</p>
                    ) : (
                        <ul className="space-y-4">
                            {activities.map((log) => (
                                <li key={log.id} className="border-b border-gray-700 pb-2">
                                    <div className="font-medium text-gray-200">
                                        {log.causer?.name ?? 'System'} — {log.description}
                                    </div>
                                    <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</div>

                                    {(log.properties?.old || log.properties?.attributes) && (
                                        <div className="mt-2">
                                            <div className="text-xs font-semibold text-gray-500">Changes:</div>
                                            <ul className="mt-1 ml-4 list-disc space-y-1">
                                                {Object.entries(log.properties.attributes ?? {}).map(([key, newValue]) => {
                                                    const oldValue = log.properties.old?.[key];
                                                    if (oldValue !== newValue) {
                                                        return (
                                                            <li key={key}>
                                                                <span className="font-medium text-gray-300">{key}</span>:&nbsp;
                                                                <span className="text-red-500 line-through">{oldValue?.toString()}</span>
                                                                &nbsp;<span className="text-gray-500">→</span>&nbsp;
                                                                <span className="text-green-400">{newValue?.toString()}</span>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                                {!log.properties.attributes &&
                                                    Object.entries(log.properties.old ?? {}).map(([key, oldValue]) => (
                                                        <li key={key}>
                                                            <span className="font-medium text-gray-300">{key}</span>:&nbsp;
                                                            <span className="text-red-500 line-through">{oldValue?.toString()}</span>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
