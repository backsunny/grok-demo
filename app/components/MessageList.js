import { motion } from 'framer-motion';
import { DocumentIcon } from '@heroicons/react/24/outline';

export default function MessageList({ messages, messagesEndRef }) {
    return (
        <div className="flex-1 p-4 space-y-4 pb-32 overflow-y-auto">
            {messages.map((message) => (
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                                ? 'bg-gray-100 text-gray-800'
                                : 'text-gray-800'
                            }`}
                    >
                        {message.file && (
                            <div className="mb-2 flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                                <DocumentIcon className="h-5 w-5 text-gray-500" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {message.file.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {(message.file.size / 1024).toFixed(1)} KB
                                    </div>
                                </div>
                            </div>
                        )}
                        {message.text && <div>{message.text}</div>}
                    </div>
                </motion.div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
} 