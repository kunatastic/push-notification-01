console.log("Service Worker Loaded...");

self.addEventListener("push", async (e) => {
  const data = await e.data.json();
  console.log("Push Recieved...", data);
  self.registration.showNotification(data.title, {
    body: data.body,
  });
});
