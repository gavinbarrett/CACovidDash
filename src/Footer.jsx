import React from 'react';
import './sass/Footer.scss';

export const Footer = () => {
	return (<footer>
		<div id="footer-box">
			<a href="https://data.chhs.ca.gov/dataset/f333528b-4d38-4814-bebb-12db1f10f535/resource/046cdd2b-31e5-4d34-9ed3-b48cdbc4be7a" className="footer-text">Data Source</a>
			<a href="https://github.com/gavinbarrett/CACovidDash" className="footer-text">Source Code</a>
			<p className="footer-text">CA Covid Dash 2021</p>
		</div>
	</footer>);
}
