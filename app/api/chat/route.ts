import { deepseek } from '@ai-sdk/deepseek';
import { openai } from '@ai-sdk/openai';
import { streamText, Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: Message[] } = await req.json();

    const result = streamText({
        model: deepseek('deepseek-reasoner'),
        messages,
    });

    // const result = streamText({
    //     model: openai('gpt-4o'),
    //     messages,
    // }); 

    // return result.toDataStreamResponse();
    return result.toDataStreamResponse();
}
