import React from 'react';
import './sass/CaseSelector.scss';

const CaseSelector = ({updateFilter, updateSelCounty}) => {
	return(<div id='selector'>
	<div className='selector'>
	<select name='filter' id='filter'>
	<option value='New Cases'>New Cases</option>
	<option value='New Deaths'>New Deaths</option>
	<option value='Total Cases'>Total Cases</option>
	<option value='Total Deaths'>Total Deaths</option>
	</select>
	</div>
	<button id='updata' onClick={() => {
		// update the dashboard filter
		updateFilter(document.getElementById('filter').value);
		// update the dashboard county
		updateSelCounty(document.getElementById('cselect').value);
	}}>Update Graphs</button></div>);
}

export default CaseSelector;
