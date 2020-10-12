import React, {useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        },
    },
    mantainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0.0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function(value, index, values) {
                        return numeral(value).format("0a")
                    },
                },
            },
        ],
    }
}

const buildChartData = (data, casesType="cases") => {
    let charData = [];
    let lastDataPoint;
    
    for(let date in data.cases) {
        if(lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            charData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    };
    
    return charData;
}

function LineGraph({casesType = 'cases'}) {

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                let charData = buildChartData(data, 'cases');
                setData(charData);
            })
        }

        fetchData();
    }, [casesType]);

    return (
        <div>
            <h1>Im a graph</h1>
            {data?.length > 0 && (
                <Line
                options={options} 
                data={{
                datasets: [{
                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    data: data
                }]
            }} />
            )}
            
        </div>
    )
}

export default LineGraph
