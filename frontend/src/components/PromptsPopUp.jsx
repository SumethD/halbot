import React, { useState} from 'react';
import './PromptsPopUp.css';
import info_icon from '../images/fi-rr-info.svg';
import '../values/colours.css';
import CourseFilter from './CourseFilter';
const PromptsPopUp = ({handlePopUpClick}) => {
    const [popupOpen, setPopupOpen] = useState(false);

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const handleClick = (promptText) => {
        handlePopUpClick(promptText);
    };
    
    return(
        <>
            {popupOpen && (
                <div className="popup-main-div">
                <div className='prompts-header-main-div'>
                    <div className='header'>Here are some prompts you can try</div>
                    <div className='info_button'onClick={togglePopup}>
                    <img className='info_icon' src={info_icon} alt="info"/>
                    </div>
                </div>
                <div className='prompts-main-div'>
                    <div className='prompt-div' onClick={() => handleClick("What course electives can I take?")}>
                        What course electives can I take?
                    </div>
                    <CourseFilter></CourseFilter>
                </div>
                </div>
            )}

            {!popupOpen && (
            <div className='info_main_div'>
                <div className='info_button'onClick={togglePopup}>
                <img className='info_icon' src={info_icon} alt="info"/>
                </div>
            </div>
            )}
        </>
    );

};

export default PromptsPopUp;