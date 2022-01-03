//
//
// /**
//  * Get country data without using Promises
//  * @param country Name of the country
//  */
// const getCountryData = function (country: string): void {
//     const request = new XMLHttpRequest()
//     request.open('GET', `https://restcountries.com/v3.1/name/${country}`)
//     // fetch data in background
//     request.send()
//
//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(this.responseText)
//         console.log(data)
//
//         // render country one
//         renderCountry(data)
//
//         // get neighbour counties
//         const [...neighbours] = data.borders
//         console.log(neighbours)
//
//         neighbours.forEach((value: string) => {
//             const requestX = new XMLHttpRequest()
//             requestX.open('GET', `https://restcountries.com/v3.1/alpha/${value}`)
//             requestX.send()
//             requestX.addEventListener('load', function () {
//                 const [dataX] = JSON.parse(this.responseText)
//                 renderCountry(dataX, 'neighbour')
//             })
//         })
//     })
// }

// getCountryData('Russia')

// // creating own Promise
// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log('Lottery draw is happening ... ')
//
//   // simple set timeout func for 2 sec
//   // to encapsulate async behavior
//   setTimeout(function () {
//     if (Math.random() > 0.5) {
//       resolve('You WIN 🎉')
//     } else {
//       reject(new Error('You lost you money 🙃'))
//     }
//   }, 2000)
// })
//
// // calling our Promise
// lotteryPromise
//   .then(data => {
//     console.log(data)
//   })
//   .catch(err => {
//     console.error(err)
//   })
//
// // real work example - Promisifying
// // func return Promise
// const wait = function (seconds: number) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000)
//   })
// }
//
// wait(1)
//   .then(() => {
//     console.log('I waited for 1 second')
//     return wait(1)
//   })
//   .then(() => {
//     console.log('I waited for 2 seconds')
//     return wait(1)
//   })
//   .then(() => {
//     console.log('I waited for 3 seconds')
//     return wait(1)
//   })
//   .then(() => {
//     console.log('I waited for 4 seconds')
//   })
//
// Promise.resolve('abc').then(x => console.log(x))
// Promise.reject(new Error('xyz')).catch(x => console.error(x))
