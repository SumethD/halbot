import React, { useState} from 'react';
import './PromptsPopUp.css';
import info_icon from '../images/fi-rr-info.svg';
import '../values/colours.css';


const PromptsPopUp = () => {
    const [popupOpen, setPopupOpen] = useState(false);

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
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
                
                <div>HELLO I AM SO ANNOYED RN I WANNA KILL EVRYOEN</div>
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