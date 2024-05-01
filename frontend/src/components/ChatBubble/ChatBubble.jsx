import React from 'react';
import botIcon from "../../images/boticon.png";

const ChatBubble = ({ chatMessage , handlePopUpClick }) => {
    if (chatMessage.sender === 'bot' && chatMessage.contentType === 'ImageResponseCard')
        console.log("hm", chatMessage.imageResponseCard)


    const handleClick = (value) => {
        // Handle div click event
        console.log("Div clicked with value:", value);
        handlePopUpClick(value);
    };

    const renderContent = () => {
        if (chatMessage.sender === 'bot') {
            if (chatMessage.contentType === 'PlainText') {
                return (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
                        <div className="bot message botmessages-div">{chatMessage.message}</div>
                    </div>
                );
            } else if (chatMessage.contentType === 'ImageResponseCard') {
                return (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
                        <div className='botmessages-div'>
                            <div className="bot message ">{chatMessage.imageResponseCard.title}</div>
                            {/* map all the buttons */}
                            {chatMessage.imageResponseCard.buttons.map((button, index) => (
                                    <button 
                                        onClick={() => handleClick(button.value)} 
                                        key={index} className="button" 
                                        value={button.value}
                                    >
                                        {button.text}
                                    </button>
                            ))}
                        </div>
                    </div>
                );
            }
            
        } else if (chatMessage.sender === 'user') {
            return (
                <div className="user-message-container">
                    <div className="user message">{chatMessage.message}</div>
                </div>
            );
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default ChatBubble;
