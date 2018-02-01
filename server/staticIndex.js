/*
    Naively simple entry point that can be used in conjunction with the static site
    generation to serve the pre-generated routes via express.static
 */

/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const url = require('url');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.join(__dirname, '../build/static');
const appPath = process.env.DIRECTORY_PATH || '/';

app.use(appPath, express.static(staticDir));

if (appPath !== '/') {
  app.get('/', (req, res) => {
    const redirectTo = url.format({
      pathname: appPath,
      query: req.query,
    });

    res.redirect(redirectTo);
  });
}

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Static site listening on port: ${port} at path ${appPath}`);
  }
});
