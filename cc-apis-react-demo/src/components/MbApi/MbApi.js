import React from 'react';
//import PropTypes from 'prop-types';
import styles from './MbApi.module.scss';

class MbApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", simulationData:""}; //set response with empty value

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
      if(queryString) window.location.href = window.location.href.split('?')[0];
      this.callVehicleData()

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
    await fetch("http://localhost:9000/mb-api/connected-vehicle-data")
      .then(res => res.text())
      .then(res => this.setState({simulationData: res}));

  }

  componentDidMount(){
    this.callAPI();
    this.authenticateAPI()
  }


  render(){
    return (
    <div className={styles.MbApi} data-testid="MbApi">
      MbApi Component
      <p>General Test:<br />{this.state.apiResponse}</p>
      <p>Connected Vehicle API Test: <br />{this.state.simulationData.replace(/,/g,'\n,')}</p>
    </div>
  );
    }
}

MbApi.propTypes = {};

MbApi.defaultProps = {};

export default MbApi;


//obtaining-driver-consent/
//oauth/redirect