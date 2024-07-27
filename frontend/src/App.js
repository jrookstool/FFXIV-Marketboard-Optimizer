import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './App.css';

function App() {

  const [resourceName, setResourceName] = useState('Boar Hide');
  const [quantity, setQuantity] = useState(1);
  const [worldDCRegion, setWorldDCRegion] = useState('');
  const [world, setWorld] = useState('Jenova');
  const [showWorld, setShowWorld] = useState(false);
  const [options, setOptions] = useState([]);

  const customStyles = {
    option: provided => ({
      ...provided,
      color: 'black'
    }),
    control: provided => ({
      ...provided,
      color: 'black'
    }),
    singleValue: provided => ({
      ...provided,
      color: 'black'
    })
  }

  async function handleSubmit() {
    //console.log('submitting', quantity, resourceName);
    if (!worldDCRegion || !world) {
      alert('Please select a world and data center region');
      return;
    }
    else if (!worldDCRegion) {
      alert('Please select a data center region');
      return;
    } else if (world) {
      setWorldDCRegion(world.value);
    } else {
      setWorldDCRegion(worldDCRegion.value);
    }
    let res = await axios.post('http://localhost:8000/search', {
      name: resourceName,
      quantity: quantity,
      dataCenter: worldDCRegion,
    })

    console.log('res', res.data);

    if (res) {
      console.log(res);
    }
  }

  function getOptionsFromWorld(worldDCRegion) {
    let options = [];

    switch(worldDCRegion) {
      case 'Aether':
        options = [
          {value: 'Adamantoise', label: 'Adamantoise'},
          {value: 'Cactuar', label: 'Cactuar'},
          {value: 'Faerie', label: 'Faerie'},
          {value: 'Gilgamesh', label: 'Gilgamesh'},
          {value: 'Jenova', label: 'Jenova'},
          {value: 'Midgardsormr', label: 'Midgardsormr'},
          {value: 'Sargatanas', label: 'Sargatanas'},
          {value: 'Siren', label: 'Siren'},
        ];
        break;
      case 'Crystal':
        options = [
          {value: 'Balmung', label: 'Balmung'},
          {value: 'Brynhildr', label: 'Brynhildr'},
          {value: 'Coeurl', label: 'Coeurl'},
          {value: 'Diabolos', label: 'Diabolos'},
          {value: 'Goblin', label: 'Goblin'},
          {value: 'Malboro', label: 'Malboro'},
          {value: 'Mateus', label: 'Mateus'},
          {value: 'Zalera', label: 'Zalera'},
        ];
        break;
      case 'Dynamis':
        options = [
          {value: 'Cuchulainn', label: 'Cuchulainn'},
          {value: 'Golem', label: 'Golem'},
          {value: 'Halicarnassus', label: 'Halicarnassus'},
          {value: 'Kraken', label: 'Kraken'},
          {value: 'Maduin', label: 'Maduin'},
          {value: 'Marilith', label: 'Marilith'},
          {value: 'Rafflesia', label: 'Rafflesia'},
          {value: 'Seraph', label: 'Seraph'},
        ];
        break;
      case 'Primal':
        options = [
          {value: 'Behemoth', label: 'Behemoth'},
          {value: 'Excalibur', label: 'Excalibur'},
          {value: 'Exodus', label: 'Exodus'},
          {value: 'Famfrit', label: 'Famfrit'},
          {value: 'Hyperion', label: 'Hyperion'},
          {value: 'Lamia', label: 'Lamia'},
          {value: 'Leviathan', label: 'Leviathan'},
          {value: 'Ultros', label: 'Ultros'},
        ];
        break;
      case 'Chaos':
        options = [
          {value: 'Cerberus', label: 'Cerberus'},
          {value: 'Louisoix', label: 'Louisoix'},
          {value: 'Moogle', label: 'Moogle'},
          {value: 'Omega', label: 'Omega'},
          {value: 'Phantom', label: 'Phantom'},
          {value: 'Ragnarok', label: 'Ragnarok'},
          {value: 'Sagittarius', label: 'Sagittarius'},
          {value: 'Spriggan', label: 'Spriggan'},
        ];
        break;
      case 'Light':
        options = [
          {value: 'Alpha', label: 'Alpha'},
          {value: 'Lich', label: 'Lich'},
          {value: 'Odin', label: 'Odin'},
          {value: 'Phoenix', label: 'Phoenix'},
          {value: 'Raiden', label: 'Raiden'},
          {value: 'Shiva', label: 'Shiva'},
          {value: 'Twintania', label: 'Twintania'},
          {value: 'Zodiark', label: 'Zodiark'},
        ];
        break;
      case 'Shadow':
        options = [
          {value: 'Innocence', label: 'Innocence'},
          {value: 'Pixie', label: 'Pixie'},
          {value: 'Titania', label: 'Titania'},
          {value: 'Tycoon', label: 'Tycoon'},
        ];
        break;
      case 'Elemental':
        options = [
          {value: 'Aegis', label: 'Aegis'},
          {value: 'Atomos', label: 'Atomos'},
          {value: 'Carbuncle', label: 'Carbuncle'},
          {value: 'Garuda', label: 'Garuda'},
          {value: 'Gungnir', label: 'Gungnir'},
          {value: 'Kujata', label: 'Kujata'},
          {value: 'Tonberry', label: 'Tonberry'},
          {value: 'Typhon', label: 'Typhon'},
        ];
        break;
      case 'Gaia':
        options = [
          {value: 'Alexander', label: 'Alexander'},
          {value: 'Bahamut', label: 'Bahamut'},
          {value: 'Durandal', label: 'Durandal'},
          {value: 'Fenrir', label: 'Fenrir'},
          {value: 'Ifrit', label: 'Ifrit'},
          {value: 'Ridill', label: 'Ridill'},
          {value: 'Tiamat', label: 'Tiamat'},
          {value: 'Ultima', label: 'Ultima'},
        ];
        break;
      case 'Mana':
        options = [
          {value: 'Anima', label: 'Anima'},
          {value: 'Asura', label: 'Asura'},
          {value: 'Chocobo', label: 'Chocobo'},
          {value: 'Hades', label: 'Hades'},
          {value: 'Ixion', label: 'Ixion'},
          {value: 'Masamune', label: 'Masamune'},
          {value: 'Pandaemonium', label: 'Pandaemonium'},
          {value: 'Titan', label: 'Titan'},
        ];
        break;
      case 'Meteor':
        options = [
          {value: 'Belias', label: 'Belias'},
          {value: 'Mandragora', label: 'Mandragora'},
          {value: 'Ramuh', label: 'Ramuh'},
          {value: 'Shinryu', label: 'Shinryu'},
          {value: 'Unicorn', label: 'Unicorn'},
          {value: 'Valefor', label: 'Valefor'},
          {value: 'Yojimbo', label: 'Yojimbo'},
          {value: 'Zeromus', label: 'Zeromus'},
        ];
        break;
      case 'Materia':
        options = [
          {value: 'Bismarck', label: 'Bismarck'},
          {value: 'Ravana', label: 'Ravana'},
          {value: 'Sephirot', label: 'Sephirot'},
          {value: 'Sophia', label: 'Sophia'},
          {value: 'Zurvan', label: 'Zurvan'},
        ];
        break;
      default:
        break;
    }
    return options;
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
              <label className="form-label">
                Quantity:
                <input 
                  type="text" 
                  name="name" 
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}/>
              </label>
              
          </div>

          <div>
              <label className="form-label">
                Data Center Region:
                <Select
                  className="form-input"
                  value={worldDCRegion}
                  onChange={(e) => {
                    setWorldDCRegion(e);
                    setOptions(getOptionsFromWorld(e.value));
                    setWorld(null);
                  }}
                  options={[
                    {value: 'Aether', label: 'Aether'},
                    {value: 'Primal', label: 'Primal'},
                    {value: 'Crystal', label: 'Crystal'},
                    {value: 'Dynamis', label: 'Dynamis'},
                    {value: 'Shadow', label: 'Shadow'},
                    {value: 'Chaos', label: 'Chaos'},
                    {value: 'Light', label: 'Light'},
                    {value: 'Elemental', label: 'Elemental'},
                    {value: 'Gaia', label: 'Gaia'},
                    {value: 'Mana', label: 'Mana'},
                    {value: 'Meteor', label: 'Meteor'},
                    {value: 'Materia', label: 'Materia'},
                  ]}
                  styles={customStyles}
                />
                <div>
                  <input type="checkbox" onClick={() => setShowWorld(!showWorld)}/>
                  <label style={{ 'fontSize': '20px' }}> Show World </label>
                </div>
                
              </label>  
          </div>
          
          {showWorld && <div>
            <label className="form-label">
              World:
              <Select
                className="form-input"
                value={world}
                onChange={(e) => setWorld(e)}
                options={options}
                styles={customStyles}
              />
            </label>
          </div>
          }
          

          <button className="form-button" onClick={handleSubmit}> Submit </button>
        </div>
        
        
      </header>
    </div>
  );
}

export default App;