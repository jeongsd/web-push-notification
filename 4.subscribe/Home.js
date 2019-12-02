import React from "react";
import logo from "./cloud.svg";
import "./Home.css";
import VAPID_KEYS from "./vapidKeys.json";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const vapidPublicKey = VAPID_KEYS.publicKey;

const Home = () => {
  function handleClickRequestPermission() {
    Notification.requestPermission(function(status) {
      console.log("Notification permission status:", status);
    });
  }

  function displayNotification() {
    if (Notification.permission == "granted") {
      navigator.serviceWorker.getRegistration().then(function(reg) {
        reg.showNotification("Hello world!", {
          body: "Here is a notification body!",
          icon: "octocat.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {
              action: "explore",
              title: "Explore this new world",
              icon: "check.png"
            },
            {
              action: "close",
              title: "Close notification",
              icon: "close.png"
            }
          ]
        });
      });
    }
  }

  function sendSubscribe(sub) {
    return fetch("http://localhost:3000/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub)
    });
  }

  async function subscribeUser() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const reg = await navigator.serviceWorker.ready;

    // 이미 구독중이면 이미 구독중인거 사용
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      console.log("/", sub);
      await sendSubscribe(sub);
      return;
    }

    // 구독한게 없으면 새로 구독 한다.
    try {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
      await sendSubscribe(newSub);
    } catch (e) {
      if (Notification.permission === "denied") {
        console.warn("Permission for notifications was denied");
      } else {
        console.error("Unable to subscribe to push", e);
      }
    }
  }

  return (
    <div className='Home'>
      <div className='Home-header'>
        <img src={logo} className='Home-logo' alt='logo' />
        <h2>Web Push Notification</h2>

        <button onClick={handleClickRequestPermission}>권한 요청하기</button>
        <button onClick={displayNotification}>Hello world!</button>
        <button onClick={subscribeUser}>구독</button>
      </div>
    </div>
  );
};

export default Home;
