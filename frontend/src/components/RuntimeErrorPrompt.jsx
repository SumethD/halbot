import React, { useState} from 'react';
import './RuntimeErrorPrompt.css';

const RuntimeErrorBox = () =>{
    return(
        <div class= "RuntimeErrorBox">
            <h1>Runtime Error!</h1>
            <h2>Please Refresh the page</h2>
            <div class = "RefeshButton">
                <button>
                    <p>Refresh</p>
                </button>
            </div>
        </div>
    );
};