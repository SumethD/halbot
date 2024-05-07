import React from 'react';
import botIcon from "../../images/boticon.png";
import systemBotIcon from "../../images/systemboticon.png"

const ChatBubble = ({chatMessage}) => {

    const MessageButtons = () => {
        return (
            chatMessage.buttons.map((chatButton) => (
                <div className="bot-main-div">
                    <button className="message-button message">{chatButton.text}</button>
                </div>
            ))
        )
    }
    return (
        <div>
            {
                chatMessage.sender === 'bot' && (
                    <div className="bot-main-div">
                        <div><img alt="HAL BOT ICON" className="botIcon" src={botIcon}></img></div>
                        <div className="bot message botmessages-div">{chatMessage.message}</div>
                    </div>
                )
            }
            {
                chatMessage.sender === 'bot' && chatMessage.buttons && (
                    <MessageButtons />
                )
            }
            {
                chatMessage.sender === 'user' && (
                    <div className="user-message-container">
                        <div className="user message">{chatMessage.message}</div>
                    </div>
                )
            }
            {
                chatMessage.sender === 'system' && (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={systemBotIcon}></img></div>
                        <div className="bot message botmessages-div">{chatMessage.message}</div>
                    </div>
                )
            }
        </div>
    );
};

export default ChatBubble;