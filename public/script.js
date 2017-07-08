(function() {
	
	const API_BASE_URL = `http://localhost:3000`;
	const SEARCH_TIMEOUT_DELAY = 1000;
	const SEARCH_LIMIT = 10;
	// Search elements
	const search = document.getElementById("search");
	// List view elements
	const companyList = document.getElementById("company-list");
	// Detailed view elements
	const detailedCompany = {};
	detailedCompany['name'] = document.querySelector("#company-info .name");
	detailedCompany['phone'] = document.querySelector("#company-info .phone");
	detailedCompany['website'] = document.querySelector("#company-info .website");
	detailedCompany['avatar'] = document.querySelector("#company-info .avatar img");
	detailedCompany['laborType'] = document.querySelector("#company-info .labor-type");
	// Filter elements
	const filters = document.querySelectorAll(".filter");
	let filterString = ``;
	// Pagination elements
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
		currentPage.innerText = (startingEntry + SEARCH_LIMIT >= totalEntries) 
								? `(${startingEntry} - ${totalEntries}) of ${totalEntries}` 
								: `(${startingEntry} - ${startingEntry + SEARCH_LIMIT}) of ${totalEntries}`;
		nextPage.className = (startingEntry + SEARCH_LIMIT >= totalEntries) ? 'hidden' : '';
	}

	function searchCompanies(name='', entry=0, filter='', searchLimit=SEARCH_LIMIT) {
		fetch(`${API_BASE_URL}/api/companies?q=${name}&start=${entry}&laborTypes=${filter}&limit=${searchLimit}`)
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
		// Search event listener
		let searchTimestamp;
		search.addEventListener("keyup", function(e) {
			if (searchTimestamp)
				clearTimeout(searchTimestamp);

			startingEntry = 0;
			searchTimestamp = setTimeout(
				searchCompanies.bind(null, e.target.value, startingEntry, filterString), 
				SEARCH_TIMEOUT_DELAY
			);
		});
		// Detailed view event listener
		companyList.addEventListener("click", function(e) {
			if (e.target.innerHTML)
				renderDetailedCompanyView(e.target.dataset);
		});
		// Filtering event listeners
		filters.forEach((filter) => {
			filter.addEventListener("change", function(e) {
				const selectedFilters = [];

				filters.forEach((f) => {
					if (f.checked)
						selectedFilters.push(f.value);
				});

				startingEntry = 0;
				filterString = selectedFilters.join(',');
				searchCompanies(search.value, startingEntry, filterString);
			});
		});
		// Pagination event listeners
		previousPage.addEventListener("click", function(e) {
			if (startingEntry - SEARCH_LIMIT >= 0) {
				startingEntry -= SEARCH_LIMIT;
				searchCompanies(search.value, startingEntry, filterString);
			}
		});
		nextPage.addEventListener("click", function(e) {
			if (startingEntry < totalEntries - SEARCH_LIMIT) {
				startingEntry += SEARCH_LIMIT;
				searchCompanies(search.value, startingEntry, filterString);
			}
		});
	}
	
	function init() {
		bindEventListeners();
		searchCompanies(search.value);
	}

	init();
})();