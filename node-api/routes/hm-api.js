var express = require("express");
var router = express.Router();
const HMKit = require('hmkit');


var hmkit = ''
var accessCertificate = ''

router.get('/',function(req,res,next){
  console.log("calling '/'")

    res.send("High Mobility Node is working properly");

});


router.get('/check-auth', function(req, res) {

    console.log("calling '/hm-api/check-auth'")

    console.log(accessCertificate)

    res.send(accessCertificate!='')

  });


router.get('/oauth/get-access-token', async function(req, res) {
    console.log("callback calling '/oauth/get-access-token'")

    hmkit = new HMKit(
        process.env.hmAuth1,process.env.hmAuth2
    );

    accessCertificate = await hmkit.downloadAccessCertificate(process.env.hmVehicleAccessToken)
    console.log(accessCertificate);
    res.send(accessCertificate)
})


router.get('/open-car',async function(req,res,next){
    console.log("calling '/open-car'")

    try {
        const response = await hmkit.telematics.sendCommand(
          hmkit.commands.Doors.lockUnlockDoors({ locksState: 'unlocked' }), // command helper function
            accessCertificate // access certificate
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