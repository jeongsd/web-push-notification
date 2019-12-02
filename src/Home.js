import React from "react";
import logo from "./cloud.svg";
import "./Home.css";

class Home extends React.Component {
  render() {
    return (
      <div className='Home'>
        <div className='Home-header'>
          <img src={logo} className='Home-logo' alt='logo' />
          <h2>Web Push Notification</h2>
        </div>
      </div>
    );
  }
}

export default Home;
