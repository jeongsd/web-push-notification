import React from "react";
import logo from "./cloud.svg";
import "./Home.css";

const Home = () => {
  function handleClickRequestPermission() {
    Notification.requestPermission(function(status) {
      console.log("Notification permission status:", status);
    });
  }

  function displayNotification() {
    if (Notification.permission == "granted") {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        reg.showNotification("Hello world!");
      });
    }
  }

  return (
    <div className='Home'>
      <div className='Home-header'>
        <img src={logo} className='Home-logo' alt='logo' />
        <h2>Web Push Notification</h2>

        <button onClick={handleClickRequestPermission}>권한 요청하기</button>
        <button onClick={displayNotification}>Hello world!</button>
      </div>
    </div>
  );
};

export default Home;
