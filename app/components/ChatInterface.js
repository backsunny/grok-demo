import { useRef, useState, useEffect } from 'react';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import MessageList from './MessageList';
import InputArea from './InputArea';

export default function ChatInterface({ messages, onSendMessage,liha}) {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);





    useEffect(() => {
        let one = window.addEventListener("scroll", scorePOI, true) //监听滚动条变化
        return () => {
            window.removeEventListener("scroll", scorePOI, true) //清除监听
        }
    }, [])
    //监听到滚动条变化，处理的函数
    function scorePOI() {
        if (window.innerHeight + window.scrollY + 10 <= liha.current.scrollHeight) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    }

    return (
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col relative">
            <div ref={messagesContainerRef} className="flex-1">
                <MessageList messages={messages} messagesEndRef={messagesEndRef} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent h-32 pointer-events-none"></div>
            <div className="bg-white rounded-lg shadow-lg fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
                <Button
                    onClick={scrollToBottom}
                    className={`rounded-full p-2 bg-black text-white shadow-lg hover:bg-gray-800 absolute -top-15 right-10 transition-opacity duration-200 ${showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none' } }`}
                >
                    <ArrowDownIcon className="h-5 w-5" />
                </Button>
                <InputArea onSubmit={onSendMessage} />

            </div>
        </div>
    );
}
