(function() {

	const API_BASE_URL = `http://localhost:3000`;

	document.getElementById("search").addEventListener("keyup", function(e) {
		fetch(`${API_BASE_URL}/api/companies?q=${e.target.value}`)
			.then((result) => result.json())
			.then((json) => console.log(json));
	});

})();