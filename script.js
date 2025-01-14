// Input placeholder change for intro
let input_button = document.querySelector('input');
input_button.addEventListener('click', (e) => {
    e.target.placeholder = "";
});

input_button.addEventListener('blur', (e) => {
    e.target.placeholder = "Enter your city name";
});

// Intro search button click event
const search_button = document.querySelector('.intro-content-input-button');
search_button.addEventListener('click', (event) => {
    const city_name = document.querySelector('.intro-content-input-box input').value;
    if (city_name.trim() !== "") {
        document.querySelector('.intro-content').style.display = 'none';
        document.querySelector('.weather-container').style.display = 'flex';
        getWeather(city_name);
    }
});

// Weather search button click event
const weather_search_button = document.querySelector('.weather-input-button');
weather_search_button.addEventListener('click', (event) => {
    const city_name = document.querySelector('.weather-input-box input').value;
    if (city_name.trim() !== "") {
        getWeather(city_name);
    }
});

// Fetch current weather data
async function getWeather(city_name) {
    const weather_data = await getFetchData(city_name);

    if (weather_data) {
        let date = new Date(weather_data[1] * 1000);
        let new_date = date.toLocaleString().split(',')[0];

        document.querySelector('.weather-input-box input').value = weather_data[0];
        document.querySelector('.weather-location-place p').innerHTML = weather_data[0];
        document.querySelector('.weather-location-date').innerText = new_date;
        document.querySelector('.weather-condition-data-temp').innerText = weather_data[2] + '°C';
        document.querySelector('.weather-condition-data-climate').innerText = weather_data[3];
        document.querySelector('.weather-info-humidity-percent').innerText = weather_data[4] + '%';
        document.querySelector('.weather-info-wind-speed').innerText = weather_data[5] + ' M/S';

        getForecast(city_name); // Fetch forecast after weather data
    }
}

// Fetch current weather data from API
async function getFetchData(city_name) {
    let arr = [];
    try {
        const APIKEY = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=aab0e71fa1ecfa5ba754c557fb9ce901&units=metric`;
        let response = await fetch(APIKEY);

        if (!response.ok) {
            throw new Error("City not found");
        }

        response = await response.json();
        arr.push(response.name, response.dt, response.main.temp, response.weather[0].description, response.main.humidity, response.wind.speed);
        return arr;
    } catch (error) {
        document.querySelector('.intro-content-div-1').innerText = 'City Not Found';
        document.querySelector('.intro-content-div-2').innerText = 'Enter a valid city name';
        return null;
    }
}

// Fetch and display the forecast
async function getForecast(city_name) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const forecast_API = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=aab0e71fa1ecfa5ba754c557fb9ce901&units=metric`;

    let forecast_data = await getForecastData(forecast_API);
    if (forecast_data !== null) {
        let dailyForecasts = forecast_data.list.filter(item => item.dt_txt.includes('12:00:00'));

        let WF = document.querySelector('.weather-forecast');
        for (let i = 0; i < WF.children.length; i++) {
            if (dailyForecasts[i]) {
                let city_date = new Date((dailyForecasts[i].dt * 1000));
                city_date = months[city_date.getMonth()] + " " + city_date.getDate();

                WF.children[i].children[0].innerHTML = city_date;
                WF.children[i].children[1].innerHTML = Math.round(dailyForecasts[i].main.temp) + "°C";
            }
        }
    }
}

// Fetch forecast data from API
async function getForecastData(forecast_API) {
    let response = await fetch(forecast_API);
    try {
        if (!response.ok) {
            throw new Error("Future Forecast Not Found");
        }
    } catch (error) {
        console.log(error);
        return null;
    }

    return response.json();
}
