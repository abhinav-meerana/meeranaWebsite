import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ChatArea() {
    const { messages, inputMessage, setInputMessage, handleSendMessage } = useOutletContext();

    return (
        <div className="flex-grow bg-white shadow-lg p-6 flex flex-col h-screen max-h-screen">
            <h1 className="text-xl font-semibold text-[#072FA5] mb-4">OpenAI Chatbot</h1>
            
            {/* Chat History Box with Reduced Height */}
            <div className="flex-grow-0 h-[650px] border border-gray-300 rounded-md p-4 mb-4 overflow-y-auto bg-[#f5f5f5]">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center">No messages yet...</p>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-3 p-2 rounded-md max-w-xs ${message.sender === 'user'
                                ? 'ml-auto bg-blue-500 text-white'
                                : 'mr-auto bg-gray-300 text-black'
                                }`}
                        >
                            {message.text}
                        </div>
                    ))
                )}
            </div>
            
            {/* Chat Input Area */}
            <div className="flex mt-2">
                <textarea
                    placeholder="Type your message here..."
                    className="flex-grow p-2 border border-gray-300 rounded-md bg-[#f5f5f5] text-[#333333] h-12 mr-2 resize-none"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                ></textarea>
                <button
                    onClick={handleSendMessage}
                    className="bg-[#072FA5] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#0652a3] transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
