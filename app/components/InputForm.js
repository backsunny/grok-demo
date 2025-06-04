'use client';
import { useRef, useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';


// 允许上传的文件扩展名白名单
const ALLOWED_FILE_EXTENSIONS = ['.txt', '.doc', '.docx', '.pdf'];
// 允许上传的文件MIME类型白名单
const ALLOWED_FILE_TYPES = [
    'text/plain', // .txt
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/pdf', // .pdf
];

// 应用角色选项
const APP_ROLES = [
    { id: 'default', name: '通用助手' },
    { id: 'lawyer', name: '律师助手' },
    { id: 'doctor', name: '医疗助手' },
    { id: 'programmer', name: '编程助手' },
];

/**
 * 输入表单组件（处理文本输入和文件上传）
 * @param {Object} props - 组件属性
 * @param {string} props.input - 当前输入的文本内容
 * @param {Function} props.handleInputChange - 输入变化的回调函数
 * @param {Function} props.handleSubmit - 表单提交的回调函数
 * @param {FileList} props.files - 已上传的文件列表
 * @param {Function} props.setFiles - 更新文件列表的状态函数
 * @param {Function} props.handleRemoveFile - 移除文件的回调函数
 * @param {string} props.selectedRole - 当前选择的应用角色
 * @param {Function} props.setSelectedRole - 更新应用角色的状态函数
 * @returns {JSX.Element} 输入表单界面
 */
export default function InputForm({
    input,
    handleInputChange,
    handleSubmit,
    files,
    setFiles,
    handleRemoveFile,
    selectedRole,
    setSelectedRole,
    isConversationStarted = false
}) {
    const [showScrollbar, setShowScrollbar] = useState(false); // 控制输入框滚动条显示状态
    const textareaRef = useRef(null); // 输入框引用（用于调整高度）
    const fileInputRef = useRef(null); // 文件选择框引用
    const [fileError, setFileError] = useState(''); // 文件上传错误提示
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // 控制确认对话框显示状态
    const [pendingRole, setPendingRole] = useState(null); // 待确认的角色
    const [showUploadMask, setShowUploadMask] = useState(false); // 控制上传遮罩层显示状态

    // 调整输入框高度（根据内容自适应）
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(Math.max(textarea.scrollHeight, 80), 240);
            textarea.style.height = `${newHeight}px`;
            setShowScrollbar(textarea.scrollHeight > 240);
        }
    };

    /**
     * 检查文件类型是否合法
     */
    function checkFileType(file) {
        // 检查文件扩展名
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
            setFileError(`不支持的文件类型。请上传以下格式的文件：${ALLOWED_FILE_EXTENSIONS.join('、')}`);
            // 清空文件选择框（避免重复选择同一文件时不触发change事件）
            fileInputRef.current.value = '';
            return false;
        }

        // 检查MIME类型
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setFileError(`不支持的文件类型。请上传以下格式的文件：${ALLOWED_FILE_EXTENSIONS.join('、')}`);
            fileInputRef.current.value = '';
            return false;
        }

        setFileError(''); // 清除错误提示
        return true;
    }

    // 处理角色选择变化
    const handleRoleChange = (e) => {
        const newRole = e.target.value;

        // 如果已经开始对话，显示确认对话框
        if (isConversationStarted) {
            setPendingRole(newRole);
            setShowConfirmDialog(true);
        } else {
            // 如果未开始对话，直接更新角色
            setSelectedRole(newRole);
        }
    };

    // 确认切换角色
    const confirmRoleChange = () => {
        setSelectedRole(pendingRole);
        setShowConfirmDialog(false);
        // 刷新页面
        window.location.reload();
    };

    // 取消切换角色
    const cancelRoleChange = () => {
        setPendingRole(null);
        setShowConfirmDialog(false);
    };

    // 显示上传遮罩层
    const showUploadDialog = () => {
        setShowUploadMask(true);
    };

    // 隐藏上传遮罩层
    const hideUploadDialog = () => {
        setShowUploadMask(false);
    };

    // 处理文件拖放
    const handleFileDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (checkFileType(file)) {
                setFiles(e.dataTransfer.files);
                setShowUploadMask(false);

                try {
                    // 读取文件内容
                    const fileData = await readFile(file);
                    // 将文件内容填入textarea
                    handleInputChange({ target: { value: fileData } });
                    //调用id为"send-button"的按钮的click事件
                    const sendButton = document.getElementById("send-button");


                } catch (error) {
                    setFileError('读取文件失败: ' + error.message);
                }
            }
        }
    };

    // 处理文件选择
    const handleFileSelect = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (checkFileType(file)) {
                setFiles(event.target.files);
                setShowUploadMask(false);

                try {
                    // 读取文件内容
                    const fileData = await readFile(file);
                    // 将文件内容填入textarea
                    handleInputChange({ target: { value: fileData } });
                    //调用id为"send-button"的按钮的click事件
                    const sendButton = document.getElementById("send-button");
                    if (sendButton) {
                        console.log("sendButton:", sendButton);
                        sendButton.click();
                    }

                } catch (error) {
                    setFileError('读取文件失败: ' + error.message);
                }
            }
        }
    };

    // 阻止默认拖放行为
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // 输入内容变化时调整输入框高度
    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    return (
        <div className={`bg-white rounded-lg shadow-lg p-4`}>

            {/* 文件上传遮罩层 */}
            {showUploadMask && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        className="bg-white rounded-lg p-6 max-w-md w-full border-2 border-dashed border-gray-300"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex flex-col items-center justify-center py-10">
                            <ArrowUpTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium text-gray-900 mb-2">拖拽文件到此处上传</p>
                            <p className="text-sm text-gray-500 mb-6">支持的格式: {ALLOWED_FILE_EXTENSIONS.join('、')}</p>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        document.getElementById('file-upload').click();
                                    }}
                                    className="px-4 py-2"
                                >
                                    选择文件
                                </Button>
                                <Button
                                    type="button"
                                    className="px-4 py-2 bg-black text-white"
                                    onClick={hideUploadDialog}
                                >
                                    取消
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={async (event) => {
                event.preventDefault(); // 先阻止默认提交
                console.log('handleSubmit');
                handleSubmit(event); // 然后再调用 handleSubmit
            }}>
                {fileError && (
                    // 显示文件上传错误提示
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {fileError}
                    </div>
                )}

                {/* 应用角色选择下拉框 */}
                <div className="mb-4 width-200 inline-block ">
                    <select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 hover:shadow-sm cursor-pointer"
                    >
                        {APP_ROLES.map(role => (
                            <option key={role.id} value={role.id} >
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="输入您的问题... "
                    className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[80px] max-h-[240px] ${showScrollbar ? 'overflow-y-auto' : 'overflow-y-hidden'} scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-4`}
                />
                <div className="flex justify-between items-center">
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept={ALLOWED_FILE_EXTENSIONS.join(',')}
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 transition-colors hover:bg-blue-50 hover:shadow-sm cursor-pointer"
                            onClick={showUploadDialog}
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            <span>上传文件</span>
                        </Button>
                    </div>
                    <Button type="submit" className="flex items-center gap-2 bg-black text-white transition-transform hover:scale-102 cursor-pointer" id="send-button">
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span>发送</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}



function readFile(file) {
    switch (file.type) { // 根据文件类型进行不同的处理
        case 'application/pdf':
            // 处理 PDF 文件
            return pdf2text(file);
        case 'text/plain':
            // 处理文本文件
            return readTextFile(file);
        case 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            // 处理 Word 文档
            return word2text(file);
        default:
            // 处理其他文件类型
            return '不支持的文件类型';
    }
}

function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function pdf2text(file) {
    try {
        // 1. 读取文件为 ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // 2. 加载 PDF 文档
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        // 3. 获取所有页面
        const pages = pdfDoc.getPages();

        // 4. 提取每一页的文本
        let fullText = '';
        for (const page of pages) {
            const textContent = await page.getTextContent();
            const textItems = textContent.items;
            const pageText = textItems.map(item => item.str).join(' ');
            fullText += pageText + '\n'; // 每页之间加换行
        }

        return fullText;
    } catch (error) {
        console.error('PDF 解析失败:', error);
        throw error; // 抛出错误以便调用方处理
    }
}


function word2text(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                // 使用mammoth将Word文档转换为文本
                const arrayBuffer = event.target.result;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value); // 返回提取的文本内容
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
