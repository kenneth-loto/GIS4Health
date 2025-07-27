import { zodResolver } from '@hookform/resolvers/zod';
import { BotMessageSquare, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendMessageToAI } from '@/api/chat';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
    input: z.string().min(1, 'Message is required'),
});

export default function ChatBot() {
    const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful assistant.' }]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { input: '' },
    });

    const filteredMessages = messages.filter((msg) => msg.role !== 'system');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSubmit = async ({ input }: { input: string }) => {
        const updatedMessages = [...messages, { role: 'user', content: input }];
        setMessages(updatedMessages);
        form.reset();
        setLoading(true);

        try {
            const reply = await sendMessageToAI(updatedMessages);
            const newReply = reply ? { role: 'assistant', content: reply } : { role: 'assistant', content: 'Sorry, I had trouble replying.' };
            setMessages((prev) => [...prev, newReply]);
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I had trouble replying.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="fixed right-5 bottom-20 z-50 flex w-[400px] flex-col border shadow-lg">
            <CardHeader>
                <CardTitle>GIS4Health</CardTitle>
                <CardDescription>GIS4Health: Geospatial Information System for Health Monitoring in Biliran</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col border-t p-0 pt-3">
                <div
                    className={`flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2 text-sm transition-all duration-300 ${
                        filteredMessages.length === 0 ? 'max-h-[50px]' : 'max-h-[300px]'
                    }`}
                >
                    {filteredMessages.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground italic">Have something in mind? Ask away!</div>
                    ) : (
                        filteredMessages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="rounded-full bg-muted p-1">
                                        <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm break-words ${
                                        msg.role === 'user'
                                            ? 'bg-black text-white dark:bg-white dark:text-black'
                                            : 'bg-gray-200 text-black dark:bg-white dark:text-black'
                                    }`}
                                >
                                    {msg.content}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="rounded-full bg-muted p-1">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {loading && (
                        <div className="flex items-start gap-2">
                            <div className="rounded-full bg-muted p-1">
                                <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex max-w-[80%] items-center gap-1 rounded-lg bg-gray-200 px-3 py-1 text-sm text-black dark:bg-white dark:text-black">
                                <span className="animate-bounce text-xl font-bold">.</span>
                                <span className="animate-bounce text-xl font-bold delay-150">.</span>
                                <span className="animate-bounce text-xl font-bold delay-300">.</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="px-4 pt-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="input"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Ask a question..."
                                                className="max-h-[5.5rem] resize-none"
                                                disabled={loading}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={loading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    );
}
