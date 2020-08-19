import React, {PureComponent, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryTooltip } from 'victory';

const countyList = ["Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba"];

const zipObjects = (obj1, obj2) => {
	// zip a data object with a dates object
	return Object.values(obj1).map((arrElem, index) => {
		let str = Object.keys(obj2);
		return {"date": arrElem, "new_cases": obj2[str[index]], "label": obj2[str[index]]};
	});
}

function Graph({data, countyName}) {
	return (<div id='chart'>
	<div id='countyName'>{countyName}</div>
	<VictoryChart width={600} height={200}>
	<VictoryAxis scale="time" style={{tickLabels: {fontSize: 4, fill: '#EAE2B7'}, fontWeight: 'bold'}} tickFormat={date => date.toLocaleString('en-us', {month: 'short'})} tickLabelComponent={<VictoryLabel angle={90}/>}/>
	<VictoryAxis dependentAxis style={{tickLabels: {fill: '#EAE2B7'}}} fixLabelAxis={true} tickFormat={x => x}/>
	<VictoryBar domainPadding={{x: 10, y: 50}} style={{data: {fill: '#FCBF49'}}} barWidth={2} barRatio={0.4} width={400} height={130} data={data} labels={d => d.x.toFixed(0)} labelComponent={<VictoryTooltip/>} x="date" y="new_cases"/>
	</VictoryChart>
	</div>);
}

function Selector({updateFilter, updateSelCounty}) {
	return(<div id='selector'>
	<select name='filter' id='filter'>
	<option value='New Cases'>New Cases</option>
	<option value='New Deaths'>New Deaths</option>
	<option value='Total Cases'>Total Cases</option>
	<option value='Total Deaths'>Total Deaths</option>
	</select>
	<button id='updata' onClick={() => {
		// update the dashboard filter
		updateFilter(document.getElementById('filter').value);
		// update the dashboard county
		updateSelCounty(document.getElementById('cselect').value);
		// FIXME: add support for filtering by zip codes
	}}>Update Graphs</button></div>);
}

function CountySelector() {
	return (<div id='countySelector'>
	<select name='cselect' id='cselect'>
	{countyList.map((name, index) => { 
		if (name === 'Sacramento')
			return <option value={name} selected>{name}</option>;
		else
			return <option value={name}>{name}</option>;
	})}
	</select>
	</div>);
}

function App() {

	const [data, updateData] = useState([]);
	const [dates, updateDates] = useState([]);
	const [graphs, updateGraphs] = useState([]);
	const [filter, updateFilter] = useState('New Cases');
	const [selCounty, updateSelCounty] = useState('Sacramento');

	useEffect(() => {
		// pull data from the server for the selCounty county
		getJSON(selCounty);
	}, [filter, selCounty]);

	const getFilter = (dataFilter) => {
		// return the hashmap key of the selected filter
		if (dataFilter === 'New Cases')
			return 'newcountconfirmed';
		else if (dataFilter === 'New Deaths')
			return 'newcountdeaths';
		else if (dataFilter === 'Total Cases')
			return 'totalcountconfirmed';
		else if (dataFilter === 'Total Deaths')
			return 'totalcountdeaths';
	}

	const getJSON = (selectedCounty) => {
		// pull data from the server and generate a corresponding graph
		updateData([]);
		updateDates([]);
		console.log('Updating json');
		const resp = fetch(`/get_county/${selectedCounty}`, {method: 'GET'})
			.then(resp => { return resp.json() })
			.then(dat => {
				// save dates and new covid counts
				let obj1 = dat['date'];
				let ds = Object.values(obj1);
				let tag = getFilter(filter);
				let obj2 = dat[tag];
				let zipped = zipObjects(obj1, obj2);
				let g = <Graph data={zipped} countyName={selCounty}/>;
				updateGraphs(g);
			});
	}

	return(<div id='app'>
	<div id='heading'>California Covid Dash</div>
	<div id='selectortab'>
	<CountySelector/>
	<Selector updateFilter={updateFilter} updateSelCounty={updateSelCounty}/>
	</div>
	<div id='covdash'>
	<div id='graphContainer'>{graphs ? graphs : ''}</div>
	</div>
	</div>);
}

ReactDOM.render(<App/>, document.getElementById('root'));
