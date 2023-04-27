import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import SelectedListItem from "./SelectedListItem";
import {ECGService} from "./ECGService";
import {Box, FormControlLabel, Slider, Switch} from "@mui/material";
import Chart from "./Chart";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    const [data, setData] = useState<any>(undefined);

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [negative, setNegative] = React.useState(false);
    const [fh, setFh] = React.useState(60);
    const [aT, setAt] = React.useState(0.2);
    const [mT, setMt] = React.useState(0.6);
    const [bT1, setBt1] = React.useState(0.05);
    const [bT2, setBt2] = React.useState(0.03);

    // useEffect(() => {
    //     setData({
    //         // @ts-ignore
    //         labels: [],
    //         datasets: [
    //             {
    //                 label: 'Dataset 1',
    //                 data: [],
    //                 borderColor: 'rgb(255, 99, 132)',
    //                 backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //                 tension: 0.2,
    //                 responsive: true,
    //                 options: {
    //                     maintainAspectRatio: false,
    //                     scales: {
    //                         yAxes: [{
    //                             ticks: {
    //                                 max: 10,
    //                                 beginAtZero: true
    //                             }
    //                         }]
    //                     },
    //                     animation: {
    //                         duration: 100
    //                     }
    //                 }
    //             }
    //         ],
    //
    //     })
    // }, []);

    const updateDataSet = (obj :{timeLine: number [], ecg: number []}, index: number) => {
        setData({
            // @ts-ignore
            labels: obj.timeLine,
            datasets: [
                {
                    label: !index ? 'Власноруч побудований' : index === 1 ? 'Нормальний цикл' : index === 2 ?
                        'Цикл з від\'ємним T' : 'Цикл з асиметричним T',
                    data: obj.ecg,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.2,
                    responsive: true,
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    max: 10,
                                    beginAtZero: true
                                }
                            }]
                        },
                        animation: {
                            duration: 100
                        }
                    }
                }
            ],

        })
    };

    const pickMethodByIndex = (index: number) => {
        // @ts-ignore
        setData(ECGService.ready_1(4))
        // setSelectedIndex(index);
        // switch (index) {
        //     case 0:
        //         // updateDataSet(ECGService.ecgCustomDataset(fh, aT, mT, bT1, bT2, negative), index);
        //         updateDataSet(ECGService.ecgCycle(fh, aT, mT, bT1, bT2, 0.1,5, 0.01  ), index);
        //         break;
        //     case 1:
        //         // ecgCycle(Fh: number, A_T: number, mu_T: number, sigma_T_1: number, sigma_T_2: number, alt: number,
        //         // countCycles: number, noise: number)
        //         // updateDataSet(ECGService.ecgDataset(false, false), index);
        //         updateDataSet(ECGService.ecgCycle(fh, aT, mT, bT1, bT2, 0.1,30, 0.01  ), index);
        //         // updateDataSet(ECGService.get_Model(60, aT, bT1, bT2, mT, 0.005,4, 0.05  ), index);
        //         break;
        //     case 2:
        //         updateDataSet(ECGService.ecgDataset(true, false), index);
        //         break;
        //     case 3:
        //         updateDataSet(ECGService.ecgDataset(false, true), index);
        //         break;
        // }
    };

    const setFhValue = (event: Event, value: any) => {
        setFh(value);
        updateDataSet(ECGService.ecgCustomDataset(value, aT, mT, bT1, bT2, negative), selectedIndex);
    };

    const setAtValue = (event: Event, value: any) => {
        setAt(value);
        updateDataSet(ECGService.ecgCustomDataset(fh, value, mT, bT1, bT2, negative), selectedIndex);
    };

    const setMtValue = (event: Event, value: any) => {
        setMt(value);
        updateDataSet(ECGService.ecgCustomDataset(fh, aT, value, bT1, bT2, negative), selectedIndex);
    };

    const setBt1Value = (event: Event, value: any) => {
        setBt1(value);
        updateDataSet(ECGService.ecgCustomDataset(fh, aT, mT, value, bT2, negative), selectedIndex);
    };

    const setBt2Value = (event: Event, value: any) => {
        setBt2(value);
        updateDataSet(ECGService.ecgCustomDataset(fh, aT, mT, bT1, value, negative), selectedIndex);
    };

    const setNegativeValue = (event: any, value: any) => {
        setNegative(value);
        updateDataSet(ECGService.ecgCustomDataset(fh, aT, mT, bT1, bT2, value), selectedIndex);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div style={{
                    fontSize: "30px",
                    color: "#666666",
                    marginLeft: "30px",
                    marginTop: "12px"
                }}>Lab 3 - ECG diagram
                </div>
            </header>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", height: "100%"}}>
                <div style={{
                    width: "60%",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    { data && <Chart data={{arr1: data.t, arr2: data.data }}/> }
                    {/*<Chart data={[]}/>*/}
                </div>
                <div style={{
                    width: "40%",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    <div style={{
                        width: "100%",
                        height: "50%",
                        // padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        { data && <Chart data={{arr1: data.ph_tu_1, arr2: data.data }}/> }
                    </div>
                    <div style={{
                        width: "100%",
                        height: "50%",
                        // padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        { data && <Chart data={{arr1: data.phase_1_ecg_1, arr2: data.phase_2_ecg_1 }}/> }
                    </div>
                    {/*<FormControlLabel*/}
                    {/*    control={*/}
                    {/*        <Switch checked={negative} onChange={setNegativeValue} disabled={!!selectedIndex} />*/}
                    {/*    }*/}
                    {/*    label="Від'ємне"*/}
                    {/*/>*/}
                    {/*<div className="boxWrapper">*/}
                    {/*    <Box sx={{ width: 360 }}>*/}
                    {/*        <div className="sliderWrapper">*/}
                    {/*            <Slider*/}
                    {/*                value={fh || 60}*/}
                    {/*                onChange={setFhValue}*/}
                    {/*                valueLabelDisplay="auto"*/}
                    {/*                step={10}*/}
                    {/*                marks*/}
                    {/*                min={10}*/}
                    {/*                max={110}*/}
                    {/*                disabled={!!selectedIndex}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </Box>*/}
                    {/*    <div className="labelWrapper">*/}
                    {/*        Fh*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="boxWrapper">*/}
                    {/*    <Box sx={{ width: 360 }}>*/}
                    {/*        <div className="sliderWrapper">*/}
                    {/*            <Slider*/}
                    {/*                aria-label="A_T"*/}
                    {/*                value={aT || 0.2}*/}
                    {/*                onChange={setAtValue}*/}
                    {/*                valueLabelDisplay="auto"*/}
                    {/*                step={0.1}*/}
                    {/*                marks*/}
                    {/*                min={0.1}*/}
                    {/*                max={0.9}*/}
                    {/*                disabled={!!selectedIndex}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </Box>*/}
                    {/*    <div className="labelWrapper">*/}
                    {/*        aT*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="boxWrapper">*/}
                    {/*    <Box sx={{ width: 360 }}>*/}
                    {/*        <div className="sliderWrapper">*/}
                    {/*            <Slider*/}
                    {/*                value={mT || 0.6}*/}
                    {/*                onChange={setMtValue}*/}
                    {/*                valueLabelDisplay="auto"*/}
                    {/*                step={0.1}*/}
                    {/*                marks*/}
                    {/*                min={0.1}*/}
                    {/*                max={0.9}*/}
                    {/*                disabled={!!selectedIndex}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </Box>*/}
                    {/*    <div className="labelWrapper">*/}
                    {/*        mT*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="boxWrapper">*/}
                    {/*    <Box sx={{ width: 360 }}>*/}
                    {/*        <div className="sliderWrapper">*/}
                    {/*            <Slider*/}
                    {/*                value={bT1 || 0.05}*/}
                    {/*                onChange={setBt1Value}*/}
                    {/*                valueLabelDisplay="auto"*/}
                    {/*                step={0.01}*/}
                    {/*                marks*/}
                    {/*                min={0.01}*/}
                    {/*                max={0.09}*/}
                    {/*                disabled={!!selectedIndex}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </Box>*/}
                    {/*    <div className="labelWrapper">*/}
                    {/*        bT1*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="boxWrapper">*/}
                    {/*    <Box sx={{ width: 360 }}>*/}
                    {/*        <div className="sliderWrapper">*/}
                    {/*            <Slider*/}
                    {/*                value={bT2 || 0.03}*/}
                    {/*                onChange={setBt2Value}*/}
                    {/*                valueLabelDisplay="auto"*/}
                    {/*                step={0.01}*/}
                    {/*                marks*/}
                    {/*                min={0.01}*/}
                    {/*                max={0.09}*/}
                    {/*                disabled={!!selectedIndex}*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </Box>*/}
                    {/*    <div className="labelWrapper">*/}
                    {/*        bT2*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <SelectedListItem setSelectedIndexMethod={pickMethodByIndex}/>
                </div>
            </div>
        </div>
    );
}

export default App;
