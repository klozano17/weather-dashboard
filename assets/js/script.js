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
    var cityInput = cityInputEl.value.trim();
    if (cityInput) {
        getCity(cityInput);
        getForecast(cityInput);
        localStorage.setItem(cityInput, cityInput);
        fiveDayForecastEl.innerHTML = '5 Day Forecast: ';
        cityInputEl.value = "";
        updateUI();
    } else {
        alert("Please enter a city");
    }
    saveSearch();
    pastSearch(city);
}


//loads local storage when page loads
window.addEventListener("DOMContentLoaded", function(){
    updateUI();
    })


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
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;


    fetch(queryUrl).then(function (response) {
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
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

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
    fiveDayForecastEl.textContent = "5 Day Forecast: ";
    forecastRowEl.textContent = "";
    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];
        var forecastCol = document.createElement("div");
        forecastCol.classList = "col-md-2";
        var forecastCard = document.createElement("div");
        forecastCard.classList = "card bg-primary text-white";
        var forecastBody = document.createElement("div");
        forecastBody.classList = "card-body p-2";
        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-title";
        var forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/w/" + dailyForecast.weather[0].icon + ".png");
        var forecastTemp = document.createElement("p");
        forecastTemp.classList = "card-text";
        forecastTemp.textContent = "Temp: " + dailyForecast.main.temp + "°F";
        var forecastHumidity = document.createElement("p");
        forecastHumidity.classList = "card-text";
        forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + "%";
        forecastCol.appendChild(forecastCard);
        forecastCard.appendChild(forecastBody);
        forecastBody.appendChild(forecastDate);
        forecastBody.appendChild(forecastIcon);
        forecastBody.appendChild(forecastTemp);
        forecastBody.appendChild(forecastHumidity);
        forecastCol.appendChild(forecastCol);
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


