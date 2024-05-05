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

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
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


                // for displaying assingment %
                const intent = chatMessage.intent.name;
                const slots = chatMessage.intent.slots
                let taskA = ""

                if (intent==='CourseElectivesWithA'){
                    taskA = slots.Task_A.value.interpretedValue
                }

                return (
                    <div className="bot-main-div">
                        <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
                        <div className='botmessages-div bot message '>
                            {/* Render each custom payload item aka subject */}
                            {customPayloadData.map((payloadItem, index) => (
                                <button 
                                    className='subject-div' 
                                    key={index} 
                                    onClick={() => window.open(payloadItem.SubjectLink.S, '_blank')}
                                >
                                    <div>{payloadItem.SubjectCode.S} - {payloadItem.SubjectName.S}</div>
                                    {taskA !== "" && payloadItem.Assignments && (
                                        <div>
                                            {/* Display assignments if taskA is not an empty string */}
                                            <div className='assignments-div'>
                                                {payloadItem.Assignments.L.map((assignment, index) => {
                                                    const assignmentType = assignment.M.AssignmentType.S;
                                                    if (assignmentType.includes(taskA)) {
                                                        return (
                                                            <div key={index} className='assignment-bubble'>
                                                                Task {index+1}: {capitalizeFirstLetter(taskA)} - {assignment.M.Percentage_Weight.N}%
                                                            </div>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </button>
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
