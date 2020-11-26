import React from 'react';

const CaseSelector = ({updateFilter, updateSelCounty}) => {
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
	}}>Update Graphs</button></div>);
}

export default CaseSelector;
