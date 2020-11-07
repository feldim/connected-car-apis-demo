import React from 'react';
//import PropTypes from 'prop-types';
import styles from './MbApi.module.scss';

class MbApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", dataVehicle:"", dataVin:"",lockstate:""}; //set response with empty value
    this.lockCar = this.lockCar.bind(this);
    this.unlockCar = this.unlockCar.bind(this);
    this.callVehicleVinData = this.callVehicleVinData.bind(this);
    this.callDoorState = this.callDoorState.bind(this);
  }

  callAPI(){
    console.log("MB: api call check")
    fetch("http://localhost:9000/mb-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }

  async authenticateAPI(){
    console.log("MB: authenticateAPI");

    const queryString = window.location.search;
    console.log("query String: " + queryString);

    const urlParams = new URLSearchParams(queryString);

    var auth = false;
    //check for auth
    await fetch("http://localhost:9000/mb-api/check-auth")
        .then(res => res.text())
        .then(res => (
            auth = (res === 'true')
          ));


    if(auth){
      console.log("already authenticated");

      await this.callVehicleData()
      await this.callVehicleVinData();
      await this.callDoorState();

    }else if(urlParams.has('code')){

      var result = ''
      await fetch("http://localhost:9000/mb-api/oauth/get-access-token"+queryString)
        .then(res => res.text())
        .then(res => (
          result = JSON.parse(res)
        ));

        if(result.statusCode === 200){
          auth = true
          window.location.href = window.location.href.split('?')[0]
        }
    }else{

      console.log("authenticate")
      var loginUrl = "";

      await fetch("http://localhost:9000/mb-api/oauth")
        .then(res => res.text())
        .then(res => (
            loginUrl = res
          ));

      window.location.href = loginUrl;
    }

  }

  async callVehicleData(){
    console.log("MB: call vehicle data")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    await fetch("http://localhost:9000/mb-api/connected-vehicle-data")
      .then(res => res.text())
      .then(res => {

        const body = JSON.parse(res);
        if(!urlParams.has('id') && body){
          window.location.href = window.location.href + "?id="+body[0].id
        }
        this.setState({dataVehicle: res})
    });
  }

  async callVehicleVinData(){
    console.log("MB: call vehicle vin data")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get('id')
    if(id){
      await fetch("http://localhost:9000/mb-api/connected-vehicle-data/vehicles?id="+id)
        .then(res => res.text())
        .then(res => {

          this.setState({dataVin: res})

      });
    }else{
      console.log("id was undefined: refused to call vehicle vin information")
      this.setState({dataVin: ''})
    }
  }

  async lockCar(){
    console.log("MB: call lock")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

      await fetch("http://localhost:9000/mb-api/doors?id="+urlParams.get('id')+'&cmd=LOCK')
        .then(res => res.text())
        .then(res => {
          console.log(res)
          this.setState({lockstate: JSON.parse(res).data})

      });
  }

  async unlockCar(){
    console.log("MB: call unlock")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    await fetch("http://localhost:9000/mb-api/doors?id="+urlParams.get('id')+'&cmd=UNLOCK')
    .then(res => res.text())
    .then(res => {

    this.setState({lockstate: res})

    });
  }

  async callDoorState(){
    console.log("MB: call doorState")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    await fetch("http://localhost:9000/mb-api/doors?id="+urlParams.get('id'))
    .then(res => res.text())
    .then(res => {
      this.setState({lockstate: res})
    });

  }

  async componentDidMount(){
    this.callAPI();
    await this.authenticateAPI()
  }


  render(){
    return (
    <div className={styles.MbApi} data-testid="MbApi">
      <h1>MbApi Component</h1>
      <h2>General Node Test:</h2><p>{this.state.apiResponse}</p>
      <p>Connected Vehicle API: <br />{this.state.dataVehicle}</p>
      <p>Connected Vehicle API VIN data: <br />{this.state.dataVin}</p>
      <h2>Controls:</h2>
      <p>
        Lock State: <br />
        <button onClick={this.callDoorState}>refresh</button><br />
        {this.state.lockstate}<br />
        <button onClick={this.lockCar}>Lock Car</button> <button onClick={this.unlockCar}>Unlock Car</button>
      </p>
    </div>

  );
    }
}

MbApi.propTypes = {};

MbApi.defaultProps = {};

export default MbApi;


//obtaining-driver-consent/
//oauth/redirect