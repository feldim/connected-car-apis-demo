var express = require("express");
var router = express.Router();
// Import the axios library, to make HTTP requests
const axios = require('axios')
var request = require("request-promise");


const redirect_uri = 'http://localhost:3000/otonomo-api'
var access_body = ''
var access_body_aggregate = ''

router.get('/',function(req,res,next){
  console.log("calling '/'")
  res.send("Otonomo Node is working properly");
});


router.get('/personal/check-auth', function(req, res) {

  console.log("calling '/otonomo-api/personal/check-auth'")

  console.log(access_body)

  res.send(access_body!='')

});

router.get('/personal/oauth', function(req, res) {
  console.log("calling 'personal/oauth'")
  const clientID = process.env.otonomoClientID
  const autorize_url = 'https://consent.otonomo.io/v1/oauth/authorize'
  const service = process.env.otonomoService
  //const redirect_uri = 'https://otonomo.io' //'http://localhost:3000/otonomo-api'
  const state = 'test'
  const oem = 'BMW'
  var url = `${autorize_url}?response_type=code&app=${service}&client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=code&state=${state}&oem=${oem}`;
   
  console.log("url: "+url);
  res.send(url)

});

  
router.get('/personal/oauth/get-access-token', function(req, res) {
    // This is the client ID and client secret that you obtained
    // while registering the application
    const clientID = process.env.otonomoClientID
    const clientSecret = process.env.otonomoClientSecret
    const token_url = 'https://api.otonomo.io/v1/oauth/token'
    const service = process.env.otonomoService
   // const redirect_uri = 'https://otonomo.io/callback' //'http://localhost:3000/otonomo-api'
    const code = "  " //this should come from /obtaining-driver-consent


    var url = `${token_url}?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${clientID}&client_secret=${clientSecret}`;
   
    console.log("url: "+url);
    // The req.query object has the query params that
    // were sent to this route. We want the `code` param
    //const requestToken = req.query.code
    axios({
      // make a POST request
      method: 'post',
      // to the Github authentication API, with the client ID, client secret
      // and request token
      url: url,
      // Set the content type header, so that we get the response in JSOn
      headers: {
        accept: 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      // Once we get the response, extract the access token from
      // the response body
      const body = JSON.parse(response.body);
      access_body = body;
      // redirect the user to the welcome page, along with the access token
      //res.redirect(`/welcome.html?access_token=${accessToken}`)
      //res.redirect(`/welcome.html?access_token=${accessToken}`)

      res.send(response)
    })
});


router.get('/personal/personal-data', function(req, res) {

    // this should normally come from /obtaining-driver-consent/oauth/redirect
    const bearer = process.env.otonomoBearer
    const url = 'https://market.otonomo.io/cars/v1/status/'

    var options = {
      method: 'GET',
      url: url,
      headers: {authorization: bearer}
    };

    request(options, function (error, response, body) {
    
      console.log(body);

      res.send(body)

    });


});

/***
 * ******************************************
 * 
 * 
 * AGGREGATE - DATA
 * 
 * 
 * ******************************************
 */

router.get('/aggregate/auth', function(req, res) {

  var options = {
    'method': 'POST',
    'url': 'https://api.otonomo.io/oauth/v1/token',
    'headers': {
      'Content-Type': ['application/x-www-form-urlencoded', 'application/x-www-form-urlencoded'],
    },
    form: {
      'client_id': process.env.otonomoClientIDAggregate,
      'client_secret': process.env.otonomoClientSecretAggregate,
      'grant_type': 'client_credentials',
      'service': process.env.otonomoServiceAggregate
    }
  };

  request(options, function (error, response) {
   

    const body = JSON.parse(response.body);
      access_body_aggregate = body;
      console.log(response.body)
      res.send(response.statusCode)
  });


});

router.get('/aggregate/historical-raw-data', function(req, res) {

  
  const start_datetime = "2019-01-19 00:00:00" //res.req.query.end
  const end_datetime = "2019-01-20 00:00:00"

  var options = {
    'method': 'POST',
    'url': 'https://api.otonomo.io/v1/aggregate/reports/AnonymousHistoricalRawData/',
    'headers': {
      'Authorization': 'Bearer ' + access_body_aggregate.access_token,
      'Content-Type': ['application/json', 'application/json']
    },
    body: JSON.stringify({"start_datetime":start_datetime,"end_datetime":end_datetime})
  
  };

  request(options, function (error, response) {

    res.send(response)
  });

});



router.get('/aggregate/report-status', function(req, res) {

  const id = res.req.query.request_id

  var options = {
    'method': 'GET',
    'url': 'https://api.otonomo.io/v1/aggregate/reports/requests/'+id,
    'headers': {
      'Authorization': 'Bearer ' + access_body_aggregate.access_token,
    }
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);

      res.send(response)
  });

});



module.exports=router;