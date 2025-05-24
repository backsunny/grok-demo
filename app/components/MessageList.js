
import { motion } from 'framer-motion';

/**
 * 消息列表组件（显示聊天消息及附件）
 * @param {Object} props - 组件属性
 * @param {Array} props.messages - 消息列表（每个消息包含id、role、parts、experimental_attachments等）
 * @param {Object} props.messagesEndRef - 消息列表底部的引用（用于滚动定位）
 */
export default function MessageList({ messages, messagesEndRef }) {
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
                        {/* 显示文件附件（仅支持文档类） */}
                        {message?.experimental_attachments
                            ?.filter(
                                attachment =>
                                    attachment?.contentType?.startsWith('application/pdf') ||  // PDF
                                    attachment?.contentType?.startsWith('text/plain') ||        // TXT
                                    attachment?.contentType?.startsWith('application/msword') || // DOC
                                    attachment?.contentType?.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || // DOCX
                                    attachment?.contentType?.startsWith('application/vnd.ms-excel') || // XLS
                                    attachment?.contentType?.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')  // XLSX
                            )
                            .map((attachment, index) =>
                                attachment.contentType?.startsWith('application/pdf') ? (
                                    <iframe
                                        key={`${message.id}-${index}`}
                                        src={attachment.url}
                                        width="500"
                                        height="600"
                                        title={attachment.name ?? `attachment-${index}`}
                                    />
                                ) : (
                                    <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-50" key={index}>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                {attachment.name.split('.').slice(0, -1).join('.')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {attachment.name.split('.').pop()}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        {/* 显示文本消息 */}
                        {message.parts.map((part, i) => {
                            switch (part.type) {
                                case 'text':
                                    return <div key={i}>{part.text}</div>
                            }
                        })}
                    </div>

                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

/**
 * 格式化文件大小（辅助函数）
 * @param {number} size 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
function formatFileSize(size) {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
        return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
}