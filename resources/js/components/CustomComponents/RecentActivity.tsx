import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActivityLogs } from '@/hooks/use-activity-logs';

export default function RecentActivity() {
    const { activities, loading } = useActivityLogs();

    return (
        <Card className="flex h-full flex-col border border-zinc-800 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base text-white">Recent Activity</CardTitle>
                <span className="cursor-pointer text-xs text-muted-foreground hover:underline">View all</span>
            </CardHeader>

            <CardContent className="flex-1 p-4 pt-0">
                <div className="h-full max-h-[300px] overflow-y-auto pr-1">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading...</div>
                    ) : (
                        <ul className="space-y-4 pl-2">
                            {activities.slice(0, 3).map((log, index, array) => (
                                <li key={log.id} className="relative flex items-start space-x-5">
                                    {/* Avatar + Line */}
                                    <div className="relative flex flex-col items-center">
                                        {index !== array.length - 1 && (
                                            <div className="absolute top-1/2 left-1/2 h-[calc(100%+8px)] w-px -translate-x-1/2 translate-y-[20px] bg-zinc-700" />
                                        )}
                                        <Avatar className="z-10 h-10 w-10">
                                            <AvatarImage src={log.causer?.avatar ?? ''} />
                                            <AvatarFallback>{log.causer?.name?.[0] ?? 'N'}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Activity Details */}
                                    <div className="space-y-1 text-sm break-words text-white">
                                        <div>
                                            <span className="font-semibold">{log.causer?.name ?? 'System'}</span>{' '}
                                            <span className="text-zinc-300">{log.description}</span>
                                        </div>

                                        {/* CREATED */}
                                        {log.event === 'created' && log.properties?.attributes && (
                                            <div className="space-y-0.5 text-[13px] text-green-400">
                                                {Object.entries(log.properties.attributes).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-zinc-500">{key}:</span> {String(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* DELETED */}
                                        {log.event === 'deleted' && log.properties?.old && (
                                            <div className="space-y-0.5 text-[13px] text-red-400">
                                                {Object.entries(log.properties.old).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-zinc-500">{key}:</span> {String(value)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* UPDATED */}
                                        {log.event === 'updated' && log.properties?.old && log.properties?.attributes && (
                                            <div className="space-y-0.5 text-[13px] text-zinc-400">
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
                </div>
            </CardContent>
        </Card>
    );
}
