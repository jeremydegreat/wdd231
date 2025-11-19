document.addEventListener('DOMContentLoaded', () => {
    const currentTemp = document.querySelector('#current-temp');
    const weatherIcon = document.querySelector('#weather-icon');
    const captionDesign = document.querySelector('#figcaption');
    const townName = document.querySelector('#town');
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&appid=aa3916679dc4bbcbf977d897ea29a5f6&units=metric';

    // Function to display weather data on the page
    function displayResults(data) {
        // 1. Display current temperature (rounded to 1 decimal or whole number)
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;

        // 2. Get icon code and set image source
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.setAttribute('src', iconUrl);
        weatherIcon.setAttribute('alt', data.weather[0].description);

        // 3. Set figure caption to weather description (capitalized)
        captionDesign.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    }

    // Fetch data using API
    async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
        const data = await response.json();
        console.log(data); // testing only
        displayResults(data); // uncomment when ready
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
    }

    apiFetch();

})