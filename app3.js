const citiesList = document.getElementById('citiesList');
const searchBar = document.getElementById('searchBar');
const searchBar2 = document.getElementById('searchBar2');
let focusedBar = searchBar;
let searchString = 'https://api.comparatrip.eu/cities/autocomplete/?q=';
let cityFrom = '';
let res = 0;
let filterString = '';
let cities = [];
let popular = [];
let popular2 = [];
let id_autocomplete;
let car2= [];
let car3 = [];
let car4 = [];
let finalApi = '';

const loadPopular = async () => {
	try
	{
		const res2 = await fetch('https://api.comparatrip.eu/cities/popular/5');
		popular = await res2.json();
	} catch(err) {
		console.error(err);
	}

};

function changefocus()
{
	focusedBar=document.activeElement;
};

function mergeUnique(arr1, arr2){
	return arr1.concat(arr2.filter(function (item) {
				return arr1.indexOf(item) === -1;
				}));
}
function api_filter(filterString,pop,mode)
{
	const filteredCharacters = pop.filter((city) => {
			return (
					city.unique_name.toLowerCase().includes(filterString)
				   );
			});
	if (filteredCharacters.length !== 0)
	{
		let i = -1;
		while (++i < filteredCharacters.length)
		{
			searchString = 'https://api.comparatrip.eu/cities/autocomplete/?q=';
			searchString = searchString.concat(filteredCharacters[i].unique_name);
			tt(searchString);
		}
	}
	searchString = 'https://api.comparatrip.eu/cities/autocomplete/?q=';
	searchString = searchString.concat(filterString);
	tt(searchString);
	if (mode === 1)
		car3 = JSON.parse(JSON.stringify(car2));
	else
		car4 = JSON.parse(JSON.stringify(car2));
	car2 = [];


};

searchBar.addEventListener('keyup', (e) => {
		filterString = e.target.value.toLowerCase();
		if (filterString !== '')
			api_filter(filterString,popular,1);
		else
			displayCities(popular);
		});

function test (that,searchBar) {
	id_autocomplete = that.id;
	focusedBar.value = id_autocomplete;
}

async function tt (string) {
	cities = [];
	try {
		res = await fetch(string);
		cities = await res.json();
		car2 = car2.concat(cities).filter(function(o) {
				return this[o.unique_name]? false : this[o.unique_name] = true;},{});
		displayCities(car2);
	} catch (err) {
		console.error(err);
	}
	searchString = 'https://api.comparatrip.eu/cities/autocomplete/?q=';
};

const displayCities = (position) => {
	const htmlString = position
		.map((city) => {
				if (city.station_unique_name == null)
				{
					return `
					<li class="city", id="${city.unique_name}", onClick=test(this)>
					<h2>${city.unique_name}</h2>
					</li>
					`;
				}
				else
				{
					return `
					<li class="city", id="${city.station_unique_name}", onClick=test(this)>
					<h2>${city.station_unique_name}</h2>
					</li>
					`;
				}
			})
	.join('');
	citiesList.innerHTML = htmlString;
};

const loadPopular2 = async () => {
	try{
		const api = 'https://api.comparatrip.eu/cities/popular/from/';
		const api2 = '/5';
		finalApi = (api.concat('',searchBar.value)).concat('',api2);
		const res3 = await fetch(finalApi);
		popular2 = await res3.json();
	} catch(err) {
		console.error(err);
	}
};

function remove() {
	while (citiesList.hasChildNodes())
		citiesList.removeChild(citiesList.firstChild);
	car2 = [];
};

loadPopular();

searchBar.addEventListener('click', (e) => {
		if (searchBar.value === '')
			displayCities(popular);
		else
		{
			filterString = e.target.value.toLowerCase();
			api_filter(filterString,popular,1);
		}
});
searchBar2.addEventListener('click', (e) => {
		const api = 'https://api.comparatrip.eu/cities/popular/from/';
		const api2 = '/5';
		finalApi = (api.concat('',searchBar.value)).concat('',api2);
		if (searchBar.value === '')
			displayCities(popular);
		else
		{
			if (searchBar2.value === '')
			{
				loadPopular2();
				displayCities(popular2);
			}
			else
			{
				filterString2 = e.target.value.toLowerCase();
			api_filter(filterString2,popular2,0);
			}
		}
});

searchBar2.addEventListener('keyup', (e) => {
		filterString2 = e.target.value.toLowerCase();
		if (filterString2 !== '')
		api_filter(filterString2,popular2,0);
		else
		{
		if (searchBar.value === '')
		displayCities(popular);
		else
		{
		loadPopular2();
		displayCities(popular2);
		}
		}
		});

window.addEventListener('click', function(e){
		if (!(document.getElementById('searchWrapper').contains(e.target) || document.getElementById('searchWrapper2').contains(e.target))){
			remove();
		}
		});
