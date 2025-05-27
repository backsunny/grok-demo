'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowDownIcon, PaperAirplaneIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import MessageList from './components/MessageList';
import InputForm from './components/InputForm';

/**
 * 导航栏组件
 */
function Navbar() {
  return (
    <nav className="px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Grok Demo</h1>
      </div>
    </nav>
  );
}

export default function Home() {
  const scrollRef = useRef(null); // 用于监听滚动事件的容器引用
  const [selectedRole, setSelectedRole] = useState('default'); // 当前选择的应用角色
  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit } = useChat(); // 使用聊天状态管理
  const [showScrollButton, setShowScrollButton] = useState(false); // 控制"返回底部"按钮的显示状态
  const messagesEndRef = useRef(null); // 消息列表底部的引用（用于滚动定位）
  const messagesContainerRef = useRef(null);
  const [files, setFiles] = useState(null); // 已上传的文件列表
  const isConversationStarted = messages.length > 0; // 判断是否已开始对话

  // 自定义提交处理函数，添加角色信息
  const handleSubmit = (event, options) => {
    event.preventDefault();
    // 将角色信息添加到请求中
    originalHandleSubmit(event, { 
      ...options,
      data: { role: selectedRole } 
    });
  };

  // 滚动到消息列表底部（新消息到达时触发）
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 消息变化时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 移除事件监听的清理函数
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", scorePOI, true);
    }
  }, []);

  // 监听滚动事件，判断是否显示"返回底部"按钮
  function scorePOI() {
    if (window.innerHeight + window.scrollY + 10 <= scrollRef.current.scrollHeight) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }

  // 移除已上传的文件
  const handleRemoveFile = () => {
    setFiles(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen overflow-y-auto" ref={scrollRef}>
      <Navbar />
      {messages.length === 0 ? (
        // 无消息时显示欢迎界面
        <div className="flex-1 flex flex-col items-center justify-center -mt-40">
          <div className="w-full max-w-4xl px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Grok Demo
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              想聊点什么？
            </h2>
            <InputForm 
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              files={files}
              setFiles={setFiles}
              handleRemoveFile={handleRemoveFile}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              isConversationStarted={isConversationStarted}
            />
          </div>
        </div>
      ) : (
        // 有消息时显示聊天界面
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col relative">
          <div ref={messagesContainerRef} className="flex-1">
            <MessageList messages={messages} messagesEndRef={messagesEndRef} />
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent h-32 pointer-events-none"></div>
          <div className="bg-white rounded-lg shadow-lg fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
            <Button
              onClick={scrollToBottom}
              className={`rounded-full p-2 bg-black text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl absolute -top-15 right-10 cursor-pointer ${showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'} }`}
            >
              <ArrowDownIcon className="h-5 w-5" />
            </Button>
            <InputForm
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              files={files}
              setFiles={setFiles}
              handleRemoveFile={handleRemoveFile}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              isConversationStarted={isConversationStarted}
            />
          </div>
        </div>
      )}
    </main>
  );
}
