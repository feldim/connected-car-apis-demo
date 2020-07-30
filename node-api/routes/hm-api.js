var express = require("express");
var router = express.Router();
const axios = require('axios');
const HMKit = require('hmkit');


var hmkit = ''
var access_body = ''
var accessCertificate = ''

router.get('/',function(req,res,next){
  console.log("calling '/'")

    res.send("High Mobility Node is working properly");

});


router.get('/check-auth', function(req, res) {

    console.log("calling '/hm-api/check-auth'")

    console.log(access_body)

    res.send(access_body!='')

  });


  
router.get('/oauth', function(req, res) {

  console.log("calling '/oauth'")

    // We are requesting full control of the car in this example. Other options can be found in Developer Center
    const FULL_PERMISSIONS_TOKEN = 'car.full_control';

    const redirect_uri = process.env.hmCallbackUri
    const clientID = process.env.hmClientID
    const authUri = process.env.hmAuthUri
    const appId = process.env.hmAppId


    const url = `${authUri}?app_id=${appId}&client_id=${clientID}&redirect_uri=${redirect_uri}&scope=${FULL_PERMISSIONS_TOKEN}`;
    console.log("url: "+url);
    res.send(url)

  });




router.get('/oauth/get-access-token', async function(req, res) {
    console.log("callback calling '/oauth/get-access-token'")

    const clientSecret = process.env.hmclientSecret
    const redirectUri = process.env.hmCallbackUri
    const clientId = process.env.hmClientID
    const tokenUri = process.env.hmTokenUri
    const code = res.req.query.code;

    return axios
      .post(tokenUri, {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code
      })
      .then(async (response) => {
        console.log(response)
        access_body = response.data

        hmkit = new HMKit(process.env.hmAuth1,process.env.hmAuth2);

        accessCertificate = await hmkit.downloadAccessCertificate(access_body.access_token)

        console.log(accessCertificate);
        res.send(access_body)

      })
      .catch(err => console.log(err));


})


router.get('/open-car',async function(req,res,next){
    console.log("calling '/open-car'")

    try {
        const response = await hmkit.telematics.sendCommand(
          hmkit.commands.Doors.lockUnlockDoors({ locksState: 'unlocked' }), // command helper function
          accessCertificate  // access certificate
        )
        console.log('object:', response.parse())
        res.send(response.parse())

      } catch (error) {
        console.log(error)
        res.send(error)
      }
})

router.get('/lock-car',async function(req,res,next){
  console.log("calling '/lock-car'")

  try {
      const response = await hmkit.telematics.sendCommand(
        hmkit.commands.Doors.lockUnlockDoors({ locksState: 'locked' }), // command helper function
        accessCertificate // access certificate
      )
      console.log('object:', response.parse()) 
      res.send(response.parse())

    } catch (error) {
      console.log(error)
      res.send(error)
    }
})


router.get('/car-lock-state',async function(req,res,next){
  console.log("calling '/car-lock-state'")

  try {
      const response = await hmkit.telematics.sendCommand(
        hmkit.commands.Doors.getState(), // command helper function
        accessCertificate // access certificate
      )
      console.log('object:', response.parse()) 
      res.send(response.parse())

    } catch (error) {
      console.log(error)
      res.send(error)
    }
})

router.get('/connected-vehicle-data',async function(req,res,next){
  console.log("calling '/connected-vehicle-data'")

  try {
      const response = await hmkit.telematics.sendCommand(
        hmkit.commands.VehicleStatus.getVehicleStatus(), // command helper function
        accessCertificate // access certificate
      )
      console.log('object:', response.parse()) 
      res.send(response.parse())

    } catch (error) {
      console.log(error)
      res.send(error)
    }
})


module.exports=router;