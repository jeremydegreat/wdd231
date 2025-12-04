
document.addEventListener('DOMContentLoaded', () => {
 const lastModified = document.querySelector('#lastmodified');
 // Last modified
    if (lastModified) {
        lastModified.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" style="margin-right:8px; vertical-align:middle;">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 11h4v2h-6V7h2v6z"></path>
            </svg>
            Last modified: ${document.lastModified}
        `;
    }

// Hamburger Toggle
const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.navlinks');

hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navlinks.classList.toggle('active');
    hamburger.classList.toggle('active');  /* animate hamburger icon */
});

// Close navlinks when clicking anywhere else on the document
document.addEventListener('click', (e) => {
    if (navlinks.classList.contains('active') && 
        !hamburger.contains(e.target) && 
        !navlinks.contains(e.target)) {
        navlinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Close navlinks when clicking a nav link
const navItems = document.querySelectorAll('.navlinks li a');
navItems.forEach((item) => {
    item.addEventListener('click', () => {
        navlinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// CHANGE OD COLOR ON-SCROLL
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


/* ================================ WEATHER SECTION (OpenWeatherMap) ================================ */

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
        const goldSilver = data.members.filter(m => m.membershipLevel === 3 || m.membershipLevel === 2);

        if (goldSilver.length === 0) {
            document.getElementById("spotlights-container").innerHTML =
                "<p>No spotlight members available.</p>";
            return;
        }

        // RANDOMLY SHUFFLE
        const shuffled = goldSilver.sort(() => 0.5 - Math.random());

        // PICK UP TO 3 MEMBERS
        const selectedCount = Math.min(3, shuffled.length);
        const selected = shuffled.slice(0, selectedCount);

        const container = document.getElementById("spotlights-container");
        container.innerHTML = "";

        selected.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("spotlight-card");

           card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${member.image}" alt="${member.name}">
                </div>

                <div class="card-body">
                    <h3>${member.name}</h3>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><a href="${member.website}" target="_blank">Visit Website →</a></p>
                    <p class="level ${member.membershipLevel === 3 ? "gold" : "silver"}">
                        ${member.membershipLevel === 3 ? "Gold Member" : "Silver Member"}
                    </p>
                </div>
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
