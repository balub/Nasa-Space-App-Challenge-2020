const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require("axios");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/history", (req, res) => {
  const jsonString = fs.readFileSync("./data/history.json");
  const history = JSON.parse(jsonString);
  res.send(history);
});

app.get("/weather", async (req, res) => {
  let weatherForecastData;
  await axios
    .get(
      "http://api.weatherapi.com/v1/forecast.json?key=6cf8820888f54e91a6a202101210210&q=Tokyo&days=10&aqi=no&alerts=no"
    )
    .then((data) => {
      const weatherByHour = data.data.forecast.forecastday;
      const weatherData = [];
      for (item = 0; item < 3; item++) {
        const arrayLength = weatherByHour[item].hour.length;
        const hourlyData = weatherByHour[item].hour;
        for (hr = 0; hr < arrayLength; hr++) {
          weatherData.push({
            dateTime: hourlyData[hr].time,
            temperature: hourlyData[hr].temp_c,
            humidity: hourlyData[hr].humidity,
            chanceOfRain: hourlyData[hr].chance_of_rain,
          });
        }
      }
      weatherForecastData = {
        weatherData: weatherData,
      };
    })
    .catch((err) => console.log(err));
  
  res.send(weatherForecastData);
});

//data-stream is to stream data in realtime
//trigger-stream is to send alert triggers

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("trigger-stream", (msg) => {
    io.emit("trigger-stream", msg);
  });

  socket.on("earthquake-stream", async (msg) => {
    const earthquake = await getCurrentWeather();
    io.emit("data-stream", { magnitude: msg, ...earthquake });
  });

  setInterval(async () => {
    const earthquake = await getCurrentWeather((Math.random() * 4 + 1).toFixed(1));
    io.emit("data-stream", earthquake);
  }, 4000);
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`listening on *:${process.env.PORT}`);
});

async function getCurrentWeather(magnitude) {
  let earthquakeData = {
    magnitude: magnitude,
    date: Date.now()
  }
  return earthquakeData;
}
