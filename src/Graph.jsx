import React, { useEffect, useState } from 'react';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryCursorContainer } from 'victory';

const Graph = ({data, countyName, filter}) => {

	const [date, updateDate] = useState(null);
	const [ticks, updateTicks] = useState([]);
	const [monthDates, updateMonthDates] = useState([]);
	
	const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	useEffect(() => {
		// create an array for months on the x-axis
		getDates();
	},[data]);

	const updateCursorTarget = (data, value) => {
		if (value === null) return null;
		const range = data.length;
		const index = Math.round(value/range * (data.length - 1));
		return data[index];
	}

	const updateCursor = (value) => {
		updateDate(updateCursorTarget(data, value));
	}

	const getDates = () => {
		let values = [];
		let tickVals = [];
		// iterate through the dates
		data.map((d, index) => {
			// extract the day
			let day = parseInt(d["date"].slice(3));
			// extract the month
			let month = parseInt(d["date"].slice(0,2));
			// add the month to the array if the date is halfway into the month
			if (month === 3 && day === 18)
				values.push(months[month-1]);
			else if (day === 15)
				values.push(months[month-1]);
			else if (day === 1)
				values.push('|');
			else
				values.push('');
			tickVals.push(index);
		});
		updateMonthDates(values);
		updateTicks(tickVals);
	}

	const cursor = <VictoryCursorContainer cursorDimension="x" cursorLabel={_ => date ? `${date.date}, ${date.new_cases}` : ''} onCursorChange={updateCursor} style={{color: "#FCBF49"}}/>;

	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<div id='filterdemo'>Showing: {filter} {(date && date.date) ? `on ${date.date}: ${date.new_cases}` : ''}</div>
	<VictoryChart width={600} height={200} containerComponent={cursor}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 8, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickValues={ticks} tickFormat={monthDates}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7', fontSize: 10}}}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: '#FCBF49'}}} barWidth={3} barRatio={0.4} width={400} height={130} x="date" y="new_cases" data={data} animate/>
	{/*<VictoryLine data={data} style={{data: {stroke: '#FCBF49'}}} x="date" y="new_cases" animate/>*/}
	</VictoryChart>
	</div>);
}

export default Graph;
