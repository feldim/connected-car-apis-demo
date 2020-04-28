import React from 'react';
//import PropTypes from 'prop-types';
import styles from './OtonomoApi.module.scss';

class OtonomoApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:""}; //set response with empty value

  }

  callAPI(){
    console.log("api call")
    fetch("http://localhost:9000/testAPI")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }

  componentDidMount(){
    this.callAPI();
  }

  //react render function
  render(){
    return (
      <div className={styles.OtonomoApi} data-testid="OtonomoApi">
      OtonomoApi Component
      <p>Test:{this.state.apiResponse}</p>
    </div>
    );
  }

}








OtonomoApi.propTypes = {};

OtonomoApi.defaultProps = {};

export default OtonomoApi;
