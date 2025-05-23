'use client';

import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const liha = useRef(null) //创建useRef 

  const handleSendMessage = (input) => {
    const newMessage = {
      id: Date.now(),
      text: input.text || '',
      file: input.file || null,
      sender: 'user',
    };

    setMessages([...messages, newMessage]);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: '这是一个模拟的AI响应。在实际应用中，这里会连接到真实的AI服务。',
        sender: 'ai',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <main className="flex flex-col bg-gray-50 min-h-screen overflow-y-auto" ref={liha}>
      <Navbar />
      {messages.length === 0 ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} liha={liha} />
      )}
    </main>
  );
}
