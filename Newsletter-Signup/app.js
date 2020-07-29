require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function () {
  console.log("server started");
});

//to get data posted from form
app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const Email = req.body.email;

  var data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const urlink = process.env.URL;
  //url link for https request
  const url = urlink;
  const authkey = process.env.AUTH;
  //for authetication
  const options = {
    method: "POST",
    auth: authkey,
  };

  //request for api
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/FAILURE.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
