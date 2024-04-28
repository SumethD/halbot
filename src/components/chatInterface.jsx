import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import { sendMessageToLex } from '../services/lexServices';
import './ChatInterface.css'; // Import CSS file for styling
import '../values/colours.css';
import PromptsPopUp from './PromptsPopUp';

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    // TODO: the scroll gets rid of previous chat history
    // Scroll to bottom of the chat history when chat history updates
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(chatHistory.length);
    }
    console.log("input message updated:", inputMessage)
    
  }, [chatHistory,inputMessage]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    console.log("reched dumb")
    console.log("input message: ", inputMessage)
    if (inputMessage.trim() !== '') {
      // Send user message to Lex
      console.log("reched dum")

      const response = await sendMessageToLex(inputMessage);
      // Update chat history with user message and Lex response
      console.log("reched dum")

      setChatHistory([...chatHistory, { user: inputMessage, bot: response['message'] }]);
      setInputMessage('');
      console.log("reched dum")

    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // connection from pop up component
  const updateInputMessage = async (message) => {
    // First, update the input message
    await setInputMessage(message);
    console.log("from update input message: ", inputMessage)

    // Then, call handleSendMessage after inputMessage state has been updated
    handleSendMessage();
  };


  return (
    <div className='chat-main-div'>
      <PromptsPopUp
        updateInputMessage={updateInputMessage}
      ></PromptsPopUp>
      <div className="chat-interface">
        <div className="header-box">
          HAL BOT
        </div>
        <Slider
          ref={sliderRef}
          dots={false}
          arrows={false}
          infinite={false}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          vertical={true}
          className="chat-history"
        >
          {chatHistory.map((message, index) => (
            <div key={index} className="message">
              <p className="user-message">User: {message.user}</p>
              <p className="bot-message">Bot: {message.bot}</p>
            </div>
          ))}
        </Slider>
        <div className="message-div">
          <div className='message-input'>
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
