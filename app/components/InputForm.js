'use client';
import { useRef, useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

// 允许上传的文件扩展名白名单
const ALLOWED_FILE_EXTENSIONS = ['.txt', '.doc', '.docx', '.pdf', '.xls', '.xlsx'];
// 允许上传的文件MIME类型白名单
const ALLOWED_FILE_TYPES = [
    'text/plain', // .txt
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/pdf', // .pdf
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
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
 * @param {boolean} props.isConversationStarted - 是否已开始对话
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
            return;
        }

        // 检查MIME类型
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setFileError(`不支持的文件类型。请上传以下格式的文件：${ALLOWED_FILE_EXTENSIONS.join('、')}`);
            fileInputRef.current.value = '';
            return;
        }

        setFileError(''); // 清除错误提示
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

    // 输入内容变化时调整输入框高度
    useEffect(() => {
        adjustTextareaHeight();
    }, [input]);

    return (
        <div className={`bg-white rounded-lg shadow-lg p-4`}>
            {/* 确认对话框 */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">提示</h3>
                        <p className="text-gray-600 mb-6">无法在对话中切换角色，是否回到开始界面</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={cancelRoleChange}
                                className="px-4 py-2"
                            >
                                否
                            </Button>
                            <Button
                                type="button"
                                className="px-4 py-2 bg-black text-white"
                                onClick={confirmRoleChange}
                            >
                                是
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={event => {
                handleSubmit(event, { experimental_attachments: files });
                setFiles(undefined); // 提交后清空文件列表
                if (fileInputRef.current) fileInputRef.current.value = ''; // 重置文件选择框
            }}>
                {fileError && (
                    // 显示文件上传错误提示
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {fileError}
                    </div>
                )}
                {files?.[0] && (
                    // 显示已上传的文件信息
                    <div className="mb-4 flex items-center gap-2 p-3 bg-gray-50 rounded-lg w-50">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                                {files[0].name.split('.').slice(0, -1).join('.')}
                            </div>
                            <div className="text-sm text-gray-500">
                                {files[0].name.split('.').pop()} • {formatFileSize(files[0].size)}
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 rounded-full p-1 cursor-pointer"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </Button>
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
                            onChange={event => {
                                if (event.target.files) {
                                    checkFileType(event.target.files[0]); // 检查文件类型
                                    setFiles(event.target.files); // 更新文件列表
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 transition-colors hover:bg-blue-50 hover:shadow-sm cursor-pointer"
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                            <span>上传文件</span>
                        </Button>
                    </div>
                    <Button type="submit" className="flex items-center gap-2 bg-black text-white transition-transform hover:scale-102 cursor-pointer">
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span>发送</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}

/**
 * 格式化文件大小（辅助函数）
 * @param {number} size 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
function formatFileSize(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

