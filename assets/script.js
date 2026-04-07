const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const message = document.getElementById('message');
const weatherIcon = document.getElementById('weather-icon');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const apiKey = "cd13ddceec8e564e064cafda1e62964a";

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value;
    if (!city) return;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (!response.ok || data.cod !== 200) {
            showError();
            return;
        }

        const weather = data.weather && data.weather[0];
        const temp = data.main;

        cityName.textContent = `${data.name}, ${data.sys?.country || ''}`.trim();
        temperature.textContent = `${Math.round(temp.temp)}°C`;
        description.textContent = weather?.description || 'No description';
        humidity.innerHTML = `${temp.humidity}% <img src="weather/OIP.webp" style="width: 16px; height: 16px; vertical-align: middle;">`;
        windSpeed.textContent = data.wind?.speed ?? 'N/A';
        windSpeed.innerHTML = `${data.wind?.speed} mph <img src="weather/wind speed.webp" style="width: 16px; height: 16px; vertical-align: middle;">`;

        const iconSrc = getWeatherIcon(weather?.main || weather?.description || '');
        weatherIcon.src = `weather/${iconSrc}`;

        weatherInfo.classList.remove('hidden');
        message.classList.add('hidden');
    } catch (error) {
        showError();
    }
}

function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return 'clear.svg';
    if (desc.includes('cloud')) return 'clouds.svg';
    if (desc.includes('rain') && !desc.includes('drizzle')) return 'rain.svg';
    if (desc.includes('drizzle')) return 'drizzle.svg';
    if (desc.includes('snow')) return 'snow.svg';
    if (desc.includes('thunder')) return 'thunderstorm.svg';
    if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze') || desc.includes('smoke')) return 'atmosphere.svg';
    return 'clear.svg'; // default
}

function showError() {
    weatherInfo.classList.add('hidden');
    message.innerHTML = `
        <img src="message/not-found.png" alt="City not found">
        <p>City not found. Please try again.</p>
    `;
    message.classList.remove('hidden');
}