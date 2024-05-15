import React from 'react';
import botIcon from "../../images/boticon.png";
import { useEffect, useState } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx"; 

const ChatBubble = ({ chatMessage , handlePopUpClick }) => {
    if (chatMessage.sender === 'bot' && chatMessage.contentType === 'ImageResponseCard')
        console.log("hm", chatMessage.imageResponseCard)

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set loading to true when a new message is received
        setIsLoading(true);

        // Simulate message processing time (remove this setTimeout in your actual implementation)
        const timeout = setTimeout(() => {
            setIsLoading(false); // Set loading to false when message processing is complete
        }, 2000); // Adjust the timeout duration as needed or remove it for real-time data processing

        return () => clearTimeout(timeout); // Clean up timeout on component unmount
    }, [chatMessage]); // Trigger effect on new chatMessage

    
    const handleClick = (value) => {
        console.log("Div clicked with value:", value);
        handlePopUpClick(value);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderPlainText = () => (
        <div className="bot-main-div">
            <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
            <div className="bot message botmessages-div">{chatMessage.message}</div>
        </div>
    );

    const renderImageResponseCard = () => (
        <div className="bot-main-div">
            <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
            <div className='botmessages-div'>
                <div className="bot message ">{chatMessage.imageResponseCard.title}</div>
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

    const renderAssignmentsWithTaskA = (payloadItem, taskA) => (
        <div>
            {taskA !== "" && (
                <div className='assignments-div'>
                    {payloadItem.Assignments.L.map((assignment, index) => {
                        const assignmentType = assignment.M.AssignmentType.S;
                        if (assignmentType.includes(taskA)) {
                            return (
                                <div key={index} className='assignment-bubble'>
                                    Task {index + 1}: {capitalizeFirstLetter(taskA)} - {assignment.M.Percentage_Weight.N}%
                                </div>
                            );
                        } else {
                            return null;
                        }
                    })}
                </div>
            )}
        </div>
    );
    
    const renderMultipleTasks = (payloadItem, tasks) => {
        console.log(payloadItem);
    
        const assignmentsList = [];
    
        payloadItem.Assignments.L.forEach((assignment, index) => {
            const assignmentType = assignment.M.AssignmentType.S;
            const matchingTasks = [];
            tasks.forEach(task => {
                if (assignmentType.includes(task)) {
                    matchingTasks.push(task);
                }
            });
    
            if (matchingTasks.length > 0) {
                assignmentsList.push({
                    assignment_index: index,
                    assignment: assignment,
                    tasks_names: matchingTasks.join(' ')
                });
            }
        });
    
        return (
            <div className='assignments-div'>
                {assignmentsList.map((assignmentItem, index) => {
                    const { assignment_index, assignment, tasks_names } = assignmentItem;
                    return (
                        <div key={assignment_index} className='assignment-bubble'>
                            Task {assignment_index + 1}: {capitalizeFirstLetter(tasks_names)} - {assignment.M.Percentage_Weight.N}%
                        </div>
                    );
                })}
            </div>
        );
    };
    
    const renderCustomPayload = () => {
        
        const customPayloadData = JSON.parse(chatMessage.content);
        const intent = chatMessage.intent.name;
        const slots = chatMessage.intent.slots;
        let taskA = "";
        let tasks = [];
    
        if (intent==='CourseElectivesWithA'){
            taskA = slots.Task_A.value.interpretedValue;
        }
        if (intent === 'FilterWithA'){
            //  tasks is a list of all the "with task A" slots values. 
            tasks = slots;
        }


        return (
            <div className="bot-main-div">
                <div><img className="botIcon" src={botIcon} alt="Bot Icon" /></div>
                <div className='botmessages-div bot message '>
                    {customPayloadData.map((payloadItem, index) => (
                        <button 
                            className='subject-div' 
                            key={index} 
                            onClick={() => window.open(payloadItem.SubjectLink.S, '_blank')}
                        >
                            <div>{payloadItem.SubjectCode.S} - {payloadItem.SubjectName.S}</div>
                            {intent === 'CourseElectivesWithA' && (
                                <div>
                                    {renderAssignmentsWithTaskA(payloadItem, taskA)}
                                </div>
                            )}
                            {intent === 'FilterWithA' && (
                                <div>
                                    {renderMultipleTasks(payloadItem, tasks)}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    };
    

    const renderUserMessage = () => (
        <div className="user-message-container">
            <div className="user message">{chatMessage.message}</div>
        </div>
    );

    const renderContent = () => {
        if (chatMessage.sender === 'bot') {
            if (isLoading) {
                return <LoadingSpinner />; // Render loading spinner while loading
            }
            if (chatMessage.contentType === 'PlainText') {
                return renderPlainText();
            } else if (chatMessage.contentType === 'ImageResponseCard') {
                return renderImageResponseCard();
            } else if (chatMessage.contentType === 'CustomPayload') {
                return renderCustomPayload();
            }
        } else if (chatMessage.sender === 'user') {
            return renderUserMessage();
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
};

export default ChatBubble;
