import React from 'react';
import './sass/CountySelector.scss';

export const CountySelector = () => {
	const countyList = ["Statewide", "Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa", "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo", "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa", "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange", "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino", "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo", "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou", "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare", "Tuolumne", "Ventura", "Yolo", "Yuba", "Out of state", "Unknown"];

	return (<div id='countySelector'>
	<div className='selector'>
	<select name='cselect' id='cselect'>
	{countyList.map((name, index) => {
		// Set the list of counties to choose from. Make Sacramento county the default
		return (name === 'Sacramento') ? <option value={name} selected>{name}</option> : <option value={name}>{name}</option>;
	})}
	</select>
	</div>
	</div>);
}
