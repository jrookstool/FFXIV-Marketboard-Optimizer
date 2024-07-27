import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './App.css';
import Home from './Home';
import DisplayPrice from './DisplayPrice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/displayPrices" element={<DisplayPrice />} />
      </Routes>
    </Router>
  );
}

export default App;