import React, {useState} from "react";
import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'

import config from "./configs/chatbotConfig";
import ActionProvider from "./configs/ActionProvider";
import MessageParser from "./configs/MessageParser";

function WebsiteBot() {
    const [open, setOpen] = useState(false)

    const togglePopup = () => {
        setOpen(!open);
      };

    return (
        <>
        <button
            className="z-20 fixed bottom-9 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-blue-800 hover:bg-blue-900 m-0 cursor-pointer bg-none p-0 normal-case leading-5"
            onClick={togglePopup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-white block border-gray-200 align-middle">
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" className="border-gray-200">
            </path>
            </svg>
        </button>

        {open === true &&
            <div className="">
                <div className="relative">
                    <div className="z-20
                    fixed bottom-0 right-14
                    mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10">
                        <Chatbot
                        config={config}
                        messageParser={MessageParser}
                        actionProvider={ActionProvider}
                    />
                    </div>
                </div>
            </div>
        }
        
        </>
    );
}

export default WebsiteBot;