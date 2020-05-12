import React from 'react';
//import PropTypes from 'prop-types';
import styles from './HighMobilityApi.module.scss';


class HighMobilityApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", dataVehicle:"", lockStatus:""};
    this.lockCar = this.lockCar.bind(this);
    this.unlockCar = this.unlockCar.bind(this);
    this.render = this.render.bind(this);
  }

  callAPI(){
    console.log("High Mobility: api call check")
    fetch("http://localhost:9000/hm-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }

  async authenticateAPI(){
    console.log("High Mobility: authenticateAPI");

    const queryString = window.location.search;
    console.log("query String: " + queryString);

    const urlParams = new URLSearchParams(queryString);

    var auth = false;
    //check for auth
    await fetch("http://localhost:9000/hm-api/check-auth")
        .then(res => res.text())
        .then(res => (
            auth = (res === 'true')
          ));


    if(auth){

      console.log("already authenticated");
      this.callVehicleData();
      this.getCarLockState();

    }else if(urlParams.has('code')){

      var result = ''
      await fetch("http://localhost:9000/hm-api/oauth/get-access-token"+queryString)
        .then(res => res.text())
        .then(res => (
          result = JSON.parse(res)
        ));

        if(result.status === 'appoved'){
          auth = true
          window.location.href = window.location.href.split('?')[0]

        }
    }else{

      console.log("authenticate")
      var loginUrl = "";

      await fetch("http://localhost:9000/hm-api/oauth/")
        .then(res => res.text())
        .then(res => (
            loginUrl = res
          ));

      window.location.href = loginUrl;
    }
  }


  async callVehicleData(){
    console.log("HM: call vehicle data")

    await fetch("http://localhost:9000/hm-api/connected-vehicle-data")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);

          if(body.json){
            this.setState({dataVehicle: JSON.parse(body.json)})
          }else if(body.failureReason){
            this.setState({dataVehicle: body.failureReason})
          }else{
            console.log(this.state.dataVehicle)
            this.setState({dataVehicle: body})
          }
      })
  }

  unlockCar(){
    console.log("HM: call unlockCar car")

    fetch("http://localhost:9000/hm-api/open-car")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);

          if(body.json){
            this.setState({lockStatus: JSON.parse(body.json)})
          }else if(body.failureReason){
            this.setState({lockStatus: body.failureReason})
          }else{
            this.setState({lockStatus: body})
            console.log(this.state.lockStatus)
          }
      })

  }

  lockCar(){
    console.log("HM: call lock car")

    fetch("http://localhost:9000/hm-api/lock-car")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);

          if(body.json){
            this.setState({lockStatus: JSON.parse(body.json)})
          }else if(body.failureReason){
            this.setState({lockStatus: body.failureReason})
          }else{
            this.setState({lockStatus: body})
            console.log(this.state.lockStatus)
          }
      })
  }

  getCarLockState(){
    console.log("HM: call lock car state")

    fetch("http://localhost:9000/hm-api/car-lock-state")
        .then(res => res.text())
        .then(res => {

          const body = JSON.parse(res);

          if(body.json){
            this.setState({lockStatus: JSON.parse(body.json)})
          }else if(body.failureReason){
            this.setState({lockStatus: body.failureReason})
          }else{
            console.log(this.state.dataVehicle)
            this.setState({lockStatus: body})
          }
      })
  }

  async componentDidMount(){
    this.callAPI();
    await this.authenticateAPI();

  }


  render (){



    return(
    <div className={styles.HighMobilityApi} data-testid="HighMobilityApi">
      <h1>HighMobilityApi Component</h1>
      <h2>General Node Test</h2>{this.state.apiResponse}<br />
      { this.state.dataVehicle ?
            <div>
              <h2>Connected Vehicle:</h2>
              {Object.entries(this.state.dataVehicle).map(([key,value])=>{
                return (<div>{key} : {JSON.stringify(value)}</div>);
              })}

              <h2>Control:</h2>
              Lock Status:<br />
              {Object.entries(this.state.lockStatus).map(([key,value])=>{
                return (
                <div>{key} : { 
                  value.keys ? 
                    Object.entries(value).map(([key,value])=>{
                    return (
                    <div>{key} :
                    {'key' in value?
                    <div>
                        {Object.entries(value).map(([key,value])=>{
                            return (<div>{key}: {JSON.stringify(value)}</div>);
                        })}
                      </div>
                      :
                        <div>{JSON.stringify(value)}</div>
                      }
                    </div>
                    );
                    })
                  : <b>{value}</b>
                  }
                </div>
                );
                })}
              <p>
              <button onClick={this.lockCar}>Lock Car</button><br />
              <button onClick={this.unlockCar}>Unlock Car</button>
              </p>

            </div>
            : null
         }
    </div>
  );
  }
}


HighMobilityApi.propTypes = {};

HighMobilityApi.defaultProps = {};

export default HighMobilityApi;
