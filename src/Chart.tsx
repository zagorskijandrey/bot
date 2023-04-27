import React, { useEffect, useState } from "react";
// import cx from "../../services/utils/cx";
// import styles from "./Chart.module.css";
import ReactEcharts from "echarts-for-react";
// import date from "../../services/utils/date";
// import i18next from "i18next";
// import {EChartsOption, EChartsOption, EChartsOption} from "echarts-for-react";

const Chart = (p: {
    data: any;
}) => {
    const [data, setData] = useState(undefined);

    const [option, setOption] = useState<any>({});

    useEffect(() => {
        if (p?.data?.arr1 && p?.data?.arr2) {
            const temp: any = [];
            p.data.arr1.forEach((item: number, index: number) => {
                temp.push([item / 1000, p.data.arr2[index]/1000])
            });
            setData(temp);
        }
    }, [p.data]);

    useEffect(() => {
        // if (p.data?.keys && p.data?.values) {
            // const categoryData: any = [];
            // const values: any = [];
            // p.data.values.forEach((item: any) => {
            //     categoryData.push(date.getDateTime(new Date(item.time * 1000).toString()));
            //     values.push(item.data);
            // });

            setOption(
                {
                    animation: false,
                    grid: {
                        top: 40,
                        left: 50,
                        right: 40,
                        bottom: 50
                    },
                    xAxis: {
                        name: 'x',
                        minorTick: {
                            show: true
                        },
                        minorSplitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                        name: 'y',
                        min: -100,
                        max: 100,
                        minorTick: {
                            show: true
                        },
                        minorSplitLine: {
                            show: true
                        }
                    },
                    dataZoom: [
                        {
                            show: true,
                            type: 'inside',
                            filterMode: 'none',
                            xAxisIndex: [0],
                            startValue: -20,
                            endValue: 20
                        },
                        {
                            show: true,
                            type: 'inside',
                            filterMode: 'none',
                            yAxisIndex: [0],
                            startValue: -20,
                            endValue: 20
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            showSymbol: false,
                            clip: true,
                            data
                        }
                    ]
                }
            )
        // }
    }, [p.data]);

    return (
        <div className="container">
            <ReactEcharts option={option} style={{width: "100%", height: "100%"}} />
        </div>
    );
};

export default Chart;