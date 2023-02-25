import React, {useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {AIBotService} from "./AIBotService";

function App() {

  let counterUser = useRef(0);
  let counterBot = useRef(0);
  const [value, setValue] = useState<string>('');
  const [dialog, setDialog] = useState<{key: string, value: string} []> ([]);
  const [zodiacData, setZodiacData] = useState<any>(undefined);

  const aiBotService: AIBotService = new AIBotService();

  const onChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      const v = value;
      if (v.toLowerCase().match("goodbye")) {
        setDialog([])
        setTimeout(() => {
          setDialog([{key: "bot", value: "Goodbye!"}])
        }, 500)
      }
      else if (v.toLowerCase().match("what is your name")) {
        setTimeout(() => {
          dialog.push({key: "bot", value: "My name is Toby!"});
          ++counterBot.current;
          setDialog([...dialog]);
          setTimeout(() => {
            dialog.push({key: "bot", value: "How are you?"});
            ++counterBot.current;
            setDialog([...dialog]);
          }, 2000);
        }, 1000);
      }
      else if(v.toLowerCase().match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
        const zodiacSign = aiBotService.getZodiacSign(v);
        setTimeout(() => {
          dialog.push({key: "bot", value: `Your sign is ${zodiacSign}`});
          ++counterBot.current;
          setDialog([...dialog]);
        }, 1000);

        const answer: any = await aiBotService.getAnswer(zodiacSign);
        dialog.push({key: "bot", value: `Your horoscope on today - ${answer.description}`});
        ++counterBot.current;
        setDialog([...dialog]);
      }
      else if(v.toLowerCase().match("good") || v.toLowerCase().match("fine") || v.toLowerCase().match("great")) {
        updateBotAnswer(`Happy to hear that!`, 1000);
        updateBotAnswer(`How can I help you?`, 2000);
        counterBot.current = counterBot.current + 2;
      }
      // else if (v.toLowerCase().match("humidity") && weatherData) {
      //   updateBotAnswer(`Humidity is ${weatherData.main.humidity} %`, 1000);
      //   ++counterBot.current;
      // } else if (v.toLowerCase().match("pressure") && weatherData) {
      //   updateBotAnswer(`Pressure is ${weatherData.main.pressure} bar`, 1000);
      //   ++counterBot.current;
      // } else if (v.toLowerCase().match("feels") && weatherData) {
      //   updateBotAnswer(`Temperature feels like ${(weatherData.main.feels_like - 273.15).toFixed(1)} C`, 1000);
      //   ++counterBot.current;
      // } else if (v.toLowerCase().match("description") && weatherData) {
      //   updateBotAnswer(`The weather outside is ${weatherData.weather[0].description}`, 1000);
      //   ++counterBot.current;
      // } else if (v.toLowerCase().match("wind") && weatherData) {
      //   updateBotAnswer(`The wind speed is ${weatherData.wind.speed} m/s`, 1000);
      //   ++counterBot.current;
      // }
      else {
        setTimeout(async () => {
          if (dialog.length === 1) {
            dialog.push({key: "bot", value: "Hello! What is your name?"});
            ++counterBot.current;
            setDialog([...dialog]);
          } else if (dialog.length === 3) {
            const answer: any = await aiBotService.getAnswer("hello");
            dialog.push({key: "bot", value: `${answer} ${v}!`});
            ++counterBot.current;
            setDialog([...dialog]);
          } else {
            const answer: any = await aiBotService.getAnswer(v);
            if (typeof answer !== "string") {
              setZodiacData(answer);
              dialog.push({key: "bot", value: `Description of horoscope for today ${answer.main.temp}`});
              ++counterBot.current;
            } else {
              dialog.push({key: "bot", value: answer});
            }
            setDialog([...dialog]);
          }
        }, 1000);
      }


      dialog.push({key: "user", value});
      ++counterUser.current;
      console.log(counterUser)
      console.log(counterBot)

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
        <div style={{
          fontSize: "30px",
          color: "white",
          marginLeft: "30px",
          marginTop: "12px"
        }}>Lab 2 - Horoscope Prediction</div>
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
