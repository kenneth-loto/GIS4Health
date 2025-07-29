import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityLogs } from '@/hooks/use-activity-logs';

export default function RecentActivity() {
    const { activities, loading } = useActivityLogs();

    return (
        <div className="absolute right-4 bottom-4 w-full max-w-sm">
            <Card className="border border-zinc-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base text-white">Recent Activity</CardTitle>
                    <span className="cursor-pointer text-xs text-muted-foreground hover:underline">View all</span>
                </CardHeader>

                <CardContent className="space-y-6">
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                        <ul className="relative max-h-[35vh] space-y-6 overflow-y-auto before:top-2 before:bottom-2 before:left-5 before:w-px before:bg-zinc-700">
                            {activities.slice(0, 20).map((log) => (
                                <li key={log.id} className="relative flex items-start space-x-4">
                                    {/* Avatar */}
                                    <Avatar>
                                        <AvatarImage src={log.causer?.avatar ?? ''} />
                                        <AvatarFallback>{log.causer?.name?.[0] ?? 'N'}</AvatarFallback>
                                    </Avatar>

                                    {/* Details */}
                                    <div className="space-y-1 text-sm text-white">
                                        <div className="font-medium">
                                            {log.causer?.name ?? 'System'} <span className="font-normal text-zinc-300">{log.description}</span>
                                        </div>

                                        {/* CREATED */}
                                        {log.event === 'created' && log.properties?.attributes && (
                                            <div className="space-y-1 text-xs text-green-400">
                                                {Object.entries(log.properties.attributes).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-zinc-500">{key}:</span> {String(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* DELETED */}
                                        {log.event === 'deleted' && log.properties?.old && (
                                            <div className="space-y-1 text-xs text-red-400">
                                                {Object.entries(log.properties.old).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-zinc-500">{key}:</span> {String(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* UPDATED */}
                                        {log.event === 'updated' && log.properties?.old && log.properties?.attributes && (
                                            <div className="space-y-1 text-xs text-zinc-400">
                                                {Object.keys(log.properties.attributes).map((key) => (
                                                    <div key={key}>
                                                        <span className="text-zinc-500">{key}:</span>{' '}
                                                        <span className="text-red-400 line-through">{String(log.properties.old[key])}</span>{' '}
                                                        <span className="text-green-400">→ {String(log.properties.attributes[key])}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
