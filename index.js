// 
//   Author: Kevin Sebastian
//   GitHub: https://github.com/KVN-SBN
//   Project: Weather App
// 

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");


const apiKey = '0b49129e02fbba5948432f7d810357e2'; //replace with ur "apikey" 




window.addEventListener("load", () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          
          const data = await response.json();
          displayWeatherInfo(data);
          
        } catch (err) {
          displayError("Unable to fetch location weather.");
        }
      });
    }
  });


weatherForm.addEventListener("submit", async event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  clearCard();

  if (!city) {
    displayError("PLEASE ENTER A CITY");
    return;
  }

  showLoading();

  try {
    const weatherData = await getWeatherData(city);
    displayWeatherInfo(weatherData);
  } catch (error) {
    console.error(error);
    displayError(error.message || "An error occurred");
  }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error("City not found");
    return await response.json();
}
  

function displayWeatherInfo(data){

    const {name: city,
         main: {temp,humidity}, 
         weather: [{description,id}]} = data;
    
         card.textContent = "";
         card.style.display = "flex";

         const cityDisplay = document.createElement("h1");
         const tempDisplay = document.createElement("p");
         const humidityDisplay = document.createElement("p");
         const descDisplay = document.createElement("p");
         const weatherEmoji = document.createElement("p");

        cityDisplay.textContent = city;
        tempDisplay.textContent = `${temp} °C`;
        humidityDisplay.textContent = `Humidity: ${humidity}%`;
        descDisplay.textContent = description;
        weatherEmoji.textContent = getWeatherEmoji(id);

        cityDisplay.classList.add("cityDisplay");
        tempDisplay.classList.add("tempDisplay");
        humidityDisplay.classList.add("humidityDisplay");
        descDisplay.classList.add("descDisplay");
        weatherEmoji.classList.add("weatherEmoji");

        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(descDisplay);
        card.appendChild(weatherEmoji);


        const feelsLikeDisplay = document.createElement("p");
        const windDisplay = document.createElement("p");
        const sunriseDisplay = document.createElement("p");
        const sunsetDisplay = document.createElement("p");

        feelsLikeDisplay.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°C`;
        windDisplay.textContent = `Wind: ${data.wind.speed} m/s`;

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        sunriseDisplay.textContent = `Sunrise: ${sunriseTime}`;
        sunsetDisplay.textContent = `Sunset: ${sunsetTime}`;

        card.appendChild(feelsLikeDisplay);
        card.appendChild(windDisplay);
        card.appendChild(sunriseDisplay);
        card.appendChild(sunsetDisplay);
        
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId>=200 && weatherId <300):
            return "⛈"
        case (weatherId>=300 && weatherId <400):
            return "🌧"
        case (weatherId>=500 && weatherId <600):
            return "🌧"
        case (weatherId>=600 && weatherId <700):
            return "❄"
        case (weatherId>=700 && weatherId <800):
            return "💨"
        case (weatherId === 800):
            return "☀"
        case (weatherId >=801 && weatherId <810):
            return "☁";
        default :
            return "❓"
    }
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}

function showLoading() {
    card.innerHTML = '<div class="spinner"></div>';
    card.style.display = "flex";
  }

function clearCard() {
    card.textContent = "";
    card.style.display = "none";
  }

//suggestions
  const suggestionsList = document.querySelector(".suggestionsList");

  let debounceTimeout;
  
  cityInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(fetchSuggestions, 300); 
  });
  
  async function fetchSuggestions() {
    const query = cityInput.value.trim();
    if (query.length < 2) {
      suggestionsList.innerHTML = "";
      return;
    }
  
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${query}&format=json&limit=5`;
  
    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "MyWeatherApp/1.0 (me@example.com)"
        }
      });
  
      const results = await response.json();
      suggestionsList.innerHTML = results.map(place =>
        `<li>${place.display_name}</li>`
      ).join("");
  
      suggestionsList.querySelectorAll("li").forEach(li =>
        li.addEventListener("click", () => {
          cityInput.value = li.textContent.split(",")[0]; 
          suggestionsList.innerHTML = "";
        })
      );
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  }
  
  
