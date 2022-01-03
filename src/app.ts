// selectors from index
const countriesContainer = document.querySelector(
  '.countries'
)! as HTMLDivElement
const form = document.querySelector('form')!
const latitude = document.getElementById('latitude')! as HTMLInputElement
const longitude = document.getElementById('longitude')! as HTMLInputElement

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
  countriesContainer.insertAdjacentHTML('beforeend', html)
}

/**
 * Get country data without using Promises
 * @param country Name of the country
 */
const getCountryData = function (country: string): void {
  const request = new XMLHttpRequest()
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`)
  // fetch data in background
  request.send()

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText)
    console.log(data)

    // render country one
    renderCountry(data)

    // get neighbour counties
    const [...neighbours] = data.borders
    console.log(neighbours)

    neighbours.forEach((value: string) => {
      const requestX = new XMLHttpRequest()
      requestX.open('GET', `https://restcountries.com/v3.1/alpha/${value}`)
      requestX.send()
      requestX.addEventListener('load', function () {
        const [dataX] = JSON.parse(this.responseText)
        renderCountry(dataX, 'neighbour')
      })
    })
  })
}

// getCountryData('Russia')

/**
 * Display Error message if it happened
 * @param message Error message
 */
const renderError = function (message: string) {
  countriesContainer.insertAdjacentText('beforeend', message)
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
      countriesContainer.style.opacity = '1'
      countriesContainer.style.marginBottom = '10px'
    })
}

function searchPlace(event: Event) {
  event.preventDefault()
  const enteredLatitude = latitude.value
  const enteredLongitude = longitude.value

  fetch(`https://geocode.xyz/${enteredLatitude},${enteredLongitude}?geoit=json`)
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
      countriesContainer.style.opacity = '1'
      countriesContainer.style.marginBottom = '10px'
    })
}

form.addEventListener('submit', searchPlace)

// creating own Promise
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening ... ')

  // simple set timeout func for 2 sec
  // to encapsulate async behavior
  setTimeout(function () {
    if (Math.random() > 0.5) {
      resolve('You WIN 🎉')
    } else {
      reject(new Error('You lost you money 🙃'))
    }
  }, 2000)
})

// calling our Promise
lotteryPromise
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.error(err)
  })

// real work example - Promisifying
// func return Promise
const wait = function (seconds: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000)
  })
}

wait(1)
  .then(() => {
    console.log('I waited for 1 second')
    return wait(1)
  })
  .then(() => {
    console.log('I waited for 2 seconds')
    return wait(1)
  })
  .then(() => {
    console.log('I waited for 3 seconds')
    return wait(1)
  })
  .then(() => {
    console.log('I waited for 4 seconds')
  })

Promise.resolve('abc').then(x => console.log(x))
Promise.reject(new Error('xyz')).catch(x => console.error(x))
