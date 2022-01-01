const countriesContainer = document.querySelector('.countries')! as HTMLDivElement;

// old way


interface CountryInfo {
    name: { common: string };
    flags: Flags;
    region: string;
    population: number;
    languages: Dictionary;
    currencies: Dictionary;
    borders: string[];
}

export interface Flags {
    png: string;
    svg: string;
}

export interface Dictionary {
    [key: string]: { name: string };
}

const renderCountry = function (data: CountryInfo, className: string = ''): void {
    const html = `
<article class="country ${className}">
<img class="country__img" src="${data.flags.png}"  alt="${data.name.common}"/>
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} M people</p>
  <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
  <p class="country__row"><span>💰</span>${Object.keys(data.currencies)}</p>
</div>
</article>
`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = '1';
}

const getCountryData = function (country: string): void {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
// fetch data in background
    request.send();

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        // render country one
        renderCountry(data);

        // get neighbour counties
        const [...neighbours] = data.borders;
        console.log(neighbours);

        neighbours.forEach((value: string) => {
            const requestX = new XMLHttpRequest();
            requestX.open('GET', `https://restcountries.com/v3.1/alpha/${value}`);
            requestX.send();
            requestX.addEventListener('load', function () {
                const [dataX] = JSON.parse(this.responseText);
                renderCountry(dataX, 'neighbour');
            })

        })
    })
}

getCountryData('Latvia')
