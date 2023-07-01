// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

const s_citySearchInput = document.querySelector("#city-search-input");
const s_citySearchSubmit = document.querySelector("#city-search-submit");

const weatherAPIKey = "868193796ea8040d9f907e1ebd86b46c";


s_citySearchSubmit.addEventListener("click", function () {

    const citySearched = s_citySearchInput.value;

    //:api req: call a city to get long, lat details
    //if successful >> pull data and parse to next function
    //if error >> throw error, correct city?

    getCityData(citySearched, 5);



    //:api req: get city weather data
    //if successful >> pull weather data and parse to next function
    //>> Add city to nav list and store in local storage
    //>> display city weather details on main
    //if error >> throw error with error code

});

async function getCityData(citySearched, noOfDays) {

    let getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&appid=${weatherAPIKey}`;

    const cityData = await fetch(getCityUrl)
        .then(function (response) {

            return response.json();

        });

    if (cityData) {

        getWeatherData(
            cityData[0].lat, cityData[0].lon, noOfDays
        );

    }

}

async function getWeatherData(cityLat, cityLon, noOfDays) {

    let getWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=6&appid=${weatherAPIKey}`;

    const weatherData = await fetch(getWeatherUrl)
        .then(function (response) {

            return response.json();

        });

    if (weatherData) {

        const city = weatherData.city.name;
        const forecast = {};

        for (let i = 0; i < noOfDays; i++) {

            forecast[i] = {

                date: "x",
                temp: "y",
                wind: "z",
                humidity: "a",

            };

        }

        console.log(city);
        console.log(forecast);

        //city, date, temp, wind, humidity

    }

}