import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {AIBotService} from "./AIBotService";

function App() {

  const [value, setValue] = useState<string>('');
  const [dialog, setDialog] = useState<{key: string, value: string} []> ([]);

  const aiBotService: AIBotService = new AIBotService();

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      const v = value;
      dialog.push({key: "user", value});

      setDialog([...dialog]);
      setValue("");

      setTimeout(() => {
        dialog.push({key: "bot", value: aiBotService.getAnswer(v)});

        setDialog([...dialog]);
      }, 1000)
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
        <div className="dialogWrapper">
          <div style={{overflow: "auto", maxHeight: "70vh"}}>
            {
              dialog.map((item: {key: string, value: string}, index: number) => {
                return <div key={index} style={{display: "flex", flexDirection: "row", justifyContent: item.key === "user" ? "flex-end" : "flex-start", width: "100%"}}>
                  <div className="answer">
                    {item.value}
                  </div>
                </div>
              })
            }
          </div>
          <input className="inputBlock" value={value || ""} onChange={onChange} onKeyDown={handleKeyDown}/>
        </div>
      </div>
    </div>
  );
}

export default App;
