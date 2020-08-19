import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

const Graph = ({data, countyName}) => {
	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<VictoryChart width={600} height={200} containerComponent={<VictoryVoronoiContainer style={{labels: {fontSize: 5}}} labels={({datum}) => `${datum.date}: ${datum.new_cases}`}/>}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 4, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickFormat={date => date.toLocaleString('en-us', {month: 'short'})} tickLabelComponent={<VictoryLabel angle={90}/>}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7'}}}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: ({active}) => active ? '#F77F00' : '#FCBF49'}}} barWidth={({active}) => active ? 5 : 3} barRatio={0.4} width={400} height={130} data={data} x="date" y="new_cases"/>
	</VictoryChart>
	</div>);
}

export default Graph;
