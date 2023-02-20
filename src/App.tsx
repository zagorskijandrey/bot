import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {AIBotService} from "./AIBotService";

function App() {

  const [value, setValue] = useState<string>('');
  const [dialog, setDialog] = useState<{key: string, value: string} []> ([]);
  const [weatherData, setWeatherData] = useState<any>(undefined);

  const aiBotService: AIBotService = new AIBotService();

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      const v = value;

      if (v.toLowerCase().match("what is your name")) {
        setTimeout(() => {
          dialog.push({key: "bot", value: "My name is Toby!"});
          setDialog([...dialog]);
          setTimeout(() => {
            dialog.push({key: "bot", value: "How are you?"});
            setDialog([...dialog]);
            updateBotAnswer(`How can I help you?`, 2000);
          }, 2000);
        }, 1000);
      } else if (v.toLowerCase().match("humidity") && weatherData) {
        updateBotAnswer(`Humidity ${weatherData.main.humidity} %`, 1000);
      } else if (v.toLowerCase().match("pressure") && weatherData) {
        updateBotAnswer(`Pressure ${weatherData.main.pressure} bar`, 1000);
      } else {
        setTimeout(async () => {
          if (dialog.length === 1) {
            dialog.push({key: "bot", value: "What is your name?"});
            setDialog([...dialog]);
          } else if (dialog.length === 3) {
            const answer: any = await aiBotService.getAnswer("hello");
            dialog.push({key: "bot", value: `${answer} ${v}!`});
            setDialog([...dialog]);
          } else {
            const answer: any = await aiBotService.getAnswer(v);
            if (typeof answer !== "string") {
              setWeatherData(answer);
              dialog.push({key: "bot", value: `Temperature ${answer.main.temp} F`});
            } else {
              dialog.push({key: "bot", value: answer});
            }
            setDialog([...dialog]);
          }
        }, 1000);
      }


      dialog.push({key: "user", value});

      setDialog([...dialog]);
      setValue("");
    }
  };

  const updateBotAnswer = (answer: string, timeout: number) => {
    setTimeout(() => {
      dialog.push({key: "bot", value: answer});
      setDialog([...dialog]);
    }, timeout)
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
