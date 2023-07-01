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

    getCity(citySearched);



    //:api req: get city weather data
    //if successful >> pull weather data and parse to next function
    //>> Add city to nav list and store in local storage
    //>> display city weather details on main
    //if error >> throw error with error code

});

async function getCity(citySearched) {

    let getCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${citySearched}&appid=${weatherAPIKey}`;

    const cityData = await fetch(getCityUrl)
        .then(function (response) {

            return response.json();

        });

    if (cityData) {

        console.log(cityData[0].name);

        getWeatherData(
            cityData[0].lat, cityData[0].lon
        );

    }

}

async function getWeatherData(cityLat, cityLon) {

    let getWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${weatherAPIKey}`;

    const weatherData = await fetch(getWeatherUrl)
        .then(function (response) {

            return response.json();

        })
        .then(function (data) {

            console.log(data);

        });

}