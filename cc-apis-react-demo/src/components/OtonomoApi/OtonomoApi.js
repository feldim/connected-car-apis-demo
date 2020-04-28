import React from 'react';
//import PropTypes from 'prop-types';
import styles from './OtonomoApi.module.scss';

class OtonomoApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", simulationData:""}; //set response with empty value

  }

  callAPI(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }

  getSimulationData(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api/personal-data")
      .then(res => res.text())
      .then(res => this.setState({simulationData: res}));
  }

  componentDidMount(){
    this.callAPI();
    this.getSimulationData();
  }

  //react render function
  render(){
    return (
      <div className={styles.OtonomoApi} data-testid="OtonomoApi">
      OtonomoApi Component
      <p>General Test:<br />{this.state.apiResponse}</p>
      <p>Personal Data Test: <br />{this.state.simulationData.replace(/,/g,'\n,')}</p>
    </div>
    );
  }

}








OtonomoApi.propTypes = {};

OtonomoApi.defaultProps = {};

export default OtonomoApi;
