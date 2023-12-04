// source for the chart 
// https://recharts.org/en-US/api/RadialBarChart

// source to group trainings by activity name
// https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects

import { useState, useEffect } from "react";
import { RadialBarChart, ResponsiveContainer } from "recharts";
import { RadialBar } from "recharts";
import { Legend, Tooltip } from "recharts";

export default function Charts() {

    const [trainings, setTrainings] = useState([]);



    const REST_URL = "https://traineeapp.azurewebsites.net/gettrainings";

    const getTrainings = () => {
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                const groupedTrainings = groupTrainings(responseData);
                // kaksi parametria treenit ja indeksi
                // indeksi väriä varten

                const trainingsForChart = groupedTrainings.map((trainings, index) => ({
                    name: trainings.name,
                    // fill attribuutti tarvitaan, jotta radialBar saa värin
                    fill: getColor(index),
                    durations: trainings.trainings.reduce((total, training) => total + training.duration, 0),
                }));
                setTrainings(trainingsForChart);
                console.log("Trainings for chart: " + trainingsForChart);

            })
            .catch(error => {
                console.log(error)
            });
    }

    // luodaan funktio, jonka avulla saadaan treenit ryhmiteltyä
    const groupTrainings = (trainings) => {
        // tyhjä olio muuttuja
        const groupedTrainings = {};
        // käydään treenit läpi
        trainings.forEach(training => {
            // katsotaan onko treenille jo olemassa ryhmä 'group'
            // jos ryhmää ei ole, tehdään sille uusi lista
            if (!groupedTrainings[training.activity]) {
                groupedTrainings[training.activity] = { name: training.activity, trainings: [] };
            }
            // lisätään treenit omiin ryhmiin
            groupedTrainings[training.activity].trainings.push(training);
        });
        // palautetaan ryhmitetyt treenit
        return Object.values(groupedTrainings);
    };

    // värit tilastotaulukkoon
    const getColor = (index) => {
        const colors = ["#FF33C7", "#9333FF", "#BEFF33", "#33FF58", "#33D1FF"];
        return colors[index % colors.length];
    };

    useEffect(() => getTrainings(), []);

    return (
        <>
            <ResponsiveContainer width={730} height={500} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <RadialBarChart
                    innerRadius="20%"
                    outerRadius="100%"
                    data={trainings}
                    startAngle={180}
                    endAngle={0}
                >
                    <RadialBar minAngle={15}
                        label={{ fill: '#00000', position: 'middle' }}
                        background clockWise={true}
                        dataKey='durations'
                        fill={(_, index) => getColor(index)} />
                    <Legend
                        iconSize={10}
                        width={120}
                        height={140}
                        layout="vertical"
                        verticalAlign="right"
                        align="right"
                    />
                    <Tooltip />
                </RadialBarChart>
            </ResponsiveContainer>
        </>
    );
}
