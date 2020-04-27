import React from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import logo from './img/logo.svg';

const Home = () => (
  <div className={styles.Home} data-testid="Home">
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> this is cool :) 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
  </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
