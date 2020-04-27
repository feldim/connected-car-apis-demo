import React from 'react';
//import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import logo from './img/logo.svg';

const Home = () => (
  <div className={styles.Home} data-testid="Home">
    <header className={styles.AppHeader}>
        <img src={logo} className={styles.AppLogo} alt="logo" />
        <p>
          Edit <code>src/App.js</code> this is cool :) 
        </p>
        <a
          className={styles.AppLink}
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
