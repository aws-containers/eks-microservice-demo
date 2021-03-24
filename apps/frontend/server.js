const express = require('express');
const bodyParser= require('body-parser')
const axios = require('axios')
const app = express()
const path = require("path");
const Prometheus = require('prom-client')

var AWSXRay = require('aws-xray-sdk');
app.use(AWSXRay.express.openSegment('Frontend-Node'));

Prometheus.collectDefaultMetrics();

var baseProductUrl = process.env.BASE_URL;

if(baseProductUrl === undefined)  {
    baseProductUrl = 'http://localhost:3000/catalogDetail';
}

console.log(baseProductUrl);

// ========================
// Middlewares
// ========================
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    let query = req.query.queryStr;

        const requestOne = axios.get(baseProductUrl);
        //const requestTwo = axios.get(baseSummaryUrl);
        //axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
        axios.all([requestOne]).then(axios.spread((...responses) => {
          const responseOne = responses[0]
       //   const responseTwo = responses[1]

        //  console.log(responseOne.data.products, responseOne.data.details.vendors, responseOne.data.details.version);
          res.render('index.ejs', {vendors:responseOne.data.vendors, version:responseOne.data.version})
          console.log("Catalog Detail get call was Successful from frontend");
        })).catch(errors => {

       //   console.log("baseSummaryUrl " + baseSummaryUrl);
          console.log(errors);
          console.log("There was error in Catalog Detail get call from frontend");
        })

})

app.get("/ping", (req, res, next) => {
  res.json("Healthy")
});

// Export Prometheus metrics from /stats/prometheus endpoint
app.get('/stats/prometheus', (req, res, next) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

app.use(AWSXRay.express.closeSegment());

app.listen(9000, function() {
      console.log('listening on 9000')
    })