import React from 'react';
//import PropTypes from 'prop-types';
import styles from './MbApi.module.scss';

class MbApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", dataVehicle:"", dataVin:""}; //set response with empty value

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
      urlParams.delete('code');
      urlParams.delete('state')

      this.callVehicleData()
      this.callVehicleVinData();

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
        this.setState({dataVehicle: res})
        if(!urlParams.has('id')){
        window.location.href = window.location.href + "?id="+body[0].id
      }
    });
  }

  async callVehicleVinData(){
    console.log("MB: call vehicle vin data")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


      await fetch("http://localhost:9000/mb-api/connected-vehicle-data/vehicles?id="+urlParams.get('id'))
        .then(res => res.text())
        .then(res => {

          this.setState({dataVin: res})

      });

  }

  componentDidMount(){
    this.callAPI();
    this.authenticateAPI()
  }


  render(){
    return (
    <div className={styles.MbApi} data-testid="MbApi">
      <h1>MbApi Component</h1>
      <p>General Node Test:<br />{this.state.apiResponse}</p>
      <p>Connected Vehicle API: <br />{this.state.dataVehicle}</p>
      <p>Connected Vehicle API VIN data: <br />{this.state.dataVin}</p>
    </div>
  );
    }
}

MbApi.propTypes = {};

MbApi.defaultProps = {};

export default MbApi;


//obtaining-driver-consent/
//oauth/redirect