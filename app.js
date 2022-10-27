//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/", function (req, res) {
  const Fname = req.body.firstName;
  const Lname = req.body.lastName;
  const mail = req.body.email;

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: Fname,
          LNAME: Lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/9c7b42a898";
  const options = {
    method: "POST",
    auth: "ashwin:e3cba767a9bd542afae83c9f0afbe72c-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  console.log(Fname, Lname, mail);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server Running on Port 3000");
});

// list id
// 9c7b42a898
// api key
// e3cba767a9bd542afae83c9f0afbe72c-us21
