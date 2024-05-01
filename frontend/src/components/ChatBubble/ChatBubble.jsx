import React from 'react';
import botIcon from "../../images/boticon.png";

const ChatBubble = ({chatMessage}) => {
    if (chatMessage.sender == 'bot')
        console.log("bot message: ", chatMessage.message);

    return (
        <div>
            {
                chatMessage.sender === 'bot' && (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={botIcon}></img></div>
                        <div className="bot message botmessages-div">{chatMessage.message}</div>
                    </div>
                )
            }
            {
                chatMessage.sender === 'user' && (
                    <div className="user-message-container">
                        <div className="user message">{chatMessage.message}</div>
                    </div>
                )
            }
        </div>
    );
};

export default ChatBubble;