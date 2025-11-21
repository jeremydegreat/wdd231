
document.addEventListener('DOMContentLoaded', () => {

/* ================================
   WEATHER SECTION (OpenWeatherMap)
   ================================ */

const apiKey = "aa3916679dc4bbcbf977d897ea29a5f6"; 
const city = "Awka,NG";

async function loadWeather() {
    try {
        // CURRENT WEATHER
        const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const currentRes = await fetch(currentURL);
        const current = await currentRes.json();

        document.getElementById("town").textContent = current.name;
        document.getElementById("current-temp").textContent = `${current.main.temp}°C`;
        document.getElementById("figcaption").textContent = current.weather[0].description;

        const icon = current.weather[0].icon;
        const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        document.getElementById("weather-icon").src = iconURL;
        document.getElementById("weather-icon").alt = current.weather[0].description;

        // 3-DAY FORECAST
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastURL);
        const forecast = await forecastRes.json();

        const midday = forecast.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

        // Day 1
        document.getElementById("day1-date").textContent =
            new Date(midday[0].dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        document.getElementById("day1-temp").textContent = `${midday[0].main.temp}°C`;

        // Day 2
        document.getElementById("day2-date").textContent =
            new Date(midday[1].dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        document.getElementById("day2-temp").textContent = `${midday[1].main.temp}°C`;

        // Day 3
        document.getElementById("day3-date").textContent =
            new Date(midday[2].dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        document.getElementById("day3-temp").textContent = `${midday[2].main.temp}°C`;

    } catch (error) {
        console.log("Weather loading error:", error);
        document.getElementById("town").textContent = "Weather unavailable";
    }
}

loadWeather();



/* ================================
   SPOTLIGHT SECTION (Gold + Silver)
   ================================ */
async function loadSpotlights() {
    try {
        const res = await fetch("./data/members.json"); // adjust path if needed
        const data = await res.json();

        // FILTER ONLY GOLD (3) + SILVER (2)
        const goldSilver = data.members.filter(m =>
            m.membershipLevel === 2 || m.membershipLevel === 3
        );

        // RANDOMLY PICK 2 OR 3 MEMBERS
        const shuffled = goldSilver.sort(() => 0.5 - Math.random());
        const selectedCount = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const selected = shuffled.slice(0, selectedCount);

        const container = document.getElementById("spotlights-container");
        container.innerHTML = ""; // clear old content

        selected.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("spotlight-card");

            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <p class="level ${member.membershipLevel === 3 ? "gold" : "silver"}">
                    ${member.membershipLevel === 3 ? "Gold Member" : "Silver Member"}
                </p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.log("Spotlight loading error:", error);
        document.getElementById("spotlights-container").innerHTML =
            "<p>Unable to load spotlight members.</p>";
    }
}

loadSpotlights();

})
