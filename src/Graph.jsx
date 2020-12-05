import React from 'react';
import { Line } from 'react-chartjs-2';
import './sass/Graph.scss';

const Graph = ({data, countyName, filter}) => {

	const state = {
		labels: data.map(date => date['date']),
		datasets: [{
			label: filter,
			fill: true,
			lineTension: 0.5,
			backgroundColor: '#F77F00',
			data: data.map(date => date['amount'])
		}]
	}

	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<div id='filterdemo'>Showing: {filter}</div>
	<div className='graphcontainer'>
		{data ? <Line data={state} options={{ maintainAspectRatio: false, responsive: true }}/> : 'Loading'}
	</div>
	</div>);
}

export default Graph;
