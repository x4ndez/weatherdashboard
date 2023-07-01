// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

const s_citySearchInput = document.querySelector("#city-search-input");
const s_citySearchSubmit = document.querySelector("#city-search-submit");
const s_main = document.querySelector("main");
const s_searchHistory = document.querySelector("#search-history");

const weatherAPIKey = "868193796ea8040d9f907e1ebd86b46c";

getSearchHistory(); //Render search history to nav bar

s_citySearchSubmit.addEventListener("click", function () {

    renderWeather(s_citySearchInput.value);

});

function renderWeather(userInput) {

    const citySearched = userInput;

    //clear main area
    while (s_main.firstChild) {

        s_main.firstChild.remove();

    }


    //:api req: call a city to get long, lat details
    //if successful >> pull data and parse to next function
    //if error >> throw error, correct city?

    getCityData("weather", citySearched);
    getCityData("forecast", citySearched);



    //:api req: get city weather data
    //if successful >> pull weather data and parse to next function
    //>> Add city to nav list and store in local storage
    //>> display city weather details on main
    //if error >> throw error with error code


}

async function getCityData(type, citySearched) {

    let getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&appid=${weatherAPIKey}`;

    const cityData = await fetch(getCityUrl)
        .then(function (response) {

            return response.json();

        });

    if (cityData) {

        getWeatherData(
            type, cityData[0].lat, cityData[0].lon
        );

    }

}

async function getWeatherData(type, cityLat, cityLon) {

    let getWeatherUrl = `https://api.openweathermap.org/data/2.5/${type}?lat=${cityLat}&lon=${cityLon}&appid=${weatherAPIKey}`;

    const weatherData = await fetch(getWeatherUrl)
        .then(function (response) {

            return response.json();

        });

    if (weatherData) {

        if (type === "weather") {

            renderCurrentWeather(weatherData);

        } else if (type === "forecast") {

            console.log(weatherData);

            renderForecastWeather(weatherData);

        }

    }

}

function renderCurrentWeather(weatherData) {

    // add: city, date, temp, wind, humidity

    const city = weatherData.name;
    const date = "current date";
    const temp = weatherData.main.temp;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    const currentWeatherEl = document.createElement("div");
    currentWeatherEl.innerHTML = `

        <h2>${city} (${date})</h2>

        <p>Temp: ${temp} F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>

        `;

    s_main.append(currentWeatherEl);

    addToHistory(weatherData.name); //Log this search to navbar

}

function renderForecastWeather(weatherData) {

    //make div in main
    //for loop make div in div

    let weatherForecast = [];
    let timeStampIterator = 2;

    weatherForecastContainer = document.createElement("div");
    weatherForecastContainer.setAttribute("id", "forecast-container");
    s_main.append(weatherForecastContainer);

    for (let i = 0; i < 5; i++) {

        const date = weatherData.list[timeStampIterator].dt_txt;
        const temp = weatherData.list[timeStampIterator].main.temp;
        const wind = weatherData.list[timeStampIterator].wind.speed;
        const humidity = weatherData.list[timeStampIterator].main.humidity;

        weatherForecast[i] = document.createElement("div");
        weatherForecast[i].setAttribute("class", "forecast-item");

        weatherForecast[i].innerHTML = `

        <h3>${date}</h3>

        <p>Temp: ${temp} F</p>
        <p>Wind: ${wind} MPH</p>
        <p>Humidity: ${humidity} %</p>

        `;

        weatherForecastContainer.append(weatherForecast[i]);

        timeStampIterator += 8;

    }

}

function addToHistory(city) {

    const searchHistory = localStorage.getItem("searchHistory");
    let searchHistoryArray = [];

    if (searchHistory === null) {

        console.log("hey");
        searchHistoryArray.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));

    } else {

        searchHistoryArray = JSON.parse(searchHistory);
        searchHistoryArray.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));

    }

    console.log(searchHistory);

}

function getSearchHistory() {

    const searchHistory = localStorage.getItem("searchHistory");
    let searchHistoryArray = JSON.parse(searchHistory);
    let searchHistoryList = [];

    for (let i = 0; i < searchHistoryArray.length; i++) {

        searchHistoryList[i] = document.createElement("li");
        searchHistoryList[i].textContent = searchHistoryArray[i];

        s_searchHistory.append(searchHistoryList[i]);

        searchHistoryList[i].addEventListener("click", function () {

            renderWeather(searchHistoryArray[i]);

        });

    }

}