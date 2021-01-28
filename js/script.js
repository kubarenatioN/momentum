const overlay = document.querySelector('.overlay-wrapper')
const changeBgBtn = document.querySelector('.change-bg')
const date = document.querySelector('.date')
const time = document.querySelector('.time')
const timeHours = document.querySelector('.hours')
const timeMinutes = document.querySelector('.minutes')
const timeSeconds = document.querySelector('.seconds')
const greeting = document.querySelector('.greeting')
const userName = document.querySelector('.name')
const userNameWrapper = document.querySelector('.name-wrapper')
const userFocus = document.querySelector('.focus')
const userFocusWrapper = document.querySelector('.focus-wrapper')
const quoteText = document.querySelector('.quote-text')
const quoteAuthor = document.querySelector('.quote-author')
const quoteUpdate = document.querySelector('.update-quote-btn')
const userCity = document.querySelector('.city')
const weatherIcon = document.querySelector('.weather-icon')
const weatherTemperature = document.querySelector('.weather-temperature')
const weatherWind = document.querySelector('.weather-wind')
const weatherHumidity = document.querySelector('.weather-humidity')
const weatherDescr = document.querySelector('.weather-descr')

// Getting all date components and add them to HTML
function getDateTime() {

  // get current Date
  const today = new Date()

  // Getting hours, minutes, seconds
  const hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()

  // avoid time moving
  timeHours.innerText = hours
  timeMinutes.innerText = `:${addZero(minutes)}:`
  timeSeconds.innerText = addZero(seconds)

  //  Specify date format
  let dateOptions = { weekday: 'long', day: 'numeric', month: 'long' }
  date.innerText = today.toLocaleString('en', dateOptions)

}

// Correcting format
function addZero(number) {
  return (number < 10 ? '0' : '') + number
}

function generateRandomImages() {
  let a = []
  for (let i = 0; i < 20; ++i) {
    if (i < 9) a[i] = `0${i + 1}.jpg`
    else a[i] = `${i + 1}.jpg`
  }

  function shuffle(array) {
    let tmp, current, top = array.length;
    if (top) while (--top) {
      current = Math.floor(Math.random() * (top + 1))
      tmp = array[current]
      array[current] = array[top]
      array[top] = tmp
    }
    return array
  }
  a = shuffle(a)

  let imagesNames = []
  for (let i = 0; i < 6; i++) {
    imagesNames.push(a[i])
  }

  return imagesNames
}

// getting array of imageNames arrays
const bgImages = Array(4).fill(0).map(el => generateRandomImages())
// console.log(bgImages)
const timePeriods = ['images/night/', 'images/morning/', 'images/day/', 'images/evening/']
const greetingsList = ['Good night', 'Good morning', 'Good afternoon', 'Good evening']

// hours to start from use them to change bg-images by button
let growingHours = (new Date()).getHours()

// previous hours number, use them to compare with current hours
// and decide execute changeBgImage function or not
// prevent bg-image refreshing while using changeBgImage
let prevHour = (new Date()).getHours()

// calculate hours and decide execute changeBgImage() or not
// depending on diference between current and previous hour
function setTimeBg() {

  // const today = new Date(2021, 02, 25, 18)
  const today = new Date()

  // const hour = Math.trunc(today.getMinutes() / 3)
  const hour = today.getHours()

  // at the moment when hour jumps from one value to another (e.g. 17:59 -> 18:00)
  // prevHour = 17, hour = 18
  if (prevHour != hour) {
    // execute bg-image changing 
    changeBgImage(hour)
    // refreshing counters
    prevHour = hour
    growingHours = hour
  }

  greeting.innerText = greetingsList[Math.trunc(hour / 6)] + ', '
}

function changeBgImage(hour) {

  // get time period from 0 to 3 index
  let timePeriod = Math.trunc(hour / 6)

  // create an img tag and listen for onload event, then change bg-image to avoid flickering
  // solution for single image-names array
  // const src = `${timePeriods[timePeriod]}${bgImages[hour % 6]}`

  //solution for multiple image-names array
  const src = `${timePeriods[timePeriod]}${bgImages[timePeriod][hour % 6]}`
  const img = document.createElement('img')
  img.src = src
  img.onload = () => {
    // configure bg image url
    document.body.style.backgroundImage = `url(${src})`

    if (timePeriod > 0 && timePeriod <= 3) overlay.style.background = 'rgba(0,0,0,0.3)'
    else overlay.style.background = 'rgba(0,0,0,0)'

  }
}

function setStorageItem(event, itemName, item) {
  if (event.keyCode == 13) {
    event.preventDefault()
    if (event.target.innerText.trim() != '') {
      localStorage.setItem(itemName, event.target.innerText.trim())
      if(itemName == 'userCity') getWeather()
      item.blur()
    }
  }
}
function getStorageItem(itemName, item, placeholder) {
  if (localStorage.getItem(itemName) != null)
    item.innerText = localStorage.getItem(itemName)
  else item.innerText = placeholder
}

async function getQuote() {
  const requestUrl = 'https://type.fit/api/quotes'
  const response = await fetch(requestUrl)
  const data = await response.json()
  const quote = data[Math.floor(Math.random() * 1643)]
  const text = quote.text
  const author = quote.author ? quote.author : 'Anonim'
  quoteText.innerText = `"${text}"`
  quoteAuthor.innerText = '— '+author
  quoteUpdate.disabled = true;
  setTimeout(() => {
    quoteUpdate.disabled = false
  }, 2000);
}

async function getWeather() {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('userCity')}&appid=9513284f7eb04b592fe4dba8479cfc80&units=metric`

  const response = await fetch(weatherUrl)
  const data = await response.json()
  
  weatherIcon.className = 'weather-icon owf owf-lg'
  if(data.cod == 404 && data.message == 'city not found'){
    weatherDescr.innerText = 'No search results'
    weatherTemperature.innerText = ''
    weatherHumidity.innerText = ''
    weatherWind.innerText = ''
  }
  else{
    weatherIcon.classList.add(`owf-${data.weather[0].id}`)
    weatherDescr.innerText = data.weather[0].description
    weatherTemperature.innerText = `Temperature: ${data.main.temp.toFixed(1)}°`
    weatherHumidity.innerText = `Humidity: ${data.main.humidity}%`
    weatherWind.innerText = `Wind: ${data.wind.speed} km/h`
  }
}

userName.addEventListener('mousedown', () => {
  userName.classList.add('active')
  userName.setAttribute('contenteditable', true)
  userName.innerText = ' '
})
userName.addEventListener('keypress', (e) => {
  setStorageItem(e, 'userName', userName)
})
userName.addEventListener('blur', () => {
  userName.setAttribute('contenteditable', false)
  userName.classList.remove('active')
  getStorageItem('userName', userName, 'Guest')
})

userFocus.addEventListener('mousedown', () => {
  userFocus.setAttribute('contenteditable', true)
  userFocus.classList.add('active')
  userFocus.innerText = ''
})
userFocus.addEventListener('keypress', (e) => {
  setStorageItem(e, 'userFocus', userFocus)
})
userFocus.addEventListener('blur', () => {
  userFocus.setAttribute('contenteditable', false)
  userFocus.classList.remove('active')
  getStorageItem('userFocus', userFocus, 'Your focus')
})

userCity.addEventListener('mousedown', () => {
  userCity.setAttribute('contenteditable', true)
  userCity.classList.add('active')
  userCity.innerText = ''
})
userCity.addEventListener('keypress', (e) => {
  setStorageItem(e, 'userCity', userCity)
})
userCity.addEventListener('blur', () => {
  userCity.setAttribute('contenteditable', false)
  userCity.classList.remove('active')
  getStorageItem('userCity', userCity, 'Your city')
})

getDateTime()
setInterval(() => {
  getDateTime()
}, 1000);

changeBgImage(growingHours)
setTimeBg()
setInterval(() => {
  setTimeBg()
}, 1000);

getStorageItem('userCity', userCity, 'Your city')
getStorageItem('userFocus', userFocus, 'Your focus')
getStorageItem('userName', userName, 'Guest')

changeBgBtn.addEventListener('click', () => {

  // format hours
  changeBgImage((++growingHours) % 24)

  // freeze changeBgBtn for 1 sec
  changeBgBtn.disabled = true;
  setTimeout(() => {
    changeBgBtn.disabled = false
  }, 1000);
})

document.addEventListener('DOMContentLoaded', getQuote)
quoteUpdate.addEventListener('click', getQuote)

getWeather()