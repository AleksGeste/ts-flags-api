const countriesContainer = document.querySelector('.countries')! as HTMLDivElement;

// old way
const getCountryData = function (country: string) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// fetch data in background
    request.send();

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        const html = `
<article class="country">
<img class="country__img" src="${data.flags.png}"  alt="${data.name.common}"/>
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} M people</p>
  <p class="country__row"><span>🗣️</span>${data.languages.lav}</p>
  <p class="country__row"><span>💰</span>${data.currencies.EUR.name}</p>
</div>
</article>
`;
        countriesContainer.insertAdjacentHTML('beforeend', html);
        countriesContainer.style.opacity = '1';
    })
}

getCountryData('Latvia')
