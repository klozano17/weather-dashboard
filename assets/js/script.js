var apiKey = "6b2c4a346b736729f68d7bb065d0ac86";
var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Variables
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var searchButtonEl = document.querySelector("#search-btn");
var clearButtonEl = document.querySelector("#clear-btn");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var headerContainerEl = document.querySelector("#header-container");
var historyEl = document.querySelector("#history");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var tempEl = document.querySelector("#temp");
var uvIndexEl = document.querySelector("#uv-index");
var currentWeatherIconEl = document.querySelector("#current-weather-icon");
var currentCityEl = document.querySelector("#current-city");
var currentDateEl = document.querySelector("#current-date");
var currentTempEl = document.querySelector("#current-temp");
var currentHumidityEl = document.querySelector("#current-humidity");
var currentWindSpeedEl = document.querySelector("#current-wind-speed");
var currentUvIndexEl = document.querySelector("#current-uv-index");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// Event listeners
cityFormEl.addEventListener("submit", formSubmitHandler);
clearButtonEl.addEventListener("click", clearSearchHistory);



// Function to handle form submission
function formSubmitHandler(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCurrentWeather(city);
        getFiveDayForecast(city);
        searchHistory.unshift({ city: city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
    saveSearch();
    pastSearch(city);
}





// Function to save search history
function saveSearchHistory() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Function to display search history
function displaySearchHistory() {
    historyEl.textContent = "";
    for (var i = 0; i < searchHistory.length; i++) {
        var historyItem = document.createElement("input");
        historyItem.setAttribute("type", "text");
        historyItem.setAttribute("readonly", true);
        historyItem.setAttribute("class", "form-control d-block bg-white");
        historyItem.setAttribute("value", searchHistory[i].city);
        historyItem.addEventListener("click", function () {
            getCurrentWeather(this.value);
            getFiveDayForecast(this.value);
        });
        historyEl.appendChild(historyItem);
    }
}

// Function to clear search history
function clearSearchHistory(event) {
    event.preventDefault();
    searchHistory = [];
    saveSearchHistory();
    displaySearchHistory();
}



// Function to display past search  
function pastSearch(pastSearch) {
    pastSearch = document.createElement("button");
    pastSearch.textContent = pastSearch;
    pastSearch.classList = "d-flex w-100 btn-light border p-2";
    pastSearch.setAttribute("data-city", pastSearch);
    pastSearch.setAttribute("type", "submit");

    pastSearchButtonEl.prepend(pastSearch);
}


// Function to get current weather
function getCurrentWeather(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;


    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayCurrentWeather(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function () {
            alert("Unable to connect to OpenWeather");
        });
}

// Function to display current weather
function displayCurrentWeather(weather, searchCity) {
    currentCityEl.textContent = searchCity.toUpperCase();
    var currentDate = moment.unix(weather.dt).format("dddd, MMMM Do YYYY");
    currentDateEl.textContent = currentDate;
    var weatherIcon = weather.weather[0].icon;
    currentWeatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + weatherIcon + ".png");
    currentTempEl.textContent = "Temperature: " + weather.main.temp + "°F";
    currentHumidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
    currentWindSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(uvIndexUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayUvIndex(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function () {
            alert("Unable to connect to OpenWeather");
        });
}

// Function to display UV Index
function displayUvIndex(index) {
    currentUvIndexEl.textContent = "UV Index: " + weather.value;
    var uvIndex = document.createElement("span");
    uvIndex.textContent = index.value;
    if (index.value <= 2) {
        uvIndex.classList = "badge badge-success";
    } else if (index.value <= 7) {
        uvIndex.classList = "badge badge-warning";
    } else {
        uvIndex.classList = "badge badge-danger";
    }
    currentUvIndexEl.appendChild(uvIndex);
}


// Function to get 5 day forecast
function getFiveDayForecast(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayFiveDayForecast(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
        .catch(function () {
            alert("Unable to connect to OpenWeather");
        });
}

// Function to display 5 day forecast
function displayFiveDayForecast(weather) {
    fiveDayForecastEl.innerHTML = "";
    headerContainerEl.classList = "container-fluid bg-white border p-2";
    var forecastTitle = document.createElement("h2");
    forecastTitle.textContent = "5-Day Forecast:";
    fiveDayForecastEl.appendChild(forecastTitle);

    for (var i = 0; i < weather.list.length; i++) {
        if (weather.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            var forecastCardEl = document.createElement("div");
            forecastCardEl.classList = "card bg-primary text-white m-2";

            var forecastCardBodyEl = document.createElement("div");
            forecastCardBodyEl.classList = "card-body p-2";

            var forecastDateEl = document.createElement("h5");
            forecastDateEl.textContent = moment.unix(weather.list[i].dt).format("MMM Do");
            forecastCardBodyEl.appendChild(forecastDateEl);

            var forecastImgEl = document.createElement("img");
            forecastImgEl.setAttribute("src", "https://openweathermap.org/img/w/" + weather.list[i].weather[0].icon + ".png");
            forecastImgEl.setAttribute("alt", weather.list[i].weather[0].description);
            forecastCardBodyEl.appendChild(forecastImgEl);

            var forecastTempEl = document.createElement("p");
            forecastTempEl.textContent = "Temp: " + weather.list[i].main.temp_max + "°F";
            forecastCardBodyEl.appendChild(forecastTempEl);

            var forecastHumidityEl = document.createElement("p");
            forecastHumidityEl.textContent = "Humidity: " + weather.list[i].main.humidity + "%";
            forecastCardBodyEl.appendChild(forecastHumidityEl);

            forecastCardEl.appendChild(forecastCardBodyEl);
            fiveDayForecastEl.appendChild(forecastCardEl);
        }
    }
}




// Initial function to load saved search history
function init() {
    displaySearchHistory();
    if (searchHistory.length > 0) {
        var lastCity = searchHistory[0].city;
        getCurrentWeather(lastCity);
        getFiveDayForecast(lastCity);
    }
}

init();


// Event listeners  
searchFormEl.addEventListener("submit", formSubmitHandler);
clearHistoryButtonEl.addEventListener("click", clearSearchHistory);
pastSearchButtonEl.addEventListener("click", pastSearch);


