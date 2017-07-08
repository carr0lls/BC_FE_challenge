(function() {
	
	const API_BASE_URL = `http://localhost:3000`;
	const SEARCH_TIMEOUT_DELAY = 1000;
	
	const search = document.getElementById("search");
	const companyList = document.getElementById("company-list");

	function renderCompanyInfoList({results, total}) {
		let companies = ``;

		results.map((company) => {
			companies += `
				<li>
					${company.name}
				</li>`;
		});
		companyList.innerHTML = companies;
	}

	function searchCompanies(name) {
		fetch(`${API_BASE_URL}/api/companies?q=${name}&limit=500`)
			.then((result) => result.json())
			.then(renderCompanyInfoList)
			.catch((err) => console.log(err));
	}

	function bindEventListeners() {
		let searchTimestamp, detailedCompanyInfo;

		search.addEventListener("keyup", function(e) {
			if (searchTimestamp)
				clearTimeout(searchTimestamp);

			searchTimestamp = setTimeout(searchCompanies.bind(null, e.target.value), SEARCH_TIMEOUT_DELAY);
		});
	}
	
	function init() {
		bindEventListeners();
	}

	init();
})();