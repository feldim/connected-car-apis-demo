var express = require("express");
var router = express.Router();
// Import the axios library, to make HTTP requests
const axios = require('axios')
const request = require('request-promise')
bodyParser = require('body-parser')


const redirect_uri = 'http://localhost:3000/mb-api'
var access_body = ''

router.get('/',function(req,res,next){
  console.log("calling '/'")

    res.send("MB API is working properly");
});



router.get('/check-auth', function(req, res) {

  console.log("calling '/mb-api/check-auth'")

  console.log(access_body)

  res.send(access_body!='')

});


router.get('/oauth', function(req, res) {

  console.log("calling '/oauth'")

    const clientID = process.env.mbClientID
    const autorize_url = 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/authorize'
    const scope = 'mb:user:pool:reader+mb:vehicle:status:general'
    const state = 'test'

    var url = `${autorize_url}?response_type=code&client_id=${clientID}&redirect_uri=${redirect_uri}&scope=${scope}&prompt=login,consent&state=${state}`;

    console.log("url: "+url);
    res.send(url)

});


/**
 * Exchange authorization token with access token
 */
router.get('/oauth/get-access-token', function(req, res) {
  console.log("\n*************************************************\n'")
  console.log("callback calling '/oauth/get-access-token'")

    const auth_code = res.req.query.code;
    const state = res.req.query.state;

    console.log("response: authorization_code="+auth_code);
    console.log("response: state="+state);

    const clientID = process.env.mbClientID
    const clientSecret = process.env.mbClientSecret
    const token_url = 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token'

    const auth = 'Basic ' + Buffer.from(clientID+':'+clientSecret).toString('base64')

    var options = {
      method: 'POST',
      uri: token_url,
      headers: {'content-type': 'application/x-www-form-urlencoded',  'Authorization': auth},
      form: {
        grant_type: 'authorization_code',
        code: auth_code,
        redirect_uri: `${redirect_uri}`
      }
    };

    request(options, function (error, response, parsedBody) {
      if (error) throw new Error(error);

      const body = JSON.parse(response.body);
      access_body = body;

      /*
        {
          "access_token":"d7e1f11d-f5a2-4973-8721-b8331cfeeaf0",
          "token_type":"Bearer",
          "expires_in":3600,
          "refresh_token":"49a46180-c428-4465-b605-f654576c9810",
          "scope":"mb:vehicle:status:general mb:user:pool:reader"
         }
*/
      console.log(response.body)

      res.send(response)

    });

});


/**
 * Refresh TOKN
 */
router.get('/obtaining-driver-consent/oauth/refresh', function(req, res) {
  console.log("\n*************************************************\n'")
  console.log("callback calling '/obtaining-driver-consent/oauth/refresh'")

    const refresh_token = req.query.refresh_token;

    console.log("response: authorization_code="+refresh_token);

    const clientID = process.env.mbClientID
    const clientSecret = process.env.mbClientSecret
    const token_url = 'https://api.secure.mercedes-benz.com/oidc10/auth/oauth/v2/token'

    const auth = 'Basic ' + Buffer.from(clientID+':'+clientSecret).toString('base64')

    var options = {
      method: 'POST',
      uri: token_url,
      headers: {'content-type': 'application/x-www-form-urlencoded',  'Authorization': auth},
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }
    };

    request(options, function (error, response, parsedBody) {
      if (error) throw new Error(error);

      const body = JSON.parse(response.body);
      access_body = body;

      /*
        {
          "access_token":"d7e1f11d-f5a2-4973-8721-b8331cfeeaf0",
          "token_type":"Bearer",
          "expires_in":3600,
          "refresh_token":"49a46180-c428-4465-b605-f654576c9810",
          "scope":"mb:vehicle:status:general mb:user:pool:reader"
         }
*/
      console.log(response.body)

      res.redirect(`/mb-api/connected-vehicle-data?access_token=${access_body.access_token}`);

    });
});


router.get('/connected-vehicle-data',function(req,res,next){
  console.log("calling '/connected-vehicle-data'")

  const api_endpoint = 'https://api.mercedes-benz.com/experimental/connectedvehicle/v1/vehicles'

  var options = {
    method: 'GET',
    uri: api_endpoint,
    headers: {
      "Authorization":
        "Bearer "+access_body.access_token,
    }
  };

  request(options, function (error, response, parsedBody) {
    const body = JSON.parse(response.body);
    console.log(response.body + " error: \n"+error)
    res.send(body)

    if (error) throw new Error(error);

  });

});

module.exports=router;