import React from 'react';
import './sass/CaseSelector.scss';

export const CaseSelector = ({updateFilter, updateSelCounty}) => {
	return(<div id='selector'>
		<div className='selector'>
			<select name='filter' id='filter'>
				<option value='Cases'>Cases</option>
				<option value='Deaths'>Deaths</option>
				<option value='Positive Tests'>Positive Tests</option>
				<option value='Reported Cases'>Reported Cases</option>
				<option value='Reported Deaths'>Reported Deaths</option>
				<option value='Reported Tests'>Reported Tests</option>
				<option value='Cumulative Cases'>CumulativeCases</option>
				<option value='Cumulative Deaths'>Cumulative Deaths</option>
				<option value='Cumulative Positive Tests'>Cumulative Positive Tests</option>
				<option value='Cumulative Reported Cases'>Cumulative Reported Cases</option>
				<option value='Cumulative Reported Deaths'>Cumulative Reported Deaths</option>
				<option value='Cumulative Reported Tests'>Cumulative Reported Tests</option>
			</select>
		</div>
	<button id='updata' onClick={() => {
		// update the dashboard filter
		updateFilter(document.getElementById('filter').value);
		// update the dashboard county
		updateSelCounty(document.getElementById('cselect').value);
	}}>Update Graphs</button></div>);
}
