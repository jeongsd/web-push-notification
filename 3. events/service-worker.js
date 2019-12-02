self.addEventListener("notificationclose", function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log("Closed notification: " + primaryKey);
});

self.addEventListener("notificationclick", function(e) {
  var notification = e.notification;
  var action = e.action;
  if (action === "close") {
    notification.close();
  }

  e.waitUntil(
    (async function() {
      const allClients = await clients.matchAll({
        includeUncontrolled: true
      });

      let cloudClient;

      // 이미 열려있으면 새로 열지 않고 focus 한다.
      for (const client of allClients) {
        const url = new URL(client.url);

        if (url.pathname == "/cloud/") {
          client.focus();
          cloudClient = client;
          break;
        }
      }

      // 페이지가 열려 있지 않으면 새로 연다.
      if (!cloudClient) {
        cloudClient = await clients.openWindow("/cloud/");
      }
      notification.close();
    })()
  );
});
