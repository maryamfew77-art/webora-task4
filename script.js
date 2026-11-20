const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const result = document.getElementById("result");
const recentBox = document.getElementById("recent");

// load saved searches (or start with an empty list)
let recent = JSON.parse(localStorage.getItem("recentCities")) || [];

// ---------- Recent searches (last 3, saved in localStorage) ----------
function saveSearch(name) {
  recent = recent.filter(item => item.toLowerCase() !== name.toLowerCase());
  recent.unshift(name);              // newest first
  recent = recent.slice(0, 3);       // keep only 3
  localStorage.setItem("recentCities", JSON.stringify(recent));
  showRecent();
}

function showRecent() {
  recentBox.innerHTML = "";
  if (recent.length === 0) {
    recentBox.textContent = "none yet";
    return;
  }
  recent.forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.addEventListener("click", () => {
      input.value = name;
      searchCity(name);
    });
    recentBox.appendChild(btn);
  });
}

// ---------- Turn the API's weather code into an icon + text ----------
function describeWeather(code) {
  if (code === 0) return ["☀️", "Clear sky"];
  if (code <= 3) return ["⛅", "Partly cloudy"];
  if (code <= 48) return ["🌫️", "Foggy"];
  if (code <= 57) return ["🌦️", "Drizzle"];
  if (code <= 67) return ["🌧️", "Rain"];
  if (code <= 77) return ["❄️", "Snow"];
  if (code <= 82) return ["🌧️", "Rain showers"];
  if (code <= 86) return ["❄️", "Snow showers"];
  return ["⛈️", "Thunderstorm"];
}

// ---------- Helper: fetch JSON, with clear error messages ----------
async function getJSON(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    // only the network request itself is checked here
    throw new Error("Could not connect. Please check your internet and try again.");
  }
  if (!response.ok) {
    throw new Error("The weather service had a problem. Please try again.");
  }
  return response.json();
}

// ---------- Main search ----------
async function searchCity(name) {
  errorBox.classList.add("hidden");
  result.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    // Step 1: city name -> latitude and longitude
    const geo = await getJSON(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
    );
    if (!geo.results) {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    const place = geo.results[0];

    // Step 2: coordinates -> current weather
    const weather = await getJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
    );

    showWeather(place, weather.current);
    saveSearch(place.name);

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");

  } finally {
    loader.classList.add("hidden");   // always hide the spinner at the end
  }
}

// ---------- Show the result card ----------
function showWeather(place, current) {
  const [icon, text] = describeWeather(current.weather_code);
  const title = place.country ? `${place.name}, ${place.country}` : place.name;

  result.innerHTML = `
    <div class="weather-icon">
      <span>${icon}</span>
      <strong>${Math.round(current.temperature_2m)}°C</strong>
    </div>
    <div class="info">
      <h2>${title}</h2>
      <p><strong>Condition:</strong> ${text}</p>
      <p><strong>Feels like:</strong> ${Math.round(current.apparent_temperature)}°C</p>
      <p><strong>Humidity:</strong> ${current.relative_humidity_2m}%</p>
      <p><strong>Wind:</strong> ${current.wind_speed_10m} km/h</p>
    </div>
  `;
  result.classList.remove("hidden");   // un-hiding replays the slide-up animation
}

// ---------- Search form ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (name) searchCity(name);
});

// show saved searches when the page loads or refreshes
showRecent();