const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
   res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res){
    const city = req.body.cityName || "Abuja";
    const apiKey = "406077cd5441b7db108df2d4261bc6e7";
    const unit = req.body.unit;

    let unitName;

    switch(unit){
        case "metric":
            unitName = "Celcius";
            break;
        case "imperial":
            unitName = "Fahrenheit";
            break;
        case "standard":
            unitName = "Kelvin"
            break;
        default:
            break;
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    
    https.get(url, function(response){
        if(response.statusCode !== 200){
            res.send(`
            <h1 style='text-align: center;'>${response.statusCode} Error </h1>
            <h2 style='text-align: center;'>Entered City ${response.statusMessage}</h2>
            `)
            return;
        } else {
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
        
                res.setHeader('Content-Type', 'text/html');
                res.write(`<img src=${imageURL} alt="weather icon" />`);
                res.write(`<p>The weather in ${city} is currently <strong>${description}</strong></p>`);
                res.write(`<h1>The temperature in ${city} is ${temp} degree ${unitName}</h1>`);
                res.send();
            })
        }
    
    })
})


app.listen(process.env.PORT || 4000, function(){
    console.log("Weather app is running on port 4000.")
})