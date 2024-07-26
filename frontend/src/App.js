import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [resourceName, setResourceName] = useState('Boar Hide');
  const [quantity, setQuantity] = useState(1);
  const [worldDCRegion, setWorldDCRegion] = useState('Primal');

  async function handleSubmit() {
    //console.log('submitting', quantity, resourceName);
    let res = await axios.post('http://localhost:8000/search', {
      name: resourceName,
      quantity: quantity
    })

    console.log('res', res.data);

    if (res) {
      console.log(res);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>FFXIV Market Board Optimizer</h1>
        <p>Used to maximize your profit on the marketboard!</p>

        <div>
          <div>
            <label className="form-label">
              Resource Name:
              <input 
                type="text" 
                name="name" 
                className="form-input"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}/>
            </label>
          </div>

          <div>
              Quantity:
              <input 
                type="text" 
                name="name" 
                className="form-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}/>
          </div>

          <div>
              Data Center Region:
              <select
                className="form-input"
                value={worldDCRegion}
                onChange={(e) => setWorldDCRegion(e.target.value)}>
                <option value="Aether">Aether</option>
                <option value="Primal">Primal</option>
                <option value="Crystal">Crystal</option>
                <option value="Chaos">Chaos</option>
                <option value="Light">Light</option>
                <option value="Elemental">Elemental</option>
                <option value="Gaia">Gaia</option>
                <option value="Mana">Mana</option>
              </select>
          </div>


          <button className="form-button" onClick={handleSubmit}> Submit </button>
        </div>
        
        
      </header>
    </div>
  );
}

export default App;