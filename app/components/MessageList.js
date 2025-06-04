
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { memo, useMemo } from 'react';

/**
 * 将Markdown内容解析为块
 * @param {string} markdown - Markdown文本内容
 * @returns {string[]} Markdown块数组
 */
function parseMarkdownIntoBlocks(markdown) {
    const tokens = marked.lexer(markdown);
    return tokens.map(token => token.raw);
}

/**
 * 记忆化的Markdown块组件
 */
const MemoizedMarkdownBlock = memo(
    ({ content }) => {
        return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
    },
    (prevProps, nextProps) => {
        if (prevProps.content !== nextProps.content) return false;
        return true;
    },
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

/**
 * 记忆化的Markdown组件
 */
const MemoizedMarkdown = memo(
    ({ content, id }) => {
        const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

        return blocks.map((block, index) => (
            <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
        ));
    },
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

/**
 * 消息列表组件（显示聊天消息及附件）
 * @param {Object} props - 组件属性
 * @param {Array} props.messages - 消息列表（每个消息包含id、role、parts、experimental_attachments等）
 * @param {Object} props.messagesEndRef - 消息列表底部的引用（用于滚动定位）
 */
export default function MessageList({ messages, messagesEndRef }) {
    console.log('MessageList:', messages);
    return (
        <div className="flex-1 p-4 space-y-4 pb-80 overflow-y-auto">
            {messages.map((message) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }} // 初始动画状态（透明+偏移）
                    animate={{ opacity: 1, y: 0 }} // 最终动画状态（不透明+无偏移）
                    className={`flex ${message.role === 'user' ? 'justify-end ' : 'justify-start'}`} // 用户消息右对齐，AI消息左对齐
                >
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                            ? 'bg-gray-100 text-gray-800'
                            : 'text-gray-800'
                            }`}
                    >
                        
                        {/* 显示消息部分 */}
                        {message.parts && message.parts.map((part, i) => {
                            switch (part.type) {
                                case 'text':
                                    return (
                                        <div key={i} className="markdown-content">
                                            <MemoizedMarkdown content={part.text} id={`${message.id}-part-${i}`} />
                                        </div>
                                    );
                                case 'step-start':
                                    return ;
                                default:
                                    return <div key={i}>{JSON.stringify(part)}</div>;
                            }
                        })}
                    </div>

                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
