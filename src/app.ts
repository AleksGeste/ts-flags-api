// selectors from index
const countriesCont = document.querySelector('.countries')! as HTMLDivElement
const messageCont = document.querySelector('.message')! as HTMLDivElement
const form = document.querySelector('form')!
const latitude = document.getElementById('latitude')! as HTMLInputElement
const longitude = document.getElementById('longitude')! as HTMLInputElement
const btn = document.querySelector('.btn-country') as HTMLButtonElement

interface CountryInfo {
  name: { common: string }
  flags: Flags
  region: string
  population: number
  languages: Dictionary
  currencies: Dictionary
  borders: string[] | undefined
}

export interface Flags {
  png: string
  svg: string
}

export interface Dictionary {
  [key: string]: { name: string }
}

/**
 * Custom type - response type when getting response with country
 */
type CountryResponse = {
  status: number
  statusText: string
  ok: boolean
  json: any
}

/**
 * Rendering country information to the web
 * @param data Information about country with CountryInfo interface format
 * @param className Html class name to display neighbour country in different format
 */
const renderCountry = function (
  data: CountryInfo,
  className: string = ''
): void {
  const html = `
<article class="country ${className}">
<img class="country__img" src="${data.flags.png}"  alt="${data.name.common}"/>
<div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
    1
  )} M people</p>
  <p class="country__row"><span>🗣️</span>${Object.values(data.languages)}</p>
  <p class="country__row"><span>💰</span>${Object.keys(data.currencies)}</p>
</div>
</article>
`
  countriesCont.insertAdjacentHTML('beforeend', html)
  messageCont.style.opacity = '0'
}

/**
 * Display Error message if it happened
 * @param message Error message
 */
const renderError = function (message: string) {
  messageCont.innerHTML = ''
  messageCont.style.opacity = '1'
  messageCont.insertAdjacentText('beforeend', message)
}

/**
 * Function which receive upl as parameter and return promise
 * @param url
 * @param errorMessage
 */
const getJSON = function (
  url: string,
  errorMessage: string = 'Something went wrong'
): Promise<CountryInfo[]> {
  return fetch(url).then<CountryInfo[]>((response: CountryResponse) => {
    if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status})`)
    }
    return response.json()
  })
}

/**
 * Get Countries using Promises
 * @param country Name of the country
 */
const getCountryDataPr = function (country: string) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found: '
  )
    .then(data => {
      renderCountry(data[0])
      let neighbour: string

      if (data[0].borders) {
        neighbour = data[0].borders[0]
      } else {
        throw new Error('No neighbour found')
      }
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found: '
      )
    })
    .then(data => {
      renderCountry(data[0], 'neighbour')
    })
    .catch(err => {
      // catch also returns promise
      renderError(`Something went wrong: ${err.message}. Try again!`)
    })
    .finally(() => {
      // always need to happened
      countriesCont.style.opacity = '1'
      countriesCont.style.marginBottom = '10px'
    })
}

/**
 * Function fetching country by lat and lon
 * @param lat
 * @param lon
 */
const fetchCountry = function (lat: string, lon: string) {
  fetch(`https://geocode.xyz/${lat},${lon}?geoit=json`)
    .then((response: CountryResponse) => {
      if (!response.ok) {
        throw new Error(`Server busy! ${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      getCountryDataPr(data.country)
    })
    .catch(err => {
      // catch also returns promise
      renderError(`Something went wrong: ${err.message}. Try again later! `)
    })
    .finally(() => {
      // always need to happened
      countriesCont.style.opacity = '1'
      countriesCont.style.marginBottom = '10px'
    })
}

/**
 * Function for event listener. Get lan and lon from user and trigger fetch func
 * @param event
 */
function searchPlace(event: Event) {
  countriesCont.innerHTML = ''
  event.preventDefault()
  const enteredLatitude = latitude.value
  const enteredLongitude = longitude.value
  fetchCountry(enteredLatitude, enteredLongitude)
}

/**
 * Listener for btn in form
 */
form.addEventListener('submit', searchPlace)

interface T {
  coords: {
    latitude: number
    longitude: number
  }
}

/**
 * Function get position from user browser and return promise
 */
const getPosition: () => Promise<T> = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

/**
 * Function for btn and workaround with promise with user geo
 */
const findUser = function () {
  countriesCont.innerHTML = ''
  getPosition()
    .then(data => {
      // destructuring
      const { latitude: lat, longitude: lon } = data.coords
      fetchCountry(lat.toString(), lon.toString())
    })
    .catch(err => {
      console.error(err)
    })
}

btn.addEventListener('click', findUser)
