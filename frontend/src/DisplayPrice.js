import React, { useState } from 'react';
import './App.css';

const DisplayPrice = () => {
    const [data, setData] = useState(sessionStorage.getItem('data'));
    return (
        <div className="App">
            <header className="App-header">
                <h1>Display Price</h1>
                <p>{data}</p>
            </header>
        </div>
    );
}

export default DisplayPrice;