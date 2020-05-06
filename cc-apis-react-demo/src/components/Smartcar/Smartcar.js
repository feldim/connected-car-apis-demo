import React from 'react';
//import PropTypes from 'prop-types';
import styles from './Smartcar.module.scss';



class Smartcar extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", dataVehicle:"", lockData:""}; //set response with empty value
    this.lockCar = this.lockCar.bind(this);
    this.unlockCar = this.unlockCar.bind(this);
  }

  callAPI(){
    console.log("Smartcar: api call check")
    fetch("http://localhost:9000/smartcar-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }


  async authenticateAPI(){
    console.log("Smartcar : authenticateAPI");

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

    await fetch("http://localhost:9000/smartcar-api/vehicle-data")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);
          this.setState({dataVehicle: body})

      });
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

  componentDidMount(){
    this.callAPI();
    this.authenticateAPI()
  }

  render(){
  return (
    <div className={styles.Smartcar} data-testid="Smartcar">
      <h1>Smartcar Component</h1>
      <h2>General Node Test</h2>{this.state.apiResponse}
      { this.state.dataVehicle ?
            <div>
              <h2>Connected Vehicle:</h2>
              ID: {this.state.dataVehicle.id}<br />
              Make: {this.state.dataVehicle.make}<br />
              Model: {this.state.dataVehicle.model}<br />
              Model: {this.state.dataVehicle.year}<br />
              Control: <button onClick={this.lockCar}>Lock Car</button><button onClick={this.unlockCar}>Unlock Car</button><br />
              { this.state.lockData ?
                <p>{this.state.lockData.status}</p>
                : <p>n.a.</p>
            }
            </div>
            : null
         }
    </div>
  );

  }
}

Smartcar.propTypes = {};

Smartcar.defaultProps = {};

export default Smartcar;
