var apiKey = "6b2c4a346b736729f68d7bb065d0ac86";

var cities = [];
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");
var searchButtonEl = document.querySelector("#search-btn");
var weatherContainerEl = document.querySelector("#weather-container");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecastEl = document.querySelector("#five-day-forecast");
var headerContainerEl = document.querySelector("header-container");
var historyEl = document.querySelector("#history");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var city = [];
