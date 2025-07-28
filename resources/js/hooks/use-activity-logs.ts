import { fetchActivities } from '@/api/activity';
import { useEffect, useState } from 'react';

export function useActivityLogs() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities()
            .then((data) => setActivities(data))
            .finally(() => setLoading(false));
    }, []);

    return { activities, loading };
}
