import {observer} from "mobx-react-lite";
import Chart from "react-apexcharts";
import React from "react";
import {PerformanceData} from "@/data/ProblemSetsData";

const defaultOptions = {
    chart: {
        fontFamily: 'inherit',
        parentHeightOffset: 0,
        toolbar: {
            show: false
        },
        animations: {
            enabled: false
        },
        stacked: true
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        opacity: 1
    },
    grid: {
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        }
    },
    xaxis: {
        tooltip: {
            enabled: false
        },
        axisBorder: {
            show: false
        },
        lines: {
            show: false
        },
        labels: {
            show: false
        }
    },
    yaxis: {
        tooltip: {
            enabled: false
        },
        labels: {
            show: false
        }
    },
    tooltip : {
        enabled: false
    },
    colors: ["#2589F5", "#D9D9D9"],
    legend: {
        show: false
    }
};

export interface RuntimeGraphProps {
    userValue: number;
    data?: PerformanceData;
    options?: any;
    labels?: string[];
    height?: number;
    highlightColor?: string;
}

export const PerformanceGraph = observer(({userValue, data, options, labels, height, highlightColor} : RuntimeGraphProps) => {
    console.log("Rendering RuntimeGraph");

    //Combine the userRuntime and runtimeData into a single array named data
    const chartData = [
        {
            name: 'User Runtime',
            data: data ? constructUserRuntimeArray(userValue, data) : []
        },
        {
            name: 'Average Runtime',
            data: data?.overallData ? constructOverallRuntimeArray(userValue, data) : []
        }
    ];

    let chartOptions = Object.assign({}, defaultOptions, options, { labels });

    chartOptions.colors = [highlightColor ? highlightColor : "#2589F5", "#D9D9D9"];

    return (
        <Chart
            series={chartData}
            type="bar"
            height={height ? height : 200}
            options={chartOptions}
            style={{marginLeft: -32}}
        />
    );
});

// Goes through the runtime data and find the interval where the user runtime is
// It sets all values to zero except the interval where the user runtime is,
// where it sets it to the same value as the overall runtime to match the height on the graph
// Example:
// runtime = 45
// runtimeData =
// {
//  startingTime: 0,
//  endingTime: 200,
//  overallRuntimes: [0, 2, 4, 5, 2, 1, 10, 16, 32, 25, 10, 25, 3, 2, 4, 4, 1, 3, 2, 0]
// }
// Output:
// [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] (each chunk corresponds to a 10 ms interval)
function constructUserRuntimeArray(runtime : number, runtimeData : PerformanceData)  {
    const intervalCount = runtimeData.overallData.length;
    const intervalSize = (runtimeData.endingValue - runtimeData.startingValue) / intervalCount;
    const intervalIndex = Math.floor(runtime / intervalSize);
    const runtimeArray = new Array(intervalCount).fill(0);
    runtimeArray[intervalIndex] = runtimeData.overallData[intervalIndex];
    return runtimeArray;
}

function constructOverallRuntimeArray(runtime : number, runtimeData : PerformanceData) {
    const intervalCount = runtimeData.overallData.length;
    const intervalSize = (runtimeData.endingValue - runtimeData.startingValue) / intervalCount;
    const intervalIndex = Math.floor(runtime / intervalSize);
    // Create a copy of the array
    const runtimeArray = [...runtimeData.overallData];
    runtimeArray[intervalIndex] = 0;
    return runtimeArray;
}