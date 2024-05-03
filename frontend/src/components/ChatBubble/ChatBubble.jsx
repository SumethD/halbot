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
                            <div className='bot-prompt-buttons-div'>
                                {chatMessage.imageResponseCard.buttons.map((button, index) => (
                                        <button 
                                            onClick={() => handleClick(button.value)} 
                                            key={index} 
                                            className="bot-prompt-button" 
                                            value={button.value}
                                        >
                                            {button.text}
                                        </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            } else if (chatMessage.contentType === 'CustomPayload') {
                // process dyanmo maps and data to display divs of the different course codes and their names
                // Process CustomPayload data
                const customPayloadData = JSON.parse(chatMessage.content);
                return (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
                        <div className='botmessages-div'>
                            {/* Render each custom payload item aka subjecy */}
                            {customPayloadData.map((payloadItem, index) => (
                                <div key={index}>
                                    <div>Subject Code: {payloadItem.SubjectCode.S}- {payloadItem.SubjectName.S}</div>
                                    {/* Add more fields as needed */}
                                    {/* Example: */}
                                    {/* <div>Credit Points: {payloadItem.CreditPoints.N}</div> */}
                                    {/* <div>Subject Link: {payloadItem.SubjectLink.S}</div> */}
                                    {/* Render assignments */}
                                    <div>Assignments:</div>
                                    {payloadItem.Assignments.L.map((assignment, idx) => (
                                        <div key={idx}>
                                            <div>Assignment Name: {assignment.M.AssignmentName.S}</div>
                                            <div>Percentage Weight: {assignment.M.Percentage_Weight.N}</div>
                                            {/* Add more assignment fields as needed */}
                                            {/* Example: */}
                                            {/* <div>Assignment Type: {assignment.M.AssignmentType.S}</div> */}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        }   
        else if (chatMessage.sender === 'user') {
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
