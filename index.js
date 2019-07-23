'use strict';

const express = require('express');
const http = require('http');
const app = express();

app.get('/', (req, res) => {
  console.log(`GET / ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/index.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/index.css', (req, res) => {
  console.log(`GET /index.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/index.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/myResume.pdf', (req, res) => {
  console.log(`GET /myResume.pdf ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./cv/myResume.pdf', {root : __dirname},
                           (err) => { res.end(); });
});

http.createServer(app).listen(8000, '0.0.0.0',
                              () => {console.log('[+]Server started')});
