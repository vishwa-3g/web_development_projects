require("dotenv").config();
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  console.log(req.body.cityInput);

  const query = req.body.cityInput;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit +
    "";

  https.get(url, function (response) {
    console.log(response.statuscode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const weatherDescription = weatherData.weather[0].description;
      const imageURl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write('<head><meta charset="utf-8"></head>');
      res.write("the forcast in " + query + " is " + temp);

      res.write("<img src=" + imageURl + ">");

      res.send();
      console.log(weatherDescription);
    });
  });
});

app.listen(3000, function (req, res) {
  console.log("server started");
});
