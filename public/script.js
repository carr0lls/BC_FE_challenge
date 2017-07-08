(function() {
	
	const API_BASE_URL = `http://localhost:3000`;
	const SEARCH_TIMEOUT_DELAY = 1000;
	
	const search = document.getElementById("search");
	const companyList = document.getElementById("company-list");
	const detailedCompany = {};
	detailedCompany['name'] = document.querySelector("#company-info .name");
	detailedCompany['phone'] = document.querySelector("#company-info .phone");
	detailedCompany['website'] = document.querySelector("#company-info .website a");
	detailedCompany['avatar'] = document.querySelector("#company-info .avatar img");
	detailedCompany['laborType'] = document.querySelector("#company-info .labor-type");

	function renderCompanyInfoList({results, total}) {
		let companies = ``;

		results.map((company) => {
			companies += `
				<li data-name="${company.name}"
					data-phone="${company.phone}"
					data-website="${company.website}"
					data-avatar-url="${company.avatarUrl}"
					data-labor-type="${company.laborType}">
					${company.name}
				</li>`;
		});
		companyList.innerHTML = companies;
	}

	function searchCompanies(name) {
		fetch(`${API_BASE_URL}/api/companies?q=${name}`)
			.then((result) => result.json())
			.then(renderCompanyInfoList)
			.catch((err) => console.log(err));
	}

	function renderDetailedCompanyView(companyInfo) {
		detailedCompany['name'].innerHTML = companyInfo.name;
		detailedCompany['phone'].innerHTML = companyInfo.phone;
		detailedCompany['website'].href = companyInfo.website;
		detailedCompany['website'].innerText = companyInfo.website;
		detailedCompany['avatar'].src = companyInfo.avatarUrl;
		detailedCompany['laborType'].innerHTML = 'Labor Type: ' + companyInfo.laborType;
	}

	function bindEventListeners() {
		let searchTimestamp, detailedCompanyInfo;

		search.addEventListener("keyup", function(e) {
			if (searchTimestamp)
				clearTimeout(searchTimestamp);

			searchTimestamp = setTimeout(searchCompanies.bind(null, e.target.value), SEARCH_TIMEOUT_DELAY);
		});

		companyList.addEventListener("click", function(e) {
			if (e.target.innerHTML)
				renderDetailedCompanyView(e.target.dataset);
		});
	}
	
	function init() {
		bindEventListeners();
	}

	init();
})();