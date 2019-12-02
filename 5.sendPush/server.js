import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import bodyParser from "body-parser";
import { renderToString } from "react-dom/server";
import webpush from "web-push";
import VAPID_KEYS from "./vapidKeys.json";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

const INLINE_DB = [];

server.post("/subscribe", function(req, res) {
  console.log("subscribe with", JSON.stringify(req.body, null, " "));
  INLINE_DB.push(req.body);
  res.sendStatus(200);
});

server.post("/notify", function(req, res) {
  console.log(req.body, INLINE_DB);
  const { message } = req.body;

  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: "mailto:asdfg852456@gmail.com",
      publicKey: VAPID_KEYS.publicKey,
      privateKey: VAPID_KEYS.privateKey
    }
  };

  INLINE_DB.forEach(sub => {
    console.log("send push message to", sub.endpoint, "with", message);
    webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: sub.keys
      },
      JSON.stringify({ message: message }),
      options
    );
  });

  res.sendStatus(200);
});

export default server;
