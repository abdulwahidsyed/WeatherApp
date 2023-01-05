const input = document.getElementById("addCity");
const submitBtn = document.getElementById("btn");
const mainContainer = document.getElementById("main");
const inpWrapper = document.getElementById("inp-wrapper");
const loader = document.getElementById("loader");
const APIKey = "7219bab40c2ce6a7e75fe16b22622221";

const onChangeCity = (e) => {
  removeError();
};

const onSubmit = async () => {
  loader.classList.remove("remove");
  const city = input.value;

  if (!city) {
    errorCallback("City name can't be empty");
    return;
  }
  const oldWeatherBox = document.getElementById("weather-box");

  const coordinates = await getCoordinates(city);
  if (oldWeatherBox) {
    oldWeatherBox.remove();
  }

  if (!coordinates) {
    errorCallback("City does not exist. Please enter a valid city");
    return;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${APIKey}`;

  const res = await fetch(url);
  const weatherData = await res.json();
  console.log("my weather response", weatherData);

  const backgroundImage = getBackgroundImg(weatherData.weather[0].main);
  document.body.style.backgroundImage = `url(${backgroundImage})`;
  //   document.body.style.backgroundImage = backgroundImage;

  const heading = `${coordinates.city} ${coordinates.state} ${coordinates.country}`;
  const temperature = (weatherData.main.temp - 272.15).toFixed(2);
  const iconSrc = await getIconSrc(weatherData.weather[0].icon);
  const feelsLike = `Feels Like: ${weatherData.main.feels_like}`;
  const wthTyp = weatherData.weather[0].description;

  const weatherBox = createElement("div", "weather-box");
  weatherBox.setAttribute("id", "weather-box");
  const logo = document.createElement("img");
  logo.setAttribute("src", iconSrc);

  const infoBox = createElement("div", "info-box");
  const cityName = createElement("h2", "city-name", heading);
  const temp = createElement("h1", "temp", temperature);
  const extraInfo = createElement("h4", "extra-info", feelsLike);
  const weatherType = createElement("h4", "weather-type", wthTyp);
  infoBox.appendChild(cityName);
  infoBox.appendChild(temp);
  infoBox.appendChild(extraInfo);
  infoBox.appendChild(weatherType);

  weatherBox.appendChild(logo);
  weatherBox.appendChild(infoBox);

  mainContainer.appendChild(weatherBox);
  mainContainer.classList.add("low-margin");
  loader.classList.add("remove");
};

const getBackgroundImg = (type) => {
  const weatherTypes = {
    Clouds: "/assets/clouds.jpg",
    Clear: "/assets/clearSky.jpg",
    Tornado: "/assets/tornado.jpg",
    Squall: "/assets/sqallyWeather.jpg",
    Ash: "/assets/ash.jpg",
    Dust: "/assets/dust.jpg",
    Sand: "/assets/sand.jpg",
    Fog: "/assets/fog.jpg",
    Haze: "/assets/haze.jpg",
    Smoke: "/assets/smoke.jpg",
    Mist: "/assets/mist.jpg",
    Snow: "/assets/snow.jpg",
    Rain: "/assets/rain.jpg",
    Drizzle: "/assets/drizzle.jpg",
    Thunderstorm: "./assets/thunderstorm.jpg",
  };
  return weatherTypes[type];
};

const errorCallback = (errText) => {
  const existingError = document.getElementById("error-element");
  document.body.style.backgroundImage = "none";
  if (existingError) {
    return;
  }
  const errorElement = createElement("p", "error-text", errText || "error");
  errorElement.setAttribute("id", "error-element");
  input.after(errorElement);
  input.classList.add("error-border");

  const oldWeatherBox = document.getElementById("weather-box");
  if (oldWeatherBox) {
    oldWeatherBox.remove();
  }
  loader.classList.add("remove");
};

const removeError = () => {
  const existingError = document.getElementById("error-element");
  if (!existingError) return;
  existingError.remove();
  input.classList.remove("error-border");
};

const createElement = (type, classname, innerText) => {
  const element = document.createElement(type);
  element.className = classname;
  if (innerText) {
    element.innerText = innerText;
  }
  return element;
};

const getIconSrc = async (code) => {
  const icon = `http://openweathermap.org/img/wn/${code}@2x.png`;
  return icon;
};

const getCoordinates = async (cityName) => {
  //   const cityName = "tirupati";
  const stateCode = 28;
  const countrCode = 91;
  const limit = 20;

  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${APIKey}`;
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("my coordinates response", data);
      const city = data[0];
      return {
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        city: city.name,
        state: city.state,
      };
    })
    .catch((err) => {
      console.log("err", err);
      errorCallback("City does not exist. Please enter a valid city");
    });
};

input.addEventListener("keydown", onChangeCity);
submitBtn.addEventListener("click", onSubmit);
