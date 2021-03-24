//Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//SPDX-License-Identifier: MIT-0

var express = require("express");
var app = express();
var AWSXRay = require('aws-xray-sdk');
var os = require("os");

var responseStatus = 200;

app.use(AWSXRay.express.openSegment('Product-Detail-V1'));

app.get("/catalogDetail", (req, res, next) => {
  console.log(responseStatus)
  res.status(responseStatus)
  if (responseStatus == 200) {
      console.log("Catalog Detail Version 1 Get Request Successful");
      res.json({
                 "version":"1",
                 "vendors":[ "ABC.com" ]
                  } )
   } else {
        console.log("Catalog Detail Version 1 Get Request has error 500");
        res.json("Error")
   }
});

app.get("/ping", (req, res, next) => {
  res.json("Healthy")
});

app.get("/injectFault", (req, res, next) => {
    console.log("host: " + os.hostname() + " will now respond with 500 error.");
    responseStatus=500;
    res.status(500);
    next(new Error("host: " + os.hostname() + " will now respond with 500 error."));
});

app.get("/resetFault", (req, res, next) => {
   console.log("Removed fault injection from host: " + os.hostname());
   responseStatus=200;
   res.json("Removed fault injection from host: " + os.hostname());
});

app.use(AWSXRay.express.closeSegment());

app.listen(3000, () => {
 console.log("Server running on port 3000");
});