import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email,
      name,
    };
    const response = await fetch("/api/notify", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);

    someFunction();
  };

  const someFunction = () => {
    if ("serviceWorker" in navigator) {
      send().catch((err) => console.error(err));
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    // eslint-disable-next-line
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const send = async () => {
    console.log("register sw");
    const register = await navigator.serviceWorker.register("./worker.js", {
      scope: "/",
    });
    console.log("sw registered");

    console.log("push register");
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BFPh0ToK8cmYySGUxKZbIIJ99VgJF1gqPMjNqLwVriQ0CYnKQuQ_F9wCAEeAqVB0xrxzsGaVg5q4n7_UoVxg-Q8"
      ),
    });
    console.log("push regesterd");

    console.log("send push notification");
    await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json",
      },
    });
    console.log("Push Sent...");
  };

  return (
    <>
      <h1>Welcome to weekly newsletter</h1>
      <form onSubmit={handler}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit">submit!!</button>
      </form>
    </>
  );
}

export default App;
