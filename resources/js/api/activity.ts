import axios from 'axios';

export async function fetchActivities() {
    const response = await axios.get('/api/activity-logs');
    return response.data;
}
