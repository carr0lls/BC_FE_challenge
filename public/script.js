(function() {
	const API_BASE_URL = `http://localhost:3000`;
	const search = document.getElementById("search");
	const companyList = document.getElementById("company-list");

	function renderCompanyInfoList({results, total}) {
		let companies = ``;

		results.map((company) => {
			companies += `<li>${company.name}</li>`;
		});
		companyList.innerHTML = companies;
	}

	function searchCompanies(name) {
		fetch(`${API_BASE_URL}/api/companies?q=${name}`)
			.then((result) => result.json())
			.then(renderCompanyInfoList)
			.catch((err) => console.log(err));
	}

	function bindEventListeners() {
		search.addEventListener("keyup", function(e) {
			searchCompanies(e.target.value);
		});
	}
	
	function init() {
		bindEventListeners();
	}

	init();
})();