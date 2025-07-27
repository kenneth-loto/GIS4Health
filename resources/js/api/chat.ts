import axios from 'axios';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function sendMessageToAI(messages: { role: string; content: string }[]) {
    try {
        const { data } = await axios.post(
            API_URL,
            {
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    'HTTP-Referer': window.location.origin,
                    'Content-Type': 'application/json',
                },
            },
        );

        return data.choices?.[0]?.message?.content ?? null;
    } catch (error) {
        console.error('AI API error:', error);
        throw new Error('Failed to get a response from the AI.');
    }
}
