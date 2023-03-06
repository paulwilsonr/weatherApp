const apiKey = '8a2d0a38f1725afd4fd0b1d85a6aea83';
const submitButton = document.querySelector('#submitButton');
let weatherData = {};
const getWeatherData = {
    getFormInput() {
        const city = document.querySelector('#cityInput').value;
        console.log(city)
        document.querySelector('#cityInput').value = '';
        return city;
    },

    async getLatAndLon(location) {
        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`)
            const geocodingData = await response.json();
            return {
                lat: geocodingData[0].lat,
                lon: geocodingData[0].lon
            }
        } catch (e) {
            console.log('error ' + e);
        }
    },

    async getWeatherApiResponse() {
        try {
            const cityName = getWeatherData.getFormInput();
            const latArr = await getWeatherData.getLatAndLon(cityName);
            //console.log(latArr);
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latArr.lat}&lon=${latArr.lon}&appid=${apiKey}`);
            const weatherApiData = await response.json();
            return weatherApiData;

        } catch (e) {
            console.log('error ' + e);
        }
    }
};


const processData = {
    async breakDownData() {
        const weatherApiData = await getWeatherData.getWeatherApiResponse();
        console.log(weatherApiData)
        weatherData = {};
        weatherData.city = weatherApiData.name;
        weatherData.tempFahr = processData.convertToFahrenheit(weatherApiData.main.temp);
        weatherData.tempCel = processData.convertToCelsius(weatherApiData.main.temp)
        weatherData.humidity = weatherApiData.main.humidity;
        weatherData.weatherDesc = weatherApiData.weather[0].description;
        weatherData.weather = weatherApiData.weather[0].main;
        console.log(weatherData)
        return weatherData;
    },
    convertToFahrenheit(kelvin) {
        const fahr = Math.round((kelvin-273.15)*9/5+32);
        console.log(fahr);
        return fahr;

    },
    convertToCelsius (kelvin) {
        const cel = Math.round(kelvin-273.15);
        console.log(cel);
        return cel;
    }

};

const displayControls = {
    async addWeatherDisplay () {
        weatherData = await processData.breakDownData()
        document.querySelector('#city').innerText = weatherData.city;
        displayControls.fahrOrCelDisplay(weatherData);
        document.querySelector('#humidity').innerText = weatherData.humidity;
        document.querySelector('#weatherDesc').innerText = weatherData.weatherDesc;
        document.querySelector('#weather').innerText = weatherData.weather;
    },
    fahrOrCelDisplay(){
        if(document.querySelector('#fOrC').checked) {
            document.querySelector('#temp').innerText = weatherData.tempCel;
        } else {
            document.querySelector('#temp').innerText = weatherData.tempFahr;
        };
    }
};

submitButton.addEventListener('click',(e) => {
    e.preventDefault()
    displayControls.addWeatherDisplay();
})

document.querySelector('#fOrC').addEventListener('click', () =>
{
    if(weatherData.city) {
        displayControls.fahrOrCelDisplay()
    }
});

