import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

const Graph = ({data, countyName}) => {

	const [ticks, updateTicks] = useState([]);
	const [monthDates, updateMonthDates] = useState([]);
	
	const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	useEffect(() => {
		// create an array for months on the x-axis
		getDates();
		console.log('data:');
		console.log(monthDates);
		console.log(ticks);
	},[]);

	const getDates = async () => {
		let values = [];
		let ts = [];
		// iterate through the dates
		data.map((d, index) => {
			console.log('index: ' + index);
			// extract the date
			let day = parseInt(d["date"].slice(3));
			// add the month to the array if the date is halfway into the month
			if (day === 18) {
				// extract the month
				let month = parseInt(d["date"].slice(0,2));
				// push the month name onto the array
				console.log('month');
				console.log(months[month-1]);
				values.push(months[month-1]);
			} else if (day === 1) {
				values.push('|');
			} else {
				// push an empty string so that no value is rendered
				values.push('');
			}
			ts.push(index);
		});
		console.log('vals: ');
		console.log(values);
		console.log(ts);
		await updateMonthDates(values);
		await updateTicks(ts);
	}

	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<VictoryChart width={600} height={200} containerComponent={<VictoryVoronoiContainer style={{labels: {fontSize: 4}}, {data: {width: 100}}} labels={({datum}) => `${datum.date}: ${datum.new_cases}`}/>}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 4, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickValues={ticks} tickFormat={monthDates}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7'}}}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: ({active}) => active ? '#F77F00' : '#FCBF49'}}} barWidth={({active}) => active ? 5 : 3} barRatio={0.4} width={400} height={130} data={data} x="date" y="new_cases"/>
	</VictoryChart>
	</div>);
}

export default Graph;
