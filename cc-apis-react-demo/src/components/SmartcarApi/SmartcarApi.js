import React from 'react';
//import PropTypes from 'prop-types';
import styles from './SmartcarApi.module.scss';
import Lottie from 'react-lottie';
import animationData from './../../lotties/8959-car-revolving-animation.json';

import { Player, Controls } from '@lottiefiles/react-lottie-player';



class Smartcar extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", dataVehicle:"", lockData:"",disconnectState:"", isLoading:false}; //set response with empty value
    this.lockCar = this.lockCar.bind(this);
    this.unlockCar = this.unlockCar.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  callAPI(){
    console.log("Smartcar: api call check")
    fetch("http://localhost:9000/smartcar-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }


  async authenticateAPI(){
    console.log("Smartcar: authenticateAPI");

    const queryString = window.location.search;
    console.log("query String: " + queryString);

    const urlParams = new URLSearchParams(queryString);

    var auth = false;
    //check for auth
    await fetch("http://localhost:9000/smartcar-api/check-auth")
        .then(res => res.text())
        .then(res => (
            auth = (res === 'true')
          ));


    if(auth){
      console.log("already authenticated");
      urlParams.delete('code');
      urlParams.delete('state')

      this.callVehicleData()

    }else if(urlParams.has('code')){

      var result = ''
      await fetch("http://localhost:9000/smartcar-api/oauth/get-access-token"+queryString)
        .then(res => res.text())
        .then(res => (
          result = JSON.parse(res)
        ));

        if(result.accessToken){
          auth = true
          window.location.href = window.location.href.split('?')[0]
        }
    }else{

      console.log("authenticate")
      var loginUrl = "";

      await fetch("http://localhost:9000/smartcar-api/oauth")
        .then(res => res.text())
        .then(res => (
            loginUrl = res
          ));

      window.location.href = loginUrl;
    }

  }


  async callVehicleData(){
    console.log("Smartcar: call vehicle data")
    this.setState({isLoading:true})
    await fetch("http://localhost:9000/smartcar-api/vehicle-data")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);
          this.setState({dataVehicle: body})

      });
      this.setState({isLoading:false})
  }


  lockCar(){

    console.log("Smartcar: call vehicle data")

    fetch("http://localhost:9000/smartcar-api/lock-car")
        .then(res => res.text())
        .then(res => {
          const body = JSON.parse(res);
          this.setState({lockData: body})
      });
  }

  unlockCar(){

    console.log("Smartcar: call vehicle data")

    fetch("http://localhost:9000/smartcar-api/unlock-car")
        .then(res => res.text())
        .then(res => {
          const body = JSON.parse(res);
          this.setState({lockData: body})
      });
  }


  disconnect(){
    console.log("Smartcar: disconnect")

    fetch("http://localhost:9000/smartcar-api/disconnect")
        .then(res => res.text())
        .then(res => {
          const body = JSON.parse(res);
          this.setState({disconnectState: body})
      });
  }

  componentDidMount(){
    this.callAPI();
    this.authenticateAPI()
  }

  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

  return (
    <div className={styles.Smartcar} data-testid="Smartcar">
      <h1>Smartcar Component</h1>
      <h2>General Node Test</h2>{this.state.apiResponse}
      { this.state.dataVehicle ?
            <div>
              <h2>Connected Vehicle:</h2>
              ID: {this.state.dataVehicle[0].id}<br />
              Make: {this.state.dataVehicle[0].make}<br />
              Model: {this.state.dataVehicle[0].model}<br />
              Year: {this.state.dataVehicle[0].year}<br />
              <hr />
              Permissions: {JSON.stringify(this.state.dataVehicle[1])}<br />
              <hr />
              Location: {JSON.stringify(this.state.dataVehicle[2])}<br />
              <hr />
              Odometer: {JSON.stringify(this.state.dataVehicle[3].data.distance)}<br />
              <hr />
              Oil: {JSON.stringify(this.state.dataVehicle[4])}<br />
              <hr />
              Tire Pressures: {JSON.stringify(this.state.dataVehicle[5])}<br />
              <hr />
              Fuel: {JSON.stringify(this.state.dataVehicle[6])}<br />
              <hr />
              Battery: {JSON.stringify(this.state.dataVehicle[7])}<br />
              <hr />
              Charge: {JSON.stringify(this.state.dataVehicle[8])}<br />
              <hr />
              VIN: {JSON.stringify(this.state.dataVehicle[9])}<br />
              <h3>Control: </h3>
              <button onClick={this.lockCar}>Lock Car</button><button onClick={this.unlockCar}>Unlock Car</button><br />
              { this.state.lockData ?
                <p>{this.state.lockData.status}</p>
                : <p>n.a.</p>
              }
              <button onClick={this.disconnect}>Disconnect Car</button>
              { this.state.disconnectState ?
                <p>{this.state.disconnectState.status}</p>
                : <p>n.a.</p>
              }
            </div>
            :     
            <React.Fragment>
            <h3>Please wait . . .</h3>
            <div>
            <Player
              autoplay
              loop
              src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
              style={{ height: '300px', width: '300px' }}
            >
              <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
            </div>
            </React.Fragment>
         }


    </div>
  );

  }
}

Smartcar.propTypes = {};

Smartcar.defaultProps = {};

export default Smartcar;
