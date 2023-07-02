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

    //:api req: get city weather data
    //if successful >> pull weather data and parse to next function
    //>> Add city to nav list and store in local storage
    //>> display city weather details on main
    //if error >> throw error with error code

    getCityData("weather", citySearched); //:api req: for current weather

    getCityData("forecast", citySearched); //:api req: for 5 day forecast

}

async function getCityData(type, citySearched) {

    let getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&appid=${weatherAPIKey}`;

    const cityData = await fetch(getCityUrl)
        .then(function (response) {

            if (response.ok) {

                console.log("Request successful: " + response.status);
                return response.json();

            } else {

                alert("Failed Request: " + response.status + ", please try again.");
                console.log("Failed Request: " + response.status + ", please try again.");

            }

        });

    if (cityData) {

        getWeatherData(
            type, cityData[0].lat, cityData[0].lon
        );

    }

}

async function getWeatherData(type, cityLat, cityLon) {

    let getWeatherUrl = `https://api.openweathermap.org/data/2.5/${type}?lat=${cityLat}&lon=${cityLon}&units=metric&appid=${weatherAPIKey}`;

    const weatherData = await fetch(getWeatherUrl)
        .then(function (response) {

            return response.json();

        });

    if (weatherData) {

        if (type === "weather") {

            renderCurrentWeather(weatherData);

        } else if (type === "forecast") {

            renderForecastWeather(weatherData);

        }

    }

}

function renderCurrentWeather(weatherData) {

    // add: city, date, temp, wind, humidity, icon

    const city = weatherData.name;
    const date = dayjs().format("dddd, DD/MM/YYYY");
    const temp = weatherData.main.temp;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;
    const iconCode = weatherData.weather[0].icon;

    const currentWeatherEl = document.createElement("div");
    currentWeatherEl.innerHTML = `

        <h2>${city} (${date})</h2>

        <p><img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" /></p>
        <p>Temp: ${temp} C</p>
        <p>Wind: ${wind} km/h</p>
        <p>Humidity: ${humidity} %</p>

        `;

    s_main.append(currentWeatherEl);

    addToHistory(weatherData.name); //Log this search to navbar

}

function renderForecastWeather(weatherData) {

    //make div in main
    //for loop make div in div

    let weatherForecast = [];
    let timeStampIterator = [];

    weatherForecastContainer = document.createElement("div");
    weatherForecastContainer.setAttribute("id", "forecast-container");
    s_main.append(weatherForecastContainer);

    //get the indexes of weather data and put them in the array timeStampIterator...
    //if they are the day after current date AND the hour is 00:00.
    for (let i = 0; i < weatherData.list.length; i++) {

        if (
            dayjs().date() < dayjs(weatherData.list[i].dt_txt).date() &&
            dayjs(weatherData.list[i].dt_txt).isSame(dayjs(weatherData.list[i].dt_txt).hour(0))
        ) {

            timeStampIterator.push(i);

        }

    }

    for (let i = 0; i < timeStampIterator.length; i++) {

        const date = dayjs(weatherData.list[timeStampIterator[i]].dt_txt).format("dddd, DD/MM/YYYY");
        const temp = weatherData.list[timeStampIterator[i]].main.temp;
        const wind = weatherData.list[timeStampIterator[i]].wind.speed;
        const humidity = weatherData.list[timeStampIterator[i]].main.humidity;
        const iconCode = weatherData.list[timeStampIterator[i]].weather[0].icon;

        weatherForecast[i] = document.createElement("div");
        weatherForecast[i].setAttribute("class", "forecast-item");

        weatherForecast[i].innerHTML = `

        <h3>${date}</h3>

        <p><img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" /></p>
        <p>Temp: ${temp} C</p>
        <p>Wind: ${wind} km/h</p>
        <p>Humidity: ${humidity} %</p>

        `;

        weatherForecastContainer.append(weatherForecast[i]);

    }

}

function addToHistory(city) {

    const searchHistory = localStorage.getItem("searchHistory");
    let searchHistoryArray = [];

    if (searchHistory === null) {

        searchHistoryArray.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));

    } else {

        searchHistoryArray = JSON.parse(searchHistory);

        if (searchExistsInHistory(city, searchHistoryArray)) {

            //do nothing

        } else {

            searchHistoryArray.push(city);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));

        }

    }

    getSearchHistory();

}

function searchExistsInHistory(city, searchHistoryArray) {

    for (let i = 0; i < searchHistoryArray.length; i++) {

        if (city === searchHistoryArray[i]) {

            return true;

        }

    }

    return false;

}

function getSearchHistory() {

    const searchHistory = localStorage.getItem("searchHistory");
    let searchHistoryArray = JSON.parse(searchHistory);
    let searchHistoryList = [];

    //remove previous search history, so it can be updated
    while (s_searchHistory.firstChild) {

        s_searchHistory.firstChild.remove();

    }

    //if there's nothing in local storage, do nothing.
    if (searchHistoryArray === null) {

        console.log("Nothing in localStorage");

    } else {

        // if there are items in local storage, render search history to navbar

        for (let i = 0; i < searchHistoryArray.length; i++) {

            searchHistoryList[i] = document.createElement("li");
            searchHistoryList[i].textContent = searchHistoryArray[i];

            s_searchHistory.append(searchHistoryList[i]);

            searchHistoryList[i].addEventListener("click", function () {

                renderWeather(searchHistoryArray[i]);

            });

        }

    }

}