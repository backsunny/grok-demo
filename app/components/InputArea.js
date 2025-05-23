import { useRef, useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

const ALLOWED_FILE_TYPES = [
    'text/plain', // .txt
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/pdf', // .pdf
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
];

const ALLOWED_FILE_EXTENSIONS = ['.txt', '.doc', '.docx', '.pdf', '.xls', '.xlsx'];

export default function InputArea({ onSubmit, className = '' }) {
    const [input, setInput] = useState('');
    const [showScrollbar, setShowScrollbar] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const textareaRef = useRef(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(Math.max(textarea.scrollHeight, 80), 240);
            textarea.style.height = `${newHeight}px`;
            setShowScrollbar(textarea.scrollHeight > 240);
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 检查文件扩展名
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
            setFileError(`不支持的文件类型。请上传以下格式的文件：${ALLOWED_FILE_EXTENSIONS.join('、')}`);
            e.target.value = '';
            return;
        }

        // 检查MIME类型
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setFileError(`不支持的文件类型。请上传以下格式的文件：${ALLOWED_FILE_EXTENSIONS.join('、')}`);
            e.target.value = '';
            return;
        }

        setFileError('');
        setUploadedFile(file);
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setFileError('');
        // 重置文件输入框，这样同一个文件可以再次上传
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() && !uploadedFile) return;

        // 发送消息和文件信息
        onSubmit({
            text: input.trim(),
            file: uploadedFile
        });

        // 重置状态
        setInput('');
        setUploadedFile(null);

        // 重置文件输入框
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
            <form onSubmit={handleSubmit}>
                {fileError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {fileError}
                    </div>
                )}
                {uploadedFile && (
                    <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-50">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {uploadedFile.name.split('.').slice(0, -1).join('.')}
                            </div>
                            <div className="text-sm text-gray-500">
                                {uploadedFile.name.split('.').pop()} • {(formatFileSize(uploadedFile.size))}
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </Button>
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="输入您的问题... (Shift + Enter 换行)"
                    className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] max-h-[240px] ${showScrollbar ? 'overflow-y-auto' : 'overflow-y-hidden'
                        } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-4`}
                />
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".txt,.doc,.docx,.pdf,.xls,.xlsx"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            <span>上传文件</span>
                        </Button>
                    </div>
                    <Button type="submit" className="flex items-center gap-2 bg-black text-white">
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span>发送</span>
                    </Button>
                </div>
            </form>
        </div>
    );
} 

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

