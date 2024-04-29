import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import './ChatInterface.css'; // Import CSS file for styling
import '../values/colours.css';
import PromptsPopUp from './PromptsPopUp';
import botIcon from '../images/boticon.png'

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const sliderRef = useRef(null);

  //const example_response = ["Hello I am Hal!", "idk"];
  const example_response = "Hello I";
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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // method for send through button or press enter
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      setChatHistory([...chatHistory, { user: inputMessage, bot: example_response, botType: typeof example_response }]);
      setInputMessage('');
    }
  };

  // method for pop up send
  const handlePopUpClick = async (message) => {
    if (message.trim() !== '') {
      setChatHistory([...chatHistory, { user: message, bot: example_response, botType: typeof example_response }]);

      setInputMessage('');
    }
  };

  return (
    <div className='chat-main-div'>
      <PromptsPopUp
        handlePopUpClick={handlePopUpClick}
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
            <div key={index}>
              {message.botType === 'object' ? (
                <div>
                  <div className='user-message-container'><div className="user message">{message.user}</div></div>
                  <div className='bot-main-div'>
                    <div><img className='botIcon' src={botIcon}></img></div>
                    <div className='botmessages-div'>
                      {message.bot.map((item, itemIndex) => (
                        <div className='bot-message-container'><div key={itemIndex} className='bot message'>{item}</div></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className='user-message-container'><div className="user message">{message.user}</div></div>
                  <div className='bot-main-div'>
                      <div><img className='botIcon' src={botIcon}></img></div>
                      <div className="bot message botmessages-div">{message.bot}</div>
                  </div>
                </div>
              )}
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
