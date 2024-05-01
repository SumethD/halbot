import React, {useState, useRef, useEffect} from 'react';
import './ChatInterface.css'; // Import CSS file for styling
import '../values/colours.css';
import PromptsPopUp from './PromptsPopUp';
import {sendMessage} from "../utils/client";
import ChatBubble from "./ChatBubble/ChatBubble";
import botIcon from "../images/boticon.png";

const ChatInterface = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const chatbox = useRef(null);
    useEffect(() => chatbox.current.scrollIntoView(false), [chatHistory]);

    // keeping an eye on chat history
    useEffect(() => {
        console.log("Chat History Updated:", chatHistory);
    }, [chatHistory]);

    // main method to send message to bot
    const handleSendMessage = async (userMessage = inputMessage) => {
        if (userMessage.trim() !== '') {
            const newUserMessage = {
                sender: 'user',
                message: userMessage
            };
    
            setChatHistory(prevChatHistory => [...prevChatHistory, newUserMessage]);
    
            const res = await sendMessage(userMessage);
    
            console.log(res);
    
            if (!res || !res.messages) return;
    
            const botMessages = res.messages.map(message => ({
                sender: 'bot',
                message: message.content,
                ...message
            }));
    
            console.log(botMessages);
    
            setChatHistory(prevChatHistory => [...prevChatHistory, ...botMessages]);
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

    // method for enter
    const handleKeyPress = async (event) => {
        console.log("type of input message ON ENTER ", typeof inputMessage, " here lie thy input: ", inputMessage)
        if (event.key === 'Enter') {
            await handleSendMessage(inputMessage);
        }
    };

    const handleButtonPress = async () => {
        console.log("type of input message ", typeof inputMessage, " here lie thy input: ", inputMessage)
        await handleSendMessage(inputMessage);
        
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
                {/* message input below: */}
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
                        <button onClick={handleButtonPress} className="send-button">Send</button>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default ChatInterface;
