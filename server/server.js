const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.static(path.join(__dirname, "../public")));

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City name is required." });
  }

  try {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;
    console.log("📡 Requesting weather for:", city);
    console.log("🌐 API URL:", apiURL);

    const response = await fetch(apiURL);
    const data = await response.json();

    console.log("🟡 API Raw Response:", data);

    if (data.cod !== 200) {
      console.error("❌ OpenWeather API Error:", data.message);
      return res.status(500).json({ error: `API Error: ${data.message}` });
    }

    const temp = data.main.temp;
    const description = data.weather[0].description;
    const aiSummary = generateAISummary(temp, description);

    res.json({
      city: data.name,
      temp,
      description,
      aiSummary,
    });
  } catch (err) {
    console.error("🔴 Unexpected Server Error:", err);
    res.status(500).json({ error: "Server error while fetching weather." });
  }
});

// ✅ AI summary function (outside route)
function generateAISummary(temp, description) {
  if (temp >= 35) return `🔥 It's very hot with ${description}. Stay indoors and hydrated!`;
  if (temp >= 25) return `🌤️ Warm day with ${description}. Great for outdoor activities!`;
  if (temp >= 15) return `🍃 Cool weather and ${description}. You might need a light jacket.`;
  return `❄️ It's cold and ${description}. Dress warmly and take care!`;
}

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

