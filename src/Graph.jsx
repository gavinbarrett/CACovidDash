import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

const Graph = ({data, countyName, filter}) => {

	const [ticks, updateTicks] = useState([]);
	const [monthDates, updateMonthDates] = useState([]);
	
	const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	useEffect(() => {
		// create an array for months on the x-axis
		getDates();
	},[data]);

	const getDates = async () => {
		let values = [];
		let tickVals = [];
		// iterate through the dates
		data.map((d, index) => {
			// extract the day
			let day = parseInt(d["date"].slice(3));
			// extract the month
			let month = parseInt(d["date"].slice(0,2));
			// add the month to the array if the date is halfway into the month
			if (month === 3 && day === 18) {
				values.push(months[month-1]);
			} else if (day === 15) {
				// push the month name onto the array
				values.push(months[month-1]);
			} else if (day === 1) {
				values.push('|');
			} else {
				// push an empty string so that no value is rendered
				values.push('');
			}
			tickVals.push(index);
		});
		await updateMonthDates(values);
		await updateTicks(ts);
	}

	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<div id='filterdemo'>Showing: {filter}</div>
	<VictoryChart width={600} height={200} containerComponent={<VictoryVoronoiContainer style={{labels: {fontSize: 4}}, {data: {width: 100}}} labels={({datum}) => `${datum.date}: ${datum.new_cases}`}/>} animate={{duration: 550}}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 8, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickValues={ticks} tickFormat={monthDates}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7', fontSize: 10}}}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: ({active}) => active ? '#F77F00' : '#FCBF49'}}} barWidth={({active}) => active ? 5 : 3} barRatio={0.4} width={400} height={130} data={data} x="date" y="new_cases" animate/>
	</VictoryChart>
	</div>);
}

export default Graph;
