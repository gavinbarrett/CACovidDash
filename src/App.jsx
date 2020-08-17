import React, {PureComponent, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip } from 'victory';

const zipObjects = (obj1, obj2) => {
	return Object.values(obj1).map((arrElem, index) => {
		let str = Object.keys(obj2);
		return {"date": arrElem, "new_cases": obj2[str[index]], "label": obj2[str[index]]};
	});
}

function Graph({data, dates}) {
	return (<div id='chart'>
	<VictoryChart width={600} height={200}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 4, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickFormat={date => date.toLocaleString('en-us', {month: 'short'})} tickLabelComponent={<VictoryLabel angle={90}/>}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7'}}} fixLabelAxis={true} tickFormat={x => x}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: '#FCBF49'}}} barWidth={2} barRatio={0.4} width={400} height={130} data={data} labels={d => d.x.toFixed(0)} labelComponent={<VictoryTooltip/>} x="date" y="new_cases"/>
	</VictoryChart>
	</div>);
}

function CountySelector({countyList, updateData, updateDates, updateCountyName}) {
	let counties = [];
	countyList.map(county => {
		if (county === 'Sacramento')
			counties.push(<option value={county} selected>{county}</option>);
		else
			counties.push(<option value={county}>{county}</option>);
	});

	const changeCounty = () => {
		const county = document.getElementById('county_selector');
		const resp = fetch('/get_county/' + county.value, {method: 'GET'})
			.then(resp => { return resp.json() })
			.then(data => {
				let obj1 = data['date'];
				let dates = Object.values(obj1);
				let obj2 = data['newcountconfirmed'];
				let zipped = zipObjects(obj1, obj2);
				updateData(zipped);
				updateDates(dates);
				updateCountyName(county.value);
			});
	}	
	return (<div id='selector'>
	<select name='county_selector' id='county_selector'>
		{counties}
	</select>
	<button onClick={() => changeCounty()}>Find Data</button>
	</div>);
}

function App() {
	
	const [data, updateData] = useState(null);
	const [dates, updateDates] = useState(null);
	const [counties, updateCounties] = useState(null);
	const [countyName, updateCountyName] = useState(null);

	useEffect(() => {
		// retrieve the list of CA counties
		getCounties();
		// get the initial county data (Sacramento county)
		getJSON();
	}, []);

	const getCounties = () => {
		const resp = fetch('/get_counties', {method: 'GET'})
			.then(resp => { return resp.json() })
			.then(counties => {
				updateCounties(counties['counties']);
			});
	}

	const getJSON = () => {
		const resp = fetch('/get_county/Sacramento', {method: 'GET'})
			.then(resp => { return resp.json() })
			.then(data => {
				let obj1 = data['date'];
				let dates = Object.values(obj1);
				let obj2 = data['newcountconfirmed'];
				let zipped = zipObjects(obj1, obj2);
				updateData(zipped);
				updateDates(dates);
				updateCountyName('Sacramento');
			});
	}

	return(<div id='app'>
	<div id='heading'>California Covid Dash</div>
	<div id='covdash'>
	{counties ? <CountySelector countyList={counties} updateData={updateData} updateDates={updateDates} updateCountyName={updateCountyName}/> : ''}
	<div id='countyName'>{countyName ? countyName : ''}</div>
	{data ? <Graph data={data} dates={dates}/> : ''}
	</div>
	</div>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
