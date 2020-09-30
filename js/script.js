let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');

  totalPopulationList = document.querySelector('#totalPopulationList');

  // prettier-ignore
  totalPopulationFavorites =
    document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountriesAsync();
  // fetchCountries();
});

async function fetchCountriesAsync() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  console.log(json);
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();

  handleCountryButtons();
}

document.addEventListener('DOMContentLoaded', function () {
  const hint_tip = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(hint_tip, {});
});

function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
        <a id="${id}" data-position="top" data-tooltip="Adicionar ${name}" class='waves-effect waves-light btn tooltipped'>+</a>
        </div>
        <div>
        <img src="${flag}" alt="${name}">
        </div>
      <div>
       <ul>
        <li>${name}</li>
        <li>${formattedPopulation}</li>
      </div>
      </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoritesCountryHTML = `
      <div class='country'>
        <div>
        <a id="${id}" data-position="bottom" data-tooltip="Adicionar ${name}" class='waves-effect waves-light btn tooltipped red darken-4'>-</a>
        </div>
        <div>
        <img src="${flag}" alt="${name}">
        </div>
      <div>
       <ul>
        <li>${name}</li>
        <li>${formattedPopulation}</li>
      </div>
      </div>
    `;
    favoritesHTML += favoritesCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoritesButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  favoriteCountries = [...favoriteCountries, countryToAdd];

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

function removeFromFavorites(id) {
  const countrytoRemove = favoriteCountries.find(
    (country) => country.id === id
  );

  allCountries = [...allCountries, countrytoRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  favoriteCountries = favoriteCountries.filter((country) => country.id !== id);

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}

function fetchCountries() {
  fetch('http://restcountries.eu/rest/v2/all')
    .then((res) => res.json())
    .then((json) => {
      allCountries = json;
      console.log(allCountries);
    });
}
