# Weather Finder – Web App Using Live API Data

**Task 4 – Frontend Development Internship (Webora Tec)**

A small web app where users search for any city and see its current weather. The data comes live from the free Open-Meteo API.

## Features

- **Search field** to look up any city
- Uses the **Fetch API with async/await**
- **Loading spinner** while the data is being fetched
- **Helpful error messages** when the city is not found or the connection fails
- Results shown in a neat card: temperature, condition, feels-like temperature, humidity and wind speed
- **Last three searches saved in `localStorage`**, shown as buttons and still there after a refresh
- Slide-up animation when new results appear
- Responsive layout that works on mobile screens

## API Used

[Open-Meteo](https://open-meteo.com/) is free and needs no API key.

1. **Geocoding API** turns the city name into latitude and longitude.
2. **Forecast API** returns the current weather for those coordinates.

## Technologies

- HTML5
- CSS3 (Flexbox, animations, media queries)
- JavaScript (async/await, Fetch API, error handling with try/catch/finally, `localStorage`)

## How to Run

1. Download the project (**Code → Download ZIP**) and unzip it.
2. Open `index.html` in your browser. An internet connection is required.
3. Type a city name (for example *Faisalabad*, *Dubai* or *London*) and press **Search**.

## Project Structure

```
task4-weather-app/
├── index.html
├── style.css
├── script.js
├── screenshot.png
└── README.md
```

## What I Practised

Using a public API, working with asynchronous JavaScript, handling errors, displaying dynamic information, and saving recent searches in browser storage.

## Author

**Maryam**
- GitHub: [maryamfew77-art](https://github.com/maryamfew77-art)
- Email: maryamfew77@gmail.com