(function() {
	
	const API_BASE_URL = `http://localhost:3000`;
	const SEARCH_TIMEOUT_DELAY = 1000;
	
	const search = document.getElementById("search");
	const companyList = document.getElementById("company-list");

	const detailedCompany = {};
	detailedCompany['name'] = document.querySelector("#company-info .name");
	detailedCompany['phone'] = document.querySelector("#company-info .phone");
	detailedCompany['website'] = document.querySelector("#company-info .website");
	detailedCompany['avatar'] = document.querySelector("#company-info .avatar img");
	detailedCompany['laborType'] = document.querySelector("#company-info .labor-type");

	const previousPage = document.getElementById("previous-page");
	const nextPage = document.getElementById("next-page");
	const currentPage = document.getElementById("current-page");
	let startingEntry = 0, totalEntries;

	function renderCompanyInfoList({results, total}) {
		totalEntries = total;
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

		previousPage.className = (startingEntry <= 0) ? 'hidden' : '';
		currentPage.innerText = (startingEntry + 10 >= totalEntries) 
								? `(${startingEntry} - ${totalEntries}) of ${totalEntries}` 
								: `(${startingEntry} - ${startingEntry + 10}) of ${totalEntries}`;
		nextPage.className = (startingEntry + 10 >= totalEntries) ? 'hidden' : '';
	}

	function searchCompanies(name='', entry=0, filter='') {
		fetch(`${API_BASE_URL}/api/companies?q=${name}&start=${entry}&laborTypes=${filter}`)
			.then((result) => result.json())
			.then(renderCompanyInfoList)
			.catch((err) => console.log(err));
	}

	function renderDetailedCompanyView(companyInfo) {
		detailedCompany['name'].innerHTML = companyInfo.name;
		detailedCompany['phone'].innerHTML = 'Phone: ' + companyInfo.phone;
		detailedCompany['website'].href = companyInfo.website;
		detailedCompany['avatar'].src = companyInfo.avatarUrl;
		detailedCompany['laborType'].innerHTML = 'Labor Type: ' + companyInfo.laborType;
	}

	function bindEventListeners() {
		let searchTimestamp, detailedCompanyInfo;

		search.addEventListener("keyup", function(e) {
			if (searchTimestamp)
				clearTimeout(searchTimestamp);

			startingEntry = 0;
			searchTimestamp = setTimeout(searchCompanies.bind(null, e.target.value, startingEntry), SEARCH_TIMEOUT_DELAY);
		});

		companyList.addEventListener("click", function(e) {
			if (e.target.innerHTML)
				renderDetailedCompanyView(e.target.dataset);
		});

		previousPage.addEventListener("click", function(e) {
			if (startingEntry - 10 >= 0) {
				startingEntry -= 10;
				searchCompanies(search.value, startingEntry);
			}
		});

		nextPage.addEventListener("click", function(e) {
			if (startingEntry < totalEntries - 10) {
				startingEntry += 10;
				searchCompanies(search.value, startingEntry);
			}
		});
	}
	
	function init() {
		bindEventListeners();
		searchCompanies(search.value);
	}

	init();
})();