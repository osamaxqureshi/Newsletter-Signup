const express = require("express");
const { request } = require("http");
const app = express();
app.use(express.urlencoded());
const https = require("https");

app.use(express.static("Public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    app.post("/failure", function (req, res) {
        res.redirect("/");
    });

    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/d0170615ec";
    const options = {
        method: "POST",
        auth: "docoak:ed5aefa192f2171bc7010b0fd645d46f-us8s"
    }
    const request = https.request(url, options, function (response) {
        console.log(response.statusCode);



        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.listen(3000, function () {
    console.log("Server Has Started @ 3000 Port");
});


// My API Key
// ed5aefa192f2171bc7010b0fd645d46f-us8

// audience id
// d0170615ec