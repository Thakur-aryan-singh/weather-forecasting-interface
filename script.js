function getWeather() {
    const cityInput = document.getElementById('search-city');
    const cityDropdown = document.getElementById('city-dropdown');
    const cityName = cityInput.value || cityDropdown.value;
    const apiKey = "YOUR_API_KEY"; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=05a3b02381b7fe79ab21aba3f849f23e`;

    // Show loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading-spinner').style.display = 'none';
            const weatherIcon = document.getElementById('weather-icon');
            const weatherClimate = document.getElementById('weather-climate');
            const weatherDescription = document.getElementById('weather-description');
            const temperature = document.getElementById('temperature');
            const minTemperature = document.getElementById('min-temperature');
            const maxTemperature = document.getElementById('max-temperature');
            const pressure = document.getElementById('pressure');
            const lastUpdated = document.getElementById('last-updated');
            const errorMessage = document.getElementById('error-message');
            const weatherTip = document.getElementById('weather-tip');
            const weatherInfo = document.getElementById('weather-info');

            weatherIcon.setAttribute('src', getWeatherIcon(data.weather[0].icon));
            weatherClimate.textContent = data.weather[0].main;
            weatherDescription.textContent = data.weather[0].description;
            temperature.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
            minTemperature.textContent = `${Math.round(data.main.temp_min - 273.15)}°C`;
            maxTemperature.textContent = `${Math.round(data.main.temp_max - 273.15)}°C`;
            pressure.textContent = `${data.main.pressure} hPa`;
            lastUpdated.textContent = `Last Updated: ${new Date().toLocaleString()}`;

            const lat = data.coord.lat;
            const lon = data.coord.lon;
            showMap(lat, lon);

            // Set weather tips based on weather conditions
            const mainWeather = data.weather[0].main.toLowerCase();
            if (mainWeather.includes('rain')) {
                weatherTip.innerHTML = 'It\'s raining! Don\'t forget to carry an umbrella ☔️';
                document.body.style.background = 'linear-gradient(to bottom, #85C1E9, #3498db)';
            } else if (mainWeather.includes('clear')) {
                weatherTip.innerHTML = 'It\'s sunny! Wear sunglasses and stay hydrated 😎🌞';
                document.body.style.background = 'linear-gradient(to bottom, #F7DC6F, #f1c40f)';
            } else if (mainWeather.includes('cloud')) {
                weatherTip.innerHTML = 'It\'s cloudy! A great day for a walk in the park ☁️🌳';
                document.body.style.background = 'linear-gradient(to bottom, #FADBD8, #e74c3c)';
            } else if (mainWeather.includes('snow')) {
                weatherTip.innerHTML = 'It\'s snowing! Stay warm and enjoy the snow ❄️☃️';
                document.body.style.background = 'linear-gradient(to bottom, #E0F7FA, #00BCD4)';
            } else {
                weatherTip.innerHTML = 'Weather looks normal. Have a great day! 🌈';
                document.body.style.background = 'linear-gradient(to bottom, #FADBD8, #dcdde1)';
            }

            weatherInfo.style.display = 'block';
            errorMessage.textContent = '';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'Error fetching weather data! ⚠️';
            document.getElementById('loading-spinner').style.display = 'none';
        });
}

function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

function autocompleteSearch() {
    const input = document.getElementById('search-city');
    const list = document.getElementById('autocomplete-list');
    const searchTerm = input.value.toLowerCase();
    list.innerHTML = '';

    if (!searchTerm) return;

    const cities = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Mumbai", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Hyderabad", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep", "National Capital Territory of Delhi", "Puducherry"];

    const filteredCities = cities.filter(city => city.toLowerCase().includes(searchTerm));

    filteredCities.forEach(city => {
        const item = document.createElement('div');
        item.textContent = city;
        item.addEventListener('click', () => {
            input.value = city;
            list.innerHTML = '';
        });
        list.appendChild(item);
    });
}

function showMap(lat, lon) {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';
    const map = L.map(mapContainer).setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
}
