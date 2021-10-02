const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require("axios");

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/history", (req, res) => {
  const jsonString = fs.readFileSync("./data/history.json");
  const history = JSON.parse(jsonString);
  res.send(history);
});

//data-stream is to stream data in realtime
//trigger-stream is to send alert triggers

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("trigger-stream", (msg) => {
    io.emit("trigger-stream", msg);
  });

  setInterval(async () => {
    const earthquake = await getCurrentWeather();
    console.log(earthquake);
    io.emit("data-stream", earthquake);
  }, 4000);
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

async function getCurrentWeather() {
  let earthquakeData;
  await axios
    .get(
      "http://api.weatherapi.com/v1/forecast.json?key=6cf8820888f54e91a6a202101210210&q=Tokyo&days=10&aqi=no&alerts=no"
    )
    .then((data) => {
      // console.log(data.data.forecast.forecastday);
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
      earthquakeData = {
        magnitude: Math.floor(Math.random() * 100) + 1,
        weatherData: weatherData,
      };
    })
    .catch((err) => console.log(err));
  return earthquakeData;
}

// io.emit("trigger-stream", {"disasterType":"","Message":""});

//volcanos-->on Btn click on remote-->emit in trigger-stream--->{"disasterType":"volcano","Message":"some message"}
//landslide-->on Btn click on remote-->emit in trigger-stream--->{"landslide":"volcano","Message":"some message"}
//tsunami-->on Btn click on remote-->emit in trigger-stream--->{"landslide":"tsunami","Message":"some message"}
//earthqake-->on Btn click on remote-->emit in data-stream--->change to some high value
