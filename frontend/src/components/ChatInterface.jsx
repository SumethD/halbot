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

    // keeping an eye on chat history
    useEffect(() => {
        console.log("Chat History Updated:", chatHistory);
    }, [chatHistory]);

    // main method to send message to bot AND save to chat history
    const handleSendMessage = async (userMessage = inputMessage) => {
        if (userMessage.trim() !== '') {
            const newUserMessage = {
                sender: 'user',
                message: userMessage
            };
    
            setChatHistory(prevChatHistory => [...prevChatHistory, newUserMessage]);
            setInputMessage('');
            
            const res = await sendMessage(userMessage);
    
            console.log("res: ",res);
    
            if (!res || !res.messages) return;

            const intent = res.sessionState.intent;
    
            const botMessages = res.messages.map(message => ({
                sender: 'bot',
                message: message.content,
                intent: intent,
                ...message
            }));
    
            console.log(botMessages);
    
            setChatHistory(prevChatHistory => [...prevChatHistory, ...botMessages]);
            
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

    //  method to send message to bot and receive back (NO SAVE TO chat)
    // meant for FILTER queries only
    const sendBotQuery = async (query) => {
        if (query.trim() !== '') {

            const res = await sendMessage(query);
    
            console.log("res: ",res);
    
            if (!res || !res.messages){
                console.log("res is undefined or something")
                return;
            } 

            const intent = res.sessionState.intent;
            console.log("the intent is: ",intent);

            const botMessages = res.messages.map(message => ({
                sender: 'bot',
                message: message.content,
                intent: intent,
                ...message
            }));
    
            console.log(botMessages);
            
            return botMessages;
            
        }
    };

    // seperate method for multiple queiries and intersection 
    const handleFilterQuery = async (queryList, userMessage, botReply, intent) => {
        // render user message in chat history
        const newUserMessage = {
            sender: 'user',
            message: userMessage
        };
        setChatHistory(prevChatHistory => [...prevChatHistory, newUserMessage]);
    

        let commonCourses = []; // Array to store common courses

        console.log(queryList)
        for (const i in queryList){
            console.log("this si the query passed: ", queryList[i]);
            const q = queryList[i];
            
            const botReplies = await sendBotQuery(q);

            if (!botReplies){
                console.log("bot replies undefined, returning")
                return;
            }
            // first message is just confirmation of request message
            const query_confirmation_msg = botReplies[0].content

            // second message has raw list of courses (in map form) befitting of query
            const course_list = JSON.parse(botReplies[1].content)
            

            console.log("bot messages : ", botReplies);
            console.log(query_confirmation_msg)
            console.log(course_list)

            // If it's the first query, set the commonCourses array to the courses from the first query
            if (i === '0') {
                commonCourses = course_list;
            } else {
                // Otherwise, find the intersection with the courses from the current query
                commonCourses = commonCourses.filter(course => 
                    course_list.some(courseItem => courseItem.SubjectCode.S === course.SubjectCode.S)
                );
                console.log("common courses", commonCourses);
            }
        }

        console.log("Common courses:", commonCourses);
        if (commonCourses.length === 0){
            const botMessage = {
                sender: 'bot',
                message: botReply[1],
                content: botReply[1], 
                contentType: 'PlainText'
            };

            // render bot message in chat history
            setChatHistory(prevChatHistory => [...prevChatHistory, botMessage]);

        } 
        else {
            commonCourses = JSON.stringify(commonCourses)

            const botMessage = {
                sender: 'bot',
                message: botReply[0],
                content: botReply[0], 
                contentType: 'PlainText'
            };
            console.log("the PASSED on intent object made is: ", intent);
            
            const commonCoursesMessage = {
                sender: 'bot',
                message: commonCourses,
                content: commonCourses,
                intent: intent,
                contentType: 'CustomPayload'
            };

            // render bot message in chat history
            setChatHistory(prevChatHistory => [...prevChatHistory, botMessage]);

            // render common courses in chat history 
            setChatHistory(prevChatHistory => [...prevChatHistory, commonCoursesMessage]);
        }
        

        
    };

    return (
        <div className="chat-main-div">
            <PromptsPopUp
                handlePopUpClick={handlePopUpClick} 
                handleFilterQuery = {handleFilterQuery}
            ></PromptsPopUp>
            <div className="chat-interface">
                <div className="header-box" style={{ fontFamily: 'Share Tech Mono, monospace' }}>HAL.BOT</div>
                <div className="chat-history">
                <div ref={chatbox}>
                    {chatHistory.map((message, index) => (
                        <ChatBubble key={index} chatMessage={message} handlePopUpClick={handlePopUpClick} />
                    ))}
                </div>  
                </div>
                {/* message input below: */}
                <div className="message-div">
                    <div className="message-input">
                        <input
                            style={{ fontFamily: 'Share Tech Mono, monospace' }}
                            type="text"
                            value={inputMessage}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            className="input-field"
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={handleButtonPress} className="send-button" style={{ fontFamily: 'Share Tech Mono, monospace' }}>Send</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ChatInterface;
