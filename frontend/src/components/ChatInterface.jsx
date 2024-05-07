import React, {useState, useRef, useEffect} from 'react';
import './ChatInterface.css'; // Import CSS file for styling
import '../values/colours.css';
import PromptsPopUp from './PromptsPopUp';
import {sendMessage} from "../utils/client";
import ChatBubble from "./ChatBubble/ChatBubble";
import {v4} from "uuid";

const ChatInterface = () => {
    const [sessionId, setSessionId] = useState();
    const [inputMessage, setInputMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const chatbox = useRef(null);
    useEffect(() => {
        if(!sessionId) {
            const chatId = v4()
            setChatHistory([
                ...chatHistory,
                {
                    sender: 'system',
                    message: `Your chat id is: ${chatId}`
                }
            ])
            setSessionId(chatId);
        }
    }, [sessionId])
    useEffect(() => chatbox.current.scrollIntoView(false), [chatHistory]);

    //const example_response = ["Hello I am Hal!", "idk"];
    const example_response = "Hello I";

    const handleBotResponse = (res) => {
        console.log(res);

        if (!res || !res.messages) return;

        const botMessages = res.messages;



        const mappedMessages = botMessages.map(message => {
            let builtMessage = {
                sender: 'bot',
                message: message.content,
            }

            if(message.imageResponseCard) {
                builtMessage  = {
                    ...builtMessage,
                    message: message.imageResponseCard.title,
                    buttons: message.imageResponseCard.buttons
                }
            }

            return builtMessage;
        });

        console.log(mappedMessages)

        setChatHistory((prev) => [...prev, ...mappedMessages]);
        setInputMessage('');
    }

    // method for send through button or press enter
    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '') {
            setChatHistory([
                ...chatHistory,
                {
                    sender: 'user',
                    message: inputMessage
                }
            ]);

            const res = await sendMessage(inputMessage, sessionId);

            handleBotResponse(res);
        }
    };

    // method for pop up send
    const handlePopUpClick = async (message) => {
        if (message.trim() !== '') {
            setChatHistory([...chatHistory, {user: message, bot: example_response, botType: typeof example_response}]);
            setInputMessage('');
        }
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
                        {chatHistory &&  chatHistory.map((message, index) => (
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
