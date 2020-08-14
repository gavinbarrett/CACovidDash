function getJSON() {
	console.log('calling');
	let resp = fetch('/get_json', {method: 'GET'})
				.then(resp => {
					return resp.json()
				})
				.then(data => {
					//data = data.replace(/'/g, '"');
					//console.log(data);
					//console.log(JSON.parse(data));
					console.log(data);
				});
};
