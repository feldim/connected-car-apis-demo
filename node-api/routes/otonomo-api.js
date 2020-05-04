var express = require("express");
var router = express.Router();
// Import the axios library, to make HTTP requests
const axios = require('axios')
var request = require("request-promise");



router.get('/',function(req,res,next){
    res.send("API is working properly");
});


router.get('/obtaining-driver-consent', function(req, res) {

    // This is the client ID and client secret that you obtained
    // while registering the application
    const clientID = process.env.otonomoClientID
    const autorize_url = 'https://consent.eu.otonomo.io/v1/oauth/authorize'
    const service = process.env.otonomoService
    const redirect_uri = 'https://otonomo.io' //'http://localhost:3000/otonomo-api'

    var url = `${autorize_url}?response_type=code&app=${service}&client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=code`;
   
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
        accept: 'application/json'
      }
    }).then((response) => {
      // Once we get the response, extract the access token from
      // the response body
      const accessToken = response.data.access_token
      // redirect the user to the welcome page, along with the access token
      //res.redirect(`/welcome.html?access_token=${accessToken}`)
      //res.redirect(`/welcome.html?access_token=${accessToken}`)

      res.send(accessToken)
    })
});

  
router.get('obtaining-driver-consent/oauth/redirect', function(req, res) {
    // This is the client ID and client secret that you obtained
    // while registering the application
    const clientID = process.env.otonomoClientID
    const clientSecret = process.env.otonomoClientSecret
    const token_url = 'https://api.otonomo.io/v1/oauth/token'
    const service = process.env.otonomoService
    const redirect_uri = 'https://otonomo.io/callback' //'http://localhost:3000/otonomo-api'
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
      const accessToken = response.data.access_token
      // redirect the user to the welcome page, along with the access token
      //res.redirect(`/welcome.html?access_token=${accessToken}`)
      //res.redirect(`/welcome.html?access_token=${accessToken}`)

      res.send(accessToken)
    })
});


router.get('/personal-data', function(req, res) {

    // this should normally come from /obtaining-driver-consent/oauth/redirect
    const bearer = process.env.otonomoBearer
    const url = 'https://market.otonomo.io/cars/v1/status/'

    var options = {
      method: 'GET',
      url: url,
      headers: {authorization: bearer}
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);

      res.send(body)
    });


});


module.exports=router;