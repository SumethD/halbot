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
    // Scroll to bottom of the chat history when chat history updates
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(chatHistory.length);
    }
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      // Send user message to Lex
      const response = await sendMessageToLex(inputMessage);
      // Update chat history with user message and Lex response
      setChatHistory([...chatHistory, { user: inputMessage, bot: response['message'] }]);
      setInputMessage('');
    }
  };


  return (
    <div className='chat-main-div'>
      <PromptsPopUp></PromptsPopUp>
      <div className="chat-interface">
        <div className="header-box">
          <h1>HAL BOT</h1>
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
            />
            <button onClick={handleSendMessage} className="send-button">Send</button>
          </div>
          
        </div>
      </div>
    </div>
    
  );
};

export default ChatInterface;
