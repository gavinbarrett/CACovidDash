import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import CaseSelector from './CaseSelector';
import CountySelector from './CountySelector';
import Graph from './Graph';
import './sass/Dashboard.scss';

const Dashboard = () => {

	const [data, updateData] = useState(null);
	const [dates, updateDates] = useState([]);
	const [filter, updateFilter] = useState('New Cases');
	const [selCounty, updateSelCounty] = useState('Statewide');

	useEffect(() => {
		// pull data from the server for the selCounty county
		getJSON(selCounty);
	}, [filter, selCounty]);

	const zipObjects = (obj1, obj2) => {
		// zip a data object with a dates object
		return Object.values(obj1).map((arrElem, index) => {
			let str = Object.keys(obj2);
			let day = arrElem.slice(5);
			return {"date": day, "amount": obj2[str[index]]};
		});
	}

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
		const resp = fetch(`/get_county/${selectedCounty}`, {method: 'GET'})
			.then(resp => { return resp.json() })
			.then(dat => {
				console.log(`dat: ${dat}`)
				// save dates and new covid counts
				let obj1 = dat['date'];
				let ds = Object.values(dat['date']);
				console.log(`obj1: ${obj1}\nds: ${ds}`);
				// return the appropriate filter
				const tag = getFilter(filter);
				let obj2 = dat[tag];
				console.log(`obj2: ${Object.keys(obj2)}`);
				let zipped = zipObjects(obj1, obj2);
				console.log(`Zipped: ${zipped}`);
				console.log(`County: ${selectedCounty}`);
				updateData(zipped);
				updateSelCounty(selectedCounty);
			});
	}

	return(<div id='app'>
	<div id='heading'>California Covid Dash</div>
	<div id='selectortab'>
	<CountySelector/>
	<CaseSelector updateFilter={updateFilter} updateSelCounty={updateSelCounty}/>
	</div>
	<div id='graphContainer'>
		{data ? <Graph data={data} countyName={selCounty} filter={filter}/> : ''}
	</div>
	</div>);
}

ReactDOM.render(<Dashboard/>, document.getElementById('root'));
