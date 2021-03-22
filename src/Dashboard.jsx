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
			return 'cases';
		else if (dataFilter === 'Cumulative Cases')
			return 'cumulative_cases';
		else if (dataFilter === 'Deaths')
			return 'deaths';
		else if (dataFilter === 'Cumulative Deaths')
			return 'cumulative_deaths';
		else if (dataFilter === 'Total Tests')
			return 'total_tests';
		else if (dataFilter === 'Cumulative Total Tests')
			return 'cumulative_total_tests';
		else if (dataFilter === 'Positive Tests')
			return 'positive_tests';
		else if (dataFilter === 'Cumulative Positive Tests')
			return 'cumulative_positive_tests';
		else if (dataFilter === 'Reported Cases')
			return 'reported_cases';
		else if (dataFilter === 'Cumulative Reported Cases')
			return 'cumulative_reported_cases';
		else if (dataFilter === 'Reported Deaths')
			return 'reported_deaths';
		else if (dataFilter === 'Cumulative Reported Deaths')
			return 'cumulative_reported_deaths';
		else if (dataFilter ===	'Reported Tests')
			return 'reported_tests';
		else if (dataFilter === 'Cumulative Reported Tests')
			return 'cumulative_reported_tests';
	}

	const getJSON = (selectedCounty) => {
		// pull data from the server and generate a corresponding graph
		if (selectedCounty === 'Statewide') {
			const resp = fetch('/get_state/', {method: 'GET'})
				.then(resp => { return resp.json() })
				.then(dat => {
					const tag = getFilter(filter);
					const dates = dat['data']['date'];
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
					const dates = dat['data']['date'];
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
