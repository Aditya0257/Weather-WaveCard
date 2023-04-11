'use strict';
 
var requests = require('requests');
const http = require('http');
const fs = require('fs');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {

    const objData = JSON.parse(orgVal);
    const arrData = [objData];

    let temperature = tempVal.replace("{%tempVal%}".toString(), arrData[0].main.temp);
    temperature = temperature.replace("{%city%}", arrData[0].name);
    temperature = temperature.replace("{%country%}", arrData[0].sys.country);
    temperature = temperature.replace("{%tempMin%}", arrData[0].main.temp_min);
    temperature = temperature.replace("{%tempMax%}", arrData[0].main.temp_max);
    // console.log(arrData); 

    return temperature;

    
}

const server = http.createServer((req, res) => {
    if (req.url == "/"){
                    requests('https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=9ba588abe4413cd9bba184fc2d625fa4',
                    )
            .on('data', function (chunk) {
                
                
                // const realTimeData = arrData.map((val)=>{

                const realTimeData = replaceVal(homeFile, chunk);
                    // HOMEFILE IS USED INSIDE REPLACE VAL FUNCTION AS IT HAS ALL DATA OF HOME.HTML (THE UI/UX)
                //     replaceVal(homeFile, val);
                // }).join("");
                res.write(realTimeData);
                
                // console.log(realTimeData) ;
            })
            .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            console.log('end');
            res.end();
            
            });
    }
})

server.listen(8500, "127.0.0.1", ()=>{
    console.log('server is now listening...');
});
