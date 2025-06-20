async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  showSpinner(true);

  try {
    const response = await fetch(`https://ai-weather-app-ax6z.onrender.com/weather?city=${city}`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      displayWeather(data);
      saveRecentSearch(city);
    }
  } catch (err) {
    alert("Error fetching weather.");
  } finally {
    showSpinner(false);
  }
}

function displayWeather(data) {
  document.getElementById("weatherResult").style.display = "block";

  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent = data.main.temp.toFixed(2);
  document.getElementById("condition").textContent = data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity;
  document.getElementById("wind").textContent = data.wind.speed;

  const icon = data.weather[0].icon;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  document.getElementById("tip").textContent = generateAITip(data.weather[0].main);
}

function generateAITip(condition) {
  const tips = {
    Rain: "Don’t forget your umbrella ☔",
    Clear: "Perfect day for a walk ☀️",
    Clouds: "A bit gloomy, maybe stay cozy ☁️",
    Snow: "Stay warm and drive safe ❄️",
    Thunderstorm: "Avoid going outside ⚡",
    Drizzle: "Light rain – carry a light jacket 🌧️",
    Haze: "Low visibility – stay safe 😷",
    default: "Check local forecasts for updates."
  };
  return tips[condition] || tips.default;
}

function showSpinner(show) {
  document.getElementById("spinner").style.display = show ? "block" : "none";
}

function saveRecentSearch(city) {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
  if (!recent.includes(city)) {
    recent.unshift(city);
    if (recent.length > 5) recent.pop();
    localStorage.setItem("recentSearches", JSON.stringify(recent));
  }
  renderRecent();
}

function renderRecent() {
  let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
  const list = document.getElementById("recentList");
  list.innerHTML = "";
  recent.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    list.appendChild(li);
  });
}

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark-mode");
};

window.onload = renderRecent;


