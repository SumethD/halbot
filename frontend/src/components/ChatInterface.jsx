import React, {useState, useRef, useEffect} from 'react';
import './ChatInterface.css'; // Import CSS file for styling
import '../values/colours.css';
import PromptsPopUp from './PromptsPopUp';
import {sendMessage} from "../utils/client";
import ChatBubble from "./ChatBubble/ChatBubble";

const ChatInterface = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const chatbox = useRef(null);
    useEffect(() => chatbox.current.scrollIntoView(false), [chatHistory]);

    //const example_response = ["Hello I am Hal!", "idk"];
    const example_response = "Hello I";


    // method for send through button or press enter
    const handleSendMessage = async (userMessage = inputMessage) => {
        if (userMessage.trim() !== '') {
            setChatHistory([...chatHistory,
                {
                    sender: 'user',
                    message: userMessage
                }
            ]);

            const res = await sendMessage(userMessage);

            console.log(res);

            if (!res || !res.messages) return;

            const botMessages = res.messages;

            const mappedMessages = botMessages.map(message => (
                {
                    sender: 'bot',
                    message: message.content,
                    ...message
                }
            ));

            console.log(mappedMessages)

            setChatHistory([...chatHistory, ...mappedMessages]);
            setInputMessage('');
        }
    };

    // method for pop up send
    const handlePopUpClick = async (message) => {
        handleSendMessage(message);
    };


    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleKeyPress = async (event) => {
        if (event.key === 'Enter') {
            await handleSendMessage();
        }
    };

    return (
        <div className="chat-main-div">
            <PromptsPopUp
                handlePopUpClick={handlePopUpClick}
            ></PromptsPopUp>
            <div className="chat-interface">
                <div className="header-box">HAL BOT</div>
                <div className="chat-history">
                    <div ref={chatbox}>
                        {chatHistory.map((message, index) => (
                           <ChatBubble key={index} chatMessage={message} />
                        ))}
                    </div>
                </div>
                <div className="message-div">
                    <div className="message-input">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="input-field"
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={handleSendMessage} className="send-button">Send</button>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default ChatInterface;
