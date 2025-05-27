import { deepseek } from '@ai-sdk/deepseek';
import { streamText, Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 不同角色的系统提示词
const ROLE_PROMPTS = {
    default: '你是一个有帮助的助手。请用 Markdown 格式回复用户。',
    lawyer: '你是一位精通法律的法律助理。请基于法律原则和判例提供法律信息和咨询建议。必要时请包含免责声明，并建议用户咨询持证律师以获取具体法律建议。请用 Markdown 格式回复用户。',
    doctor: '你是一位具备医疗知识的医学信息助理。请提供一般性的医学信息和健康教育。务必说明你不是执业医生，不能诊断疾病或开具处方。鼓励用户咨询专业医疗人员以获取个人医疗建议。请用 Markdown 格式回复用户。',
    programmer: '你是一位编程助理，擅长软件开发。帮助解决代码问题、调试和解释编程概念。提供清晰、高效的代码示例并附上解释。建议最佳实践并协助排查技术问题。请用 Markdown 格式回复用户，并确保代码格式正确。'
};

export async function POST(req: Request) {
    const { messages, data }: { messages: Message[], data?: { role?: string } } = await req.json();

    // 获取角色，如果未指定则使用默认角色
    const role = data?.role || 'default';

    // 获取对应角色的系统提示词
    const systemPrompt = ROLE_PROMPTS[role as keyof typeof ROLE_PROMPTS];

    const result = streamText({
        system: systemPrompt,
        model: deepseek('deepseek-reasoner'),
        messages,
    });

    return result.toDataStreamResponse();
}
