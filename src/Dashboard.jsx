import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CaseSelector } from './CaseSelector';
import { CountySelector } from './CountySelector';
import { Graph } from './Graph';
import { Footer } from './Footer';
import './sass/Dashboard.scss';

const Dashboard = () => {
	const [data, updateData] = useState(null);
	const [dates, updateDates] = useState([]);
	const [filter, updateFilter] = useState('Cases');
	const [selCounty, updateSelCounty] = useState('Sacramento');

	useEffect(() => {
		// pull data from the server for the selCounty county
		getJSON(selCounty);
	}, [filter, selCounty]);

	const zipObjects = (obj1, obj2) => {
		console.log(obj1);
		console.log(obj2);
		// zip a data object with a dates object
		const str = Object.keys(obj2);
		return Object.values(obj1).map((arrElem, index) => {
			//console.log(arrElem);
			return {"date": arrElem, "amount": obj2[str[index]]};
		});
	}

	const getFilter = (dataFilter) => {
		// return the hashmap key of the selected filter
		if (dataFilter === 'Cases')
			return 'CASES';
		else if (dataFilter === 'Cumulative Cases')
			return 'CUMULATIVE_CASES';
		else if (dataFilter === 'Deaths')
			return 'DEATHS';
		else if (dataFilter === 'Cumulative Deaths')
			return 'CUMULATIVE_DEATHS';
		else if (dataFilter === 'Total Tests')
			return 'TOTAL_TESTS';
		else if (dataFilter === 'Cumulative Total Tests')
			return 'CUMULATIVE_TOTAL_TESTS';
		else if (dataFilter === 'Positive Tests')
			return 'POSITIVE_TESTS';
		else if (dataFilter === 'Cumulative Positive Tests')
			return 'CUMULATIVE_POSITIVE_TESTS';
		else if (dataFilter === 'Reported Cases')
			return 'REPORTED_CASES';
		else if (dataFilter === 'Cumulative Reported Cases')
			return 'CUMULATIVE_REPORTED_CASES';
		else if (dataFilter === 'Reported Deaths')
			return 'REPORTED_DEATHS';
		else if (dataFilter === 'Cumulative Reported Deaths')
			return 'CUMULATIVE_REPORTED_DEATHS';
		else if (dataFilter ===	'Reported Tests')
			return 'REPORTED_TESTS';
		else if (dataFilter === 'Cumulative Reported Tests')
			return 'CUMULATIVE_REPORTED_TESTS';
	}

	const getJSON = (selectedCounty) => {
		// pull data from the server and generate a corresponding graph
		if (selectedCounty === 'Statewide') {
			const resp = fetch('/get_state/', {method: 'GET'})
				.then(resp => { return resp.json() })
				.then(dat => {
					const tag = getFilter(filter);
					const dates = dat['data']['DATE'];
					const filt = dat['data'][tag];
					const zipped = zipObjects(dates, filt);
					updateData(zipped);
					updateSelCounty(selectedCounty);
				});
		} else {
			const resp = fetch(`/get_county/${selectedCounty}`, {method: 'GET'})
				.then(resp => { return resp.json() })
				.then(dat => {
					// save dates and new covid counts
					const tag = getFilter(filter);
					const dates = dat['data']['DATE'];
					const filt = dat['data'][tag];
					const zipped = zipObjects(dates, filt);
					updateData(zipped);
					updateSelCounty(selectedCounty);
				});
		}
	}

	return(<><div id='app'>
	<div id='heading'>California Covid Dash</div>
	<div id='selectortab'>
	<CountySelector/>
	<CaseSelector updateFilter={updateFilter} updateSelCounty={updateSelCounty}/>
	</div>
	<div id='graphContainer'>
		{data ? <Graph data={data} countyName={selCounty} filter={filter}/> : ''}
	</div>
	</div>
	<Footer/></>);
}

ReactDOM.render(<Dashboard/>, document.getElementById('root'));
