var express = require("express");
var router = express.Router();
const smartcar = require('smartcar');

var access_body = '';
var redirect_uri=''
var client;

router.get('/',function(req,res,next){
    console.log("calling '/'")
    res.send("smartcar Node is working properly");
});



router.get('/check-auth', function(req, res) {

    console.log("calling '/smartcar-api/check-auth'")
    console.log(access_body)
    res.send(access_body!='')
  });


// Redirect to Smartcar Connect
router.get('/oauth', function(req, res) {

    // Redirect to Smartcar Connect
    redirect_uri = process.env.smartcarCallbackUri

    client = new smartcar.AuthClient({
      clientId: process.env.smartcarClientID,
      clientSecret: process.env.smartcarClientSecret,
      redirectUri: redirect_uri,
      scope: [
        'read_odometer','read_vehicle_info', 'control_security','read_engine_oil',
        'read_battery','read_charge', 'read_fuel','read_location',
        'read_tires','read_vin'
    ],
      testMode: true, // launch Smartcar Connect in test mode
    });

    const url = client.getAuthUrl();

    // redirect to the link
    console.log("url: "+url);
    res.send(url)
  });


router.get('/oauth/get-access-token', function(req, res, next) {
    console.log("\n*************************************************\n'")
    console.log("callback calling '/oauth/get-access-token'")

      /**
     *  Handle Smartcar callback with auth code
     */

    if (req.query.error) {
      // the user denied your requested permissions
      return next(new Error(req.query.error));
    }

    // exchange auth code for access token
    client
      .exchangeCode(req.query.code)
      .then(function(_access) {
        // in a production app you'll want to store this in some kind of persistent storage
        access_body = _access;
        res.send(access_body);
      })
})


router.get('/vehicle-data',async function(req,res,next){
  console.log("calling '/vehicle-data'")

  var vehicle;
  var returnData = [];
  // get the user's vehicles

  await smartcar.getVehicleIds(access_body.accessToken)
  .then(function(res) {
      // instantiate first vehicle in vehicle list
      vehicle = new smartcar.Vehicle(res.vehicles[0], access_body.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
  .then(function(data) {
    console.log(data);
    returnData.push(data);
  })

  try{
    await vehicle.permissions()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.location()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.odometer()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.oil()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.tirePressure()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.fuel()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.battery()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.charge()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }

  try{
    await vehicle.vin()
      .then(function(data) {
        console.log(data);
        returnData.push(data);
      })
  }catch(error){
      console.log(error);
      returnData.push(error);
  }


  res.json(returnData);
})

router.get('/lock-car',function(req,res,next){
    console.log("calling '/lock-car'")

    // get the user's vehicles
    smartcar.getVehicleIds(access_body.accessToken)
    .then(function(res) {
        // instantiate first vehicle in vehicle list
        const vehicle = new smartcar.Vehicle(res.vehicles[0], access_body.accessToken);
        return vehicle.lock()
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });
})


router.get('/unlock-car',function(req,res,next){
    console.log("calling '/unlock-car'")

    // get the user's vehicles
    smartcar.getVehicleIds(access_body.accessToken)
    .then(function(res) {
        // instantiate first vehicle in vehicle list
        const vehicle = new smartcar.Vehicle(res.vehicles[0], access_body.accessToken);
        return vehicle.unlock()
      })
      .then(function(data) {
        console.log(data);
        res.json(data);
      });
})

router.get('/disconnect',function(req,res,next){
  console.log("calling '/disconnect'")

  // get the user's vehicles
  smartcar.getVehicleIds(access_body.accessToken)
  .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access_body.accessToken);
      return vehicle.disconnect()
    })
    .then(function(data) {
      console.log(data);
      res.json(data);
    });
})

module.exports=router;

