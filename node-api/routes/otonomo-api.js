var express = require("express");
var router = express.Router();
// Import the axios library, to make HTTP requests
const axios = require('axios')
var request = require("request");



router.get('/',function(req,res,next){
    res.send("API is working properly");
});


router.get('/obtaining-driver-consent', function(req, res) {

    // This is the client ID and client secret that you obtained
    // while registering the application
    const clientID = 'Y1RwUGjpMhlP2gNYGiWXcdC5C9XQjisF'
    const autorize_url = 'https://consent.eu.otonomo.io/v1/oauth/authorize'
    const service = 'FelDim-demo-2'
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
    const clientID = 'Y1RwUGjpMhlP2gNYGiWXcdC5C9XQjisF'
    const clientSecret = 'ecmZhTKmwrBNm0umXlc8K2ZZaZOd0l8a7ZdN68p-kx2jCQtkxgQOV8QdDDKfA4ue'
    const token_url = 'https://api.otonomo.io/v1/oauth/token'
    const service = 'FelDim-demo-2'
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
    const bearer = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJodHRwczovL290b25vbW8uaW8vY29uc3VtZXJfbmFtZSI6ImZlbGRpbSIsImh0dHBzOi8vb3Rvbm9tby5pby9hcHBfbmFtZSI6ImZlbGRpbS1kZW1vLTIiLCJodHRwczovL290b25vbW8uaW8vYXBwX2lkIjo3ODkyMSwiaHR0cHM6Ly9vdG9ub21vLmlvL3Byb3ZpZGVyX2lkIjoxLCJodHRwczovL290b25vbW8uaW8vdG9rZW5fdHlwZSI6ImRyaXZlciIsImh0dHBzOi8vb3Rvbm9tby5pby9jYXJfaWQiOiIwVE5NWjlLTjE4VVVDQzc4NyIsImh0dHBzOi8vb3Rvbm9tby5pby9jYXJfaWRfdHlwZSI6InZpbiIsInN1YiI6IjBUTk1aOUtOMThVVUNDNzg3IiwiaXNzIjoiaHR0cHM6Ly9jb25zZW50Lm90b25vbW8uaW8iLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3Rvbm9tby5pbyIsImh0dHBzOi8vY29uc2VudC5vdG9ub21vLmlvIl0sImF6cCI6ImNsaWVudF9pZF90aGF0X2RvZXNudF9tYXR0ZXJzIiwiaWF0IjoxNTg4MDgxODcxLCJleHAiOjE1ODgwODU0NzF9.i9cDUK-MYrJDripJBiYUmKy-XmoueeEO15vDLzFxcQQIPPQlSbcYwlBrUtiLk_yk1VqLVbiXmmXNWctRl0vTEi_oA18WDemkDMxZqF5vJfzqtgXDI6Wv__jGvaLUIBU_FOWww8a3Qw5ylRhB7wop1HZ_huK-hqiYcvIVxz3BHCKiOin3eNtZ1OphCSBVAMk5mBPnlpYhkUFTDlyCFpvIOMTF290Y58fqUxUmV7vV3XwYB6uAVZvOUdLVkmKBpAWsAmgjOe8128IGJWRgr4CY4ub0762OGRWEn5aNH5KIRD8JuOXJyE610SzZ3Ntp0edC4g2KV9oJ6Zo8TchRLDxx0w'
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