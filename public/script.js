document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("weatherForm");
  const cityInput = document.getElementById("cityInput");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page refresh
    const city = cityInput.value.trim();

    if (!city) {
      resultDiv.innerHTML = `<p style="color:red;">Please enter a city name</p>`;
      return;
    }

    try {
      const response = await fetch(`/weather?city=${city}`);
      const data = await response.json();

      if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
      } else {
        resultDiv.innerHTML = `
          <h3>${data.city}</h3>
          <p><strong>Temperature:</strong> ${data.temp} °C</p>
          <p><strong>Condition:</strong> ${data.description}</p>
          <p><strong>AI Tip:</strong> ${data.aiSummary}</p>
        `;
      }
    } catch (error) {
      console.error("Client error:", error);
      resultDiv.innerHTML = `<p style="color:red;">Error fetching weather data</p>`;
    }
  });
});

