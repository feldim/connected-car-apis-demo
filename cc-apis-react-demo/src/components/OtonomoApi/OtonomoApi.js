import React from 'react';
//import PropTypes from 'prop-types';
import styles from './OtonomoApi.module.scss';

class OtonomoApi extends React.Component{
  constructor(props){
    super(props);
    this.state={apiResponse:"", simulationData:"", aggregateStatus:"", reportData:""}; //set response with empty value
    this.createAggregateData = this.createAggregateData.bind(this);
    this.updateReportData = this.updateReportData.bind(this);
  }

  callAPI(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api")
      .then(res => res.text())
      .then(res => this.setState({apiResponse: res}));
  }

  async authenticateAPI(){
    console.log("OOOO: auth")
    const queryString = window.location.search;
    console.log("query String: " + queryString);

    const urlParams = new URLSearchParams(queryString);

    var auth = false;
    //check for auth
    await fetch("http://localhost:9000/otonomo-api/check-auth")
        .then(res => res.text())
        .then(res => (
            auth = (res === 'true')
          ));


    if(auth){
      console.log("already authenticated");
      urlParams.delete('code');
      urlParams.delete('state')

      this.getSimulationData();

    }else if(urlParams.has('code')){
    
      var result = ''
      await fetch("http://localhost:9000/otonomo-api/oauth/get-access-token"+queryString)
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

      await fetch("http://localhost:9000/otonomo-api/oauth")
        .then(res => res.text())
        .then(res => (
            loginUrl = res
          ));

      window.location.href = loginUrl;
    }
  }

  getSimulationData(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api/personal/personal-data")
      .then(res => res.text())
      .then(res => this.setState({simulationData: res}));
  }

  /*
  ****************** AGGREGATE DATA ***********************
  */

  authenticateAggregateAPI(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api/aggregate/auth")
      .then(res => res.text())
      .then(res => 

        this.setState(
          {aggregateStatus: res}
        )

      );

  }


  createAggregateData(){
    console.log("api call")
    fetch("http://localhost:9000/otonomo-api/aggregate/historical-raw-data")
    .then(res => res.text())  
    .then(res => {
      console.log(res)
      var parsed = JSON.parse(res)
      parsed = JSON.parse(parsed.body)
        this.setState({reportData: parsed.body})
      })

  }


  updateReportData(newData){
    this.setState({reportData: newData})
  }


  componentDidMount(){
    this.callAPI();
    //this.authenticateAPI();
    this.getSimulationData();

    this.authenticateAggregateAPI();

  }

  //react render function
  render(){
    return (
      <div className={styles.OtonomoApi} data-testid="OtonomoApi">
        OtonomoApi Component

        <h1>Personal Data:</h1>
        <p>General Test:<br />{this.state.apiResponse}</p>
        <p>Personal Data Test: <br />{this.state.simulationData.replace(/,/g,'\n,')}</p>
        <hr />
        
        <h1>Aggregated Data:</h1>
        <p> Aggregated Data Auth Status: {this.state.aggregateStatus}</p>
          <p>Create Aggregated Data Report: <button onClick={this.createAggregateData}>Start Report</button></p>

           <ReportStatus data={this.state.reportData} update={this.updateReportData}/>
      </div>

    )}

}


class ReportStatus extends React.Component {
  constructor(props) {
    super(props)
    this.inputReportId = React.createRef();
    this.checkAggregateData = this.checkAggregateData.bind(this);
    this.downloadReport = this.downloadReport.bind(this);
    this.state = {
      data: props.data
    };

  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data) {
      return {
        data: props.data,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  checkAggregateData(){
    console.log("api call checkAggregateData")
    var reportId = this.inputReportId.current.value;
      if(reportId){
          fetch("http://localhost:9000/otonomo-api/aggregate/report-status?request_id="+reportId)
            .then(res => res.text())
            .then(res =>  {
              const parsed = JSON.parse(res)
              this.props.update(JSON.parse(parsed.body))
            });
    }
  }

  downloadReport(){

    const part = this.state.data.result_url_list
    window.open(
      part[Object.keys(part)[0]].url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  render(){
    return(
      <div>
         Check Report: <input ref={this.inputReportId} type="text"></input><button onClick={this.checkAggregateData}>Check Status</button><br />
         { this.state.data ?
            <p>
              ID: {this.state.data.id}<br />
              Report-Name: {this.state.data.report}<br />
              Report-Status: {this.state.data.status}<br />
              Info: <br />{JSON.stringify(this.state.data.result_url_list)}<br />
              <button onClick={this.downloadReport}>Download Report</button>
            </p>
            : null
         }
      </div>
    )
  }
}


OtonomoApi.propTypes = {};

OtonomoApi.defaultProps = {};

export default OtonomoApi;
