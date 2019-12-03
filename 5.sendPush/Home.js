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

  React.useEffect(() => {
    function sendSubscribe(subscription) {
      const sub = JSON.parse(JSON.stringify(subscription));
  
      return fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: sub.keys
        })
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
    subscribeUser()
  }, [])

  function sendMessage(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    fetch("http://localhost:3000/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formData.get("message")
      })
    });
  }

  return (
    <div className='Home'>
      <div className='Home-header'>
        <img src={logo} className='Home-logo' alt='logo' />
        <h2>Web Push Notification</h2>

        <button onClick={handleClickRequestPermission}>권한 요청하기</button>

        <form onSubmit={sendMessage}>
          <input name='message' />
          <button type='submit'>보내기</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
