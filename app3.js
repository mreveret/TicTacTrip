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

/*
 * On recupere le tableau popular des villes les plus populaire via l'api 2
 */

const loadPopular = async () => {
	try
	{
		const res2 = await fetch('https://api.comparatrip.eu/cities/popular/5');
		popular = await res2.json();
	} catch(err) {
		console.error(err);
	}

};

/*
 * savoir quelle est la barre de recherche a autocomplete
 */

function changefocus()
{
	focusedBar=document.activeElement;
};

/*
 * Utilisation de l'API 1 en ajoutant un filtre qui va rechercher aussi les villes 
 * qui ont ete trouver en autocompletant les villes populaires qui matchs
 * 'pop' choisi le tableau de villes populaires soit avec API 2 soit avec API 3
 * l'array resultant est garde en memoire via car3 ou car4 (defini selon 'mode')un pour chaque barre de recherche 
 */
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
			algo(searchString);
		}
	}
	searchString = 'https://api.comparatrip.eu/cities/autocomplete/?q=';
	searchString = searchString.concat(filterString);
	algo(searchString);
	if (mode === 1)
		car3 = JSON.parse(JSON.stringify(car2));
	else
		car4 = JSON.parse(JSON.stringify(car2));
	car2 = [];


};

/*
 * Si la barre de recherche depart est vide on affiche les villes poulaire sinon, le resultat
 */

searchBar.addEventListener('keyup', (e) => {
		filterString = e.target.value.toLowerCase();
		if (filterString !== '')
			api_filter(filterString,popular,1);
		else
			displayCities(popular);
		});
/*
 * en cliquant sur l'un des <li> generer on recupere son id et on autocomplete la barre de recherche avec sa valeur
 */
function autocomplete(that,searchBar) {
	id_autocomplete = that.id;
	focusedBar.value = id_autocomplete;
}

/*
 * Recupere le tableau JSON d'une API
 * Concatene 2 array sans doublons (utile pour la boucle qui check les villes populaires vu plus haut)
 * puis appelle l'affichage
 */

async function algo (string) {
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

/*
 * Affichage
 */

const displayCities = (position) => {
	const htmlString = position
		.map((city) => {
				if (city.station_unique_name == null)
				{
					return `
					<li class="city", id="${city.unique_name}", onClick=autocomplete(this)>
					<h2>${city.unique_name}</h2>
					</li>
					`;
				}
				else
				{
					return `
					<li class="city", id="${city.station_unique_name}", onClick=autocomplete(this)>
					<h2>${city.station_unique_name}</h2>
					</li>
					`;
				}
			})
	.join('');
	citiesList.innerHTML = htmlString;
};

/*
 * On recupere le tableau popular2 des villes les plus populaires suivant la ville de depart via l'api 3
 */

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

/*
 * Supprime l'affichage
 */

function remove() {
	while (citiesList.hasChildNodes())
		citiesList.removeChild(citiesList.firstChild);
	car2 = [];
};

loadPopular();

/*
 * Affiche le tableau des villes populaires si vide
 * sinon affiche le dernier tableau des resultats en memoire
 */

searchBar.addEventListener('click', (e) => {
		if (searchBar.value === '')
			displayCities(popular);
		else
		{
			filterString = e.target.value.toLowerCase();
			api_filter(filterString,popular,1);
		}
});

/*
 * Affiche le tableau des villes populaire en fonction de la ville de depart si la 1ere barre de recherche n'est pas vide et que celle de l'arrivee est vide
 * Affiche le tableau des villes populaires si les 2 barres sont vides
 * sinon affiche le dernier tableau des resultats en memoire
 */

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

/*
 * Si la barre n'est pas vide on cherche le tableau de resultats
 * sinon si seulement la barre de recherche Arrivee est vide on affiche les villes populaires en fonction de la ville de depart
 * si les 2 barres sont vides affiche seulement les villes les plus populaires generales
 */

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

/*
 * Si l'on clique en dehors d'une barre de recherche cela ferme le tableau de resultats
 */

window.addEventListener('click', function(e){
		if (!(document.getElementById('searchWrapper').contains(e.target) || document.getElementById('searchWrapper2').contains(e.target))){
			remove();
		}
		});
