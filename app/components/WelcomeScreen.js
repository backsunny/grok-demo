import InputArea from './InputArea';

export default function WelcomeScreen({ onSendMessage }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center -mt-40">
            <div className="w-full max-w-4xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    Grok Demo
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    想聊点什么？
                </h2>
                <InputArea onSubmit={onSendMessage} />
            </div>
        </div>
    );
} 