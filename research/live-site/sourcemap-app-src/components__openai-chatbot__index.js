import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { NavLink, Outlet } from 'react-router-dom';
import BannerImage from '../../sub-components/banner-image';

const documentUploadUrl = 'http://20.46.197.154:7000/start_chat';
const chatWithDocumentUrl = 'http://20.46.197.154:7000/chat';
const session_id = uuid();

export default function OpenAIChatbot() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [modelVersion, setModelVersion] = useState('gpt-4o');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: inputMessage }]);
        setInputMessage('');
        try {
            const botResponse = await askQuestion(inputMessage);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Error occurred while processing your request.' }]);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('user_id', session_id);

        try {
            const response = await fetch(documentUploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert(`File uploaded successfully. File path: ${data.filePath}`);
            } else {
                alert('File upload failed.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        } finally {
            setIsLoading(false);
        }
    };

    async function askQuestion(question) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        try {
            const requestBody = {
                user_id: session_id,
                query: question,
            };
            const response = await fetch(chatWithDocumentUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error('Network response was not ok');
            const responseData = await response.json();
            return responseData.response || 'No response returned.';
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Error:', error);
            return 'Server is currently offline. Please contact us directly at info@meerana.ae.';
        }
    }

    return (
        <div className="bg-[#ffff]">
            <BannerImage />
            <div className="bg-[#f9f9f9] min-h-screen flex flex-col md:flex-row">
                <div className="bg-white w-full md:w-1/4 shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-[#072FA5] mb-6">Navigation</h2>
                    <nav className="space-y-4 mb-6">
                        <NavLink
                            to="/openai-chatbot/chatarea"
                            className={({ isActive }) =>
                                `block text-[#072FA5] px-4 py-2 rounded-md ${isActive ? 'bg-[#072FA5] text-white' : 'hover:bg-[#f1f5f9]'}`
                            }
                        >
                            Chat Area
                        </NavLink>
                        <NavLink
                            to="/openai-chatbot/dashboard"
                            className={({ isActive }) =>
                                `block text-[#072FA5] px-4 py-2 rounded-md ${isActive ? 'bg-[#072FA5] text-white' : 'hover:bg-[#f1f5f9]'}`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </nav>

                    <h3 className="text-md font-semibold text-[#072FA5] mb-4">Settings</h3>
                    <div className="mb-4">
                        <label htmlFor="apiKey" className="block text-sm font-medium text-[#333333]">API Key</label>
                        <input
                            id="apiKey"
                            type="text"
                            placeholder="Enter your API key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-[#333333] bg-[#f5f5f5] placeholder-[#787878]"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="modelVersion" className="block text-sm font-medium text-[#333333]">Model Version</label>
                        <select
                            id="modelVersion"
                            value={modelVersion}
                            onChange={(e) => setModelVersion(e.target.value)}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md bg-[#f5f5f5] text-[#333333]"
                        >
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-4o">GPT-4o</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fileUpload" className="block text-sm font-medium text-[#333333]">Upload Document</label>
                        <input
                            id="fileUpload"
                            type="file"
                            onChange={handleFileChange}
                            className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-[#333333] bg-[#f5f5f5]"
                        />
                    </div>
                    <button
                        onClick={handleFileUpload}
                        className="bg-[#072FA5] text-white w-full md:w-auto px-4 py-2 rounded-md mt-2 shadow-md hover:bg-[#0652a3] transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>

                <div className="flex-1 mt-4 md:mt-0">
                    <Outlet context={{ messages, inputMessage, setInputMessage, handleSendMessage }} />
                </div>

                {isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                        <div className="text-white text-xl">Uploading...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
